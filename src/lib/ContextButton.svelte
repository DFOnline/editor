<script>
    import Button from "./Button.svelte";
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
<div tabindex={Number(tabIndex)} role="button" class="context-button" on:touchstart={open} on:touchend={close} on:focus={open} on:blur={close} on:mouseover={open} on:mouseenter={open} on:mouseleave={close} on:mouseout={close}>
    <Button tabindex={-1} fullWidth>
        {name}
    </Button>
    <div class={"pop-out " + isOpen}>
        <Context>
            <slot />
        </Context>
    </div>
</div>

<style>
    .context-button {
        width: fit-content;
        position: relative;
    }

    @media (max-width: 500px) {
        .context-button {
            width: 100%;
        }
    }

    @media (pointer:coarse) {
        .context-button {
            position: static;
        }
        .pop-out {
            top: 0px;
            left: 0px;
            width: 100vw;
        }
    }

    .pop-out.open {
        display: block;
    }
    
    .pop-out {
        display: none;
        position: absolute;
    }
</style>