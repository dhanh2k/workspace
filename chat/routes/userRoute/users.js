const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const bcrypt = require('bcrypt')

router.get("/", async (req, res) => {
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
                res.status(200).json(existingUser)
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

module.exports = router

