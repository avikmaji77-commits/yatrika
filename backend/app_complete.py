import io
from typing import List, Optional

import pandas as pd
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from sqlalchemy.orm import Session

from backend.config import (
    API_DEFAULT_PAGE_SIZE,
    API_MAX_RESULTS,
    CORS_ORIGINS,
    FLASK_DEBUG,
    SECRET_KEY,
)
from backend.database import SessionLocal, init_db
from backend.import_csv import import_csv
from backend.logger import logger
from backend.models import Destination
import os
import json
import time
import hmac
import hashlib

# Simple file-backed storage for users and wishlists to avoid DB schema changes
USERS_FILE = os.path.join(os.path.dirname(__file__), 'users.json')
WISHLISTS_FILE = os.path.join(os.path.dirname(__file__), 'wishlists.json')


def _read_json_file(path):
    try:
        if not os.path.exists(path):
            return {}
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f) or {}
    except Exception:
        return {}


def _write_json_file(path, data):
    tmp = f"{path}.tmp"
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, path)


def make_token(email: str) -> str:
    ts = str(int(time.time()))
    payload = f"{email}|{ts}"
    sig = hmac.new(SECRET_KEY.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
    token = f"{payload}|{sig}"
    return token


def verify_token(token: str, max_age: int = 60 * 60 * 24 * 7) -> Optional[str]:
    try:
        parts = token.split('|')
        if len(parts) != 3:
            return None
        email, ts, sig = parts
        payload = f"{email}|{ts}"
        expected = hmac.new(SECRET_KEY.encode('utf-8'), payload.encode('utf-8'), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected, sig):
            return None
        if int(time.time()) - int(ts) > max_age:
            return None
        return email
    except Exception:
        return None


app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app, resources={r'/api/*': {'origins': CORS_ORIGINS}})


def ensure_database_seeded():
    db = SessionLocal()
    try:
        if db.query(Destination).count() == 0:
            logger.info('No destinations found; importing CSV seed data...')
            import_csv()
    except Exception as exc:
        logger.error('Failed to auto-import destination data: %s', exc)
    finally:
        db.close()


init_db()
ensure_database_seeded()
logger.info('Application initialized')


def parse_int(value: Optional[str], default: Optional[int] = None, min_value: Optional[int] = None, max_value: Optional[int] = None) -> Optional[int]:
    if value is None:
        return default
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        raise ValueError('Expected integer value')
    if min_value is not None and parsed < min_value:
        raise ValueError('Value is below minimum')
    if max_value is not None and parsed > max_value:
        raise ValueError('Value is above maximum')
    return parsed


def parse_float(value: Optional[str], default: Optional[float] = None, min_value: Optional[float] = None, max_value: Optional[float] = None) -> Optional[float]:
    if value is None:
        return default
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        raise ValueError('Expected numeric value')
    if min_value is not None and parsed < min_value:
        raise ValueError('Value is below minimum')
    if max_value is not None and parsed > max_value:
        raise ValueError('Value is above maximum')
    return parsed


def normalize_text(value: Optional[str]) -> Optional[str]:
    return value.strip() if isinstance(value, str) and value.strip() else None


def validate_filter_params(args):
    category = normalize_text(args.get('category'))
    budget = normalize_text(args.get('budget'))
    season = normalize_text(args.get('season'))
    search = normalize_text(args.get('search'))
    min_rating = parse_float(args.get('min_rating'), default=None, min_value=0.0, max_value=5.0)
    max_rating = parse_float(args.get('max_rating'), default=None, min_value=0.0, max_value=5.0)
    limit = parse_int(args.get('limit'), default=API_DEFAULT_PAGE_SIZE, min_value=1, max_value=API_MAX_RESULTS)
    offset = parse_int(args.get('offset'), default=0, min_value=0)

    return {
        'category': category,
        'budget': budget,
        'season': season,
        'search': search,
        'min_rating': min_rating,
        'max_rating': max_rating,
        'limit': limit,
        'offset': offset,
    }


