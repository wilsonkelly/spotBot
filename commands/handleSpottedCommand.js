async function handleSpottedCommand(message, db) {
  const mentionedUser = message.mentions.users.first();

  if (mentionedUser) {
    if (mentionedUser.id === message.author.id) {
      console.log(`${message.author.username} tried to spot themselves.`);
      return;
    }

    const spotterMember = await message.guild.members.fetch(message.author.id);
    const spottedMember = await message.guild.members.fetch(mentionedUser.id);

    const spotterId = spotterMember.id;
    const spotterNickname = spotterMember.nickname || spotterMember.user.username;
    const spottedId = spottedMember.id;
    const spottedNickname = spottedMember.nickname || spottedMember.user.username;

    await db.run(
      `INSERT INTO scores (user_id, username, spotter_count, spotted_count)
        VALUES (?, ?, 1, 0)
        ON CONFLICT(user_id) 
        DO UPDATE SET 
          spotter_count = spotter_count + 1, 
          username = ?`,
      [spotterId, spotterNickname, spotterNickname],
    );

    await db.run(
      `INSERT INTO scores (user_id, username, spotter_count, spotted_count)
        VALUES (?, ?, 0, 1)
        ON CONFLICT(user_id) 
        DO UPDATE SET 
          spotted_count = spotted_count + 1, 
          username = ?`,
      [spottedId, spottedNickname, spottedNickname],
    );

    console.log(`${spotterNickname} has spotted ${spottedNickname}!`);
  } else {
    console.log("You need to mention a user to spot them!");
  }
}

console.log("handleSpottedCommand loaded");

module.exports = handleSpottedCommand;
