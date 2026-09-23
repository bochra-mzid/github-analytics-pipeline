{{ config(materialized='table') }}

SELECT
    c.login,
    COUNT(*) AS total_created,
    COUNT(*) FILTER (WHERE i.is_pull_request = true) AS prs_created,
    COUNT(*) FILTER (WHERE i.is_pull_request = false) AS issues_created,
    COUNT(*) FILTER (
        WHERE i.is_pull_request = true
        AND i.merged_at IS NOT NULL
    ) AS prs_merged
FROM {{ ref('stg_issues') }} i
JOIN {{ ref('stg_contributors') }} c
    ON i.author_id = c.id
GROUP BY c.login
ORDER BY total_created DESC