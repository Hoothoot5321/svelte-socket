import type { Socket as SocketServer } from 'socket.io';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

export class Client {
	private id: number;
	private name: string;
	connection: SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

	constructor(
		id: number,
		connection: SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
		name: string
	) {
		this.id = id;
		this.connection = connection;
		this.name = name;
	}
	getId(): number {
		return this.id;
	}
	getName() {
		return this.name;
	}
}
