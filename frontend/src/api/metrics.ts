const API_URL = import.meta.env.VITE_API_URL;

export interface Overview {
	total_issues: number;
	total_prs: number;
	merged_prs: number;
	merge_rate: number;
}

export interface IssuesOverTime {
	month: string;
	issues: number;
	prs: number;
}

export interface IssuesByState {
	state: string;
	count: number;
}

export interface LabelUsage {
	label: string;
	count: number;
}

export interface Contributor {
	login: string;
	total_created: number;
	prs_created: number;
	issues_created: number;
	prs_merged: number;
}

export interface MonthlyPRs {
	month: string;
	total_prs: number;
	merged_prs: number;
}

async function fetchApi<T>(endpoint: string): Promise<T> {
	const response = await fetch(`${API_URL}${endpoint}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${endpoint}`);
	}

	return response.json();
}

export function getOverview() {
	return fetchApi<Overview>('/overview');
}

export function getIssuesOverTime() {
	return fetchApi<IssuesOverTime[]>('/issues-over-time');
}

export function getIssuesByState() {
	return fetchApi<IssuesByState[]>('/issues-by-state');
}

export function getLabelUsage() {
	return fetchApi<LabelUsage[]>('/labels');
}

export function getContributors() {
	return fetchApi<Contributor[]>('/contributors');
}

export function getMonthlyPRs() {
	return fetchApi<MonthlyPRs[]>('/monthly-prs');
}
