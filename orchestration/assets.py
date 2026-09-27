
from dagster import asset

from src.ingestion import run_pipeline

@asset
def github_issues():
    run_pipeline()