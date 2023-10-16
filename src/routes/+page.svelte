<script lang="ts">
	import { io } from 'socket.io-client';

	const socket = io();

	let id = 0;
	socket.on('connectionEvent', (message) => {
		id = message;
	});

	function sendMsg(msg: string) {
		socket.emit('eventFromClient', msg);
	}
</script>

<h1>Guest{id}</h1>
<button on:click={() => sendMsg('Damn')}>Click me!!!</button>
