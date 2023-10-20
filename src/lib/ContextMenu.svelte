<div class="mobile">
    <menu>
        <slot />
    </menu>
</div>

<style>
    menu {
        display: grid;
        width: max-content;
        padding: 4px;
        border-radius: 4px;
        background-color: #444;
    }

    @media (pointer:coarse) {
        menu {
            width: 100vw;
            padding: 0px;
        }

        .mobile {
            width: 100vw;
            height: 100vh;
            background-color: #0005;
        }
    }
</style>