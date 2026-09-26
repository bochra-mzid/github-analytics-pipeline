import { useQuery } from '@tanstack/react-query';

import {
	getContributors,
	getIssuesByState,
	getIssuesOverTime,
	getLabelUsage,
	getMonthlyPRs,
	getOverview,
} from '../api/metrics';

export function useOverview() {
	return useQuery({
		queryKey: ['overview'],
		queryFn: getOverview,
	});
}

export function useIssuesOverTime() {
	return useQuery({
		queryKey: ['issues-over-time'],
		queryFn: getIssuesOverTime,
	});
}

export function useIssuesByState() {
	return useQuery({
		queryKey: ['issues-by-state'],
		queryFn: getIssuesByState,
	});
}

export function useLabelUsage() {
	return useQuery({
		queryKey: ['labels'],
		queryFn: getLabelUsage,
	});
}

export function useContributors() {
	return useQuery({
		queryKey: ['contributors'],
		queryFn: getContributors,
	});
}

export function useMonthlyPRs() {
	return useQuery({
		queryKey: ['monthly-prs'],
		queryFn: getMonthlyPRs,
	});
}
