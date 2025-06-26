<script lang="ts">
	// Svelte animate and drag-and-drop imports
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	// App state and UI components
	import { board, items } from '$lib/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import { DiamondPlus, BrushCleaning, Trash2, FilePlus } from '@lucide/svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	const flipDurationMs = 200;

	/**
	 * Add a blank card column to the board.
	 * If the last column is already blank, increment its value instead.
	 */
	function addBlank() {
		board.update((currentBoard) => {
			const last = currentBoard[currentBoard.length - 1];
			const newColumnId = last.rank + last.value;
			if (last.isBlank) {
				return [...currentBoard.slice(0, -1), { ...last, value: last.value + 1 }];
			}
			return [
				...currentBoard,
				{ id: newColumnId, rank: newColumnId, computedRank: 1, isBlank: true, value: 1, items: [] }
			];
		});
	}

	/**
	 * Add a new rank column to the board.
	 */
	function addColumn() {
		board.update((currentBoard) => {
			const last = currentBoard[currentBoard.length - 1];
			const newColumnId = last.rank + last.value;
			return [
				...currentBoard,
				{ id: newColumnId, rank: newColumnId, computedRank: 1, isBlank: false, value: 1, items: [] }
			];
		});
	}

	/**
	 * Handle drag-and-drop "consider" event for cards.
	 * Updates the items in the column being considered.
	 */
	function handleDndConsiderCards(cid: number, e: any) {
		const colIdx = $board.findIndex((c) => c.id === cid);
		if (colIdx !== -1) {
			$board[colIdx].items = e.detail.items;
		}
	}

	/**
	 * Handle drag-and-drop "finalize" event for cards.
	 * Updates the items in the column after drop.
	 */
	function handleDndFinalizeCards(cid: number, e: any) {
		const colIdx = $board.findIndex((c) => c.id === cid);
		if (colIdx !== -1) {
			$board[colIdx].items = e.detail.items;
		}
		console.log($board); // Log updated board state
	}

	/**
	 * Remove all items from a column.
	 */
	function cleanColumn(cid: number) {
		const colIdx = $board.findIndex((c) => c.id === cid);
		if (colIdx !== -1) {
			const columnItems = $board[colIdx].items;
			console.log(columnItems);
			$board[colIdx].items = [];
		}
	}
</script>

<!--
    Board layout:
    - Each column represents a rank or a blank card.
    - Cards can be dragged between columns.
    - Buttons to add new rank columns or blank cards.
-->
<section class="mb-10 flex h-[55vh] w-full flex-wrap gap-4 p-2">
	{#each $board as column, idx (column.id)}
		<div
			class="column m-4 flex h-full w-52 flex-col rounded-md border p-2
                {column.isBlank
				? 'card flex aspect-square max-h-32 max-w-[128px] min-w-[96px] flex-1 items-center justify-center rounded-md border border-gray-400 bg-white p-4 shadow-md'
				: 'border-gray-400 bg-white shadow-md'}"
			animate:flip={{ duration: flipDurationMs }}
		>
			<!-- Column header: rank label or blank card -->
			<div class="mb-2 flex items-center justify-between">
				{#if !column.isBlank}
					<span>
						{#if idx === 0}
							Most important
						{:else if idx === 1}
							Second most important
						{:else if idx === $board.length - 1}
							Least important
						{:else}
							{column.rank}ᵗʰ most important
						{/if}
					</span>
				{:else}
					<span class="text-gray-600">Blank Card</span>
				{/if}
				<div class="flex gap-2"></div>
			</div>
			<!-- Column content: draggable cards or blank card input -->
			{#if !column.isBlank}
				<div
					class="column-content flex h-full flex-col items-center overflow-y-scroll"
					use:dndzone={{ items: column.items, flipDurationMs }}
					on:consider={(e) => handleDndConsiderCards(column.id, e)}
					on:finalize={(e) => handleDndFinalizeCards(column.id, e)}
				>
					{#each column.items as item (item.id)}
						<div
							class="card m-2 flex aspect-square max-h-32 max-w-[128px] min-w-[96px] flex-1 items-center justify-center rounded-md border bg-yellow-200 p-4 text-xl font-medium shadow-md"
							animate:flip={{ duration: flipDurationMs }}
						>
							{item.shortname}
						</div>
					{/each}
				</div>
			{:else}
				<!-- Blank card: input for value -->
				<div class="flex h-full items-center justify-center text-gray-400">
					<Input
						type="number"
						placeholder="Value"
						value={column.value}
						onchange={(e) => {
							const target = e.target as HTMLInputElement | null;
							if (!target) return;
							const newValue = Number(target.value);
							board.update((current) => {
								// Update the value for the changed column
								const updated = current.map((col) =>
									col.id === column.id ? { ...col, value: newValue } : col
								);

								// Update ranks: first column stays, others are prev.rank + prev.value
								let prevRank = updated[0]?.rank ?? 1;
								const withRanks = updated.map((col, idx) => {
									if (idx === 0) {
										prevRank = col.rank;
										return col;
									}
									const newRank = prevRank + updated[idx - 1].value;
									prevRank = newRank;
									return { ...col, rank: newRank };
								});
								return withRanks;
							});
						}}
					/>
				</div>
			{/if}
		</div>
	{/each}
	<!-- Action buttons: add new rank or blank card -->
	<div class="flex h-full flex-col items-center justify-center gap-4">
		<Button variant="outline" onclick={addColumn} title="Add a new rank column">
			<DiamondPlus />
			New Rank
		</Button>
		<Button onclick={addBlank} variant="outline" title="Add a blank card">
			<FilePlus />
			Blank Card
		</Button>
	</div>
</section>
