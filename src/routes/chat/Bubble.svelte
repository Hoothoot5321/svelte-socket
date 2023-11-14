<script lang="ts">
	import MuMeShow from './MuMeShow.svelte';
	import type { MediaHolder } from '$lib';
	import { detectUrl } from '$lib';
	import { MediaType } from '$lib/Chs';
	export let text: string;
	console.log(text);
	export let id: number;

	export let name: string;

	export let media_files: MediaHolder[];

	for (let media_file of media_files) {
		console.log(media_file);
	}

	export let current_id: number;

	let detected = detectUrl(text);
	let detected_url = detected.msgs;
	let multi_media = detected.multi_median;
	let pos = current_id === id ? 'left' : 'right';
</script>

<div class={pos}>
	<div class=" bubble">
		<p>{name}</p>
		<h1>
			{#each detected_url as text2}
				{#if text2.url}
					<a href={text2.msg}>{text2.msg}</a>
				{:else}
					{text2.msg}
				{/if}
			{/each}
		</h1>
		{#each multi_media as media}
			<MuMeShow {media} />
		{/each}
		{#each media_files as media_file}
			{#if media_file.type === MediaType.IMG_FILE}
				<img src={media_file.content} alt="" class="img-viewer" />
			{:else if media_file.type === MediaType.AUDIO_FILE || media_file.type === MediaType.VIDEO_FILE}
				<video controls class="vid-viewer">
					<track kind="captions" />
					<source src={media_file.content} />
				</video>
			{/if}
		{/each}
	</div>
</div>

<style>
	.img-viewer {
		width: 95%;
	}
	.vid-viewer {
		width: 95%;
	}

	.left.right {
		display: flex;
		flex-direction: row;
	}
	.left {
		display: flex;
		justify-content: flex-start;
		margin-left: 0.5em;
	}
	.right {
		display: flex;
		justify-content: flex-end;
	}

	.left .bubble {
		background-color: #328718;
	}

	.right .bubble {
		background-color: #4582d1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}
	.right .bubble h1 {
		text-align: right;
	}

	.bubble p {
		font-size: 1em;
		margin: 0.2em;
		color: #9ea3a8;
	}

	.bubble {
		max-width: 60%;
		border-radius: 0.5em;
		margin-top: 0.5em;
		margin-right: 0.2em;
		padding: 0.2em;
	}
	.bubble h1 {
		font-size: 1.2em;
		padding: 0.2em;
		margin: 0;
		width: max-content;
		max-width: 100%;
		white-space: pre-line;
	}
</style>