def validate_recommend_payload(data):
    if not isinstance(data, dict):
        raise ValueError('Request body must be a JSON object')

    interests = data.get('interests', [])
    if interests is None:
        interests = []
    if not isinstance(interests, list) or any(not isinstance(item, str) for item in interests):
        raise ValueError('interests must be a list of strings')

    budget = normalize_text(data.get('budget'))
    season = normalize_text(data.get('season'))

    return {
        'interests': [item.lower().strip() for item in interests if isinstance(item, str) and item.strip()],
        'budget': budget.lower() if budget else None,
        'season': season.lower() if season else None,
    }


def validate_chat_payload(data):
    if not isinstance(data, dict):
        raise ValueError('Request body must be a JSON object')
    message = normalize_text(data.get('message'))
    if not message:
        raise ValueError('message is required')
    return {'message': message}


def validate_export_payload(data):
    if not isinstance(data, dict):
        raise ValueError('Request body must be a JSON object')
    export_format = normalize_text(data.get('format')) or 'json'
    if export_format not in {'json', 'csv'}:
        raise ValueError('format must be json or csv')

    fields = data.get('fields')
    if fields is not None:
        if not isinstance(fields, list) or any(not isinstance(field, str) for field in fields):
            raise ValueError('fields must be a list of strings')
    category = normalize_text(data.get('category'))
    budget = normalize_text(data.get('budget'))
    season = normalize_text(data.get('season'))
    min_rating = parse_float(data.get('min_rating'), default=None, min_value=0.0, max_value=5.0)

    return {
        'format': export_format,
        'fields': fields,
        'category': category,
        'budget': budget,
        'season': season,
        'min_rating': min_rating,
    }


def get_destinations_df(db: Session = None) -> pd.DataFrame:
    if db is None:
        db = SessionLocal()
        close_db = True
    else:
        close_db = False

    try:
        destinations = db.query(Destination).all()
        data = [d.to_dict() for d in destinations]
        df = pd.DataFrame(data)
        if not df.empty:
            df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
            df['_id'] = df['_id'].astype(int)
        return df
    finally:
        if close_db:
            db.close()


def row_to_dict(row):
    if hasattr(row, 'to_dict'):
        return dict(row)
    return {
        '_id': int(row['_id']),
        'name': str(row['name']),
        'location': str(row['location']),
        'category': str(row['category']),
        'rating': float(row['rating']) if pd.notna(row['rating']) else 0.0,
        'budget': str(row['budget']),
        'season': str(row['season']),
        'description': str(row['description']),
    }


@app.route('/health', methods=['GET'])
def health():
    db = SessionLocal()
    try:
        count = db.query(Destination).count()
        return jsonify({'status': 'ok', 'destinations_loaded': count}), 200
    except Exception as exc:
        logger.error('Health check failed: %s', exc)
        return jsonify({'status': 'error', 'message': 'Database connection failed'}), 500
    finally:
        db.close()


@app.route('/api/meta', methods=['GET'])
def get_meta():
    try:
        db = SessionLocal()
        df = get_destinations_df(db)
        if df.empty:
            return jsonify({'categories': [], 'seasons': [], 'budgets': []}), 200
        return jsonify({
            'categories': sorted(df['category'].dropna().unique().tolist()),
            'seasons': sorted(df['season'].dropna().unique().tolist()),
            'budgets': sorted(df['budget'].dropna().unique().tolist()),
        }), 200
    except Exception as exc:
        logger.error('Error in /api/meta: %s', exc)
        return jsonify({'error': 'Failed to retrieve metadata'}), 500
    finally:
        db.close()


