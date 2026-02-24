import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend requests
app.use(express.json());

// Connect to MongoDB
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Failed to connect to MongoDB:', err));
} else {
    console.warn('WARNING: MONGODB_URI not found in .env');
}

// Add Clerk middleware to parse the auth state on every request
// If the key is missing, it skips validation but doesn't crash the server
app.use(clerkMiddleware());

// Public route that anyone can access
app.get('/api/public', (req, res) => {
    res.json({ message: "This is a public endpoint. Anyone can see it." });
});

// Protected route that requires a valid Clerk token
// Uses the requireAuth middleware to reject unauthenticated requests
app.get('/api/protected', requireAuth(), (req, res) => {
    // The user's ID is available on the request via req.auth
    const { userId } = req.auth;
    res.json({
        message: "You are successfully authenticated via Clerk on the backend!",
        userId: userId
    });
});

// Sync endpoint: called by the frontend upon login to ensure MongoDB has the user
app.post('/api/users/sync', requireAuth(), async (req, res) => {
    console.log('📥 Received request at /api/users/sync');
    try {
        const { userId } = req.auth; // The secure verified clerkId
        const { email, name, avatar } = req.body;
        console.log('👤 Extracted Clerk userId:', userId);
        console.log('📦 Request body:', req.body);

        if (!name) {
            console.log('⚠️ Missing required fields: name=', name);
            return res.status(400).json({ error: "Missing required user name" });
        }

        console.log('🔄 Attempting to upsert user in MongoDB...');
        // Upsert the user into MongoDB
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                clerkId: userId,
                email: email || '', // Fallback to empty string instead of null
                name,
                avatar
            },
            { new: true, upsert: true }
        );
        console.log('✅ User successfully upserted:', user);

        res.json({ message: "User synced successfully", user });
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ error: "Failed to sync user data" });
    }
});

// Add a fallback error handler for Clerk
app.use((err, req, res, next) => {
    console.error("🔴 Global Error Handler Caught:", err.message);
    if (err.stack) console.error(err.stack);

    // Check if it's a Clerk Auth error
    if (err.message && err.message.includes('Unauthenticated')) {
        return res.status(401).json({ error: 'Unauthenticated!', details: err.message });
    }

    res.status(500).send('Internal Server Error!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
