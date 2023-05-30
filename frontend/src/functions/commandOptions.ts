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
friendAddCommands.set("add <username(s)>", "Send friend request(s).");

const friendBlockCommands = new Map<string, string>();
friendBlockCommands.set("block", "List all friends who can be blocked.");
friendBlockCommands.set("block <username(s)>", "Block friend(s) or stranger(s).");

const friendUnblockCommands = new Map<string, string>();
friendUnblockCommands.set("unblock", "List all friends who can be unblocked.");
friendUnblockCommands.set("unblock <username(s)>", "Unblock friend(s).");

const friendUnfriendCommands = new Map<string, string>();
friendUnfriendCommands.set("unfriend", "List all friends who can be unfriended.");
friendUnfriendCommands.set("unfriend <username(s)>", "Unfriend friend(s).");

const allCommands = [primaryCommands, utilityCommands];
const friendCommands = [friendGeneralCommands, friendAddCommands, friendBlockCommands, friendUnblockCommands, friendUnfriendCommands];

export {
  allCommands,
  friendCommands
};


