import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { EmbedBase } from './classes/EmbedBase.js';
import { bible } from './commands/bible.js';
dotenv.config();

const client = new Client({
	allowedMentions: { parse: ['everyone'] },
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

await mkdir('cache', { recursive: true });
const levels = JSON.parse(await readFile('cache/levels.json', 'utf-8').catch(() => '{}'));
console.log(levels);

client.on('messageCreate', (message) => {
	if (message.author.id === client.user.id) return; //dont respond to myself

	console.log(message.content);
	if (message.content === '!ping') return message.reply('Pong!'); //respond to !ping
	if (message.content === '!level')
		return message.reply({
			embeds: [
				new EmbedBase({
					title: 'Your Level',
					description: `Level ${levels[message.author.id] ?? 0}`,
				}),
			],
		});

	const args = message.content.split(' ').slice(1); //split message into array of args

	if (message.content.startsWith('!bible')) return bible(message, args);

	// message.reply('@everyone');
});

// Levelling logic
client.on('messageCreate', async (message) => {
	if (message.author.id === client.user.id) return; //dont respond to myself

	console.log('levels before', levels);

	let level = levels[message.author.id] ?? 0;
	levels[message.author.id] = ++level; // reassign user's level in the levels object

	console.log('levels after', levels);

	await writeFile('cache/levels.json', JSON.stringify(levels), 'utf-8');
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);
