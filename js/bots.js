//Create a bot, "testBot", that gets called whenever a message starts with "!"
var testBot = new Bot("testBot", "!");

//When UniChat is ready to load bots, register the bot(s). If you are doing multiple bots, you should put the bot.register() commands in the same initializeBots block. Syntax: bot.register().
function initializeBots() {
  testBot.register();
}

//this is the function called whenever a message starts with the command header. 
testBot.executeCommand =  function(data) {
  //This code initializes the variables:
  var poster = data.poster;
  var message = data.message;
  var timestamp = data.timestamp;
  var raw_timestamp = data.rawTimestamp;
  //if the first 4 characters of the message (starting from 0), minus the command header, are "ping", then highlight the user and say, "Pong!".
  if (message.substring(0,4) == "ping") {
    testBot.respond(poster + ": Pong!");
  }
}
