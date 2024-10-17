<script lang="ts">
	import type { PageData } from './$types.js';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api';
	import PropertyCard from '$lib/components/PropertyCard.svelte';

	let { data }: { data: PageData } = $props();
	let initialProperties = $derived(data.properties);

	let properties = useQuery(
		api.getProperties.get,
		() => ({
			status: data.status
		}),
		() => ({
			initialData: initialProperties,
			keepPreviousData: true
		})
	);
</script>

<h1>Properties for {data.status === 'for-sale' ? 'sale' : 'rent'}</h1>

<!-- {#if status === 'for-sale'} -->
<!-- 	<p> -->
<!-- 		PhuketKey specializes in oceanfront and near-oceanfront villas, apartments, and condominiums in -->
<!-- 		Phuket. We proudly offer a carefully curated selection of exceptional properties that stand out -->
<!-- 		for their location, quality, and value. With our extensive knowledge of the Phuket market, we’re -->
<!-- 		committed to understanding your needs and guiding you in finding the perfect property. Our -->
<!-- 		support continues beyond the sale, as we assist with management and rental services to ensure -->
<!-- 		your investment thrives. If you don’t see what you’re looking for, let us know your preferences, -->
<!-- 		and we’ll help you find a property that matches your wishes. Looking forward to helping you -->
<!-- 		discover your dream home! Best, Jakub -->
<!-- 	</p> -->
<!-- {:else if status === 'for-rent'} -->
<!-- 	<p> -->
<!-- 		At PhuketKey, we specialize in quality villas, apartments, and condominiums for both short and -->
<!-- 		long-term rentals in beautiful Phuket. Our diverse selection features properties perfect for -->
<!-- 		your holiday getaway or an extended stay. Whether you’re seeking a family-friendly home or a -->
<!-- 		cozy retreat near your favorite spots, we’re here to help. We also provide rental management -->
<!-- 		services for property owners, ensuring their villas and apartments are well-maintained and ready -->
<!-- 		for guests. If you have any questions or need assistance finding the right rental, don’t -->
<!-- 		hesitate to reach out. We’re excited to help you! Warm regards, Jakub -->
<!-- 	</p> -->
<!-- {/if} -->

<div class="flex flex-wrap gap-10 p-10">
	{#if properties.isLoading}
		Loading...
	{:else if properties.error}
		failed to load: {properties.error.toString()}
	{:else}
		{#each properties.data as property}
			<PropertyCard {property} />
		{/each}
	{/if}
</div>