@app.route('/api/destinations', methods=['GET'])
def get_destinations():
    try:
        filters = validate_filter_params(request.args)
        db = SessionLocal()
        query = db.query(Destination)
        if filters['category']:
            query = query.filter(Destination.category.ilike(f"%{filters['category']}%"))
        if filters['budget']:
            query = query.filter(Destination.budget.ilike(f"%{filters['budget']}%"))
        if filters['season']:
            query = query.filter(Destination.season.ilike(f"%{filters['season']}%"))
        if filters['min_rating'] is not None:
            query = query.filter(Destination.rating >= filters['min_rating'])
        if filters['max_rating'] is not None:
            query = query.filter(Destination.rating <= filters['max_rating'])
        if filters['search']:
            search_value = f"%{filters['search']}%"
            query = query.filter(
                (Destination.name.ilike(search_value)) |
                (Destination.location.ilike(search_value)) |
                (Destination.description.ilike(search_value))
            )
        total = query.count()
        destinations = query.offset(filters['offset']).limit(filters['limit']).all()
        result = [d.to_dict() for d in destinations]
        return jsonify({'data': result, 'total': total, 'limit': filters['limit'], 'offset': filters['offset']}), 200
    except ValueError as exc:
        logger.warning('Invalid filter parameters: %s', exc)
        return jsonify({'error': str(exc)}), 400
    except Exception as exc:
        logger.error('Error in /api/destinations: %s', exc)
        return jsonify({'error': 'Failed to retrieve destinations'}), 500
    finally:
        db.close()


@app.route('/api/destinations/<int:dest_id>', methods=['GET'])
def get_destination(dest_id):
    try:
        db = SessionLocal()
        destination = db.query(Destination).filter(Destination._id == dest_id).first()
        if not destination:
            return jsonify({'error': 'Destination not found'}), 404
        return jsonify(destination.to_dict()), 200
    except Exception as exc:
        logger.error('Error in /api/destinations/%s: %s', dest_id, exc)
        return jsonify({'error': 'Failed to retrieve destination'}), 500
    finally:
        db.close()


@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        db = SessionLocal()
        df = get_destinations_df(db)
        if df.empty:
            return jsonify({}), 200
        stats = {
            'total_destinations': int(len(df)),
            'avg_rating': round(float(df['rating'].mean()), 2),
            'median_rating': round(float(df['rating'].median()), 2),
            'min_rating': round(float(df['rating'].min()), 2),
            'max_rating': round(float(df['rating'].max()), 2),
            'top_rated': row_to_dict(df.loc[df['rating'].idxmax()]) if len(df) > 0 else {},
            'by_category': df.groupby('category')['rating'].agg(['mean', 'count']).round(2).to_dict(),
            'by_budget': df['budget'].value_counts().to_dict(),
            'by_season': df['season'].value_counts().to_dict(),
            'rating_distribution': df['rating'].value_counts().sort_index().to_dict(),
        }
        return jsonify(stats), 200
    except Exception as exc:
        logger.error('Error in /api/stats: %s', exc)
        return jsonify({'error': 'Failed to retrieve statistics'}), 500
    finally:
        db.close()


@app.route('/api/trending', methods=['GET'])
def get_trending():
    try:
        db = SessionLocal()
        df = get_destinations_df(db)
        if df.empty:
            return jsonify({'by_season': {}, 'by_category': {}}), 200
        by_season = {}
        for season in df['season'].dropna().unique():
            season_df = df[df['season'] == season].nlargest(5, 'rating')
            by_season[season] = [row_to_dict(r) for _, r in season_df.iterrows()]
        by_category = {}
        for category in df['category'].dropna().unique():
            cat_df = df[df['category'] == category].nlargest(5, 'rating')
            by_category[category] = [row_to_dict(r) for _, r in cat_df.iterrows()]
        return jsonify({'by_season': by_season, 'by_category': by_category}), 200
    except Exception as exc:
        logger.error('Error in /api/trending: %s', exc)
        return jsonify({'error': 'Failed to retrieve trending'}), 500
    finally:
        db.close()


