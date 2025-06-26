<script lang="ts">
	// Store and component imports
	import { board } from '$lib/stores';
	import Donut from '$lib/components/ui/donutpie/donut.svelte';
	import RankTradeoffHeatmap from '$lib/components/ui/heatmap/RankTradeoffHeatmap.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import Dotchart from '$lib/components/ui/dotchart/dotchart.svelte';

	// State variables
	let weights: number[] = [];
	let normalizedWeights: number[] = [];
	let selectedR1 = 0;
	let selectedR2 = 1;
	let nValue: number = 0;
	let N = 3; // Maximum value for N

	/**
	 * Get all ranks in the board that have at least one item.
	 * nonEmptyRanks: array of computedRank for each non-empty column.
	 * numRanks: number of non-empty ranks.
	 */
	$: nonEmptyRanks = $board
		.filter((col) => col.items && col.items.length > 0)
		.map((col) => col.computedRank);
	$: numRanks = nonEmptyRanks.length;

	/**
	 * Compute weights for each non-empty rank and store in an array.
	 * The formula uses N and nValue to calculate trade-off weights.
	 */
	$: weights = (() => {
		if (nonEmptyRanks.length === 0) return [];
		const first_rank = nonEmptyRanks[0];
		const last_rank = nonEmptyRanks[nonEmptyRanks.length - 1];
		return nonEmptyRanks.map((rank) => {
			let weight =
				last_rank * Math.pow(N / (N - nValue), (rank - last_rank) / (first_rank - last_rank));
			return weight;
		});
	})();

	/**
	 * Extract the items of all non-empty ranks as a string[][] using only shortname.
	 * Each sub-array contains the shortnames for items in a rank.
	 */
	$: nonEmptyRanksArray = $board
		.filter((col) => col.items && col.items.length > 0)
		.map((col) => col.items.map((item) => item.shortname ?? String(item)));

	/**
	 * Flatten all items in non-empty ranks into an array of { name, rank } objects.
	 * Used for the dotchart.
	 */
	$: rankedItems = $board
		.filter((col) => col.items && col.items.length > 0)
		.flatMap((col) =>
			col.items.map((item) => ({
				name: item.shortname ?? String(item),
				rank: col.computedRank
			}))
		);

	/**
	 * Track which rank to improve and which to impair, based on user selection.
	 */
	$: toImprove = nonEmptyRanks[selectedR1];
	$: toImpair = nonEmptyRanks[selectedR2];

	/**
	 * Normalize weights so their sum is 1, considering the number of items in each rank.
	 */
	$: if (weights.length > 0) {
		let sum_weights = 0;
		nonEmptyRanksArray.forEach((rank, idx) => {
			if (rank.length > 0) {
				// The sum of the weights should consider the length of the rank
				sum_weights += weights[idx] * rank.length;
			}
		});
		normalizedWeights =
			sum_weights > 0 ? weights.map((weight) => weight / sum_weights) : weights.map(() => 0);
	}
</script>

<!--
Layout:
- Sidebar: Trade-off selection and question
- Main: Dotchart and Donut side by side, Heatmap below
-->
<div class="flex h-full min-h-screen flex-col">
	<div class="flex flex-1">
		<!-- Sidebar -->
		<aside class="flex h-full min-h-screen w-full max-w-xs flex-col border-r bg-gray-100 p-4">
			<h2 class="mb-2 text-xl font-bold">Trade-off Assessment</h2>
			<div class="flex flex-row gap-8">
				<!-- Trade-off selection and question -->
				<div class="flex max-w-md flex-1 flex-col gap-4">
					{#if nonEmptyRanks.length >= 2}
						<label>
							<span class="font-semibold">Class to improve:</span>
							<select bind:value={selectedR1} class="mt-1 w-full rounded border p-2">
								{#each nonEmptyRanks as rank, idx}
									<option value={idx}>
										I{numRanks - idx}
									</option>
								{/each}
							</select>
						</label>
						<label>
							<span class="font-semibold">Class to impair:</span>
							<select bind:value={selectedR2} class="mt-1 w-full rounded border p-2">
								{#each nonEmptyRanks as rank, idx}
									{#if idx > selectedR1}
										<option value={idx}>
											I{numRanks - idx}
										</option>
									{/if}
								{/each}
							</select>
						</label>
						{#if selectedR2 > selectedR1}
							<div class="mt-4 rounded border bg-blue-50 p-4">
								<p class="mb-2">
									<b>Question:</b><br />
									In order to improve <b>I<sub>{numRanks - selectedR1}</sub></b> from its worst (0)
									to its best (<b>N = {N}</b>) value, <br />
									how much would you be willing to impair <b>I<sub>{numRanks - selectedR2}</sub></b>
									(i.e., let an element in
									<b>I<sub>{numRanks - selectedR2}</sub></b>
									deteriorate from <b>N</b> down to what value <b>n</b>)?
								</p>
								<label>
									<span class="font-semibold">Enter value <b>n</b> (between 0 and N):</span>
									<input
										type="number"
										min="0"
										max={N}
										bind:value={nValue}
										class="ml-2 w-24 rounded border p-2"
									/>
								</label>
							</div>
						{/if}
					{:else}
						<p class="text-gray-500">
							You need at least two non-empty ranks to assess a trade-off.
						</p>
					{/if}
				</div>
			</div>
			<div class="mt-auto flex justify-center">
				<a href="/" class="block w-full max-w-xs">
					<Button class="w-full">Modify ranking</Button>
				</a>
			</div>
		</aside>
		<!-- Main content area -->
		<main class="flex min-h-0 flex-1 flex-col overflow-auto p-4">
			<!-- Top row: Dotchart and Donut side by side -->
			<div class="flex w-full min-w-[350px] flex-row gap-8">
				<div class="flex-1">
					<h2 class="mb-2 text-xl font-bold">Inverted ranks</h2>
					<p class="mb-4 text-sm text-gray-600">
						These are the inverted ranks of the items in your current ranking, where a higher rank
						means more important.
					</p>
					<Dotchart ranks={rankedItems} bind:toImprove bind:toImpair />
				</div>
				<div class="min-w-[350px] flex-1">
					<h2 class="mb-2 text-xl font-bold">Weights Overview</h2>
					<p class="mb-4 text-sm text-gray-600">
						This chart shows the relative importance of each rank based on your current ranking, the
						class to improve (<b>I<sub>{selectedR1 + 1}</sub></b>), the class to impair (<b
							>I<sub>{selectedR2 + 1}</sub></b
						>), and N={nValue}.
					</p>
					<Donut ranks={nonEmptyRanksArray} {weights} Nweights={normalizedWeights} />
				</div>
			</div>
			<!-- Bottom row: Heatmap full width below both charts -->
			<div class="mb-2 w-full">
				<h2 class="mb-2 text-xl font-bold">Trade-offs</h2>
				<p class="text-sm text-gray-600">
					This heatmap shows the trade-offs between the ranks based on the computed weights.
				</p>
				<RankTradeoffHeatmap {weights} />
			</div>
		</main>
	</div>
</div>
