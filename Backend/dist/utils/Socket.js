"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = void 0;
let activeCalls = new Map();
const chatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("connected to socket.io");
        socket.on("setup", (user) => {
            socket.join(user?._id);
            socket.emit("connected");
        });
        socket.on("join chat", (chatId) => {
            socket.join(chatId);
        });
        socket.on("new message", (message) => {
            message.chat.users.forEach((user) => {
                if (user?._id === message.sender?._id)
                    return;
                socket.to(user._id).emit("message received", message);
            });
        });
        socket.on("typing", (chatId) => {
            socket.in(chatId).emit("typing");
        });
        socket.on("stop typing", (chatId) => {
            socket.in(chatId).emit("stop typing");
        });
        // *********** CALL **********
        // Join user to their own room
        socket.on("user:join", ({ userId }) => {
            socket.join(userId);
            console.log("User joined with ID:", userId);
        });
        // Handle incoming call notification
        socket.on("incoming:call", (data) => {
            const { from, to } = data;
            console.log(`Incoming call from ${from} to ${to}`);
            // Notify the receiver about incoming call
            io.to(to).emit("incoming:call", data);
        });
        // Handle call accepted
        socket.on("call:accepted", (data) => {
            const { from, to, answer } = data;
            console.log(`Call accepted by ${from}, notifying ${to}`);
            // Send answer back to the caller
            io.to(to).emit("call:accepted", {
                from,
                answer,
            });
        });
        // Handle call rejected
        socket.on("call:rejected", (data) => {
            const { from, to } = data;
            console.log(`Call rejected by ${from}, notifying ${to}`);
            // Notify the caller that call was rejected
            io.to(to).emit("call:rejected", {
                from,
            });
        });
        // Handle WebRTC offer (user:call)
        socket.on("user:call", (data) => {
            const { from, to, offer } = data;
            console.log(`WebRTC offer from ${from} to ${to}`);
            // Forward the offer to the receiver
            io.to(to).emit("user:call", {
                from,
                offer,
            });
        });
        // Handle call end
        socket.on("call:end", (data) => {
            const { from, to } = data;
            console.log(`Call ended by ${from}, notifying ${to}`);
            // Notify the other user that call has ended
            io.to(to).emit("call:end", {
                from,
            });
        });
        // Handle ICE candidates
        socket.on("ice:candidate", (data) => {
            const { from, to, candidate } = data;
            console.log(`ICE candidate from ${from} to ${to}`);
            // Forward ICE candidate to the other peer
            io.to(to).emit("ice:candidate", {
                from,
                candidate,
            });
        });
        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            // You can add logic here to notify other users if needed
        });
    });
};
exports.chatSocket = chatSocket;
