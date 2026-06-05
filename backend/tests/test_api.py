import json
import pytest

from backend import app as backend_app


@pytest.fixture
def client():
    backend_app.app.testing = True
    with backend_app.app.test_client() as client:
        yield client


def test_health(client):
    resp = client.get('/health')
    assert resp.status_code == 200
    data = resp.get_json()
    assert data.get('status') == 'ok'


def test_meta(client):
    resp = client.get('/api/meta')
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, dict)
    assert 'categories' in data and 'seasons' in data and 'budgets' in data


def test_destinations_list(client):
    resp = client.get('/api/destinations')
    assert resp.status_code == 200
    data = resp.get_json()
    assert isinstance(data, dict)
    assert 'data' in data
    assert isinstance(data['data'], list)
