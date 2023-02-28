import fetch from 'node-fetch';
import { Command } from '../classes/Command.js';
import { EmbedBase } from '../classes/EmbedBase.js';

const API_URL = 'https://bible-api.com/';

export default class bible extends Command {
	constructor() {
		super({
			name: 'bible',
			description: 'Get a verse from the Bible',
			options: [
				{
					type: 3,
					name: 'book',
					description: 'Book of the Bible',
					required: true,
				},
				{
					type: 3, // 3 = string
					name: 'verse',
					description: 'Verse to look up',
					required: true,
				},
			],
		});
	}

	async run({ intr, opts }) {
		const [book, verse] = [opts.getString('book'), opts.getString('verse')];
		const res = await fetch(`${API_URL}${book}+${verse}`);
		const json = await res.json();
		console.log(json);

		if (!!json.error) {
			const embed = new EmbedBase({
				title: 'Error',
				description: json.error,
				color: 0xbd222c,
			});
			return intr.reply({
				embeds: [embed],
			});
		}

		if (json === 'translation not found') {
			const embed = new EmbedBase({
				title: 'Error',
				description: json,
				color: 0xbd222c,
			});
			return intr.reply({
				embeds: [embed],
			});
		}

		return intr.reply(json.text);
	}
}
