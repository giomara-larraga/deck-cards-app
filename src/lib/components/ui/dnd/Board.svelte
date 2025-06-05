<script lang="ts">
	// This is done in a single file for clarity. A more factored version here: https://svelte.dev/repl/288f827275db4054b23c437a572234f6?version=3.38.2
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { board, items } from '$lib/stores';
	import { Button } from '$lib/components/ui/Button/index.js';
	import { Home, Library, BrushCleaning, Trash2 } from '@lucide/svelte';
	const flipDurationMs = 200;

	function handleDndConsiderCards(cid: number, e: any) {
		// Find the index of the column in the board array
		const colIdx = $board.findIndex((c) => c.id === cid);
		if (colIdx !== -1) {
			// Update the items for the specific column
			$board[colIdx].items = e.detail.items;
		}
	}

	function handleDndFinalizeCards(cid: number, e: any) {
		const colIdx = $board.findIndex((c) => c.id === cid);
		if (colIdx !== -1) {
			$board[colIdx].items = e.detail.items;
		}
		console.log($board); // To log the updated board state
	}
	function cleanColumn(cid: number) {
		const colIdx = $board.findIndex((c) => c.id === cid);

		if (colIdx !== -1) {
			const columnItems = $board[colIdx].items;
			console.log(columnItems);
			$board[colIdx].items = [];
		}
	}
</script>

<section class="mb-10 flex h-[55vh] w-full flex-row gap-4 p-2">
	{#each $board as column (column.id)}
		<div
			class="column m-4 flex h-full w-52 flex-col rounded-md border border-gray-800 bg-white p-2"
			animate:flip={{ duration: flipDurationMs }}
		>
			<div class="mb-2 flex items-center justify-between">
				<span>{column.name}</span>
				<div class="flex gap-2">
					<Button
						class="icon-btn ml-2 cursor-pointer border-none bg-transparent text-lg hover:text-blue-600"
						title="Clean Column"
						onclick={() => cleanColumn(column.id)}
					>
						<BrushCleaning />
					</Button>
					<Button
						class="icon-btn ml-2 cursor-pointer border-none bg-transparent text-lg hover:text-blue-600"
						title="Delete Column"
					>
						<Trash2 />
					</Button>
				</div>
			</div>
			<div
				class="column-content flex h-full flex-col items-center overflow-y-scroll"
				use:dndzone={{ items: column.items, flipDurationMs }}
				on:consider={(/** @type {{ detail: { items: any; }; }} */ e) =>
					handleDndConsiderCards(column.id, e)}
				on:finalize={(/** @type {{ detail: { items: any; }; }} */ e) =>
					handleDndFinalizeCards(column.id, e)}
			>
				{#each column.items as item (item.id)}
					<div
						class="card m-2 flex aspect-square max-h-32 max-w-[128px] min-w-[96px] flex-1 items-center justify-center rounded-md border bg-yellow-200 p-4 shadow-md"
						animate:flip={{ duration: flipDurationMs }}
					>
						{item.shortname}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</section>
