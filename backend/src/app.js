const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

// CORS configuration to allow credentialed requests from Vite dev server
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}))

// middlewares
app.use(express.json())
app.use(cookieParser())

// routes
const authRouter = require('./routes/auth.routes')
app.use('/api/auth', authRouter)

const testRouter = require('./routes/test.routes')
app.use('/api/test', testRouter)

module.exports = app