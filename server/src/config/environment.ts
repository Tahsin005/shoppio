const environment = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    corsOrigins: process.env.CORS_ORIGINS,
    adminEmails: process.env.ADMIN_EMAILS,
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
};

export default environment;