SELECT *
FROM {{ ref('monthly_pr_metrics') }}
WHERE merged_prs > total_prs