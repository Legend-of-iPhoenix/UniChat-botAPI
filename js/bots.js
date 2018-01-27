//Demo/example code.

var bot = new Bot("LAXBOT", "");

//when UniChat is ready to load bots, register the bot(s). If you are doing multiple bots, you should put the registerBot commands in the same initializeBots block. Syntax: registerBot(bot_username, bot_header_char, callback). Note that callback is the name of the function *in quotes* to be called whenever a message starts with the command header.
function initializeBots() {
  bot.register();
}

//this is the function called whenever a message starts with the command header. We recommend function names of the format execute<bot_username> to prevent overlap.
bot.executeCommand =  function(data) {
  //This code initializes the variables:
  var poster = data.poster;
  var message = data.message;
  var timestamp = data.timestamp;
  var raw_timestamp = data.rawTimestamp;
  //if the first 4 characters of the message (starting from 0), minus the command header, are "ping", then highlight the user and say, "Pong!".
  if (message.substring(0,6) == "/leave") {
  	this.respond(poster + " has left the room");
  }
}
