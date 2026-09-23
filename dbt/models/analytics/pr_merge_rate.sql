{{ config(materialized='table') }}

SELECT
    COUNT(*) AS total_prs,
    COUNT(merged_at) AS merged_prs,
    ROUND(
        COUNT(merged_at)::numeric * 100.0 / COUNT(*)::numeric,
        2
    ) AS merge_rate
FROM {{ ref('stg_issues') }}
WHERE is_pull_request = true