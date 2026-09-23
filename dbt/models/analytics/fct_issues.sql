{{ config(
    materialized='incremental',
    unique_key='id',
    incremental_strategy='merge'
) }}

SELECT
    id,
    number,
    title,
    state,
    created_at,
    updated_at,
    closed_at,
    author_id,
    comments,
    closed_by,
    is_pull_request,
    merged_at
FROM {{ ref('stg_issues') }}

{% if is_incremental() %}
WHERE updated_at >= (
    SELECT MAX(updated_at) - INTERVAL '5 minutes'
    FROM {{ this }}
)
{% endif %}