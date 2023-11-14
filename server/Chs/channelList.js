export class ChanelList {
	channels;

	constructor() {
		this.channels = [];
	}
	findChannel(search) {
		let temp_channel = null;
		if (typeof search == 'string') {
			for (let channel of this.channels) {
				if (channel.getName() == search) {
					temp_channel = channel;
				}
			}
		} else {
			for (let channel of this.channels) {
				if (channel.getClient().includes(search)) {
					temp_channel = channel;
				}
			}
		}
		return temp_channel;
	}
	getChannels() {
		return this.channels;
	}

	channelExists(name) {
		let exists = false;
		for (let channel of this.channels) {
			if (channel.getName() == name) {
				exists = true;
			}
		}
		return exists;
	}
	addChannel(channel) {
		this.channels.push(channel);
	}
	addClientToChannel(name, client) {
		let channel = this.findChannel(name);
		if (channel) {
			channel.addClient(client);
		}
	}
	discClient(client) {
		let channel = this.findChannel(client);
		if (channel) {
			channel.removeClient(client);
		}
	}
}
