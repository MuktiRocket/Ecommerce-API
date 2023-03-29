var jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const User = require("../model/User");

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let user = jwt.verify(token, JWT_SECRET);
        let userX = await User.findByPk(user.id);
        req.user = userX;
        next();
    } catch (error) {
        res.status(401).json({
            message: "authentication failed",
            error: error
        });
    }
};

module.exports = isAuth;