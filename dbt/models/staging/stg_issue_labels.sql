{{ config(materialized='view') }}

SELECT
    issue_id,
    label_id
FROM {{ source('github', 'issue_labels') }}