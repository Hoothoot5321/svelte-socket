import type { OutgointMediaMessage } from '$lib';
import type { MediaType } from './MediaTypes';
import type { Client } from './client';

export interface ChannelInterface {
	clientAmount: number;
	name: string;
}

export class Channel {
	private clientAmount: number;
	private name: string;
	private clients: Client[];
	private msgs: { msg: string; id: number }[];
	constructor(name: string) {
		this.clientAmount = 0;
		this.name = name;
		this.clients = [];
		this.msgs = [];
	}
	private updateAmount() {
		this.clientAmount = this.clients.length;
	}
	getAmount(): number {
		return this.clientAmount;
	}
	getName(): string {
		return this.name;
	}
	getClient(): Client[] {
		return this.clients;
	}

	getMsgs() {
		return this.msgs;
	}
	addClient(client: Client) {
		this.clients.push(client);
		this.updateAmount();
	}
	removeClient(client: Client) {
		for (let i = 0; i < this.clients.length; i++) {
			if (this.clients[i].getId() == client.getId()) {
				this.clients.splice(i, 1);
			}
		}
		this.updateAmount();
	}

	sendAll(msg: string, _client: Client) {
		let return_msg = { msg: msg, id: _client.getId(), name: _client.getName() };
		for (let client of this.clients) {
			client.connection.emit('channelMsg', JSON.stringify(return_msg));
		}
		this.msgs.push(return_msg);
	}
	isZero() {
		return this.clients.length === 0;
	}
}
