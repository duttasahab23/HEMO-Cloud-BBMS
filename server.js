const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require("./config/db");
const path = require('path')


//dot config()
dotenv.config();
//mongodb connection
connectDB();
// rest objects

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
//routes
// 1 test route

app.use('/api/v1/test', require("./routes/testRoute.js"));
app.use('/api/v1/auth', require("./routes/authRoutes.js"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes.js"));
app.use("/api/v1/analytics", require("./routes/analyticsRoute.js"));
app.use("/api/v1/admin", require("./routes/adminRoutes.js"));

// Static Folders
app.use(express.static(path.join(__dirname, './client/build')))

//Static Routes
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
});

//port

const PORT = process.env.PORT || 8080;


//listen

app.listen(PORT, () => {
    console.log(`Node Server Running In ${process.env.DEV_MODE} ModeOn Port ${process.env.PORT}`.bgBlue.white);
});

