import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useLabelUsage } from '../hooks/useMetrics';

function LabelsChart() {
	const { data, isLoading, error } = useLabelUsage();

	if (isLoading) {
		return <div>Loading chart...</div>;
	}

	if (error) {
		return <div>Failed to load chart data.</div>;
	}

	const topLabels = data?.slice(0, 10) ?? [];

	return (
		<ResponsiveContainer width="100%" height={400}>
			<BarChart data={topLabels} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
				<CartesianGrid strokeDasharray="3 3" />

				<XAxis type="number" />

				<YAxis type="category" dataKey="label" width={150} />

				<Tooltip />

				<Bar dataKey="count" name="Usage" fill="#1976d2" />
			</BarChart>
		</ResponsiveContainer>
	);
}

export default LabelsChart;
