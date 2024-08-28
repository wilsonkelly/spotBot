function handleClearCommand(message, db, guildId) {
    db.run(`DELETE FROM scores`, [], (err) => {
      if (err) {
        message.channel.send("There was an error clearing the database.");
        console.error("Error clearing database:", err.message);
      } else {
        message.channel.send("Database cleared.");
        console.log(`Database cleared for guild ${guildId}.`);
      }
    });
}

console.log("handleClearCommand loaded");

module.exports = handleClearCommand;
