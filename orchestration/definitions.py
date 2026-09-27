from dagster import Definitions, ScheduleDefinition, define_asset_job

from orchestration.assets import github_issues
from orchestration.dbt_assets import github_dbt_assets, dbt

github_analytics_job = define_asset_job(
    name="github_analytics_job",
    selection=[
        github_issues,
        github_dbt_assets,
    ],
)

daily_schedule = ScheduleDefinition(
    name="daily_github_analytics",
    job=github_analytics_job,
    cron_schedule="0 2 * * *",
)

defs = Definitions(
    assets=[
        github_issues,
        github_dbt_assets,
    ],
    resources={
        "dbt": dbt,
    },
    jobs=[
        github_analytics_job,
    ],
    schedules=[
        daily_schedule,
    ],
)