<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { cards } from '$lib/constants.js';
	import HorizontalList from '$lib/components/ui/dnd/HorizontalList.svelte';
	import Board from '$lib/components/ui/dnd/Board.svelte';
	import { goto } from '$app/navigation';
	import { board, items } from '$lib/stores.js'; // Assuming you have a store for board and items
	import { RotateCcw } from '@lucide/svelte';
	import { onMount } from 'svelte';

	function handleSelection() {
		const N = $board.length;
		const lastRank = $board[N - 1]?.rank ?? 0;
		$board[0].computedRank = lastRank; // Set the last column's computedRank to its rank
		for (let i = 1; i < N; i++) {
			// Iterate backwards to compute the ranks
			$board[i].computedRank = $board[i - 1].computedRank - ($board[i - 1]?.value ?? 0);
		}

		console.log('Updated board:', $board);
		goto('/tradeoffs');
	}

	function handleReset() {
		board.update(() => [{ id: 1, rank: 1, computedRank: 1, value: 1, isBlank: false, items: [] }]);
		items.set([...cards]); // Assuming `items` is a writable store
	}
	onMount(() => {
		items.set([...cards]); // Initialize items with the cards constant
		board.update(() => [{ id: 1, rank: 1, computedRank: 1, value: 1, isBlank: false, items: [] }]);
	});
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<!-- Top row: two columns, left for HorizontalList, right for a div -->
	<div class="border-b bg-gray-200 p-4">
		<div class="flex flex-row gap-6">
			<!-- Left: HorizontalList (larger) -->
			<div class="flex flex-[2] justify-center">
				<HorizontalList items={$items} />
			</div>
			<!-- Right: Placeholder div (smaller) -->
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
	<div class="p-4">
		<!-- Middle row content -->
		<Board />
	</div>
</div>
