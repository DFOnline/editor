<script lang="ts">
    import Button from "./Button.svelte";
import Context from "./ContextMenu.svelte";

    export let name : string;
    export let tabIndex : string;

    let ctx: Context;

    function open() {
        ctx.open();
    }
    function close() {
        ctx.close();
    }
</script>
<div tabindex={Number(tabIndex)} role="button" class="context-button" on:touchstart={open} on:touchend={close} on:focus={open} on:blur={close} on:mouseover={open} on:mouseenter={open} on:mouseleave={close} on:mouseout={close}>
    <Button tabindex={-1} fullWidth>
        {name}
    </Button>
    <Context bind:this={ctx}>
        <slot />
    </Context>
</div>

<style>
    .context-button {
        /* width: fit-content; */
        position: relative;
    }
    
    @media (max-width: 500px) {
        .context-button {
            width: 100%;
        }
    }
    
    .pop-out.open {
        display: block;
    }
    
    .pop-out {
        height: 0;
        display: none;
        position: absolute;
        top: 5px;
        left: 0px;
    }
    
    @media (pointer:coarse) {
        .context-button {
            position: static;
        }
        .pop-out {
            width: 100vw;
            top: 0px;
        }
    }
</style>