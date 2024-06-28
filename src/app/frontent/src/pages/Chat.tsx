import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import ChatItems from "../components/chat/ChatItems";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communication";
import toast from "react-hot-toast";
// const chatMessages = [
//   {
//     role: "User",
//     string: "Hi",
//     content: "Hello! How can I assist you today?",
//   },
//   {
//     role: "Assistant",
//     string: "Help",
//     content: "Sure, I'm here to help. What do you need assistance with?",
//   },
//   {
//     role: "User",
//     string: "What's the weather like today?",
//     content: "The weather today is partly cloudy with a high of 75°F.",
//   },
//   {
//     role: "Assistant",
//     string: "Tell me a joke",
//     content:
//       "Sure thing! Why don't scientists trust atoms? Because they make up everything!",
//   },
//   {
//     role: "User",
//     string: "Thank you",
//     content:
//       "You're welcome! Feel free to ask if you need any further assistance.",
//   },
// ];
type Message = {
  role: "user" | "assistant";
  content: string;
};
const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Successfully Deleted Chats", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user)
      toast.loading("Loading Chtas", { id: "loadchats" });
    getUserChats()
      .then((data) => {
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats!!!", { id: "loadchats" });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Loadding Failed", { id: "loadchats" });
      });
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  });
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]} {auth?.user?.name.split("")[1][0]}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to FUPRE-AI
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask me questions related to programming, Science, Business,
            Engineering, Finance, etc Kindly, erase chats to avoid data mining
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - FUPRE-AI 3.5 Dissertation
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowY: "auto",
            overflowX: "hidden",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            // <div>{chat.content}</div>

            <ChatItems content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: 8,
            backgroundColor: "rgb(17, 27, 39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "10px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton
            onClick={handleSubmit}
            sx={{ ml: "auto", color: "white" }}
          >
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;
