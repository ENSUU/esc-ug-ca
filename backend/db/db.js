import Database from "better-sqlite3";
const db = new Database("./database.db", { verbose: console.log });

const createUserTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        email TEXT UNIQUE NOT NULL, 
        username TEXT UNIQUE NOT NULL, 
        password TEXT NOT NULL
    )    
`);

const createTranscriptTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS transcripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        audio_file BLOB NOT NULL, 
        generated_text TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
)   
`);

createUserTable.run();
createTranscriptTable.run();

export default db;
