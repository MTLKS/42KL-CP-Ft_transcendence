const primaryCommands = new Map<string, string>();
primaryCommands.set("friend", "Manage your friendship.");
primaryCommands.set("leaderboard", "Display game leaderboard.");
primaryCommands.set("profile", "Display my or other user's profile.");

const utilityCommands = new Map<string, string>();
utilityCommands.set("clear", "Clear the terminal.");
utilityCommands.set("cowsay", "Make a cow say something.");
utilityCommands.set("help", "Display this help message.");
utilityCommands.set("ok", "Ok.");
utilityCommands.set("sudo", "Give you admin privilege.");

const friendGeneralCommands = new Map<string, string>();
friendGeneralCommands.set("list", "List all the friends.");
friendGeneralCommands.set("requests", "Show all incoming friend requests.");

const friendAddCommands = new Map<string, string>();
friendAddCommands.set("add [intraname(s)]", "Send friend request(s).");

const friendBlockCommands = new Map<string, string>();
friendBlockCommands.set("block", "List all friends who can be blocked.");
friendBlockCommands.set("block [intraname(s)]", "Block friend(s) or stranger(s).");

const friendUnblockCommands = new Map<string, string>();
friendUnblockCommands.set("unblock", "List all friends who can be unblocked.");
friendUnblockCommands.set("unblock [intraname(s)]", "Unblock friend(s).");

const friendUnfriendCommands = new Map<string, string>();
friendUnfriendCommands.set("unfriend", "List all friends who can be unfriended.");
friendUnfriendCommands.set("unfriend [intraname(s)]", "Unfriend friend(s).");

const allCommands = [primaryCommands, utilityCommands];
const friendCommands = [friendGeneralCommands, friendAddCommands, friendBlockCommands, friendUnblockCommands, friendUnfriendCommands];

export {
  allCommands,
  friendCommands
};

