const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config()
const User = require('../models/user')
const Event = require('../models/event')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_CONNECT,  { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if(err) {
        console.error(err)
    } else{
        console.log('conected to db')
    }
})

function verifyToken(req, res, next) {
    if(!req.headers.authorization){
        return res.status(401).send('Unauthorized Request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
        return res.status(401).send('Unauthorized Request')
    }
    let payload = jwt.verify(token, process.env.JWT_SECRET)
    if(!payload) {
        return res.status(401).send('Unauthorized Request')
    }
    req.userId = payload.subject
    next()
}

router.get('/', (req, res) => {
    res.send('Hello from API route')
})

router.post('/register', (req, res) => {
    req.body.password = Bcrypt.hashSync(req.body.password, 10)
    let userData = req.body
    let user = new User(userData)
    user.save((err, registeredUser) => {
        if(err) {
            console.error(err)
        } else {
            const payload = { subject: registeredUser._id }
            const token = jwt.sign(payload, process.env.JWT_SECRET)
            res.status(200).send({token})
        }
    })
})

router.post('/login', (req, res) => {
    let userData = req.body

    User.findOne({ email: userData.email }, (err, user) => {
        if(err) {
            console.error(err)
        } else {
            if(!user) {
                res.status(401).send('Invalid email')
            } else if(!Bcrypt.compareSync(userData.password, user.password)){
                res.status(401).send('Invalid password')
            } else{
                const payload = { subject: user._id }
                const token = jwt.sign(payload, process.env.JWT_SECRET)
                res.status(200).send({token})
            }
        }
    })
})

router.get('/events', (req, res) => {
    Event.find({special: false}, (err, events)=> {
        if(err) {
            console.error(err)
        } else {
            res.status(200).send(events)
        }
    })
})

router.get('/special', verifyToken, (req, res) => {
    Event.find({special: true}, (err, events)=> {
        if(err) {
            console.error(err)
        } else {
            res.status(200).send(events)
        }
    })
})

module.exports = router