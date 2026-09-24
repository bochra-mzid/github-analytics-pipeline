from fastapi import APIRouter
from app.database import get_connection

router = APIRouter(prefix="/api/metrics", tags=["Metrics"])

def execute_query(query, params=None):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(query, params)
            return cursor.fetchall()
    finally:
        connection.close()


@router.get("/overview")
def get_pr_merge_rate():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT
                    total_prs,
                    merged_prs,
                    merge_rate
                FROM analytics.pr_merge_rate
            """)

            row = cursor.fetchone()

            cursor.execute("""
                SELECT COUNT(*)
                FROM analytics.fct_issues
            """)

            total_issues = cursor.fetchone()[0]

        return {
            "total_issues": total_issues,
            "total_prs": row[0],
            "merged_prs": row[1],
            "merge_rate": float(row[2]),
        }

    finally:
        connection.close()

@router.get("/issues-over-time")
def get_issues_over_time():
    rows = execute_query("""
        SELECT
            DATE_TRUNC('month', created_at) AS month,
            COUNT(*) FILTER (WHERE NOT is_pull_request) AS issues,
            COUNT(*) FILTER (WHERE is_pull_request) AS prs
        FROM analytics.fct_issues
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month
    """)

    return [
        {
            "month": row[0].strftime("%Y-%m"),
            "issues": row[1],
            "prs": row[2],
        }
        for row in rows
    ]

@router.get("/issues-by-state")
def get_issues_by_state():
    rows = execute_query("""
        SELECT
            state,
            COUNT(*) AS count
        FROM analytics.fct_issues
        WHERE NOT is_pull_request
        GROUP BY state
        ORDER BY count DESC
    """)

    return [
        {
            "state": row[0],
            "count": row[1],
        }
        for row in rows
    ]

@router.get("/labels")
def get_label_usage():
    rows = execute_query("""
        SELECT
            label,
            usage_count
        FROM analytics.label_usage
        ORDER BY usage_count DESC
    """)

    return [
        {
            "label": row[0],
            "count": row[1],
        }
        for row in rows
    ]

@router.get("/contributors")
def get_contributors():
    rows = execute_query("""
        SELECT
            login,
            total_created,
            prs_created,
            issues_created,
            prs_merged
        FROM analytics.contributor_metrics
        ORDER BY total_created DESC
    """)

    return [
        {
            "login": row[0],
            "total_created": row[1],
            "prs_created": row[2],
            "issues_created": row[3],
            "prs_merged": row[4],
        }
        for row in rows
    ]

@router.get("/monthly-prs")
def get_monthly_prs():
    rows = execute_query("""
        SELECT
            month,
            total_prs,
            merged_prs
        FROM analytics.monthly_pr_metrics
        ORDER BY month
    """)

    return [
        {
            "month": row[0].strftime("%Y-%m"),
            "total_prs": row[1],
            "merged_prs": row[2],
        }
        for row in rows
    ]