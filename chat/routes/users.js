const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/:id", (req, res) => {
    res.send(req.params.id)
})

router.post("/", async (req, res) => {
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
            res.status(201).json(newUser)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    } catch {
        res.status(500).send()
    }
})

module.exports = router

