//Demo/example code.

var lax = new Bot("LAXBOT", "~","1.1");

//when UniChat is ready to load bots, register the bot(s). If you are doing multiple bots, you should put the registerBot commands in the same initializeBots block. Syntax: registerBot(bot_username, bot_header_char, callback). Note that callback is the name of the function *in quotes* to be called whenever a message starts with the command header.
function initializeBots() {
  lax.register();
}

//this is the function called whenever a message starts with the command header. We recommend function names of the format execute<bot_username> to prevent overlap.
lax.executeCommand =  function(data) {
  //This code initializes the variables:
  var poster = data.poster;
  var message = data.message;
  var timestamp = data.timestamp;
  var raw_timestamp = data.rawTimestamp;
 
  if (message.substring(0,7) == "laxinfo") {
  	this.respond("Hello, Im Always Watching! ~ LAXBOT version" + bot.version);
  }
}

  
