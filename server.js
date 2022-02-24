const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
require("dotenv").config();
require("./utils/logging")();
require("./utils/db");
require("./utils/startUp")(app);

app.get("/", (req, res) => {
  res.sendFile("./public/index", { root: __dirname });
});

const PORT = 5000 || process.env.PORT;

//server
const server = app.listen(PORT, () =>
  console.log(`Server running on port:${PORT}`)
);

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});
io.on("connect", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => console.log("user exit"));
});

app.set("socket", io);
