import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import userRoutes from "./routes/userRoutes";
import agencyRoutes from "./routes/agencyRoutes";
//import { authMiddleware } from "./middleware/authMiddleware";
import invitationRoutes from "./routes/invitationRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import reportRoutes from "./routes/reportRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import scheduleTemplateRoutes from "./routes/scheduleTemplateRoute";
import medicationRoutes from "./routes/medicationRoutes";
import messageRoutes from "./routes/messageRoutes";
import { setSocketIO } from "./controllers/messageController";

/* CONFIGURATIONS */
dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);

// Configure Socket.IO with proper CORS settings
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  // Add additional Socket.IO options
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  },
});

// Set Socket.IO instance in message controller
setSocketIO(io);

/* MIDDLEWARES */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/users", userRoutes);
app.use("/agencies", agencyRoutes);
app.use("/invitations", invitationRoutes);
app.use("/schedules", scheduleRoutes);
app.use("/reports", reportRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/templates", scheduleTemplateRoutes);
app.use("/medications", medicationRoutes);
app.use("/messages", messageRoutes);

/* WebSocket Connection */
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle new messages
  socket.on("send_message", (data) => {
    console.log("Received message event:", data);

    socket.broadcast.emit("receive_message", data);
  });

  // Handle typing status
  socket.on("typing", (data) => {
    console.log("User typing:", data);
    socket.broadcast.emit("user_typing", data);
  });

  // Handle read receipts
  socket.on("mark_read", (data) => {
    console.log("Messages marked as read:", data);
    socket.broadcast.emit("messages_read", data);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* SERVER */
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
