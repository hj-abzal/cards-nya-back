const USER_NAME = process.env.MONGO_DB_USER_NAME || "suan";
const PASSWORD = process.env.MONGO_DB_USER_PASSWORD || "7777";
const MONGO_DB_URL = process.env.MONGO_DB_URL || "cluster0.xyyt9t9.mongodb.net/"; // bd for tests

export const MongoDBUris = `mongodb+srv://suan:7777@cluster0.xyyt9t9.mongodb.net/?retryWrites=true&w=majority`;
console.log({MongoDBUris})

export const DEV_VERSION = false;

export const VERSION_2_0 = "/2.0";

export const GMAIL_USER = "it.karate.suan@gmail.com";
export const GMAIL_PASS = "it-karate-2022";

export const PORT = 7542;