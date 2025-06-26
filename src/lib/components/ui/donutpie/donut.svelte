<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import * as echarts from 'echarts';

	/**
	 * Props:
	 * - ranks: Array of arrays, each sub-array contains the names of items in a rank.
	 * - weights: Array of weights for each rank.
	 * - Nweights: Array of normalized weights for each rank (should sum to 1).
	 * - rankNames: Optional array of display names for each rank.
	 */
	export let ranks: string[][]; // Example: [['A', 'B'], ['C'], ['D', 'E'], ['F']]
	export let weights: number[]; // Example: [0, 1, 1.15, 2]
	export let Nweights: number[]; // Normalized weights for each rank
	export let rankNames: string[] = []; // Optional: names for each rank

	let chartDiv: HTMLDivElement;
	let chart: echarts.ECharts | null = null;
	let numRanks = weights ? weights.length : 0;

	/**
	 * Sets up and renders the donut (pie) chart using ECharts.
	 * - Each slice represents a rank.
	 * - The label shows the rank name, weight, and normalized weight as a percentage.
	 * - The rank name is bold and larger using ECharts rich text.
	 */
	function setChart() {
		if (!ranks || !weights || ranks.length !== weights.length || !chartDiv) return;

		const pieData = weights.map((value, i) => ({
			value: parseFloat(value.toFixed(2)),
			name: `{rank|${rankNames[i] ?? `I${numRanks - i}`}}\nWeight: ${value.toFixed(2)}\nNormalized: ${(Nweights[i] * 100).toFixed(1)}%`
		}));

		const option = {
			tooltip: {
				trigger: 'item',
				show: false // Set to true if you want tooltips
			},
			legend: {
				top: '1%',
				left: 'center',
				show: false // Hide legend for a cleaner look
			},
			series: [
				{
					name: 'Rank Weights',
					type: 'pie',
					radius: ['40%', '70%'],
					avoidLabelOverlap: false,
					padAngle: 5,
					itemStyle: {
						borderRadius: 10
					},
					label: {
						show: true,
						formatter: '{b}',
						rich: {
							rank: {
								fontWeight: 'bold',
								fontSize: 16
							}
						}
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 16,
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: true
					},
					data: pieData
				}
			]
		};

		if (!chart) {
			chart = echarts.init(chartDiv);
		}
		chart.setOption(option, true);
	}

	// Initialize chart on mount and update on prop changes
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
</script>

<!--
    Donut chart container.
    - width: 100% of parent
    - height: 300px (adjust as needed)
-->
<div bind:this={chartDiv} style="width: 100%; height: 300px;" />
