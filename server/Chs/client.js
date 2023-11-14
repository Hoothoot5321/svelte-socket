export class Client {
	id;
	connection;

	constructor(id, connection) {
		this.id = id;
		this.connection = connection;
	}
	getId() {
		return this.id;
	}
}