@app.route('/api/recommend', methods=['POST'])
def recommend():
    try:
        payload = validate_recommend_payload(request.get_json() or {})
        db = SessionLocal()
        df = get_destinations_df(db)
        if df.empty:
            return jsonify([]), 200
        recommendations = []
        for _, row in df.iterrows():
            score = 0.0
            reasons = []
            cat = str(row['category']).lower()
            desc = str(row['description']).lower()
            name = str(row['name']).lower()
            hits = sum(1 for interest in payload['interests'] if interest in cat or interest in desc or interest in name)
            if hits:
                score += hits * 3.0
                reasons.append(f'Matches {hits} interest(s)')
            if payload['budget'] and str(row['budget']).lower() == payload['budget']:
                score += 2.0
                reasons.append('Matches your budget')
            if payload['season'] and str(row['season']).lower() == payload['season']:
                score += 2.0
                reasons.append(f'Best in {row["season"]}')
            rating = row['rating']
            if pd.notna(rating):
                score += float(rating) * 0.5
            match_pct = min(100, int((score / 9.5) * 100))
            if match_pct < 45 and pd.notna(rating):
                match_pct = max(match_pct, int(float(rating) * 16))
            rec = row_to_dict(row)
            rec['match_pct'] = match_pct
            rec['reasons'] = reasons
            recommendations.append(rec)
        recommendations.sort(key=lambda x: (x['match_pct'], x['rating']), reverse=True)
        logger.info('Generated %s recommendations', len(recommendations[:8]))
        return jsonify(recommendations[:8]), 200
    except ValueError as exc:
        logger.warning('Invalid recommendation request: %s', exc)
        return jsonify({'error': str(exc)}), 400
    except Exception as exc:
        logger.error('Error in /api/recommend: %s', exc)
        return jsonify({'error': 'Failed to generate recommendations'}), 500
    finally:
        db.close()


@app.route('/api/search', methods=['POST'])
def search():
    try:
        data = request.get_json() or {}
        query_text = normalize_text(data.get('query'))
        if not query_text or len(query_text) < 2:
            return jsonify({'error': 'Search query must be at least 2 characters'}), 400
        db = SessionLocal()
        df = get_destinations_df(db)
        if df.empty:
            return jsonify([]), 200
        results = []
        words = query_text.split()
        for _, row in df.iterrows():
            text = f"{row['name']} {row['location']} {row['category']} {row['description']}".lower()
            score = 0
            if query_text == row['name'].lower():
                score += 100
            elif query_text in row['name'].lower():
                score += 50
            else:
                score += sum(10 for word in words if word in text)
            if score > 0:
                rec = row_to_dict(row)
                rec['relevance_score'] = score
                results.append(rec)
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        logger.info("Search '%s' returned %s results", query_text, len(results))
        return jsonify(results[:20]), 200
    except Exception as exc:
        logger.error('Error in /api/search: %s', exc)
        return jsonify({'error': 'Search failed'}), 500
    finally:
        db.close()


