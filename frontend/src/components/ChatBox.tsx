import { useState } from "react";
import { fetchAnswer } from "../services/api";
import { TextField, Button, Box, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import "./Chatbox.css";

const ChatBox = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    const response = await fetchAnswer(question);
    setMessages((prev) => [...prev, { role: "ai", content: response.answer }]);
    setLoading(false);
    setQuestion("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        height: "90vh",
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
        padding: 3,
        backgroundColor: "#121212",
        color: "#ffffff",
      }}
    >
      {/* Title */}
      <Typography variant="h4" gutterBottom align="center">
        Está na Bíblia?
      </Typography>

      {/* Bible Image */}
      <img src="/bible-glow.png" alt="Bible" className="bible-image" />

      {/* Chat Messages */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          maxHeight: "calc(100vh - 250px)",
          overflowY: "auto",
          padding: 2,
          borderRadius: "8px",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: messages.length === 0 ? "center" : "flex-start", // Center if empty
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="h6" sx={{ color: "#666" }}>
            Sem mensagens
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} role={msg.role} content={msg.content} />
          ))
        )}
        {loading && <Loader />}
      </Box>

      {/* Input Field */}
      <TextField
        fullWidth
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        label="Pergunte sobre a Bíblia..."
        variant="outlined"
        sx={{
          mt: 2,
          backgroundColor: "#2c2c2c",
          color: "#ffffff",
          borderRadius: "4px",
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#666" },
            "&:hover fieldset": { borderColor: "#888" },
            "&.Mui-focused fieldset": { borderColor: "#bbb" },
            "& input": { color: "#ffffff" },
          },
          "& .MuiInputLabel-root": {
            color: "#bbb",
          },
        }}
        onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
      />

      {/* Send Button */}
      <Button
        fullWidth
        onClick={handleSubmit}
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: "#ffcc00",
          color: "#121212",
          "&:hover": { backgroundColor: "#e6b800" },
        }}
      >
        Enviar
      </Button>
    </Box>
  );
};

export default ChatBox;
