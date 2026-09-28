# GitHub Analytics Pipeline

An end-to-end data pipeline that extracts issues and pull requests from the GitHub API, loads them into PostgreSQL, transforms them with dbt, and orchestrates the workflow with Dagster. Processed analytics are exposed through a FastAPI backend and visualized in a React dashboard.

## Architecture

```text
                         GitHub API
                             │
                             ▼
                    ┌─────────────────┐
                    │   Python ETL    │
                    │                 │
                    │ Extract         │
                    │ Transform       │
                    │ Load            │
                    └────────┬────────┘
                             │
                             ▼
                       PostgreSQL
                             │
                             ▼
                    ┌─────────────────┐
                    │      dbt        │
                    │                 │
                    │ Staging models  │
                    │ Analytics       │
                    │ Tests           │
                    │ Snapshots       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │     Dagster     │
                    │                 │
                    │ Orchestration   │
                    │ Scheduling      │
                    │ Asset lineage   │
                    └────────┬────────┘
                             │
                             ▼
                       FastAPI API
                             │
                             ▼
                      React Dashboard
```

## Features

- Incremental extraction from the GitHub REST API using a PostgreSQL watermark, with a 1-minute overlap to avoid missing records updated at the extraction boundary
- Handles issues, pull requests, contributors, and labels; paginates through the full API response
- dbt staging + analytics models (PR merge rate, monthly activity, contributor and label metrics), snapshots for historical issue tracking, and data quality tests
- Dagster orchestrates the ETL and dbt workflow as a single asset graph, with a daily schedule and run monitoring
- FastAPI backend exposing the analytics, visualized in a React dashboard (KPI cards, issues-over-time, monthly PR activity, contributor and label charts)

## Tech Stack

**Ingestion:** Python, Requests, PostgreSQL, psycopg2, python-dotenv
**Transformation:** dbt Core, dbt-postgres
**Orchestration:** Dagster, dagster-dbt
**Backend:** FastAPI, Uvicorn
**Testing:** Pytest, dbt tests
**Frontend:** React, TypeScript, Vite

## Project Structure

```text
github-analytics-pipeline/
├── src/                  # extraction, transform, load
├── orchestration/        # Dagster assets, schedules, definitions
├── dbt/                  # models, snapshots, tests
├── backend/              # FastAPI app
├── frontend/             # React + TypeScript dashboard
├── requirements.txt
└── .env
```

## How It Works

**Extraction & incremental loading:** the pipeline queries `facebook/react` issues/PRs from the GitHub API, using the last successful run's timestamp (minus a 1-minute buffer) as the `since` filter. This means only recently changed data is pulled on each run, instead of reloading the full repository history every time. The watermark is stored in a `pipeline_state` table and only advances after a successful load.

**Transformation (dbt):** staging models clean and standardize the raw tables; analytics models compute metrics like PR merge rate and contributor activity; a snapshot tracks how issues change over time; dbt tests validate key assumptions (uniqueness, required fields, relationships, metric bounds).

**Orchestration (Dagster):** the ETL step and dbt models are represented as a single Dagster asset graph (`github_issues` → `github_dbt_assets`), giving lineage visibility and run history in the Dagster UI, with a daily schedule (`daily_github_analytics`).

## Running the Project

```bash
git clone <repository-url>
cd github-analytics-pipeline
python -m venv .venv && .venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Create a `.env` file:
```env
GITHUB_TOKEN=your_github_token
DB_HOST=localhost
DB_PORT=5432
DB_NAME=github_analytics
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
```

Then:
```bash
cd dbt && dbt debug && dbt build && cd ..   # verify connection, run models + tests
dagster dev -f orchestration/definitions.py # open http://127.0.0.1:3000
```

Run the dashboard:
```bash
cd frontend
npm install
npm run dev
```

## Testing

```bash
pytest              # Python tests
cd dbt && dbt test  # dbt tests (or `dbt build` to run models + tests together)
```
