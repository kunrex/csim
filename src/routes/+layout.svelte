<script>
	import "../app.css";
	import { svg } from "$lib";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="{svg}" />
	<title>csim0.1</title>
</svelte:head>

{@render children()}
