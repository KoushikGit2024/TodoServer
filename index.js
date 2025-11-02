const express = require('express');
const cors = require('cors');
const { v4: uuidv4, stringify } = require('uuid');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 7400;

// =======================
// MODEL IMPORTS
// =======================
const { User } = require('./models/userSchema');
const { Task, subTask } = require('./models/taskSchema');

// =======================
// DATABASE CONNECTION
// =======================
const { run, ConnectDb } = require('./connection');
ConnectDb();

// =======================
// ROUTE IMPORTS
// =======================
const UserRoute = require('./routes/userRoute');
const BaseRoute = require('./routes/baseRoute');

// =======================
// MIDDLEWARE IMPORTS
// =======================
const {
    UserAuthenticationHandler,
    userPreDataHandler,
} = require('./middlewares/UserTokenChecker');

// =======================
// GLOBAL MIDDLEWARES
// =======================
app.use(cors({
    origin: [
        "https://todofrontend-t9qq.onrender.com",
        "https://todo-frontend-sage-two.vercel.app",
        "https://remidos.onrender.com"
    ],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =======================
// ROUTES
// =======================
app.use('/api/baseroute', BaseRoute);
app.use('/api/user', userPreDataHandler, UserRoute);

// Health check / root endpoints
app.get("/ping", (req, res) => {
    res.status(200).send("Server is awake 🚀");
});

app.get('/', (req, res) => {
    res.send("Hello");
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
    console.log(`✅ Server started on http://localhost:${PORT}`);
});
