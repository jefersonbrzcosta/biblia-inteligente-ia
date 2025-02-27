import { CircularProgress, Box } from "@mui/material";

const Loader = () => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
    <CircularProgress size={24} />
  </Box>
);

export default Loader;
