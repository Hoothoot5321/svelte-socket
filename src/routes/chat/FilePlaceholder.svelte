<script lang="ts">
	import { MediaType } from '$lib/Chs';

	import type { MediaHolder } from '$lib';

	export let content: MediaHolder;
	export let name: string;
	let image_file_logo = 'https://cdn-icons-png.flaticon.com/512/2198/2198323.png';
	let audio_file_logo = 'https://cdn-icons-png.flaticon.com/512/181/181603.png';
	let video_file_logo = 'https://cdn-icons-png.flaticon.com/512/1146/1146185.png';
	let text_file_logo = 'https://cdn-icons-png.flaticon.com/512/2521/2521610.png';

	let chosen_logo = '';

	switch (content.type) {
		case MediaType.IMG_FILE:
			chosen_logo = image_file_logo;
			break;
		case MediaType.VIDEO_FILE:
			chosen_logo = video_file_logo;
			break;
		case MediaType.TEXT_FILE:
			chosen_logo = text_file_logo;
			break;
		case MediaType.AUDIO_FILE:
			chosen_logo = audio_file_logo;
			break;
	}
	let extra_state = 'hidden';
</script>

<div class="image-holder">
	<img
		src={chosen_logo}
		alt=""
		width="128"
		on:mouseenter={() => (extra_state = 'show')}
		on:mouseleave={() => (extra_state = 'hidden')}
	/>
	<img class="floater {extra_state}" src={content.content} alt="" width="194" />
	<p>{name}</p>
</div>

<style>
	.image-holder {
		position: relative;
	}
	.floater {
		position: absolute;
		left: 3em;
		top: -2em;
		pointer-events: none;
		z-index: 1;
	}
	.hidden {
		visibility: hidden;
	}
	.show {
		visibility: inherit;
	}
</style>
