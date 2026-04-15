const { Client, GatewayIntentBits } = require("discord.js");
const dotenv = require("dotenv");
const path = require("path");

const { getDatabaseForGuild, initializeDatabase } = require('./utils/database');
const handleSpottedCommand = require('./commands/handleSpottedCommand');
const handleLeaderboardCommand = require('./commands/handleLeaderboardCommand');
const handleClearCommand = require('./commands/handleClearCommand');
const handleAdjustCommand = require('./commands/handleAdjustCommand');

const ownerId = 361286910775132162n;
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Bot is online!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const guildId = message.guild.id;
  const content = message.content.toLowerCase();
  const keywords = ["spotted", "spotting", "spot"];
  // const keywordsVerbose = ["spotted", "spotting", "spot", 
  // "spoted", "spoting", "spott" 
  // "spottes", "spottinf", "apotted"];
  const db = getDatabaseForGuild(guildId);

  try {
    initializeDatabase(db);

    let isSpotting = false;
    for (let i = 0; i < keywords.length; i++) {
      if (content.includes(keywords[i])) {
        isSpotting = true;
        break;
      }
    }

    let mentionedUsers = message.mentions.users;

    if (
      (mentionedUsers.size() > 0) &&
      (isSpotting)
    ) {
      await handleSpottedCommand(message, db);
    } else if (content === "!leaderboard") {
      await handleLeaderboardCommand(message, db);
    } else if (content === "!clear" && message.author.id === ownerId.toString()) {
      handleClearCommand(message, db, guildId);
    } else if (content.startsWith('!adjust') && message.author.id === ownerId.toString()) {
      await handleAdjustCommand(message, db);
    }
  } catch (err) {
    console.error("Error processing command:", err.message);
    message.channel.send("An error occurred while processing your command.");
  } finally {
    db.close((err) => {
      if (err) {
        console.error("Error closing the database connection:", err.message);
      } else {
        console.log(`Database connection closed for guild ${guildId}.`);
      }
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
