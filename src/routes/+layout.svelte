<script>import '../app.css';
import favicon from '$lib/assets/favicon.svg';

let { children } = $props();</script>

<svelte:head>
	<link rel="icon" href="{favicon}" />
	<title>csim0.1</title>
</svelte:head>

{@render children()}
