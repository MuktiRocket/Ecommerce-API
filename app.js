const dotenv = require('dotenv').config();
var cors = require('cors');
const express = require("express");
const { isAuth } = require('./middleware/authMiddleware');
const usersRouter = require('./routers/usersRouter');
const app = express();

app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: false}))
app.use("/api/user", usersRouter);


// app.get('/api', (req, res) => {
//     res.json({
//         success: 1,
//         message: "working"
//     });
// });

app.listen(process.env.APP_PORT, () => {
    console.log('server is running on: ', process.env.APP_PORT);
});