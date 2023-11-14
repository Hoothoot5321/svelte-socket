import { sveltekit } from '@sveltejs/kit/vite';
import { type ViteDevServer, defineConfig } from 'vite';

import { Server } from 'socket.io';

import { Client, Channel, ChanelList } from './src/lib/Chs';
import type { OutgointMediaMessage } from '$lib';
function stringify(obj: any) {
	let cache: any[] = [];
	let str = JSON.stringify(obj, function (key, value) {
		if (typeof value === 'object' && value !== null) {
			if (cache.indexOf(value) !== -1) {
				// Circular reference found, discard key
				return;
			}
			// Store value in our collection
			cache.push(value);
		}
		return value;
	});
	cache = []; // reset the cache
	return str;
}

function sendUpdate(ws: Client, channels: ChanelList) {
	let msg_obj = { channels: channels.getChannels() };
	ws.connection.emit('update', stringify(msg_obj));
}

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer, {
			maxHttpBufferSize: 20000000
		});

		let channels: ChanelList = new ChanelList();

		let clients: Client[] = [];

		let id = 0;
		io.on('connection', (socket) => {
			let headers = socket.handshake.headers as { name: string; password: string };
			let msg_obj = { channels: channels.getChannels(), id: id, name: headers.name };
			let msg = stringify(msg_obj);

			let client = new Client(id, socket, headers.name);
			clients.push(client);
			socket.emit('connection', msg);

			socket.on('createServer', (msg) => {
				if (!channels.channelExists(msg)) {
					let channel = new Channel(msg);
					channels.discClient(client);
					channel.addClient(client);
					channels.addChannel(channel);

					client.connection.emit('joinedChannel', msg);
					for (let ws of clients) {
						sendUpdate(ws, channels);
					}
				}
			});
			socket.on('joinServer', (msg) => {
				channels.discClient(client);
				channels.addClientToChannel(msg, client);

				client.connection.emit('joinedChannel', msg);

				for (let ws of clients) {
					sendUpdate(ws, channels);
				}
			});
			socket.on('disconnect', () => {
				channels.discClient(client);
				for (let i = 0; i < clients.length; i++) {
					if (clients[i].getId() == client.getId()) {
						clients.splice(i, 1);
					}
				}

				for (let ws of clients) {
					sendUpdate(ws, channels);
				}
			});
			socket.on('discServer', () => {
				channels.discClient(client);

				client.connection.emit('joinedChannel', '');

				for (let ws of clients) {
					sendUpdate(ws, channels);
				}
			});
			socket.on('channelMsg', (msg) => {
				channels.sendMsgAll(client, msg);
			});
			id++;
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
