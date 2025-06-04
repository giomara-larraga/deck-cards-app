<script lang="ts">
	// This is done in a single file for clarity. A more factored version here: https://svelte.dev/repl/288f827275db4054b23c437a572234f6?version=3.38.2
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { BoardItem } from '$lib/types';

	import { board, items } from '$lib/stores';

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
					<button
						class="icon-btn ml-2 cursor-pointer border-none bg-transparent text-lg hover:text-blue-600"
						title="Add Blank Card"
					>
						📝
					</button>
					<button
						class="icon-btn ml-2 cursor-pointer border-none bg-transparent text-lg hover:text-blue-600"
						title="Clean Column"
						on:click={() => cleanColumn(column.id)}
					>
						🧹
					</button>
					<button
						class="icon-btn ml-2 cursor-pointer border-none bg-transparent text-lg hover:text-blue-600"
						title="Delete Column"
					>
						❌
					</button>
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

<style>
	.board {
		height: 55vh;
		width: 100%;
		padding: 0.5em;
		margin-bottom: 40px;
	}
	.column {
		height: inherit;
		width: 13em;
		padding: 0.5em;
		margin: 1em;
		float: left;
		border: 1px solid #333333;
		/*Notice we make sure this container doesn't scroll so that the title stays on top and the dndzone inside is scrollable*/
		overflow-y: hidden;
	}
	.column-content {
		height: inherit;
		/* Notice that the scroll container needs to be the dndzone if you want dragging near the edge to trigger scrolling */
		overflow-y: scroll;
		justify-items: center;
	}
	.column-title {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.icon-btn {
		background: none;
		border: none;
		cursor: pointer;
		font-size: 1.2em;
		margin-left: 0.5em;
	}
	.icon-btn:hover {
		color: #007bff;
	}
</style>
