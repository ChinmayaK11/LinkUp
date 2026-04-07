import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import rateLimit from "express-rate-limit"
import authRouter from "./routes/auth.routes.js"
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"
import loopRouter from "./routes/loop.routes.js"
import storyRouter from "./routes/story.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket.js"

dotenv.config()

const port = process.env.PORT || 5000

app.use((req, res, next) => {
    const start = Date.now()
    res.on("finish", () => {
        const duration = Date.now() - start
        console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`)
    })
    next()
})

// ─── Rate Limiter ─────────────────────────────────────────
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // max 100 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests, please try again after 15 minutes."
    }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // stricter limit for auth routes
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many login attempts, please try again after 15 minutes."
    }
})

// ─── Middleware ───────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use("/api", limiter)

// ─── Routes ───────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/loop", loopRouter)
app.use("/api/story", storyRouter)
app.use("/api/message", messageRouter)

// ─── Health Check ─────────────────────────────────────────
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "LinkUp server is running 🚀",
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    })
})

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: `Route ${req.originalUrl} not found` 
    })
})

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
    console.error(`❌ [${new Date().toISOString()}] Error: ${err.message}`)
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    })
})

// ─── Start Server ─────────────────────────────────────────
// fix: connect to DB first, then start server so routes don't
// receive requests before the database is ready
const start = async () => {
    try {
        await connectDb()
        console.log("✅ Database connected")
        server.listen(port, () => {
            console.log(`✅ Server running on port ${port}`)
            console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
            console.log(`🔗 Health check: http://localhost:${port}/health`)
        })
    } catch (err) {
        console.error("❌ Failed to connect to database:", err.message)
        process.exit(1)
    }
}

start()
