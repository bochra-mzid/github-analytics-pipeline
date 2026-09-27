from pathlib import Path

from dagster import AssetKey
from dagster_dbt import (
    DagsterDbtTranslator,
    DbtCliResource,
    dbt_assets,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DBT_PROJECT_DIR = PROJECT_ROOT / "dbt"

class GithubDbtTranslator(DagsterDbtTranslator):

    def get_asset_key(self, dbt_resource_props):
        if (
            dbt_resource_props["resource_type"] == "source"
            and dbt_resource_props["source_name"] == "github"
        ):
            table_name = dbt_resource_props["name"]

            if table_name == "issues":
                return AssetKey(["github_issues"])

        return super().get_asset_key(dbt_resource_props)


dbt = DbtCliResource(
    project_dir=DBT_PROJECT_DIR,
)


@dbt_assets(
    manifest=DBT_PROJECT_DIR / "target" / "manifest.json",
    dagster_dbt_translator=GithubDbtTranslator(),
)
def github_dbt_assets(context, dbt: DbtCliResource):
    yield from dbt.cli(["build"], context=context).stream()