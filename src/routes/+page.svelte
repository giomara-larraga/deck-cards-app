<script lang="ts">
	// UI and navigation imports
	import { Button } from '$lib/components/ui/button/index.js';
	import { RotateCcw } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// App state and board logic
	import { cards } from '$lib/constants.js';
	import { board, items } from '$lib/stores.js';
	import HorizontalList from '$lib/components/ui/dnd/HorizontalList.svelte';
	import Board from '$lib/components/ui/dnd/Board.svelte';

	/**
	 * Handles the "Next" button click.
	 * Updates the computedRank for each column in the board,
	 * then navigates to the tradeoffs page.
	 */
	function handleSelection() {
		const N = $board.length;
		const lastRank = $board[N - 1]?.rank ?? 0;
		$board[0].computedRank = lastRank;
		for (let i = 1; i < N; i++) {
			$board[i].computedRank = $board[i - 1].computedRank - ($board[i - 1]?.value ?? 0);
		}
		goto('/tradeoffs');
	}

	/**
	 * Handles the "Reset" button click.
	 * Resets the board to a single empty column and restores all items.
	 */
	function handleReset() {
		board.set([{ id: 1, rank: 1, computedRank: 1, value: 1, isBlank: false, items: [] }]);
		items.set([...cards]);
	}

	/**
	 * On mount, initialize the board and items.
	 */
	onMount(() => {
		items.set([...cards]);
		board.set([{ id: 1, rank: 1, computedRank: 1, value: 1, isBlank: false, items: [] }]);
	});
</script>

<!--
    Main layout:
    - Top row: HorizontalList (left) and action buttons (right)
    - Middle row: Board
-->
<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<!-- Top row: HorizontalList and action buttons -->
	<div class="border-b bg-gray-200 p-4">
		<div class="flex flex-row gap-6">
			<!-- Left: HorizontalList (for draggable items) -->
			<div class="flex flex-[2] justify-center">
				<HorizontalList items={$items} />
			</div>
			<!-- Right: Action buttons (Reset, Next) -->
			<div class="flex min-h-[8rem] flex-[1] items-center justify-center rounded">
				<div class="flex flex-col gap-4">
					<Button onclick={handleReset} class="btn preset-filled-secondary-500">
						<RotateCcw class="mr-2 size-4" />
						Reset
					</Button>
					<Button type="button" class="btn preset-filled-primary-500" onclick={handleSelection}>
						Next
					</Button>
				</div>
			</div>
		</div>
	</div>
	<!-- Middle row: Board for arranging items into ranks -->
	<div class="p-4">
		<Board />
	</div>
</div>
