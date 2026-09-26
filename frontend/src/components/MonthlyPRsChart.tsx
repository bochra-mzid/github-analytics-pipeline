import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useMonthlyPRs } from '../hooks/useMetrics';

function MonthlyPRsChart() {
	const { data, isLoading, error } = useMonthlyPRs();

	if (isLoading) {
		return <div>Loading chart...</div>;
	}

	if (error) {
		return <div>Failed to load chart data.</div>;
	}

	return (
		<ResponsiveContainer width="100%" height={350}>
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="month" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line type="monotone" dataKey="total_prs" name="PRs Created" stroke="#1976d2" />
				<Line type="monotone" dataKey="merged_prs" name="PRs Merged" stroke="#2e7d32" />
			</LineChart>
		</ResponsiveContainer>
	);
}

export default MonthlyPRsChart;
