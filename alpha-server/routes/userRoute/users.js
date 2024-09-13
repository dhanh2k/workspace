const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

let refreshTokens = []

router.get("/", authenticateToken, async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// router.get("/:id", (req, res) => {
//     res.send(req.params.id)
// })

router.get("/register", (req, res) => {
    res.render("register.ejs")
})

router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        // console.log(salt)
        // console.log(hashedPassword)
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
        })
        try {
            const newUser = await user.save()
            // res.status(201).json(newUser)
            res.redirect('/users/login')
        } catch (error) {
            // res.status(400).json({ message: error.message })
            res.redirect('/users/register')
        }
    } catch {
        // res.status(500).send()
        res.redirect('/users/register')
    }
})

router.get("/login", (req, res) => {
    res.render("login.ejs")
})

router.post("/login", async (req, res) => {
    const existingUser = await User.findOne({ username: req.body.username })

    if (existingUser) {
        console.log(existingUser)
        try {
            if (await bcrypt.compare(req.body.password, existingUser.password)) {
                const user = { name: req.body.username }
                console.log(user)
                const accessToken = generateAccessToken(user)
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECKET)
                refreshTokens.push(refreshToken)
                // res.json({ accessToken, refreshToken })
                res.redirect('/chat')
            } else {
                res.json({ message: "not allowed" })
            }
        } catch {
            res.status(500).send()
        }
    } else {
        res.json({ message: "User doesm't exist!" })
    }
})

router.post("/token", (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECKET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken(user)
        res.json({ accessToken: accessToken })
    })
})

router.delete("/logout", (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(token)
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err){
            console.log(err)
            return res.sendStatus(403)
        } 
            
        req.user = user
        next()
    })
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' })
}

module.exports = router

