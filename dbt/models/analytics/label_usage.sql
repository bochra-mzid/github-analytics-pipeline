{{ config(materialized='table') }}

SELECT
    l.name AS label,
    COUNT(*) AS usage_count
FROM {{ ref('stg_issue_labels') }} il
JOIN {{ ref('stg_labels') }} l
    ON il.label_id = l.id
GROUP BY l.name
ORDER BY usage_count DESC