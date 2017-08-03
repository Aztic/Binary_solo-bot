//replace format prototype
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

//IRC
const irc = require('irc');
var irc_config = {
	channels:['#channel_name'],
	server:'server ip',
	botName:'Binary_solo',
	username:'Binary_solo',
	nick:'Binary_solo'
}

var irc_bot = new irc.Client(irc_config.server,irc_config.botName,{
	channels:irc_config.channels
});

//Discord
const MY_ID = "Your personal discord user ID";
const Discord = require('discord.js');
const client = new Discord.Client();
var client_config = {
	token: 'Your bot token',
	channel: false
};

client.on('ready', ()=>{
	console.log("Logged in as Satania"); //This was the previous name. Satania best waifu
	client.user.setGame("IRC");
});

//Read discord message
//Need to optimize this
client.on('message',msg=>{
	if(msg.author.username === client.user.username || (!client_config.channel && msg.content != '!set' && msg.author.id != MY_ID))
		return;
	if(msg.author.id === MY_ID && msg.content === "!set"){
		client_config.channel = msg.channel;
		console.log("Done at {0}".format(msg.channel.name,msg.server.name));
	}
	else if(client_config.channel){
		let name = msg.author.username;
		//Send message to irc server
		irc_bot.say(irc_config.channels[0],"<{0}>: {1}".format(name,msg.content));
	}
});

//Read IRC message
irc_bot.addListener("message",function(from,to,text,message){
	if(!client_config.channel) return;
	//Send message to discord
	client_config.channel.send("**<{0}>**: {1}".format(from,text));
});

client.login(client_config.token);
