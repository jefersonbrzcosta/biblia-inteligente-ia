import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

const MessageBubble = ({
  role,
  content,
}: {
  role: string;
  content: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Box
        sx={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: "10px",
          backgroundColor: role === "ai" ? "#e3f2fd" : "#c8e6c9", // Light blue for AI, green for user
          alignSelf: role === "ai" ? "flex-start" : "flex-end",
          marginBottom: "8px",
          color: "#333", // Darker text color
        }}
      >
        <Typography variant="body1">{content}</Typography>
      </Box>
    </motion.div>
  );
};

export default MessageBubble;
