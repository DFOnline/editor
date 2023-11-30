<script lang="ts">
	let modal: HTMLDivElement;
	let show = false;

	export function open() {
		show = true;
        setTimeout(() => {    
            (modal.firstElementChild as HTMLElement)?.focus();
        });
	}
	export function close() {
		show = false;
	}

	function closeKey(event: KeyboardEvent) {
		if (event.key == 'Escape') close();
	}
    function refocus(event: FocusEvent) {
        if(!modal.contains(event?.relatedTarget as Node)) modal.focus();
    }
</script>

<div
	class="modal"
	class:show
	bind:this={modal}
	tabindex="-1"
	role="button"
	on:click={close}
	on:keyup={closeKey}
    on:focusout={refocus}
>
	<div role="cell" class="content" tabindex="-1" on:click|stopPropagation on:keypress={closeKey}>
		<slot />
	</div>
</div>

<style>
	.modal {
		display: none;
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100vw;
		height: 100vh;
		background-color: #0005;
        z-index: 10000;
	}

    .modal:focus .content {
        border-color: blue;
    }

	.modal.show {
		display: flex;
	}

	.content {
		color: white;
		margin: auto;
		font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
		box-shadow: #000 5px 5px 2px;
		border-radius: 12px;
		padding: 40px 60px 42px 50px;
		min-width: 500px;
		margin: auto;
		width: fit-content;
		background-color: #333;
	}
</style>