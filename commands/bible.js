import fetch from 'node-fetch';
import { EmbedBase } from '../classes/EmbedBase.js';

const API_URL = 'https://bible-api.com/';

export async function bible(message, args) {
	const [book, verse] = args;
	const res = await fetch(`${API_URL}${book}+${verse}?translation=lol`);
	const json = await res.json();
	console.log(json);

	if (!!json.error) {
		const embed = new EmbedBase({
			title: 'Error',
			description: json.error,
			color: 0xbd222c,
		});
		return message.reply({
			embeds: [embed],
		});
	}

	if (json === 'translation not found') {
		const embed = new EmbedBase({
			title: 'Error',
			description: json,
			color: 0xbd222c,
		});
		return message.reply({
			embeds: [embed],
		});
	}

	return message.reply(json.text);
}
