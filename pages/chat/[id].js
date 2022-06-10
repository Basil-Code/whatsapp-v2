import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import Head from "next/head";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";

// This is our Chat page (Messages between each users)
// This is where server-side rendering is coming in
// These props comes from the server side render
function Chat({ chat, messagess }) {
  const [user] = useAuthState(auth);
  // const router = useRouter();
  // const id = router.query;
  // const q = query(
  //   collection(db, `chats/${id}/messages`),
  //   orderBy("timestamp", "asc")
  // );
  // const [messages] = useCollectionData(q);

  // console.log(messages);
  const chatData = JSON.parse(chat);

  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chatData.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        {/* Chat View */}
        <ChatScreen chat={chatData} messages={messagess} />
      </ChatContainer>
    </Container>
  );
}
export default Chat;

// Server-side rendering to pre-fetch the props on the server before the user sees the page
// context allows u to access things like the params of the URL & the Root URL when you're on the server
export async function getServerSideProps(context) {
  // // PREP the messages on the Server
  const q = query(
    collection(db, "chats", context.query.id, "messages"),
    orderBy("timestamp", "asc")
  );

  // As useCollection, but this hook extracts a typed list of the firestore.QuerySnapshot.docs values, rather than the firestore.QuerySnapshot itself.
  const querySnapshot = await getDocs(q);
  // querySnapshot.
  // const [messages] = useCollectionData(q);
  // messagess is an array of these objects that we altered
  const messagess = querySnapshot.docs
    .map((doc) => ({
      key: doc.id,
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // if (!messagess) {
  //   return {};
  // }

  // documentRef
  const docRef = doc(db, "chats", context.query.id);

  const chatRes = await getDoc(docRef);
  // Prep the chats
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    // will be passed to the page component as props
    props: {
      messagess: JSON.stringify(messagess),
      chat: JSON.stringify(chat),
    },
  };
  // const chatRes = await messages

  // context.query.id --> the id of the document
  // const docRef = doc(db, "chats", context.query.id);

  // // PREP the messages on the Server
  // const q = query(
  //   collection(db, "messages", docRef),
  //   orderBy("timestamp", "asc")
  // );

  // const messagesRef = await getDoc(q);

  // whenever dealing with an API you have to stringify informations
  // whenever I stringify a timestamp and send it from an API to the client you lose the timestamp Datatype
  // const message = messagesRef.docs
  //   .map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }))
  //   .map((messages) => ({
  //     ...messages,
  //     timestamp: messages.timestamp.toDate(),
  //   }));
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
