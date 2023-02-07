import { Embed } from 'discord.js';

//base Embed object, customized for this project
export class EmbedBase extends Embed {
	constructor({
		color = 0x2ea2e0,
		title,
		url,
		author = {},
		description,
		thumbnail = {},
		fields = [],
		image = {},
		timestamp = new Date(),
		footer = '',
		...other
	} = {}) {
		super({
			color,
			title,
			url,
			author: author ?? {},
			description,
			thumbnail,
			fields,
			image,
			timestamp,
			footer: {
				text: 'GCU Bible Bot',
			},
			...other,
		});
	}
}
