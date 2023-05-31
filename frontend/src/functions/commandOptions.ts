const primaryCommands = new Map<string, string>();
primaryCommands.set("friend", "Manages your friendship.");
primaryCommands.set("leaderboard", "Displays the game leaderboard.");
primaryCommands.set("profile", "View my profile.");
primaryCommands.set("profile <intraName> ", "Displays profile.");
primaryCommands.set("tfa", "Sets and unsets Google 2-Factor-Authentication.");
primaryCommands.set("reset", "Resets your profile (Requires TFA if enabled).");
primaryCommands.set("game", "Queue or dequeue for a game.");

const utilityCommands = new Map<string, string>();
utilityCommands.set("clear", "Clears the terminal.");
utilityCommands.set("cowsay <message> ", "Makes a cow say something.");
utilityCommands.set("help", "Displays this help message.");
utilityCommands.set("ok", "Ok.");
utilityCommands.set("sudo", "Admin privilege for debugging.");
utilityCommands.set("logout", "Logs you out.");

const friendGeneralCommands = new Map<string, string>();
friendGeneralCommands.set("list", "List all the friends.");
friendGeneralCommands.set("requests", "Show all incoming friend requests.");

const friendAddCommands = new Map<string, string>();
friendAddCommands.set("add <intraName(s)>", "Send friend request(s).");

const friendBlockCommands = new Map<string, string>();
friendBlockCommands.set("block", "List all friends who can be blocked.");
friendBlockCommands.set("block <intraName(s)>", "Block friend(s) or stranger(s).");

const friendUnblockCommands = new Map<string, string>();
friendUnblockCommands.set("unblock", "List all friends who can be unblocked.");
friendUnblockCommands.set("unblock <intraName(s)>", "Unblock friend(s).");

const friendUnfriendCommands = new Map<string, string>();
friendUnfriendCommands.set("unfriend", "List all friends who can be unfriended.");
friendUnfriendCommands.set("unfriend <intraName(s)>", "Unfriend friend(s).");

const gameQueueCommands = new Map<string, string>();
gameQueueCommands.set("queue standard", "Queue for standard, with powerups and more.");
gameQueueCommands.set("queue boring", "Seriously?");
gameQueueCommands.set("queue death", "Seriously?!");
gameQueueCommands.set("queue practice", "Try to beat the bot (PS. It's possible).");
gameQueueCommands.set("dequeue", "Dequeue from a game.");

const gameSettingsCommands = new Map<string, string>();
gameSettingsCommands.set("useParticlesFilter <boolean>","blooms!! (default: true)");
gameSettingsCommands.set("usePaddleFilter <boolean>","Set to false for minimal improvements on your fps. (default: true)");
gameSettingsCommands.set("useEntitiesFilter <boolean>","Set to false for less than minimal improvements on your fps. (default: true)");
gameSettingsCommands.set("useHitFilter <boolean>","Set to false to turn off cool hit effects, but gain fps. (default: true)");
gameSettingsCommands.set("tickPerParticlesSpawn <int>","higher number = less particles, less particle, less cool. (default: 0)");
gameSettingsCommands.set("gameMaxWidth <int>","max width of the game. (default: 1600)");
gameSettingsCommands.set("gameMaxHeight <int>","max height of the game. (default: 900) :aspect ratio always maintain 16:9");

const allCommands = [primaryCommands, utilityCommands];
const friendCommands = [friendGeneralCommands, friendAddCommands, friendBlockCommands, friendUnblockCommands, friendUnfriendCommands];
const gameSetCommands = [ gameSettingsCommands];

export {
  allCommands,
  friendCommands,
  gameSetCommands,
};


