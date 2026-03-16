import http from "http"
import express from "express"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000,      // Close connection if no response in 60s
    pingInterval: 25000,     // Check connection every 25s
})

const userSocketMap = {}

export const getSocketId = (receiverId) => {
    return userSocketMap[receiverId]
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId

    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id
        console.log(`✅ User connected: ${userId} → socket: ${socket.id}`)
    }

    // Emit updated online users to everyone
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    // Handle typing indicator
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

    socket.on("disconnect", () => {
        if (userId) {
            delete userSocketMap[userId]
            console.log(`❌ User disconnected: ${userId}`)
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

    socket.on("error", (err) => {
        console.error(`Socket error for user ${userId}:`, err.message)
    })
})

export { app, io, server }
