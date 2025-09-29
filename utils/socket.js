// utils/socket.js
let io;

export const setSocketInstance = (ioInstance) => {
  io = ioInstance;
};

export const getSocketInstance = () => io;
