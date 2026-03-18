import express from "express";
import cors from "cors";

const app = express();
// express() creates a web server application.

// EXPRESS CONFIGS -->
/* 
For any express config we have to use app.use (middleware)
In Express, middleware is a function that runs between the request and the response.
Client → Middleware → Route → Response
Middleware can: Read the request, Modify the request, Log data, Check authentication, Handle errors, Decide whether to continue or stop the request.
*/

// Basic Configs -->
app.use(express.json({ limit: "16kb" }));
// Supports JSON in the app so anyone can send JSON data --> converts incoming JSON to JS Object
// limit: "16kb" prevents very large or malicious JSON payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Parses URL-encoded data (form submissions, spaces turns to %20, etc.)
// extended: true allows nested objects in form data
app.use(express.static("public"));
// Serves static files (images, CSS, JS, HTML) from the "public" folder
// Example: public/logo.png → http://localhost:8000/logo.png

// Cookie Access -->
app.use(cookieParser());

// Cors Config -->
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    // Defines which frontend origins are allowed.
    credentials: true,
    // Allows cookies, tokens, and authentication headers to be sent.
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    // Defines which HTTP methods are allowed.
    allowedHeaders: ["Content-Type", "Authorization"],
    // Defines which headers the frontend can send.
  }),
);

// This creates a route in the Express Server.
// Means 'When someone sends a GET request to the root URL /, the server responds with "Hello World! By Ayusman Pati :0"'.
app.get("/", (req, res) => {
  res.send("Hello World! By Ayusman Pati :0");
});

// IMPORT THE ROUTES -->

// HealthCheck Route
import healthCheckRouter from "./routes/healthcheck.routes.js";
// Import the default exported router from that file and name it healthCheckRouter.
app.use("/api/v1/healthcheck", healthCheckRouter);
// As soon as someone hits 'api/v1/healthcheck', healthCheckRouter will be used.
// Can be  tested in Postman.

// Auth Route
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
app.use("/api/v1/auth", authRouter);
// Calls authRouter whenever someone hits this url. Goes to auth.routes.js and then to auth.controller.js.

// Project Route
import projectRouter from "./routes/project.routes.js";
app.use("/api/v1/projects", projectRouter);

export default app;
