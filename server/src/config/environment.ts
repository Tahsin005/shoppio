const environment = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    corsOrigins: process.env.CORS_ORIGINS,
    adminEmails: process.env.ADMIN_EMAILS,
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    cloudinaryUrl: process.env.CLOUDINARY_URL,
    moneybagApiKey: process.env.MONEYBAG_API_KEY,
    moneybagBaseUrl: process.env.MONEYBAG_BASE_URL,
    clientBaseUrl: process.env.CLIENT_BASE_URL,
};

export default environment;