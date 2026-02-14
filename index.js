require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authroutes");
const eventRoutes = require("./routes/eventroutes");

const app = express();

app.use(cors({
  origin: "*",
}));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


