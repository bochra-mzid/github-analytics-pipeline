SELECT *
FROM {{ ref('label_usage') }}
WHERE usage_count < 0