<script>
    /**
     * @type {number|undefined}
     */
    export let tabindex = undefined;

    /**
     * @type {boolean}
     */
    export let fullWidth = false;
</script>

<button tabindex={tabindex} class={fullWidth ? 'full' : ''} on:click>
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