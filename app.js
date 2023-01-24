import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
	allowedMentions: { parse: ['everyone'] },
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on('messageCreate', (message) => {
	if (message.author.id === client.user.id) return; //dont respond to myself

	console.log(message.content);
	if (message.content === '!ping') return message.reply('Pong!'); //respond to !ping

	message.reply('@everyone');
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);
