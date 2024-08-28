async function handleLeaderboardCommand(message, db) {
    db.all(
      `SELECT user_id, spotter_count, spotted_count FROM scores ORDER BY spotter_count DESC, spotted_count ASC`,
      [],
      async (err, rows) => {
        if (err) {
          console.error(err.message);
          message.channel.send("An error occurred while fetching the leaderboard.");
          return;
        }

        if (rows.length === 0) {
          message.channel.send("No spotting records found.");
          return;
        }

        let leaderboard = "";
        for (const [index, row] of rows.entries()) {
          try {
            const member = await message.guild.members.fetch(row.user_id);
            const displayName = member.nickname || member.user.username;
            leaderboard += `${index + 1}. ${displayName}: ${row.spotter_count}-${row.spotted_count}\n`;
          } catch (error) {
            console.error(`Could not fetch member with ID ${row.user_id}:`, error);
            leaderboard += `${index + 1}. User ID ${row.user_id}: ${row.spotter_count}-${row.spotted_count}\n`;
          }
        }

        message.channel.send(`**Leaderboard:**\n${leaderboard}`);
      }
    );
}

console.log("handleLeaderboardCommand loaded");

module.exports = handleLeaderboardCommand;
