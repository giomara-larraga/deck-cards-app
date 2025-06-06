<script lang="ts">
	import { board } from '$lib/stores';
	import { Button } from '$lib/components/ui/button/index.js';

	let weights;

	// Collapse consecutive empty ranks in the middle into a single blank rank with summed value
	$: processedBoard = (() => {
		const arr = [...$board];
		// Remove trailing empty columns
		while (arr.length > 0 && arr[arr.length - 1].items.length === 0) {
			arr.pop();
		}
		const result = [];
		let blankStreak = 0;
		let blankValue = 0;
		let blankRank = 0;

		for (let i = 0; i < arr.length; i++) {
			const col = arr[i];
			if (col.items.length === 0) {
				// Start or continue a blank streak
				if (blankStreak === 0) {
					blankRank = col.rank;
				}
				blankStreak++;
				blankValue += col.value ?? 1;
			} else {
				// If there was a blank streak, push a single blank rank
				if (blankStreak > 0) {
					result.push({
						id: `blank-${blankRank}`,
						rank: blankRank,
						isBlank: true,
						value: blankValue,
						items: []
					});
					blankStreak = 0;
					blankValue = 0;
					blankRank = 0;
				}
				result.push(col);
			}
		}
		// If the board ends with a blank streak (shouldn't happen due to pop above, but just in case)
		if (blankStreak > 0) {
			result.push({
				id: `blank-${blankRank}`,
				rank: blankRank,
				isBlank: true,
				value: blankValue,
				items: []
			});
		}
		return result;
	})();

	// Get all ranks in the board that have at least one item
	$: nonEmptyRanks = $board
		.filter((col) => col.items && col.items.length > 0)
		.map((col) => col.rank);

	// Compute weights for each non-empty rank
	function computeWeights() {
		if (nonEmptyRanks.length === 0) return;

		const first_rank = nonEmptyRanks[0];
		const last_rank = nonEmptyRanks[nonEmptyRanks.length - 1];

		nonEmptyRanks.forEach((rank) => {
			const col = $board.find((c) => c.rank === rank);
			const itemNames = col?.items.map((item) => item.name ?? item.shortname ?? item) ?? [];
			// Weight formula: first_rank * 2^((current_rank - first_rank)/(last_rank - first_rank))
			let weight = first_rank;
			if (last_rank !== first_rank) {
				weight = first_rank * Math.pow(2, (rank - first_rank) / (last_rank - first_rank));
			}
			console.log(`rank ${rank} has [${itemNames.join(', ')}] items, weight: ${weight}`);
		});
	}
	// Compute weights for each non-empty rank and store in an array
	$: weights = (() => {
		if (nonEmptyRanks.length === 0) return [];
		const first_rank = nonEmptyRanks[0];
		const last_rank = nonEmptyRanks[nonEmptyRanks.length - 1];
		return nonEmptyRanks.map((rank) => {
			let weight = first_rank;
			if (last_rank !== first_rank) {
				weight = first_rank * Math.pow(2, (rank - first_rank) / (last_rank - first_rank));
			}
			return weight;
		});
	})();
</script>

<h2 class="mb-4 text-xl font-bold">Board State</h2>
<ul>
	{#each processedBoard as column}
		<li class="mb-2">
			<strong>Rank {column.rank}:</strong>
			{#if column.isBlank}
				<span class="ml-2 text-yellow-600">(Blank Rank, value: {column.value})</span>
			{:else if column.items.length > 0}
				<ul class="ml-4 list-disc">
					{#each column.items as item}
						<li>{item.name ?? item.shortname ?? item}</li>
					{/each}
				</ul>
			{:else}
				<span class="text-gray-400">No items</span>
			{/if}
		</li>
	{/each}
</ul>
<p>Weights: [{weights.join(', ')}]</p>
