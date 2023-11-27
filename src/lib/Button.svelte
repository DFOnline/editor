<script>
    /**
     * @type {number|undefined}
     */
    export let tabindex = undefined;

    /**
     * @type {boolean}
     */
    export let fullWidth = false;

    /**
     * @type {((event: MouseEvent) => void)|(() => void)|undefined}
    */
    export let onclick = () => {};
</script>

<button tabindex={tabindex} class={fullWidth ? 'full' : ''} on:click={onclick}>
    <slot />
</button>

<style>
    .full {
        width: 100%;
    }

    @media (pointer:coarse) {
        button {
            font-size: x-large;
            height: 2em;
        }
    }
</style>