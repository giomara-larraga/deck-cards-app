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

		// Get unique ranks sorted ascending
		const uniqueRanks = Array.from(new Set(ranks.map((item) => item.rank))).sort((a, b) => a - b);

		// Find the max rank to size the label array
		const maxRank = Math.max(...ranks.map((item) => item.rank), 1);

		// Fill rankLabels so that index i corresponds to rank i+1
		const rankLabels: string[] = Array(maxRank).fill('');
		let classIndex = 1;
		for (let i = 1; i <= maxRank; i++) {
			const names = ranks
				.filter((item) => item.rank === i)
				.map((item) => item.name)
				.join(', ');
			if (names.length === 0) {
				continue; // Skip empty ranks
			} // Skip empty ranks
			else {
				rankLabels[i - 1] = `I{sub|${classIndex}}`;
				classIndex++;
			}
		}

		const option = {
			tooltip: {
				trigger: 'item',
				formatter: (params: any) => `${params.data.name}<br>Rank: ${params.data.rank}`,
				show: false
			},
			xAxis: {
				type: 'category',
				data: ranks.map((item) => item.name)
				//name: 'Items'
			},
			yAxis: [
				{
					type: 'value',
					inverse: false,
					min: 1,
					max: maxRank + 1,
					interval: 1,
					axisLabel: {
						formatter: (value: number) => `Rank ${value}`
					}
				},
				{
					type: 'category',
					position: 'right',
					data: rankLabels,
					axisLabel: {
						formatter: (value: string) => value,
						verticalAlign: 'top',
						rich: {
							sub: {
								fontSize: 10, // Increase as needed
								verticalAlign: 'bottom'
							}
						}
					},
					axisTick: { show: false },
					axisLine: { show: false }
				}
			],
			series: [
				{
					type: 'scatter',
					symbolSize: 20,
					yAxisIndex: 0,
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

<div bind:this={chartDiv} style="width: 100%; height: 300px;" />
