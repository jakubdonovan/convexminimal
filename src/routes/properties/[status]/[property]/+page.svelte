<script lang="ts">
	import { page } from '$app/stores';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../../convex/_generated/api';
	import { goto } from '$app/navigation';

	const slug = $page.params.property;
	const property = useQuery(api.getPropertyBySlug.get, { slug });

	$inspect(property);
</script>
