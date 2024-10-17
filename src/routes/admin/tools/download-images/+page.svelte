<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
	let loading = $state(false);

	$inspect(form);
</script>

<h1>Download Listing Images</h1>

<form
	method="POST"
	use:enhance={() => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	}}
>
	<label for="listingUrl">Listing URL:</label>
	<input id="listingUrl" name="listingUrl" type="url" required placeholder="Enter listing URL" />
	<button type="submit">Download Images</button>
</form>

{#if loading}
	Loading...
{/if}

{#if form?.success}
	<div class="success">
		<p>Images downloaded successfully for listing: {form.listingName}</p>
		<p>Downloaded {form.imageCount} images and {form.floorPlanCount} floor plans.</p>
	</div>
{/if}

{#if form?.error}
	<div class="error">
		<p>Error: {form.error}</p>
	</div>
{/if}

<style>
	form {
		margin-bottom: 1rem;
	}
	label {
		display: block;
		margin-bottom: 0.5rem;
	}
	input {
		width: 100%;
		padding: 0.5rem;
		margin-bottom: 1rem;
	}
	.success {
		background-color: #d4edda;
		color: #155724;
		padding: 1rem;
		border-radius: 0.25rem;
	}
	.error {
		background-color: #f8d7da;
		color: #721c24;
		padding: 1rem;
		border-radius: 0.25rem;
	}
</style>
