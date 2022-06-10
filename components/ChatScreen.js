import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@mui/material";
import getRecipientEmail from "../utils/getRecipientEmail";
import {
  collection,
  orderBy,
  query,
  where,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import Message from "./Message";
import { useRef, useState } from "react";
import TimeAgo from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { id } = router.query;
  const [input, setInput] = useState("");

  const endOfMessagesRef = useRef(null);

  // chat.users --> which we prepared on the server-side rendering
  // getRecipientEmail() --> is our util function
  const recipientEmail = getRecipientEmail(chat.users, user);

  const q = query(
    collection(db, "users"),
    where("email", "==", getRecipientEmail(chat.users, user))
  );
  //useCollection() -> retrieve and monitor the collection value in firestore
  const [recipientSnapshot] = useCollection(q);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  // collection "chats" --> document with the chat "id" --> nested collection "messages"
  const messagesQuery = query(
    collection(db, "chats", id, "messages"),
    orderBy("timestamp", "asc")
  );
  const [messagesSnapshot] = useCollection(messagesQuery);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            // spread operator -> gets the all/rest of the fields in that document
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    }
    // Get the data from the server side rendered to give us the value immediately before we connect to firebase ( because useCollection() is async )
    else {
      // parse it cuz we stringify it on the server side

      return messages.map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // Update the last seen...
    setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    addDoc(collection(db, "chats", id, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // I think this is the best way to get the User Status
  // if (recipient.lastSeen === serverTimestamp() then {
  // setDoc(q, {online: true}, {merge: true} ) }
  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient?.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}
        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Status:{" "}
              {recipient?.lastSeen?.toDate() ? (
                // opts={{ minInterval: 60 }} will update/render the time every 60 sec
                <TimeAgo
                  datetime={recipient?.lastSeen?.toDate()}
                  opts={{ minInterval: 60 }}
                />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading Status..</p>
          )}
        </HeaderInformation>

        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {/* Show Messages */}
        {showMessages()}

        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticonIcon />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        {/* disable the button if there's no input */}
        <button
          hidden={true}
          disabled={!input}
          type="submit"
          onClick={sendMessage}
        >
          Send Message
        </button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}
export default ChatScreen;

const Container = styled.div`
  flex: 1;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 10px;
  height: 75px;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  cursor: pointer;
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 50px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 40px;
`;

const InputContainer = styled.form`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 15px;
  margin: 0 15px;
  font-size: large;
  font-weight: 500;
`;
