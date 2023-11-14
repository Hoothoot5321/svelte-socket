<script lang="ts">
	import type { MediaHolder } from '$lib';
	import { MediaType } from '$lib/Chs';
	export let media: MediaHolder;
</script>

{#if media.type === MediaType.IMG}
	<img src={media.content} alt="IMG" />
{:else if media.type === MediaType.YOUTUBE_VIDEO}
	<iframe src={media.content} frameborder="0" title="vid" allowfullscreen />
{:else if media.type === MediaType.MP_LINK}
	<video controls>
		<track kind="captions" />
		<source src={media.content} />
	</video>
{/if}

<style>
	img {
		width: 95%;
	}
	iframe {
		width: 95%;
		height: 15.5em;
	}
	video {
		max-width: 95%;
	}
</style>
