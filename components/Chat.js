import { Avatar, Tooltip } from "@mui/material";
import { collection, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const q = query(
    collection(db, "users"),
    where("email", "==", getRecipientEmail(users, user))
  );

  const [recipientSnapshot] = useCollection(q);
  // document of index 0, cuz we only have one user with that email, so that what it would return after the query
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(users, user);

  const enterChat = () => {
    // router.push() --> push a page into the stack
    // `` --> string interpolation which means I can use variables within a string
    // ${id} --> This is a URL Parameter
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <Tooltip title={recipientEmail}>
        <p>{recipientEmail}</p>
      </Tooltip>
    </Container>
  );
}
export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  /* word-break: break-word; */

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; // keep the text in only one line
  }
  :hover {
    background-color: #e7eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
