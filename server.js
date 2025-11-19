const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Belge içeriğini bellekte tut
let documentContent = '';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);
  
  // Yeni kullanıcıya mevcut içeriği gönder
  socket.emit('load-document', { content: documentContent });
  
  // Kullanıcı sayısını gönder
  io.emit('user-count', io.engine.clientsCount);
  
  // İçerik değişikliği - tüm içeriği senkronize et
  socket.on('content-change', (data) => {
    documentContent = data.content;
    // Gönderen hariç tüm kullanıcılara ilet
    socket.broadcast.emit('content-update', data);
  });
  
  // Kullanıcı ayrıldı
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı:', socket.id);
    io.emit('user-count', io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
  console.log(`http://localhost:${PORT} adresinden erişebilirsiniz`);
});
