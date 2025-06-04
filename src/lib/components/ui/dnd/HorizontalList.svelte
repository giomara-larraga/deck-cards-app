<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	/**
	 * @type {any}
	 */
	export let items;
	export let itemWidth = '10em';
	const flipDurationMs = 300;
	/**
	 * @param {{ detail: { items: any; }; }} e
	 */
	function handleDndConsider(e) {
		items = e.detail.items;
	}
	/**
	 * @param {{ detail: { items: any; }; }} e
	 */
	function handleDndFinalize(e) {
		items = e.detail.items;
		console.log(items);
	}
</script>

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
				class="card flex aspect-square max-h-32 max-w-[128px] min-w-[96px] flex-1 items-center justify-center rounded-md border bg-yellow-200 p-4 shadow-md"
				style="flex: 0 0 {itemWidth}; margin: 0 0.15em"
				animate:flip={{ duration: flipDurationMs }}
			>
				{item.shortname}
			</div>
		{/each}
	{/if}
</section>
