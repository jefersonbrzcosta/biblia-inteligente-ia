import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

const MessageBubble = ({
  role,
  content,
  bibleReference,
  bibleText,
}: {
  role: string;
  content: string;
  bibleReference?: string;
  bibleText?: string;
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
          backgroundColor: role === "ai" ? "#e3f2fd" : "#c8e6c9",
          alignSelf: role === "ai" ? "flex-start" : "flex-end",
          marginBottom: "8px",
          color: "#333",
        }}
      >
        <Typography variant="body1">{content}</Typography>
        {bibleReference && (
          <Box
            sx={{
              marginTop: "6px",
              padding: "4px 8px",
              backgroundColor: "#ffcc00",
              borderRadius: "5px",
              display: "inline-block",
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontWeight: "bold", color: "#121212" }}
            >
              {bibleReference}
            </Typography>
          </Box>
        )}
        {bibleText && (
          <Typography
            variant="body2"
            sx={{ marginTop: "4px", fontStyle: "italic" }}
          >
            "{bibleText}"
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default MessageBubble;
