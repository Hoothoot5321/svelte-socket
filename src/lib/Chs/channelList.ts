import type { Channel } from './channel';
import type { Client } from './client';
import type { OutgointMediaMessage } from '$lib';

export class ChanelList {
	private channels: Channel[];

	constructor() {
		this.channels = [];
	}
	private findChannel(search: string): Channel | null;
	private findChannel(search: Client): Channel | null;
	private findChannel(search: string | Client): Channel | null {
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
	private checkChannels() {
		for (let i = 0; i < this.channels.length; i++) {
			if (this.channels[i].isZero()) {
				this.channels.splice(i, 1);
			}
		}
	}
	getChannels(): Channel[] {
		return this.channels;
	}

	channelExists(name: string): boolean {
		let exists = false;
		for (let channel of this.channels) {
			if (channel.getName() == name) {
				exists = true;
			}
		}
		return exists;
	}
	addChannel(channel: Channel) {
		this.channels.push(channel);
	}
	addClientToChannel(name: string, client: Client) {
		let channel = this.findChannel(name);
		if (channel) {
			channel.addClient(client);
			client.connection.emit('msgList', JSON.stringify({ msgs: channel.getMsgs() }));
		}
	}
	discClient(client: Client) {
		let channel = this.findChannel(client);
		if (channel) {
			channel.removeClient(client);
		}
		this.checkChannels();
	}
	sendMsgAll(client: Client, msg: string) {
		let channel = this.findChannel(client);
		if (!channel) {
			return;
		}
		channel.sendAll(msg, client);
	}
}
