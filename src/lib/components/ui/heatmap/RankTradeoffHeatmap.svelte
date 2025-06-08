<script lang="ts">
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';

	export let weights: number[]; // Must be square matrix (NxN)
	let chartDiv: HTMLDivElement;

	onMount(() => {
		if (!weights || weights.length === 0) return;

		const N = weights.length;
		const labels = Array.from({ length: N }, (_, i) => `Rank ${i + 1}`);

		// Only upper triangle (i < j)
		const heatmapData = [];
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				heatmapData.push([j, i, weights[i] / weights[j]]);
			}
		}

		const option = {
			tooltip: {
				position: 'top',
				formatter: (params: any) => {
					const value = params.value[2];
					if (typeof value === 'number') {
						return `${labels[params.value[1]]} vs ${labels[params.value[0]]}: ${value.toFixed(2)}`;
					}
					return '';
				}
			},
			xAxis: {
				type: 'category',
				data: labels,
				position: 'top', // 👈 this moves the axis to the top
				splitArea: { show: true }
			},
			yAxis: {
				type: 'category',
				data: labels,
				splitArea: { show: true }
			},
			visualMap: {
				min: 0,
				max: 1,
				calculable: true,
				orient: 'horizontal',
				left: 'center',
				bottom: '15%'
			},
			series: [
				{
					name: 'Tradeoff Intensity',
					type: 'heatmap',
					data: heatmapData,
					label: {
						show: true,
						formatter: (params: any) =>
							typeof params.value[2] === 'number' ? params.value[2].toFixed(2) : ''
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

		const chart = echarts.init(chartDiv);
		chart.setOption(option);
		return () => chart.dispose();
	});
</script>

<div bind:this={chartDiv} style="width: 100%; height: 500px;" />
