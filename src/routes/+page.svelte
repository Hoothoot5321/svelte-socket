<script lang="ts">
	import { startSocket, createChannel, connectToChanel } from '$lib';
	import type { ChannelInterface } from '$lib/Chs';
	import { io } from 'socket.io-client';

	import { _channels, _connected_channel, _id, _state, _socket, _name } from '../store';
	import { onMount } from 'svelte';
	import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
	import type { Socket } from 'socket.io-client';
	import '../styles/home.css';
	import { page } from '$app/stores';

	let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

	let temp_name = $page.url.searchParams.get('name');

	let temp_password = $page.url.searchParams.get('password');
	onMount(() => {
		if (!temp_name || !temp_password) {
			window.location.href = '/login';
			return;
		}

		socket = io({
			extraHeaders: {
				name: temp_name,
				password: temp_password
			}
		});
		startSocket(socket);
		_socket.set(socket);
	});

	let id = 0;

	let name = '';

	let connected_channel = '';

	let channels: ChannelInterface[] = [];

	$: channels = $_channels;
	let create_channel = '';

	$: connected_channel = $_connected_channel;
	$: id = $_id;
	$: name = $_name;
</script>

<h1>Guest{id}</h1>
<h2>Kanaler</h2>
<h2>Name {name}</h2>
<h3>{connected_channel}</h3>
<div class="channel-list">
	{#each channels as channel}
		<div>
			{#if channel.name == connected_channel}
				<p class="count green">{channel.clientAmount}</p>
				<button
					class="green channel"
					on:click={() => connectToChanel(socket, channel.name, connected_channel)}
				>
					{channel.name}
				</button>
			{:else}
				<p class="count red">{channel.clientAmount}</p>

				<button
					class="red channel"
					on:click={() => connectToChanel(socket, channel.name, connected_channel)}
				>
					{channel.name}
				</button>
			{/if}
		</div>
	{/each}
</div>
<br />
<input type="text" class="channelCreate" bind:value={create_channel} />
<br />
<button on:click={() => createChannel(socket, create_channel)}>Click me!!!</button>
<br />

<button on:click={() => _state.set('Chat')}>Chat</button>
<a href="chat">Chat</a>
