//      ________          _ _____  _                      _          
//     /  ____  \        (_)  __ \| |                    (_)         
//    /  / ___|  \        _| |__) | |__   ___   ___ _ __  ___  __    
//   |  | |       |      | |  ___/| '_ \ / _ \ / _ \ '_ \| \ \/ /    
//   |  | |___    |      | | |    | | | | (_) |  __/ | | | |>  <     
//    \  \____|  /       |_|_|    |_| |_|\___/ \___|_| |_|_/_/\_\    
//     \________/    ______                                   ______ 
//                  |______|                                 |______|
//
// botAPI v2.4b0


var bots = [];
var activeBots = [];
var user;
var otherUsers = [];

var messageStatus = {
  get error() { return "ERROR"; },
	get warning() { return "WARNING"; },
	get message() { return "MESSAGE"; },
  get split() {return ""}
};

function Bot(bot_name, header_character) {
  this.name = bot_name;
  this.headerChar = header_character;
  this._basicCommands = [];
  this.executeCommand = function (data) {
    return null;
  }
  this.onRandomMessage = function (data) {
    return null;
  }
  this.defineSimpleCommand = function(command, response) {
    this._basicCommands.push({c: command, r: response});
  }
  this.userJoined = function (data) {
    return null;
  }
  this.userLeft = function (data) {
    return null;
  }
  this.respond = function (message) {
    log(messageStatus.message,'Response from "'+bot_name+'" received.');
    var timestamp = formatTime((new Date().getTime()));
    var n = document.createElement("DIV");
    n.innerHTML = detectURL("[" + timestamp + "] [" + bot_name + "]: " + message);
    document.getElementById("output").appendChild(n);
  }
  this.active = true;
  this.deactivate = function() {
    if (this.active) {
      this.active = false;
      log(messageStatus.message, 'Bot "'+bot_name+'" has been deactivated.');
    }
    else
    {
      log(messageStatus.warning, 'Bot "'+bot_name+'" is already deactivated!');
    }
  }
  this.activate = function() {
    if (!this.active) {
      this.active = true;
      log(messageStatus.message, 'Bot "'+bot_name+'" has been activated.');
    }
    else
    {
      log(messageStatus.warning, 'Bot "'+bot_name+'" is already active!');
    }
  }
  this.register = function() {
    if (findBot(bot_name, bots) == -1) {
      bots.push(this);
      activeBots.push(this);
      log(messageStatus.message, 'Bot "' + bot_name + '" initialized.');
    } else {
      log(messageStatus.error,'Two bots cannot have the same name! Duplicate bot name: "'+bot_name+'".');
    }
  }
}

function User() {
	var username;
  this.username = function () {
    return username
  }
  chars = function(data, n) {
  	var len = data.length - 1;
  	var result = "";
  	for (var i = 0; i < n; i++) {
  		var rand = Math.floor(Math.random() * len);
  		result += data.charAt(rand);
  	}
  	return result;
  }
  init = function() {
  	username = "user_"+chars(Math.floor(Math.random() * 1048576).toString(16)+(new Date().getTime().toString(16).substring(2,8))+Math.floor(Math.random() * 1048576).toString(16),6);
  	log(messageStatus.message,'User created with username "'+username+'".');
  }
  init();
}

function findBot(bot_name,bot_array) {
	var index = -1;
	var i = -1;
	bot_array.forEach(function(bot) {
		i++;
		if (bot.name == bot_name) {
			index = i;
		}
	});
	return index;
}

function sendMessage(data) {
  var header = data.text.substring(0,1);
  bots.forEach(function (bot) {
  	var f = {
    	poster: data.un,
    	message: bot.headerChar == "" ? data.text.toLowerCase() : data.text.substring(1, data.text.length).toLowerCase(),
    	rawMessage: data.text,
    	timestamp: formatTime(data.ts),
    	rawTimestamp: data.ts
  	}
    if (bot.active) {
      bot._basicCommands.forEach(function(basicCommand) {
        if (data.text == basicCommand.c) {
          bot.respond(basicCommand.r);
        }
      });
    if (header == bot.headerChar || bot.headerChar == "") {
    	if (typeof bot.executeCommand == 'function') {
    		log(messageStatus.message,'Callback for bot "'+bot.name+'" triggered with message "'+f.message+'".');
      	bot.executeCommand(f);
    	}
    	else
    	{
    		log(messageStatus.error,'Callback for bot "'+bot.name+'" is not a function!');
    	}
    }
  }
  });
}

