import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useContributors } from '../hooks/useMetrics';

function ContributorsPRChart() {
	const { data, isLoading, error } = useContributors();

	if (isLoading) {
		return <div>Loading chart...</div>;
	}

	if (error) {
		return <div>Failed to load chart data.</div>;
	}

	const topContributors = [...(data ?? [])].sort((a, b) => b.prs_created - a.prs_created).slice(0, 10);

	return (
		<ResponsiveContainer width="100%" height={450}>
			<BarChart data={topContributors} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis type="number" />
				<YAxis type="category" dataKey="login" width={120} />
				<Tooltip />
				<Legend />
				<Bar dataKey="prs_created" name="PRs Created" fill="#1976d2" />
				<Bar dataKey="prs_merged" name="PRs Merged" fill="#2e7d32" />
			</BarChart>
		</ResponsiveContainer>
	);
}

export default ContributorsPRChart;
