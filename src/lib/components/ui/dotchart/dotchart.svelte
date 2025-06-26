<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import * as echarts from 'echarts';

	/**
	 * Props:
	 * - ranks: Array of { name, rank } objects for each item.
	 * - toImprove: Rank number to highlight in blue.
	 * - toImpair: Rank number to highlight in red.
	 */
	export let ranks: { name: string; rank: number }[];
	export let toImprove: number = -1;
	export let toImpair: number = -1;

	let chartDiv: HTMLDivElement;
	let chart: echarts.ECharts | null = null;

	/**
	 * Sets up and renders the dotchart using ECharts.
	 * - Right y-axis labels use bold for 'I' and subscript for the class index.
	 * - Points in the toImprove rank are blue, toImpair rank are red, others are gray.
	 */
	function setChart() {
		if (!ranks || !chartDiv) return;

		// Find the max rank to size the label array
		const maxRank = Math.max(...ranks.map((item) => item.rank), 1);

		// Build right y-axis labels: {bold|I}{sub|n} for each non-empty rank
		const rankLabels: string[] = Array(maxRank).fill('');
		let classIndex = 1;
		for (let i = 1; i <= maxRank; i++) {
			const hasItems = ranks.some((item) => item.rank === i);
			if (hasItems) {
				rankLabels[i - 1] = `{bold|I}{sub|${classIndex}}`;
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
						// Use rich text for bold and subscript
						formatter: (value: string) => value,
						verticalAlign: 'top',
						rich: {
							bold: {
								fontWeight: 'bold',
								fontSize: 14
							},
							sub: {
								fontWeight: 'bold',
								fontSize: 10,
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

	// Initialize and update chart on mount and after updates
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

	// Reactively update chart when inputs change
	$: toImprove, toImpair, ranks;
	$: setChart();
</script>

<!--
    Dotchart container.
    - width: 100% of parent
    - height: 300px (adjust as needed)
-->
<div bind:this={chartDiv} style="width: 100%; height: 300px;" />
