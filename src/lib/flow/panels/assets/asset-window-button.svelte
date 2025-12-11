<script lang="ts">
    interface AssetWindowProps {
        title: string,
        selected: boolean,
        onclick: () => void
    }

    let { title, selected, onclick } : AssetWindowProps = $props();
</script>

<button class="asset-button" onclick={onclick} class:selected>
    { title }
</button>