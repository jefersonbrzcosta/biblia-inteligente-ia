import { useState } from "react";
import { fetchAnswer } from "../services/api";
import { TextField, Button, Box, Typography } from "@mui/material";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";

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
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
        padding: 2,
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        Bible AI Chat
      </Typography>
      <Box
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: 2,
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <Loader />}
      </Box>
      <TextField
        fullWidth
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        label="Pergunte sobre a Bíblia..."
        variant="outlined"
        sx={{ mt: 2 }}
      />
      <Button
        fullWidth
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Enviar
      </Button>
    </Box>
  );
};

export default ChatBox;
