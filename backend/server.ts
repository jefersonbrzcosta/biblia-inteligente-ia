import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import askRoute from "./routes/ask";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/ask", askRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