@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        payload = validate_chat_payload(request.get_json() or {})
        db = SessionLocal()
        df = get_destinations_df(db)
        if df.empty:
            return jsonify({'response': 'My database is currently unavailable. Please try again!'}), 200
        msg = payload['message'].lower()
        keyword_map = {
            'beach': ['beach', 'sea', 'ocean', 'coast', 'sand', 'island'],
            'hill station': ['hill', 'mountain', 'tea garden', 'cold', 'valley', 'snow', 'misty'],
            'historical': ['history', 'monument', 'fort', 'palace', 'heritage', 'ancient', 'museum'],
            'nature': ['nature', 'lake', 'waterfall', 'forest', 'backwater', 'green', 'scenic'],
            'adventure': ['adventure', 'trek', 'ski', 'raft', 'climb', 'sport', 'expedition'],
            'religious': ['temple', 'pilgrimage', 'holy', 'spiritual', 'church', 'sacred', 'god'],
            'wildlife': ['wildlife', 'safari', 'tiger', 'jungle', 'national park', 'rhino', 'animal'],
            'city': ['city', 'shopping', 'nightlife', 'culture', 'food', 'urban'],
            'desert': ['desert', 'sand dune', 'dune', 'salt', 'camel'],
        }
        matched_cats = [cat for cat, terms in keyword_map.items() if any(term in msg for term in terms)]
        budget_hint = 'low' if any(word in msg for word in ['cheap', 'budget', 'affordable', 'low cost', 'low budget']) else 'high' if any(word in msg for word in ['luxury', 'premium', 'high end', 'expensive']) else None
        season_hint = next((season for season in ['winter', 'summer', 'monsoon', 'spring'] if season in msg), None)
        exact = [row for _, row in df.iterrows() if str(row['name']).lower() in msg or str(row['location']).lower() in msg]
        if exact:
            r = exact[0]
            reply = (
                f"**{r['name']}** ({r['location']}) sounds like a great pick! 🌟\n"
                f"It's a {r['category']} destination rated **{r['rating']}/5.0**.\n"
                f"{r['description']} Best visited in **{r['season']}** on a **{r['budget']}** budget."
            )
            if len(exact) > 1:
                others = ', '.join(str(x['name']) for x in exact[1:3])
                reply += f"\n\nYou might also like: **{others}**."
            logger.info('Chat matched exact destination: %s', r['name'])
            return jsonify({'response': reply}), 200
        if matched_cats:
            pool = df[df['category'].str.lower().isin([c.lower() for c in matched_cats])].copy()
            if budget_hint:
                filtered = pool[pool['budget'].str.lower() == budget_hint]
                pool = filtered if not filtered.empty else pool
            if season_hint:
                filtered = pool[pool['season'].str.lower() == season_hint]
                pool = filtered if not pool.empty else pool
            top = pool.sort_values('rating', ascending=False).head(3)
            if not top.empty:
                picks = [f"**{r['name']}** ({r['location']}, ⭐{r['rating']})" for _, r in top.iterrows()]
                reply = (
                    f"Great choice! For a **{', '.join(matched_cats)}** getaway, I recommend:\n\n"
                    + "\n".join(f"• {p}" for p in picks)
                    + f"\n\n{top.iloc[0]['description']}"
                )
                logger.info('Chat suggested category: %s', matched_cats)
                return jsonify({'response': reply}), 200
        words = [w for w in msg.split() if len(w) > 3]
        hits = []
        for _, row in df.iterrows():
            text = f"{row['name']} {row['location']} {row['category']} {row['description']}".lower()
            score = sum(1 for w in words if w in text)
            if score > 0:
                hits.append((score, row))
        if hits:
            hits.sort(key=lambda item: (item[0], item[1]['rating']), reverse=True)
            r = hits[0][1]
            reply = (
                f"Based on your message, you might love **{r['name']}** in {r['location']} ⭐{r['rating']}/5.0.\n"
                f"{r['description']} — best in **{r['season']}** on a **{r['budget']}** budget."
            )
            logger.info('Chat fallback search matched: %s', r['name'])
            return jsonify({'response': reply}), 200
        response = (
            "I'd love to help plan your trip! 🌍\n"
            "Tell me what you enjoy — beaches, mountains, history, wildlife, or adventure? "
            "You can also mention a budget (Low / Medium / High) or a season (Winter / Summer / Monsoon)."
        )
        return jsonify({'response': response}), 200
    except ValueError as exc:
        logger.warning('Invalid chat request: %s', exc)
        return jsonify({'error': str(exc)}), 400
    except Exception as exc:
        logger.error('Error in /api/chat: %s', exc)
        return jsonify({'error': 'Chat service unavailable'}), 500
    finally:
        db.close()


