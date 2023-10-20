<script>
import ContextRuler from "$lib/ContextRuler.svelte";
import ContextButton from "$lib/ContextButton.svelte";

</script>
<menu role="toolbar">
    <ContextButton tabIndex=1 name="File"><button>New</button><button>Open</button><button>Close</button></ContextButton>
    <ContextButton tabIndex=2 name="Edit"><button>Find</button><button>Replace</button><ContextRuler /><button>Cut</button><button>Copy</button><button>Paste</button></ContextButton>
    <ContextButton tabIndex=3 name="Selection"><button>All</button><button>None</button><button>Invert</button></ContextButton>
    <ContextButton tabIndex=4 name="View"><button>Stacking</button><button>Chest Preview</button></ContextButton>
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
</style>