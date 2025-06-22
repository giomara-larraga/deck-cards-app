<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import * as echarts from 'echarts';

	export let ranks: { name: string; rank: number }[];
	export let toImprove: number = -1;
	export let toImpair: number = -1;

	let chartDiv: HTMLDivElement;
	let chart: echarts.ECharts | null = null;

	function setChart() {
		if (!ranks || !chartDiv) return;
		console.log('Setting chart with ranks:', ranks, 'toImprove:', toImprove, 'toImpair:', toImpair);

		const option = {
			tooltip: {
				trigger: 'item',
				formatter: (params: any) => `${params.data.name}<br>Rank: ${params.data.rank}`,
				show: false
			},
			xAxis: {
				type: 'category',
				data: ranks.map((item) => item.name),
				name: 'Items'
			},
			yAxis: {
				type: 'value',
				inverse: false,
				min: 1,
				max: Math.max(...ranks.map((i) => i.rank)) + 1,
				interval: 1,
				axisLabel: {
					formatter: (value: number) => `Rank ${value}`
				}
			},
			series: [
				{
					type: 'scatter',
					symbolSize: 20,
					data: ranks.map((item) => ({
						name: item.name,
						value: [item.name, item.rank],
						itemStyle:
							item.rank === toImprove
								? { color: '#2563eb' } // blue
								: item.rank === toImpair
									? { color: '#dc2626' } // red
									: { color: '#a3a3a3' } // gray as default
					})),
					emphasis: {
						focus: 'series'
					}
				}
			]
		};

		if (!chart) {
			chart = echarts.init(chartDiv);
		}
		chart.setOption(option, true);
	}

	onMount(() => {
		setChart();
		return () => {
			if (chart) {
				chart.dispose();
				chart = null;
			}
		};
	});

	afterUpdate(() => {
		setChart();
	});

	// Update chart when toImprove or toImpair changes
	$: toImprove, toImpair, ranks; // triggers reactivity
	$: setChart();
</script>

<div bind:this={chartDiv} style="width: 100%; height: 400px;" />
