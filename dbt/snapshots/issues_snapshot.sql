{% snapshot issues_snapshot %}

{{
    config(
        target_schema='analytics',
        unique_key='id',
        strategy='timestamp',
        updated_at='updated_at'
    )
}}

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

{% endsnapshot %}