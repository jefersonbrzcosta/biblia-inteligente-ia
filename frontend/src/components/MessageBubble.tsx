import { Box, Typography } from "@mui/material";

const MessageBubble = ({
  role,
  content,
}: {
  role: string;
  content: string;
}) => {
  return (
    <Box
      sx={{
        mb: 1,
        p: 1,
        borderRadius: "8px",
        backgroundColor: role === "user" ? "#d1e7ff" : "#e7ffe7",
        textAlign: role === "user" ? "right" : "left",
      }}
    >
      <Typography variant="body1">{content}</Typography>
    </Box>
  );
};

export default MessageBubble;
