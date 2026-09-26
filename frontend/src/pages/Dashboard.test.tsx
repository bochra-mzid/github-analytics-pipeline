import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

import Dashboard from './Dashboard';
import { useOverview } from '../hooks/useMetrics';

vi.mock('../hooks/useMetrics', async (importOriginal) => {
	const actual = await importOriginal<typeof import('../hooks/useMetrics')>();

	return {
		...actual,
		useOverview: vi.fn(),
	};
});

const mockedUseOverview = vi.mocked(useOverview);

function renderDashboard() {
	const queryClient = new QueryClient();

	return render(
		<QueryClientProvider client={queryClient}>
			<Dashboard />
		</QueryClientProvider>,
	);
}

describe('Dashboard', () => {
	it('shows loading state', () => {
		mockedUseOverview.mockReturnValue({
			data: undefined,
			isLoading: true,
			error: null,
		} as ReturnType<typeof useOverview>);

		renderDashboard();

		expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
	});

	it('displays overview metrics', () => {
		mockedUseOverview.mockReturnValue({
			data: {
				total_issues: 1000,
				total_prs: 500,
				merged_prs: 250,
				merge_rate: 50,
			},
			isLoading: false,
			error: null,
		} as ReturnType<typeof useOverview>);

		renderDashboard();

		expect(screen.getByText('1000')).toBeInTheDocument();
		expect(screen.getByText('500')).toBeInTheDocument();
		expect(screen.getByText('250')).toBeInTheDocument();
		expect(screen.getByText('50%')).toBeInTheDocument();
	});

	it('shows error state', () => {
		mockedUseOverview.mockReturnValue({
			data: undefined,
			isLoading: false,
			error: new Error('Failed to fetch'),
		} as ReturnType<typeof useOverview>);

		renderDashboard();

		expect(screen.getByText('Failed to load dashboard data.')).toBeInTheDocument();
	});
});
