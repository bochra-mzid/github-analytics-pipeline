from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_overview():
    response = client.get("/api/metrics/overview")

    assert response.status_code == 200

    data = response.json()

    assert "total_issues" in data
    assert "total_prs" in data
    assert "merged_prs" in data
    assert "merge_rate" in data

def test_get_issues_over_time():
    response = client.get("/api/metrics/issues-over-time")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    if data:
        assert "month" in data[0]
        assert "issues" in data[0]
        assert "prs" in data[0]


def test_get_issues_by_state():
    response = client.get("/api/metrics/issues-by-state")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    if data:
        assert "state" in data[0]
        assert "count" in data[0]


def test_get_labels():
    response = client.get("/api/metrics/labels")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    if data:
        assert "label" in data[0]
        assert "count" in data[0]


def test_get_contributors():
    response = client.get("/api/metrics/contributors")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    if data:
        assert "login" in data[0]
        assert "total_created" in data[0]
        assert "prs_created" in data[0]
        assert "issues_created" in data[0]
        assert "prs_merged" in data[0]


def test_get_monthly_prs():
    response = client.get("/api/metrics/monthly-prs")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)

    if data:
        assert "month" in data[0]
        assert "total_prs" in data[0]
        assert "merged_prs" in data[0]