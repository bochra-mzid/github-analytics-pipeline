SELECT *
FROM {{ ref('pr_merge_rate') }}
WHERE merge_rate < 0
   OR merge_rate > 100