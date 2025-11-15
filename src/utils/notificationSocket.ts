import { Server } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secretKey } from "./helper";

const setupSocket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("join", (token: string) => {
      try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        const userId = decoded.id as string;
        if (userId) {
          socket.join(userId); 
          console.log(`User ${userId} joined notifications room`);
        }
      } catch (error) {
        console.error("Invalid token provided for socket join");
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected from socket");
    });
  });
};

export default setupSocket;
