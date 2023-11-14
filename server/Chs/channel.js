export class Channel {
	clientAmount;
	name;
	clients;
	constructor(name) {
		this.clientAmount = 0;
		this.name = name;
		this.clients = [];
	}
	updateAmount() {
		this.clientAmount = this.clients.length;
	}
	getAmount() {
		return this.clientAmount;
	}
	getName() {
		return this.name;
	}
	getClient() {
		return this.clients;
	}
	addClient(client) {
		this.clients.push(client);
		this.updateAmount();
	}
	removeClient(client) {
		for (let i = 0; i < this.clients.length; i++) {
			if (this.clients[i].getId() == client.getId()) {
				this.clients.splice(i, 1);
			}
		}
		this.updateAmount();
	}
}
