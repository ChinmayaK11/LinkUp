import http from "http"
import express from "express"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6,  // 1MB max message size
    connectionStateRecovery: {
        // restore client state on reconnect for up to 2 minutes
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true
    }
})

const userSocketMap = {}

export const getSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

export const getOnlineUsers = () => {
    return Object.keys(userSocketMap)
}

// ─── Helper: validate userId ──────────────────────────────
// fix: previous check allowed any truthy string including "null" and "undefined"
const isValidUserId = (userId) => {
    return userId && userId !== "undefined" && userId !== "null" && userId.trim() !== ""
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId

    if (isValidUserId(userId)) {
        userSocketMap[userId] = socket.id
        console.log(`✅ User connected: ${userId} → socket: ${socket.id}`)
        console.log(`📊 Online users: ${Object.keys(userSocketMap).length}`)
    }

    // Emit updated online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // ─── Typing Indicators ────────────────────────────────

    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = getSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId: userId })
        }
    })

    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = getSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { senderId: userId })
        }
    })

    // ─── Message Read Receipts ────────────────────────────

    socket.on("messageRead", ({ senderId, messageId }) => {
        const senderSocketId = getSocketId(senderId)
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageRead", { messageId, readBy: userId })
        }
    })

    // ─── Room Management ──────────────────────────────────

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId)
        console.log(`👥 User ${userId} joined room: ${roomId}`)
    })

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId)
        console.log(`🚪 User ${userId} left room: ${roomId}`)
    })

    // ─── Reconnection ─────────────────────────────────────

    socket.on("reconnect", (attemptNumber) => {
        console.log(`🔄 User ${userId} reconnected after ${attemptNumber} attempt(s)`)
        if (isValidUserId(userId)) {
            userSocketMap[userId] = socket.id
            io.emit("getOnlineUsers", Object.keys(userSocketMap))
        }
    })

    // ─── Disconnect ───────────────────────────────────────

    socket.on("disconnect", (reason) => {
        if (isValidUserId(userId)) {
            delete userSocketMap[userId]
            console.log(`❌ User disconnected: ${userId} (reason: ${reason})`)
            console.log(`📊 Online users: ${Object.keys(userSocketMap).length}`)
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

    // ─── Error Handling ───────────────────────────────────

    socket.on("error", (err) => {
        console.error(`⚠️ Socket error for user ${userId}:`, err.message)
    })
})

export { app, io, server }
