import os
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

from database import (
    get_connection,
    insert_issues,
    get_last_updated_at,
    update_last_updated_at,
    insert_labels,
    insert_issue_labels,
    insert_contributors,
)


def parse_github_timestamp(timestamp):
    if timestamp is None:
        return None

    return datetime.fromisoformat(timestamp.replace("Z", "+00:00"))


load_dotenv()

github_token = os.getenv("GITHUB_TOKEN")

headers = {
    "Authorization": f"Bearer {github_token}",
    "Accept": "application/vnd.github+json",
}

# EXTRACT
last_updated_at = get_last_updated_at()
extraction_started_at = datetime.now(timezone.utc)

page = 1
all_issues = []

while True:
    if last_updated_at:
        since = last_updated_at - timedelta(minutes=1)

        url = (
            f"https://api.github.com/repos/facebook/react/issues"
            f"?state=all&per_page=100&page={page}"
            f"&since={since.isoformat()}"
        )
    else:
        url = (
            f"https://api.github.com/repos/facebook/react/issues"
            f"?state=all&per_page=100&page={page}"
        )

    print(f"Requesting: {url}")

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        raise Exception(
            f"Error fetching issues: {response.status_code}"
        )
    issues = response.json()
    all_issues.extend(issues)

    if len(issues) < 100:
        break

    page += 1

# TRANSFORM
clean_issues = []
issue_labels = []
contributors = []

for issue in all_issues:
    clean_issue = {
        "id": issue["id"],
        "number": issue["number"],
        "title": issue["title"],
        "state": issue["state"],
        "created_at": parse_github_timestamp(issue["created_at"]),
        "updated_at": parse_github_timestamp(issue["updated_at"]),
        "closed_at": parse_github_timestamp(issue["closed_at"]),
        "author_id": issue["user"]["id"],
        "comments": issue["comments"],
        "is_pull_request": "pull_request" in issue,
        "merged_at": (
            parse_github_timestamp(issue["pull_request"]["merged_at"])
            if "pull_request" in issue
            else None
        ),
        "closed_by": (
            issue["closed_by"]["login"]
            if issue["closed_by"]
            else None
        ),
    }

    clean_issues.append(clean_issue)

    for label in issue["labels"]:
        issue_labels.append({
            "issue_id": issue["id"],
            "label_id": label["id"],
            "label_name": label["name"],
        })

    contributors.append({
        "id": issue["user"]["id"],
        "login": issue["user"]["login"],
    })

# LOAD
connection = get_connection()
try:
    insert_contributors(connection, contributors)
    insert_issues(connection, clean_issues)
    insert_labels(connection, issue_labels)
    issue_ids = [issue["id"] for issue in clean_issues]
    insert_issue_labels(connection, issue_ids, issue_labels)
    connection.commit()

except Exception:
    connection.rollback()
    raise

finally:
    connection.close()

# UPDATE WATERMARK
update_last_updated_at(extraction_started_at)


print(f"Total issues fetched: {len(all_issues)}")
print(f"Processed {len(clean_issues)} issues")
print(f"Processed {len(issue_labels)} issue-label relationships")
print("Pipeline state updated!")