function log(status, message) {
  var n = document.createElement("div");
  var dt = new Date().getTime();
  n.innerHTML = '[' + formatTime(dt) + '] <span class="' + status.toLowerCase() + '">' + status + ': ' + message + '</span>';
  if (status == "") {
    n.innerHTML = '[' + formatTime(dt) + ']';
  }
  document.getElementById("console").appendChild(n);
  document.getElementById('console').scrollTop = document.getElementById("console").scrollHeight;
}

window.onload = function () {
  log(messageStatus.message, "botAPI local testing environment loaded.");
  user = new User();
  log(messageStatus.message, "Ready to load bots!");
  if (typeof initializeBots == 'function') { 
  	initializeBots();
  	log(messageStatus.message,format(bots.length, 0, "bot")+" loaded, "+format(bots.length, 0, "bot")+" active.");
	}
  else {
  	log(messageStatus.error,'Function "initializeBots()" does not exist! No bots loaded.');
  }
  log(messageStatus.split);
  document.getElementById("messageBox").addEventListener("keyup", function (event) {
  	event.preventDefault();
  	if (event.key === "Enter")
  	  input();
	});
}

function formatTime(ts) {
  var dt = new Date(ts);

  var hours = dt.getHours() % 12;
  var minutes = dt.getMinutes();
  var seconds = dt.getSeconds();

  // the above dt.get...() functions return a single digit
  // so I prepend the zero here when needed
  if (hours < 10)
    hours = '0' + hours;

  if (minutes < 10)
    minutes = '0' + minutes;

  if (seconds < 10)
    seconds = '0' + seconds;

  if (hours == '00')
    hours = '12';

  return hours + ":" + minutes + ":" + seconds;
}

function input() {
  var message = document.getElementById("messageBox").value;
  if (message.length > 0 && message.length < 256) {
    if (message == "/newuser") {
      var newUser = new User()
      otherUsers.push(newUser);
      log(messageStatus.message, "Created a new user, "+newUser.username());
      bots.forEach(function(bot) {
        bot.userJoined({un: newUser.username(), ts: (new Date().getTime())});
      });
      document.getElementById("messageBox").value = "";
    }
    else {
      if (message == "/kickuser") {
        if (otherUsers.length > 0) {
          var kickedUser = otherUsers[Math.floor(Math.random()*otherUsers.length)];
          bots.forEach(function(bot) {
            bot.userLeft({un: kickedUser.username(), ts: (new Date().getTime())});
          });
          log(messageStatus.message, "Kicked "+kickedUser.username());
        }
        else {
          log(messageStatus.warning, "There are no other users. Use /newuser to create a new one. ");
        }
      }
      else {
        var data = {text: message, un: user.username(), ts: (new Date().getTime())};
        var n = document.createElement("DIV");
        n.innerHTML = detectURL("[" + formatTime((new Date().getTime())) + "] " + user.username() + ": " + message);
        document.getElementById("output").appendChild(n);
        document.getElementById('output').scrollTop = document.getElementById("output").scrollHeight;
        document.getElementById("messageBox").value = "";
        sendMessage(data);
      }
    }
  }
}

function cleanse(message) {
  var n = document.createElement("DIV");
  n.innerText = message;
  return n.innerHTML;
}

function detectURL(message) {
  message = cleanse(message);
  if (message !== undefined && message !== null) {
    var result = "";
    var n = "";
    //I'm using SAX's URL detection regex, because it works.
    var url_pattern = 'https?:\\/\\/[A-Za-z0-9\\.\\-\\/?&+=;:%#_~]+';
    var pattern = new RegExp(url_pattern, 'g');
    var match = message.match(pattern);
    if (match) {
      for (var i = 0; i < match.length; i++) {
        var link = '<a href="' + match[i] + '">' + match[i] + '</a>';
        var start = message.indexOf(match[i]);
        var header = message.substring(n.length, start);
        n += header;
        n += match[i];
        result = result.concat(header);
        result = result.concat(link);
      }
      result += message.substring(n.length, message.length);
    } else {
      result = message;
    }
  } else {
    result = "";
  }
  return result
}

function format(value, numDecimals, unit, showTrailingZeros) {
	value = (showTrailingZeros) ? value.toFixed(numDecimals) : parseFloat(value.toFixed(numDecimals));
	var formattedValue = value + ' ' + ((value != 1) ? unit + 's' : unit);

	return formattedValue;
}
