<script lang="ts">
    export let name: string = "";
    export let color: string = "";
</script>

<div class="node hover:cursor-pointer hover:opacity-80" style="background-color: { color };">
    <div class="text-2xl text-center">
        <b>{ name }</b>
    </div>
</div>
