import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useIssuesByState } from '../hooks/useMetrics';

const COLORS = ['#1976d2', '#ed6c02'];

function IssuesByStateChart() {
	const { data, isLoading, error } = useIssuesByState();

	if (isLoading) {
		return <div>Loading chart...</div>;
	}

	if (error) {
		return <div>Failed to load chart data.</div>;
	}

	return (
		<ResponsiveContainer width="100%" height={350}>
			<PieChart>
				<Pie data={data} dataKey="count" nameKey="state" cx="50%" cy="50%" outerRadius={110} label>
					{data?.map((entry, index) => (
						<Cell key={entry.state} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>

				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}

export default IssuesByStateChart;
