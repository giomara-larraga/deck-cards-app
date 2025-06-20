<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import * as echarts from 'echarts';

	export let ranks: string[][]; // Example: [['A', 'B'], ['C'], ['D', 'E'], ['F']]
	export let weights: number[]; // Example: [0, 1, 1.15, 2]
	export let rankNames: string[] = []; // New: names for each rank

	let chartDiv: HTMLDivElement;
	let chart: echarts.ECharts | null = null;

	function setChart() {
		if (!ranks || !weights || ranks.length !== weights.length || !chartDiv) return;

		const pieData = weights.map((value, i) => ({
			value: parseFloat(value.toFixed(2)),
			// Add a bullet point before each item in the rank
			name: `${rankNames[i] ?? `Rank ${i + 1}`}:\n${ranks[i].map((item) => '• ' + item).join('\n')}\nWeight: ${value.toFixed(2)}`
		}));

		const option = {
			tooltip: {
				trigger: 'item',
				formatter: function (params: any) {
					const nameLines = params.name.split('\n');
					const rankLine = nameLines.shift() ?? '';
					const itemsLines = nameLines.join('<br>');
					return (
						`<span style="font-weight:bold;">${rankLine}</span><br>` +
						itemsLines +
						`<br><span style="font-size:0.95em;font-weight:bold;">Weight: </span><span>${params.data.value}</span>`
					);
				},
				show: false
			},
			legend: {
				top: '1%',
				left: 'center'
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
						show: false,
						position: 'center'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: 16,
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: false
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

<div bind:this={chartDiv} style="width: 100%; height: 400px;" />
