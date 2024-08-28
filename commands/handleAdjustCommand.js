async function handleAdjustCommand(message, db) {
    const args = message.content.split(' ').filter(arg => arg !== '');
  
    if (args.length !== 4) {
      message.channel.send("Usage: !adjust <userid> <changespots> <changespotteds>");
      console.log("Invalid number of arguments:", args.length);
      return;
    }
  
    const userId = args[1];
    const changeSpots = parseInt(args[2]);
    const changeSpotteds = parseInt(args[3]);
  
    if (isNaN(changeSpots) || isNaN(changeSpotteds)) {
      message.channel.send("Invalid number format for spots or spotteds.");
      console.log("Invalid number format.");
      return;
    }
  
    db.get('SELECT * FROM scores WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        console.error(err.message);
        message.channel.send("There was an error fetching the user from the database.");
        return;
      }
  
      if (!row) {
        message.channel.send(`No user found with ID ${userId}.`);
        return;
      }
  
      const newSpotterCount = row.spotter_count + changeSpots;
      const newSpottedCount = row.spotted_count + changeSpotteds;
  
      db.run(
        `UPDATE scores SET spotter_count = ?, spotted_count = ? WHERE user_id = ?`,
        [newSpotterCount, newSpottedCount, userId],
        function (err) {
          if (err) {
            console.error(err.message);
            message.channel.send("There was an error updating the user's scores.");
            return;
          }
  
          message.channel.send(`Updated scores for ${row.username} (ID: ${userId}). New spots: ${newSpotterCount}, New spotteds: ${newSpottedCount}.`);
          console.log("User scores updated successfully.");
        }
      );
    });
}

console.log("handleAdjustCommand loaded");

module.exports = handleAdjustCommand;
