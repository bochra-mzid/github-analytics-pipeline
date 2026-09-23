{{ config(materialized='view') }}

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
FROM {{ source('github', 'issues') }}