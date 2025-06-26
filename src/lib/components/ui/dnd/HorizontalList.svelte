<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	/**
	 * Props:
	 * - items: Array of card objects to display and drag.
	 * - itemWidth: CSS width for each card (default: '10em').
	 */
	export let items: { id: number | string; shortname: string }[] = [];
	export let itemWidth = '10em';

	const flipDurationMs = 300;

	/**
	 * Handles drag-and-drop "consider" event.
	 * Updates the items array to reflect the current drag state.
	 * @param {{ detail: { items: any; }; }} e
	 */
	function handleDndConsider(e: any) {
		items = e.detail.items;
	}

	/**
	 * Handles drag-and-drop "finalize" event.
	 * Updates the items array after a drop and logs the result.
	 * @param {{ detail: { items: any; }; }} e
	 */
	function handleDndFinalize(e: any) {
		items = e.detail.items;
		console.log(items);
	}
</script>

<!--
    HorizontalList layout:
    - Displays draggable cards in a horizontal row.
    - Shows a message if no cards are available.
-->
<section
	class="flex min-h-36 flex-row justify-center gap-4"
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#if items.length === 0}
		<div class="flex w-full items-center justify-center text-gray-400">No cards available</div>
	{:else}
		{#each items as item (item.id)}
			<div
				class="card flex aspect-square max-h-32 max-w-[128px] min-w-[96px] flex-1 items-center justify-center rounded-md border bg-yellow-200 p-4 text-xl font-medium shadow-md"
				style="flex: 0 0 {itemWidth}; margin: 0 0.15em"
				animate:flip={{ duration: flipDurationMs }}
			>
				{item.shortname}
			</div>
		{/each}
	{/if}
</section>
