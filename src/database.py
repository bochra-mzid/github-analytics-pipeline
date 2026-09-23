import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

def insert_issues(connection, issues):
    cursor = connection.cursor()

    for issue in issues:
        cursor.execute("""
            INSERT INTO issues (
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
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id)
            DO UPDATE SET
                title = EXCLUDED.title,
                state = EXCLUDED.state,
                updated_at = EXCLUDED.updated_at,
                closed_at = EXCLUDED.closed_at,
                comments = EXCLUDED.comments,
                closed_by = EXCLUDED.closed_by,
                is_pull_request = EXCLUDED.is_pull_request,
                merged_at = EXCLUDED.merged_at,
                author_id = EXCLUDED.author_id;
        """, (
            issue["id"],
            issue["number"],
            issue["title"],
            issue["state"],
            issue["created_at"],
            issue["updated_at"],
            issue["closed_at"],
            issue["author_id"],
            issue["comments"],
            issue["closed_by"],
            issue["is_pull_request"],
            issue["merged_at"]
        ))

    cursor.close()

def get_last_updated_at():
    connection = psycopg2.connect(
        host="localhost",
        port=5432,
        database="github_analytics",
        user="postgres",
        password="postgres"
    )

    cursor = connection.cursor()
    cursor.execute("""
        SELECT last_updated_at
        FROM pipeline_state
        WHERE pipeline_name = 'github_issues'
    """)

    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result[0] if result else None

def update_last_updated_at(timestamp):
    connection = psycopg2.connect(
        host="localhost",
        port=5432,
        database="github_analytics",
        user="postgres",
        password="postgres"
    )

    cursor = connection.cursor()
    cursor.execute("""
        UPDATE pipeline_state
        SET last_updated_at = %s
        WHERE pipeline_name = 'github_issues'
    """, (timestamp,))

    connection.commit()
    cursor.close()
    connection.close()


def insert_labels(connection, labels):
    cursor = connection.cursor()

    for label in labels:
        cursor.execute("""
            INSERT INTO labels (id, name)
            VALUES (%s, %s)
            ON CONFLICT (id)
            DO UPDATE SET
                name = EXCLUDED.name;
        """, (
            label["label_id"],
            label["label_name"]
        ))

    cursor.close()

def insert_issue_labels(connection, issue_ids, issue_labels):
    cursor = connection.cursor()

    # Remove existing labels for the processed issues
    for issue_id in issue_ids:
        cursor.execute("""
            DELETE FROM issue_labels
            WHERE issue_id = %s;
        """, (issue_id,))

    # Insert the current labels
    for issue_label in issue_labels:
        cursor.execute("""
            INSERT INTO issue_labels (issue_id, label_id)
            VALUES (%s, %s)
            ON CONFLICT (issue_id, label_id)
            DO NOTHING;
        """, (
            issue_label["issue_id"],
            issue_label["label_id"]
        ))

    cursor.close()

def insert_contributors(connection, contributors):
    cursor = connection.cursor()

    for contributor in contributors:
        cursor.execute("""
            INSERT INTO contributors (id, login)
            VALUES (%s, %s)
            ON CONFLICT (id)
            DO UPDATE SET
                login = EXCLUDED.login;
        """, (
            contributor["id"],
            contributor["login"]
        ))

    cursor.close()