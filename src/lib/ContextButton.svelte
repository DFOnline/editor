<script>
    import Context from "./ContextMenu.svelte";

    /**
     * @type {string}
     */
    export let name;
    /**
     * @type {string}
     */
    export let tabIndex;

    let isOpen = "";

    function open() {
        isOpen = 'open';
    }
    function close() {
        isOpen = '';
    }
</script>
<div tabindex={tabIndex} role="button" class="context-button" on:touchstart={open} on:touchend={close} on:focus={open} on:blur={close} on:mouseover={open} on:mouseenter={open} on:mouseleave={close} on:mouseout={close}>
    <button tabindex="-1">
        {name}
    </button>
    <div class={"popout" + isOpen}>
        <Context>
            <slot />
        </Context>
    </div>
</div>

<style>
    .context-button {
        width: fit-content;
    }

    .popout.open {
        display: block;
        position: absolute; /* it doesn't work */
        top: 0px;
        left: 0px;
    }
    
    .popout {
        display: none;
    }
</style>