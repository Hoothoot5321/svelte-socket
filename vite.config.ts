import { sveltekit } from '@sveltejs/kit/vite';
import { type ViteDevServer, defineConfig } from 'vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);
		let clients: number[] = [];

		let id = 0;

		io.on('connection', (socket) => {
			clients.push(id);

			console.log('Client connected');
			console.log('Connected clients: ' + clients.length);
			console.log('');
			socket.on('eventFromClient', (msg) => {
				console.log(msg);
			});
			socket.on('disconnect', () => {
				clients.splice(0, 1);
				console.log('Client: ' + id + ' diconnected.');
				console.log('Connected clients: ' + clients.length);
				console.log('');
			});

			socket.emit('connectionEvent', id);

			id++;
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
