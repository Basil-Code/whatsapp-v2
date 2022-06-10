import styled from "styled-components";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { Logout, Settings } from "@mui/icons-material";
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);

  // check every email inside of the document "users" inside "chats" collection
  const userChatsRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user.email)
  );

  // Retrieve and monitor a collection value in Cloud Firestore.
  const [chatsSnapshot] = useCollection(userChatsRef);

  // These are for the menu clicks
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Create One-to-One Chat
  const createChat = () => {
    // instead of prompt I can use Modal (or any MUI component)
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );
    if (!input) return null;
    // check if email is valid and chat is already exist

    // EmailValidator.validate() return true or false
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // We need to add the chat 'document' into the DB 'chats' collection if it doesn't already exists and valid
      // We need to check if that email exist as one of our users
      addDoc(collection(db, "chats"), {
        users: [user.email, input],
        date: serverTimestamp(),
      });
    } else {
      alert("please enter correct email");
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    // ?. -> optional chaining -- we're using it here cuz it might be null or undefined because "useCollection" is async
    // Checking if the one I'm trynna talk to is already in the user chats
    // !! --> is converting this to a boolean so it'll return true if found, false if not
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <Tooltip title="Account Settings">
          {/* () => {}    --> is called annonymous inline function */}
          <IconButton
            // onClick={() => signOut(auth)}
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <UserAvatar src={user.photoURL} />
          </IconButton>
        </Tooltip>

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search in chats" />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* List of Chats */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}

      {/* .................... Menu ........................ */}
      {/* Menu when clicking the user profile picture */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 20,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar src={user.photoURL} /> Profile
        </MenuItem>
        {/* 
        <MenuItem>
          <Avatar /> My account
        </MenuItem> 
        */}
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={() => signOut(auth)}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Container>
  );
}
export default Sidebar;

const Container = styled.div`
  flex: 0.4;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky; // to stick on the top when scrolling in chats
  top: 0;
  border-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 10%; //80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  /* cursor: pointer; */

  /* :hover { */
  /* opacity: 0.8; */
  /* } */
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  /* &&& -> is like saying it's high priority just like !important  "increase the specificity" */
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
