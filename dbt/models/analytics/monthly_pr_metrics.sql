{{ config(materialized='table') }}

SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_prs,
    COUNT(merged_at) AS merged_prs
FROM {{ ref('stg_issues') }}
WHERE is_pull_request = true
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month