{{ config(materialized='view') }}

SELECT
    id,
    name
FROM {{ source('github', 'labels') }}