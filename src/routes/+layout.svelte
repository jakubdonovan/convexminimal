<script>import "../app.pcss";
  import { PUBLIC_CONVEX_URL } from '$env/static/public';
  import { setupConvex } from 'convex-svelte';
  import Navbar from "$lib/components/Navbar.svelte";

  const { children } = $props();
  setupConvex(PUBLIC_CONVEX_URL);
</script>

<svelte:head>
	<script type="text/javascript">
		window.GUMLET_CONFIG = {
			hosts: [
				{
					current: '{{example.com}}',
					gumlet: 'phuketkey.gumlet.io'
				}
			],
			lazy_load: true
		};
		(function () {
			d = document;
			s = d.createElement('script');
			s.src = 'https://cdn.jsdelivr.net/npm/gumlet.js@2.2/dist/gumlet.min.js';
			s.async = 1;
			d.getElementsByTagName('head')[0].appendChild(s);
		})();
	</script>
</svelte:head>

<Navbar />
{@render children()}
