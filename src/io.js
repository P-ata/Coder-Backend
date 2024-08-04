const { Server } = require("socket.io");
let io;

function init(server) {
    io = new Server(server);
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado");
        // Aquí el código de los sockets
    });
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io no ha sido inicializado");
    }
    return io;
}

module.exports = { init, getIO };
