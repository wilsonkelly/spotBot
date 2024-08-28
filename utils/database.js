const sqlite3 = require("sqlite3").verbose();
const path = require("path");

function getDatabaseForGuild(guildId) {
  const dbPath = path.join(__dirname, `../spotted_${guildId}.db`);
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
      console.error(`Error connecting to database for guild ${guildId}:`, err.message);
    } else {
      console.log(`Connected to the database for guild ${guildId}.`);
    }
  });
}

function initializeDatabase(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      user_id TEXT PRIMARY KEY,
      username TEXT,
      spotter_count INTEGER DEFAULT 0,
      spotted_count INTEGER DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error("Error initializing database:", err.message);
    } else {
      console.log("Database initialized successfully.");
    }
  });
}

module.exports = {
  getDatabaseForGuild,
  initializeDatabase,
};
