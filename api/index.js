const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  }
});

app.use(express.static(path.join(__dirname, '../public')));

function formatDate(date, format) {

  const dateObj = new Date(date);

  const components = {
    day: dateObj.getDate().toString().padStart(2, '0'),
    month: (dateObj.getMonth() + 1).toString().padStart(2, '0'),
    year: dateObj.getFullYear(),
    hours: dateObj.getHours().toString().padStart(2, '0'),
    minutes: dateObj.getMinutes().toString().padStart(2, '0'),
    seconds: dateObj.getSeconds().toString().padStart(2, '0')
  };

  return format.replace(/d/g, components.day)
                .replace(/m/g, components.month)
                .replace(/y/g, components.year)
                .replace(/H/g, components.hours)
                .replace(/M/g, components.minutes)
                .replace(/S/g, components.seconds);
}



io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);
  const now = new Date();
  const format = "d/m/y H:M:S";
  socket.on('chat message', (msg) => {
    io.emit('chat message', {
      userId: socket.id,
      message: msg,
      timestamp: formatDate(now, format)
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;