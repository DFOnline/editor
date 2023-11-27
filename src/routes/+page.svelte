<script lang="ts">
import ContextRuler from "$lib/ContextRuler.svelte";
import ContextButton from "$lib/ContextButton.svelte";
import Button from "$lib/Button.svelte";

import TemplateComponent from 'template';
import { df } from 'template';

import { dragscroll } from '@svelte-put/dragscroll'

/**
 * If the codespace should stack vertically with bracket depth.
 */
let stacking = false;

const template = df.Template.parse({"blocks":[
        {"id":"block","block":"func","args":{"items":[{"item":{"id":"pn_el","data":{"name":"name","type":"any","default_value":{"id":"num","data":{"name":"0"}},"plural":false,"optional":true}},"slot":0},{"item":{"id":"pn_el","data":{"name":"name","type":"var","plural":true,"optional":false}},"slot":1},{"item":{"id":"pn_el","data":{"name":"name","type":"dict","plural":true,"optional":true}},"slot":2},{"item":{"id":"pn_el","data":{"name":"name","type":"list","plural":false,"optional":false}},"slot":3},{"item":{"id":"pn_el","data":{"name":"name","type":"vec","plural":false,"optional":false,"description":"hi&ahi<green>hi","note":"&ahi<green>hi"}},"slot":4},{"item":{"id":"hint","data":{"id":"function"}},"slot":25},{"item":{"id":"bl_tag","data":{"option":"False","tag":"Is Hidden","action":"dynamic","block":"func"}},"slot":26}]},"data":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"txt","data":{"name":"&astring! %default"}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"comp","data":{"name":"<green>hi"}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"num","data":{"name":"%var(&chi)"}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"loc","data":{"isBlock":false,"loc":{"x":2.100503566321322,"y":64.14752328981187,"z":22.627610902878587,"pitch":23.69824,"yaw":-110.94752}}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"vec","data":{"x":1.0,"y":0.1,"z":0.03}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"snd","data":{"pitch":1.0,"vol":2.0,"sound":"Pling"}},"slot":0}]},"action":""},
        // {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"part","data":{"particle":"Cloud","cluster":{"amount":1,"horizontal":0.0,"vertical":0.0},"data":{"x":1.0,"y":0.0,"z":0.0,"motionVariation":100}}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"pot","data":{"pot":"Speed","dur":1000000,"amp":0}},"slot":0}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"var","data":{"name":"hi","scope":"unsaved"}},"slot":0},{"item":{"id":"var","data":{"name":"hello","scope":"saved"}},"slot":1},{"item":{"id":"var","data":{"name":"morning","scope":"local"}},"slot":2},{"item":{"id":"var","data":{"name":"night","scope":"line"}},"slot":3}]},"action":""},
        {"id":"block","block":"player_action","args":{"items":[{"item":{"id":"g_val","data":{"type":"Player Count","target":"Default"}},"slot":0},{"item":{"id":"g_val","data":{"type":"Current Health","target":"Default"}},"slot":1}]},"action":""}]
        });

interface EditingTemplate {
    active: boolean;
    template: df.Template;
    selection: unknown;
    name?: string;
}
const EditingTemplates : EditingTemplate[] = [
    {active: true, template, selection: null, name: 'Template'},
    {active: true, template, selection: null, name: 'You can name them'},
    {active: false, template, selection: null},
    {active: false, template, selection: null},
];

</script>

<div class="toolbar" role="toolbar" tabindex="0">
    <ContextButton tabIndex=1 name="File"><Button>New</Button><Button>Open</Button><Button>Close</Button></ContextButton>
    <ContextButton tabIndex=2 name="Edit"><Button>Find</Button><Button>Replace</Button><ContextRuler /><Button>Cut</Button><Button>Copy</Button><Button>Paste</Button></ContextButton>
    <ContextButton tabIndex=3 name="Selection"><Button>All</Button><Button>None</Button><Button>Invert</Button></ContextButton>
    <ContextButton tabIndex=4 name="View"><Button onclick={() => {stacking = !stacking; console.log(stacking)}}>Stacking</Button><Button>Chest Preview</Button></ContextButton>
</div>

<main use:dragscroll={{axis: "y"}}>
    <ul>
        {#each EditingTemplates as template, i}
            <li use:dragscroll class={template.active ? 'active' : 'inactive'}>
                <span>
                    <input type="checkbox" name="Active" checked={template.active} on:change={(event) => template.active = event.target?.checked}>
                    <input value={template.name} class="name" />
                </span>
                <!-- TODO: Don't use active on openableChests, add proper editing -->
                <div use:dragscroll><TemplateComponent openableChests={template.active} template={template.template} stack={stacking} --tooltip-scale=2 --block-size=10em --slot-size=50px /></div>
            </li>
        {/each}
    </ul>
</main>

<style>
    .toolbar {
        margin: 0;
        padding: 0;
        display: flex;
        background-color: var(--toolbar-color);
    }

    main {
        background-color: var(--bg-color);
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    main ul {
        padding: 0px;
    }
    main li {
        width: 100%;
        overflow-x: none;
        user-select: none;
        display: flex;
    }
    main li span {
        margin: auto;
        margin-inline: 1em;
    }
    main li span input.name {
        writing-mode: vertical-lr;
        text-orientation: sideways;
    }
    main li div {
        overflow-x: scroll;
        color: #000;
    }
    
    :global(:root) {
        --text-color: #000;
        --bg-color: #fff;
        --toolbar-color: #ccc;
    }

    @media (max-width: 500px) {
        .toolbar {
            display: grid;
            grid-auto-flow: column;
        }
        main li span {
            margin-inline: 0em;
        }
    }
    
    @media (prefers-color-scheme: dark) {
        :global(:root) {
            --text-color: #fff;
            --bg-color: #181a1b;
            --toolbar-color: #313536;
            color-scheme: dark;
        }
    }
</style>