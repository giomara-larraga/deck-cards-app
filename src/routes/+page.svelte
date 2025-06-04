<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cards } from '$lib/data/cards.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import HorizontalList from '$lib/components/ui/dnd/HorizontalList.svelte';
	import Board from '$lib/components/ui/dnd/Board.svelte';
	let cardItems = cards;
	const flipDurationMs = 300;

	function handleSelection() {
		//goto('/tradeoff');
	}

	function handleReset() {
		//board.update(() => [{ id: 1, name: 'Rank 1', items: [] }]);
		//items.set([...cards]); // Assuming `items` is a writable store
	}

	function addColumn() {
		/*board.update((currentBoard) => {
            const newColumnId = currentBoard.length + 1;
            return [...currentBoard, { id: newColumnId, name: `Rank ${newColumnId}`, items: [] }];
        });*/
	}
	function handleDndConsiderCards(e: any) {
		cardItems = e.detail.items;
	}
	/**
	 * @param {{ detail: { items: any; }; }} e
	 */
	function handleDndFinalizeCards(e: any) {
		cardItems = e.detail.items;
		console.log(cardItems);
	}
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<div class="justify-center bg-gray-200 p-4">
		<!-- Cards in columns instead of rows -->
		<HorizontalList items={cardItems} />
	</div>
	<div class="bg-white p-4">
		<!-- Middle row content -->
		<Board />
	</div>
	<div class="bg-gray-200 p-4">
		<!-- Bottom row content -->
		<div class="flex justify-end gap-4">
			<Button onclick={addColumn}>Add Column</Button>
			<Button onclick={handleReset}>Reset</Button>
			<Button type="button" class="btn preset-filled-primary-500" onclick={handleSelection}
				>Next</Button
			>
		</div>
	</div>
</div>
