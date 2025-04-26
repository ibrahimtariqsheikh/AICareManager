import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import agencyRoutes from "./routes/agencyRoutes";
//import { authMiddleware } from "./middleware/authMiddleware";
import invitationRoutes from "./routes/invitationRoutes";
import scheduleRoutes from "./routes/scheduleRoutes";
import dashboardRoutes from "./routes/dashboardRoutes"
import reportRoutes from "./routes/reportRoutes";
import chatRoutes from "./routes/chatRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import scheduleTemplateRoutes from "./routes/scheduleTemplateRoute";

/* CONFIGURATIONS */
dotenv.config();

const PORT = process.env.PORT || 3001 ;
const app = express();

/* MIDDLEWARES */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

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
app.use("/chat", chatRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/templates", scheduleTemplateRoutes);
/* SERVER */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
