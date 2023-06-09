const sequelize = require('../config/database');
const User = require("../model/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync } = require('bcrypt');


const createUser = async (req, res) => {
    const transact = await sequelize.transaction();
    try {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        var user = await User.create({
            first_name: body.first_name,
            last_name: body.last_name,
            gender: body.gender,
            email: body.email,
            password: body.password,
            number: body.number
        }, { transaction: transact });
        await transact.commit();
        return res.json({
            success: 1,
            message: "registered"
        });
    } catch (e) {
        await transact.rollback();
        return res.json({
            success: 0,
            message: e.message
        });
    }
}

const getUsers = async (req, res) => {
    try {
        var users = await User.findAll({
            attributes: ['id', 'first_name', 'gender', 'email', 'number', 'created_at']
        });
        return res.json({
            success: 1,
            message: "users fetched successfully",
            data: users
        });
    } catch (e) {
        return res.json({
            success: 0,
            message: e.message
        });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!(email && password)) {
            res.status(400)
            throw new Error('Please enter email and password')
        }

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            res.status(404)
            throw new Error('User not found')
        }

        // if you want to use cookies
        const option = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }


        const token = generateToken(user.id);

        //check user and password match
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).cookie('token', token, option).json({
                id: user.id,
                first_name: user.first_name,
                email: user.email,
                token: token
            })
        } else {
            res.status(401)
            throw new Error('Invalid credentials')
        }
    } catch (e) {
        return res.json({
            success: 0,
            message: e.message
        });
    }
}

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


module.exports = {
    createUser,
    getUsers,
    loginUser,
    generateToken
};