import fetch from 'node-fetch';
import { Command } from '../classes/Command.js';
import { EmbedBase } from '../classes/EmbedBase.js';

const API_URL = 'https://api.thecatapi.com/v1/images/search';

export default class cat extends Command {
	constructor() {
		super({
			name: 'cat',
			description: 'Get a random cat image',
			options: [
				{
					type: 4,
					name: 'count',
					description: 'Number of cat images to get',
					required: false,
					min_value: 1,
					max_value: 10,
				},
				{
					type: 3,
					name: 'breed',
					description: 'Breed of cat images to fetch',
					required: false,
				},
			],
		});
	}

	async #resolveBreed(breed) {
		if (breed === null) return '';
		const res = await fetch('https://api.thecatapi.com/v1/breeds');
		const breeds = await res.json();

		return breeds.find(({ name }) => name.toLowerCase() === breed.toLowerCase())?.id;
	}

	async run({ intr, opts }) {
		const [count, breed] = [opts.getInteger('count') ?? 1, opts.getString('breed')];

		const breed_id = await this.#resolveBreed(breed);
		if (breed_id === undefined) {
			const embed = new EmbedBase({
				title: 'Error',
				description: `Could not find breed \`${breed}\``,
				color: 0xbd222c,
			});
			return intr.reply({
				embeds: [embed],
			});
		}

		const res = await fetch(`${API_URL}?api_key=${process.env.CAT_API_KEY}&limit=${count}&breed_id=${breed_id}`);
		const json = await res.json();
		console.log(json);

		const images = json.map(({ url }) => url);

		return intr.reply({
			files: images,
		});
	}
}
