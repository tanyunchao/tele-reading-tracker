async function setupBotCommands() {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  const commands = [
    {
      command: "start",
      description: "Start the bot and see available commands",
    },
    { command: "books", description: "List your current books" },
    {
      command: "update",
      description:
        "Update reading progress: /update <book_id> <page> [summary]",
    },
    { command: "stats", description: "View your reading statistics" },
    { command: "help", description: "Show detailed help message" },
  ];

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commands }),
    }
  );

  console.log("Command setup result:", await response.json());
}

setupBotCommands();
