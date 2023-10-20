<script>
import ContextRuler from "$lib/ContextRuler.svelte";
import ContextButton from "$lib/ContextButton.svelte";
import Button from "$lib/Button.svelte";
</script>

<menu role="toolbar">
    <ContextButton tabIndex=1 name="File"><Button>New</Button><Button>Open</Button><Button>Close</Button></ContextButton>
    <ContextButton tabIndex=2 name="Edit"><Button>Find</Button><Button>Replace</Button><ContextRuler /><Button>Cut</Button><Button>Copy</Button><Button>Paste</Button></ContextButton>
    <ContextButton tabIndex=3 name="Selection"><Button>All</Button><Button>None</Button><Button>Invert</Button></ContextButton>
    <ContextButton tabIndex=4 name="View"><Button>Stacking</Button><Button>Chest Preview</Button></ContextButton>
</menu>

<main>
</main>

<style>
    menu {
        margin: 0;
        padding: 0;
        display: flex;
        background-color: #555;
    }

    @media (max-width: 500px) {
        menu {
            display: grid;
            grid-auto-flow: column;
        }
    }
</style>