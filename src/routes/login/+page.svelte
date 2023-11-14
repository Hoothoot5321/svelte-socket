<script lang="ts">
	let temp_name = '';

	let temp_password = '';
</script>

<label for="temp_name">Name</label>
<input type="text" bind:value={temp_name} id="temp_name" />
<label for="temp_password">Password</label>
<input type="text" bind:value={temp_password} id="temp_password" />
<button
	on:click={() => {
		window.location.href = '/?name=' + temp_name + '&password=' + temp_password;
	}}>Login</button
>
