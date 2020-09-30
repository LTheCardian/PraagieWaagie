"use strict";

const express = require("express");
const socket = require("socket.io");

const app = express();

// app config
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public" + "/index.html");
});


app.set("port", process.env.PORT || 9000);
const server = app.listen(app.get("port"), () => {
  console.log("server listening in PORT: " + app.get("port"));
});

let markers = [];
const io = socket(server);

io.on("connection", socket => {
  socket.on("disconnect", () => {
    markers = markers.filter(item => item.markerId !== socket.id);
    io.emit("update-markers-on-frontend", markers);
  });

  socket.on("update-marker", data => {
    if (markers.every(item => item.markerId !== socket.id)) {
      markers.push({ ...data, markerId: socket.id });
    } else {
      markers = markers.map(item => {
        if (item.markerId === data.markerId) {
          return data;
        }
       return item;
      });
    }

    io.emit("update-markers-on-frontend", markers);
  });
});
