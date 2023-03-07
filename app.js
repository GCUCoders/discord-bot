import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import klaw from 'klaw';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { EmbedBase } from './classes/EmbedBase.js';
dotenv.config();

const client = new Client({
	allowedMentions: { parse: ['everyone'] },
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
client.commands = new Collection();

await mkdir('cache', { recursive: true });
const levels = JSON.parse(await readFile('cache/levels.json', 'utf-8').catch(() => '{}'));
console.log(levels);

// Import commands
for await (const item of klaw('./commands')) {
	const cmdFile = path.parse(item.path);
	if (!cmdFile.ext || cmdFile.ext !== '.js') continue;
	const cmdName = cmdFile.name.split('.')[0];
	try {
		const cmd = new (
			await import('./' + path.relative(process.cwd(), `${cmdFile.dir}${path.sep}${cmdFile.name}${cmdFile.ext}`))
		).default();
		client.commands.set(cmdName, cmd);
	} catch (error) {
		console.error(error);
	}
}
console.log(`Loaded ${client.commands.size} commands`);

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

// Slash commands
client.on('interactionCreate', async (intr) => {
	if (!intr.isCommand()) return;
	// Ignore commands sent by other bots
	if (intr.user.bot) return;

	const command = client.commands.get(intr.commandName);

	await command.run({ intr, opts: intr.options });
});

client.on('ready', async () => {
	await postInit();
	console.log(`Logged in as ${client.user.tag}!`);
});

async function postInit() {
	try {
		await client.guilds.resolve('284847469492437002').commands.set(client.commands);
		// await client.application.commands.set([]);
	} catch (err) {
		console.error('postInit error', err);
	}
}

client.login(process.env.BOT_TOKEN);
