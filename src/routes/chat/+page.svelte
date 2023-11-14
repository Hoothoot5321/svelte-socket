<script lang="ts">
	import type { Socket } from 'socket.io-client';
	import type { DefaultEventsMap } from 'socket.io/dist/typed-events';
	import { _connected_channel, _id, _socket, _state, _msgs } from '../../store';
	import { sendMsg, MediaHolder } from '$lib';
	import type { OutgointMediaMessage } from '$lib';
	import '../../styles/chat.css';

	import Bubble from './Bubble.svelte';
	import {} from 'os';
	import { testFile } from '$lib/fileHandling';
	import FilePlaceholder from './FilePlaceholder.svelte';
	import { onMount } from 'svelte';

	let id = 0;

	let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

	onMount(() => {
		if (!socket) {
			window.location.href = '/';
		}
	});

	$: socket = $_socket;

	$: id = $_id;
	let conneted_channel = '';
	$: conneted_channel = $_connected_channel;
	let msgs: { msg: OutgointMediaMessage; id: number; name: string }[] = [];
	$: msgs = $_msgs;
	let temp_msg = '';

	let media_files: { media: MediaHolder; name: string }[] = [];
	function activateFile() {
		let file_uploader: HTMLInputElement | null = document.querySelector('#file-uploader');
		if (!file_uploader) {
			return;
		}
		file_uploader.click();
	}
	let file: FileList;
</script>

<h1>{conneted_channel}</h1>
<h3>{id}</h3>
<div class="msg-list">
	{#each msgs as msg}
		<Bubble
			{id}
			current_id={msg.id}
			text={msg.msg.msg}
			media_files={msg.msg.media_files}
			name={msg.name}
		/>
	{/each}
</div>
<div class="media-file-holder">
	{#each media_files as media_file, index}
		<button
			on:click={() => {
				media_files.splice(index, 1);
				media_files = media_files;
			}}
		>
			<FilePlaceholder content={media_file.media} name={media_file.name} />
		</button>
	{/each}
</div>
<input
	type="file"
	id="file-uploader"
	bind:files={file}
	on:change={() => {
		let type = testFile(file[0]);

		let file_reader = new FileReader();

		file_reader.readAsDataURL(file[0]);
		file_reader.onload = () => {
			if (!file_reader.result || typeof file_reader.result != 'string') {
				return;
			}
			let base64str = file_reader.result.substring(file_reader.result.indexOf(',') + 1);
			let decoded = atob(base64str);

			console.log(decoded.length / 1000 / 1000 + 'mb');

			let content = new MediaHolder(type, file_reader.result);
			media_files.push({ media: content, name: file[0].name });
			media_files = media_files;
		};
	}}
/>
<div>
	<button class="file-button" on:click={activateFile}>+</button>
	<textarea
		bind:value={temp_msg}
		class="channel-msg-field"
		rows="1"
		on:input={(self) => {
			let target = self.currentTarget;
			self.currentTarget.style.height = '';
			self.currentTarget.style.height = target.scrollHeight + 'px';
		}}
		on:paste={(data) => {
			let file = data.clipboardData?.files[0];

			if (!file) {
				return;
			}

			let file_name = file.name;
			let type = testFile(file);

			let file_reader = new FileReader();

			file_reader.readAsDataURL(file);
			file_reader.onload = () => {
				if (!file_reader.result || typeof file_reader.result != 'string') {
					return;
				}
				let content = new MediaHolder(type, file_reader.result);
				media_files.push({ media: content, name: file_name });
				media_files = media_files;
			};
		}}
	/>
</div>

{#if socket != null}
	<button
		on:click={() => {
			let media_temp = [];
			for (let media_file of media_files) {
				media_temp.push(media_file.media);
			}
			if (socket != null) {
				sendMsg(socket, temp_msg, media_temp);
			}
			media_files = [];
			temp_msg = '';
		}}>Send</button
	>
{:else}
	<h1>Fuck</h1>
{/if}
<button on:click={() => _state.set('Home')}>Home</button>
<a href="/">Home</a>

<style>
	.media-file-holder {
		display: flex;
		flex-direction: row;
	}
	#file-uploader {
		visibility: hidden;
	}
</style>
