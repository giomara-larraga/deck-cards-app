<script lang="ts">
	import { board } from '$lib/stores';
	import Donut from '$lib/components/ui/donutpie/donut.svelte';
	import RankTradeoffHeatmap from '$lib/components/ui/heatmap/RankTradeoffHeatmap.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let weights: number[] = [];

	// Get all ranks in the board that have at least one item
	$: nonEmptyRanks = $board
		.filter((col) => col.items && col.items.length > 0)
		.map((col) => col.rank)
		.reverse();

	// Compute weights for each non-empty rank and store in an array
	$: weights = (() => {
		if (nonEmptyRanks.length === 0) return [];
		console.log('Non-empty ranks:', nonEmptyRanks);
		const first_rank = nonEmptyRanks[0];
		const last_rank = nonEmptyRanks[nonEmptyRanks.length - 1];
		return nonEmptyRanks.map((rank) => {
			let weight = last_rank * Math.pow(3, (rank - last_rank) / (first_rank - last_rank));

			return weight;
		});
	})();

	// Extract the items of all non-empty ranks as a string[][] using only shortname
	$: nonEmptyRanksArray = $board
		.filter((col) => col.items && col.items.length > 0)
		.map((col) => col.items.map((item) => item.shortname ?? String(item)));

	let selectedR1 = 0;
	let selectedR2 = 1;
	let nValue: number = 0;
	const N = 100; // or set to your actual max value
</script>

<div class="flex h-full min-h-screen">
	<!-- Sidebar -->
	<aside class="flex h-full min-h-screen w-full max-w-xs flex-col border-r bg-gray-100 p-4">
		<h2 class="mb-2 text-xl font-bold">Rank Weights Overview</h2>
		<p class="mb-4 text-sm text-gray-600">
			This chart shows the relative importance of each rank based on your current ranking. You can
			modify the ranking at any time.
		</p>
		<Donut ranks={nonEmptyRanksArray} {weights} />
		<div class="mt-auto flex justify-center">
			<a href="/" class="block w-full max-w-xs">
				<Button class="w-full">Modify ranking</Button>
			</a>
		</div>
	</aside>
	<!-- Main content -->
	<main class="flex-1 p-4">
		<h2 class="mb-4 text-lg font-bold">Trade-off Assessment</h2>
		<div class="flex flex-row gap-8">
			<!-- Left: Trade-off selection and question -->
			<div class="flex max-w-md flex-1 flex-col gap-4">
				{#if nonEmptyRanks.length >= 2}
					<label>
						<span class="font-semibold">Indicator to improve ($I_r_1$):</span>
						<select bind:value={selectedR1} class="mt-1 w-full rounded border p-2">
							{#each nonEmptyRanks as rank, idx}
								<option value={idx}>
									{idx === 0
										? 'Most important'
										: idx === 1
											? 'Second most important'
											: idx === nonEmptyRanks.length - 1
												? 'Least important'
												: `${idx + 1}ᵗʰ most important`}
								</option>
							{/each}
						</select>
					</label>
					<label>
						<span class="font-semibold">Indicator to impair ($I_r_2$):</span>
						<select bind:value={selectedR2} class="mt-1 w-full rounded border p-2">
							{#each nonEmptyRanks as rank, idx}
								{#if idx > selectedR1}
									<option value={idx}>
										{idx === 0
											? 'Most important'
											: idx === 1
												? 'Second most important'
												: idx === nonEmptyRanks.length - 1
													? 'Least important'
													: `${idx + 1}ᵗʰ most important`}
									</option>
								{/if}
							{/each}
						</select>
					</label>
					{#if selectedR2 > selectedR1}
						<div class="mt-4 rounded border bg-blue-50 p-4">
							<p class="mb-2">
								<b>Question:</b><br />
								In order to improve <b>I<sub>r₁</sub></b> from its worst (0) to its best (<b>N</b>)
								value, <br />
								how much would you be willing to impair <b>I<sub>r₂</sub></b> (i.e., let an element
								in
								<b>I<sub>r₂</sub></b>
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
					<p class="text-gray-500">You need at least two non-empty ranks to assess a trade-off.</p>
				{/if}
			</div>
			<!-- Right: Heatmap -->
			<div class="min-w-[350px] flex-1">
				<RankTradeoffHeatmap {weights} />
			</div>
		</div>
	</main>
</div>
