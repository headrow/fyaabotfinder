/* SETTINGS TO CHANGE */
var channelid = ''; // ID of the discord channel to send the logs
var token = ''; // Token of the bot
var startId = 1777576; // First ID to check
var finishId = 1777624; // Last ID to check

/* Actual code */
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

var channel;
var currentId = startId;
var startDate = new Date(2020, 09, 30);
var finishDate = new Date(2020, 10, 03);
var lastMsg;
let waitTime = 0;

function sendUsers(infor) {
	setTimeout(() => {
		waitTime = 1;

		let json = JSON.parse(infor);
		
		if (currentId != lastMsg) {
			lastMsg = currentId;
			console.log(currentId + " - " + new Date().toLocaleString());
		}

		try {
			if (json.data.length > 0) {
				json.data.forEach((info) => {
					var badgeDate = new Date(info.awardedDate);
		
					if (badgeDate >= startDate && badgeDate <= finishDate) {
						channel.send('https://www.roblox.com/users/' + currentId + '/profile');
					}
				});
			}
		} catch {
			if (json.errors[0].code == 4) {
				return grabInfo(currentId + 1);
			} else {
				return grabInfo(currentId);
			}
		}

		if (currentId + 1 > finishId){
			channel.send("finished").then(() => {
				client.destroy();
				process.exit(1);
			})
		} else {
			grabInfo(currentId + 1);
		}
	}, waitTime);
}

function grabInfo(ID) {
	currentId = ID;
	fetch('https://badges.roblox.com/v1/users/' + ID + '/badges/awarded-dates?badgeIds=2124510987')
		.then(data => data.text())
		.then(sendUsers)
		.catch(error => new Error(error));
}

client.on('message', async message=>{
	if (message.content.toLowerCase() == "!update"){
		client.user.setActivity(currentId + "/" + finishId + " - " + new Date().toLocaleString());
	}
});

client.on('ready', async() =>{
	channel = client.channels.cache.get(channelid);
	grabInfo(currentId);
});

client.login(token);