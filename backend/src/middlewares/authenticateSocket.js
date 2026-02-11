import jwt from "jsonwebtoken";

const authenticateSocket = (socket, next) => {

  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Authentication error: Token is required"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = user;
    next();
  });
};

export default authenticateSocket;