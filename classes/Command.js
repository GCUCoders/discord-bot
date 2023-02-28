export class Command {
	constructor({
		name = null,
		description = '', //cannot be empty for chat commands
		options = [],
		category,
		deferResponse = false, //for commands that take longer to run
		type = 1,
		...other
	}) {
		this.name = name;
		this.description = description;
		this.options = options;
		this.category = category;
		this.defaultMemberPermissions = null;
		this.deferResponse = deferResponse;
		this.type = type;
		Object.assign(this, other);
	}

	async run({ intr, opts }) {
		throw new Error(`Command ${this.constructor.name} doesn't provide a run method.`);
	}
}
