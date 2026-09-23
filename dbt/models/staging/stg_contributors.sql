{{ config(materialized='view') }}

SELECT
    id,
    login
FROM {{ source('github', 'contributors') }}