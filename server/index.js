import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { Client, Channel, ChanelList } from './Chs/index.js';
import { handler } from '../build/handler.js';

const port = 3000;
const app = express();
const server = createServer(app);
function stringify(obj) {
	let cache = [];
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

function sendUpdate(ws, channels) {
	let msg_obj = { channels: channels.getChannels() };
	ws.connection.emit('update', stringify(msg_obj));
}

const io = new Server(server);

let channels = new ChanelList();

let clients = [];

let id = 0;
io.on('connection', (socket) => {
	let msg_obj = { channels: channels.getChannels(), id: id };
	let msg = stringify(msg_obj);

	let client = new Client(id, socket);
	clients.push(client);
	socket.emit('connection', msg);

	socket.on('createServer', (msg) => {
		if (!channels.channelExists(msg)) {
			channels.addChannel(new Channel(msg));
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
	id++;
});
// SvelteKit should handle everything else using Express middleware
// https://github.com/sveltejs/kit/tree/master/packages/adapter-node#custom-server
app.use(handler);

server.listen(port);
