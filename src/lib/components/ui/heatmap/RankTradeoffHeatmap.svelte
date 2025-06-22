<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import * as echarts from 'echarts';

	export let weights: number[];
	let Nmax = 3;
	let chartDiv: HTMLDivElement;
	let chart: echarts.ECharts | null = null;

	let numWeights = weights ? weights.length : 0;

	function setChart() {
		if (!weights || weights.length === 0 || !chartDiv) return;

		const N = weights.length;
		const labels = Array.from({ length: N }, (_, i) => `I${i + 1}`);

		const heatmapData = [];
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				if (i >= j) {
					heatmapData.push([i, j, null]);
				} else {
					heatmapData.push([i, j, weights[i] / weights[j]]);
				}
			}
		}

		const option = {
			tooltip: {
				position: 'top',
				formatter: (params: any) => {
					const value = params.value[2];
					if (value == null) {
						return '';
					}
					if (typeof value === 'number') {
						return `${labels[params.value[1]]} vs ${labels[params.value[0]]}: ${value.toFixed(2)}`;
					}
					return '';
				}
			},
			xAxis: {
				type: 'category',
				data: labels,
				position: 'top',
				splitArea: { show: true }
			},
			yAxis: {
				type: 'category',
				data: labels,
				splitArea: { show: true }
			},
			visualMap: {
				min: 0,
				max: Nmax,
				calculable: true,
				orient: 'horizontal',
				left: 'center',
				bottom: '15%',
				show: false,
				inRange: {
					color: ['#4575b4', '#ffffbf', '#d73027'] // blue → yellow → red
				},
				outOfRange: {
					color: 'rgba(0,0,0,0)' // Transparent for null values
				}
			},
			series: [
				{
					name: 'Tradeoff Intensity',
					type: 'heatmap',
					data: heatmapData,
					label: {
						show: true,
						formatter: (params: any) =>
							params.value[2] === '-'
								? '-'
								: typeof params.value[2] === 'number'
									? params.value[2].toFixed(2)
									: ''
					},
					emphasis: {
						itemStyle: {
							shadowBlur: 10,
							shadowColor: 'rgba(0,0,0,0.5)'
						}
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
</script>

<div bind:this={chartDiv} style="width: 100%; height: 300px;" />
