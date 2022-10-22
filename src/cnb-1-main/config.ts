const USER_NAME = process.env.MONGO_DB_USER_NAME || "suan";
const PASSWORD = process.env.MONGO_DB_USER_PASSWORD || "7777";
const MONGO_DB_URL = process.env.MONGO_DB_URL || "cluster0.xyyt9t9.mongodb.net/"; // bd for tests

export const MongoDBUris = `mongodb+srv://${USER_NAME}:${PASSWORD}@${MONGO_DB_URL}?retryWrites=true&w=majority`;
console.log({MongoDBUris})

export const DEV_VERSION = false;

export const VERSION_2_0 = "/2.0";

export const GMAIL_USER = "";
export const GMAIL_PASS = "";

export const PORT = 7542;