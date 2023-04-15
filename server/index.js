// express is a library that helps us to create a server and handle requests
import express from "express"; 
// body-parser is a library that helps us to parse the body of the request and get the data from it
import bodyParser from "body-parser";
// mongoose is a library that helps us to connect to the database and create models and schemas for the data
import mongoose from "mongoose";
// cors is a library that helps us to handle cross-origin requests (requests from different domains)
import cors from "cors";
// dotenv is a library that helps us to store our environment variables in a .env file and access them in our code using process.env
import dotenv from "dotenv";
// multer is a library that helps us to handle file uploads in our requests (images, videos, etc.)
import multer from "multer";
// helmet is a library that helps us to secure our express app by setting various HTTP headers (security)
import helmet from "helmet";
// morgan is a library that helps us to log requests to our server in the console (development)
import morgan from "morgan";
// path is a library that helps us to get the current directory path (used for file storage)
import path from "path";
// fileURLToPath is a function that helps us to get the current directory path (used for file storage)
import { fileURLToPath } from "url";

// authRoutes is a file that contains all the routes for the authentication
import authRoutes from "./routes/auth.js";
// userRoutes is a file that contains all the routes for the users
import userRoutes from "./routes/users.js";
// postRoutes is a file that contains all the routes for the posts
import postRoutes from "./routes/posts.js";
// register is a function that helps us to register a new user
import { register } from "./controllers/auth.js";
// createPost is a function that helps us to create a new post
import { createPost } from "./controllers/posts.js";
// verifyToken is a function that helps us to verify the token of the user
import { verifyToken } from "./middleware/auth.js";
// User is a model that helps us to create a new user
import User from "./models/User.js";
// Post is a model that helps us to create a new post
import Post from "./models/Post.js";

import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
// __filename and __dirname are global variables that are available in every file in our project
const __filename = fileURLToPath(import.meta.url);
// path.dirname() is a function that helps us to get the current directory path
const __dirname = path.dirname(__filename);
// dotenv.config() is a function that helps us to read the .env file and store the environment variables in process.env
dotenv.config();
// express() is a function that helps us to create a new express app
const app = express();
// app.use() is a function that helps us to use a middleware in our app
// express.json() is a function that helps us to parse the body of the request and get the data from it
app.use(express.json());
// helmet() is a function that helps us to secure our express app by setting various HTTP headers (security)
app.use(helmet());
// helmet.contentSecurityPolicy() is a function that helps us to secure our express app by setting various HTTP headers (security)
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// morgan() is a function that helps us to log requests to our server in the console (development)
app.use(morgan("common"));
// bodyParser.json() is a function that helps us to parse the body of the request and get the data from it
app.use(bodyParser.json({ limit: "30mb", extended: true }));
// bodyParser.urlencoded() Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// cors() is a function that helps us to handle cross-origin requests (requests from different domains)
app.use(cors());
// express.static() is a function that helps us to serve static files (images, videos, etc.)
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
