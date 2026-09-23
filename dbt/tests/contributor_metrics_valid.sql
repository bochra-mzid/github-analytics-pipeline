SELECT *
FROM {{ ref('contributor_metrics') }}
WHERE prs_merged > prs_created