@app.route('/api/export', methods=['POST'])
def export_data():
    try:
        payload = validate_export_payload(request.get_json() or {})
        db = SessionLocal()
        query = db.query(Destination)
        if payload['category']:
            query = query.filter(Destination.category.ilike(f"%{payload['category']}%"))
        if payload['budget']:
            query = query.filter(Destination.budget.ilike(f"%{payload['budget']}%"))
        if payload['season']:
            query = query.filter(Destination.season.ilike(f"%{payload['season']}%"))
        if payload['min_rating'] is not None:
            query = query.filter(Destination.rating >= payload['min_rating'])
        data_list = [d.to_dict() for d in query.all()]
        if not data_list:
            return jsonify({'error': 'No data to export'}), 404
        fields = [f for f in payload['fields'] if f in data_list[0]] if payload['fields'] else list(data_list[0].keys())
        filtered_data = [{k: v for k, v in item.items() if k in fields} for item in data_list]
        if payload['format'] == 'csv':
            df = pd.DataFrame(filtered_data)
            csv_buffer = io.StringIO()
            df.to_csv(csv_buffer, index=False)
            return send_file(
                io.BytesIO(csv_buffer.getvalue().encode()),
                mimetype='text/csv',
                as_attachment=True,
                download_name='destinations.csv'
            )
        return jsonify(filtered_data), 200
    except ValueError as exc:
        logger.warning('Invalid export request: %s', exc)
        return jsonify({'error': str(exc)}), 400
    except Exception as exc:
        logger.error('Error in /api/export: %s', exc)
        return jsonify({'error': 'Export failed'}), 500
    finally:
        db.close()


@app.route('/api/import', methods=['POST'])
def import_data():
    try:
        success = import_csv()
        if not success:
            return jsonify({'error': 'Import failed'}), 500
        return jsonify({'status': 'success', 'message': 'CSV imported successfully'}), 200
    except Exception as exc:
        logger.error('Error in /api/import: %s', exc)
        return jsonify({'error': 'Failed to import data'}), 500


@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    try:
        data = request.get_json() or {}
        email = normalize_text(data.get('email'))
        password = normalize_text(data.get('password'))
        if not email or not password:
            return jsonify({'error': 'email and password required'}), 400

        users = _read_json_file(USERS_FILE)
        # create user if missing (insecure: no real password hashing for prototype)
        if email not in users:
            users[email] = {
                'email': email,
                'name': email.split('@')[0],
                'created_at': int(time.time())
            }
            _write_json_file(USERS_FILE, users)

        token = make_token(email)
        return jsonify({'token': token, 'user': users[email]}), 200
    except Exception as exc:
        logger.error('Error in /api/auth/login: %s', exc)
        return jsonify({'error': 'Login failed'}), 500


def _get_auth_email():
    auth = request.headers.get('Authorization') or ''
    if auth.startswith('Bearer '):
        token = auth[len('Bearer '):].strip()
        return verify_token(token)
    return None


@app.route('/api/user/profile', methods=['GET'])
def user_profile():
    try:
        email = _get_auth_email()
        if not email:
            return jsonify({'error': 'Unauthorized'}), 401
        users = _read_json_file(USERS_FILE)
        return jsonify(users.get(email, {'email': email, 'name': email.split('@')[0]})), 200
    except Exception as exc:
        logger.error('Error in /api/user/profile: %s', exc)
        return jsonify({'error': 'Failed to fetch profile'}), 500


@app.route('/api/user/wishlist', methods=['GET', 'POST', 'DELETE'])
def user_wishlist():
    try:
        email = _get_auth_email()
        if not email:
            return jsonify({'error': 'Unauthorized'}), 401
        wishlists = _read_json_file(WISHLISTS_FILE)
        user_list = wishlists.get(email, [])

        if request.method == 'GET':
            return jsonify({'wishlist': user_list}), 200

        data = request.get_json() or {}
        item = data.get('item')
        if not item:
            return jsonify({'error': 'item is required'}), 400

        if request.method == 'POST':
            if item not in user_list:
                user_list.append(item)
                wishlists[email] = user_list
                _write_json_file(WISHLISTS_FILE, wishlists)
            return jsonify({'wishlist': user_list}), 200

        if request.method == 'DELETE':
            if item in user_list:
                user_list = [i for i in user_list if i != item]
                wishlists[email] = user_list
                _write_json_file(WISHLISTS_FILE, wishlists)
            return jsonify({'wishlist': user_list}), 200

    except Exception as exc:
        logger.error('Error in /api/user/wishlist: %s', exc)
        return jsonify({'error': 'Wishlist operation failed'}), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error('Internal server error: %s', error)
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    logger.info('Starting Yatrika backend...')
    app.run(host='0.0.0.0', port=5000, debug=FLASK_DEBUG)
