import fetch from 'node-fetch';

const API_URL = 'https://bible-api.com/';

export async function bible(message, args) {
	const [book, verse, translation] = args;
	const res = await fetch(`${API_URL}${book}+${verse}?translation=${translation}`);
	const json = await res.json();

	return message.reply(json.text);
}
