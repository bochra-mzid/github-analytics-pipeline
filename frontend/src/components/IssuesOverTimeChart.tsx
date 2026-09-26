import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useIssuesOverTime } from '../hooks/useMetrics';

function IssuesOverTimeChart() {
	const { data, isLoading, error } = useIssuesOverTime();

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

				<Line type="monotone" dataKey="issues" name="Issues" stroke="#1976d2" />

				<Line type="monotone" dataKey="prs" name="Pull Requests" stroke="#ed6c02" />
			</LineChart>
		</ResponsiveContainer>
	);
}

export default IssuesOverTimeChart;
