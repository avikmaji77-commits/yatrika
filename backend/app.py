try:
    from .app_complete import app, FLASK_DEBUG, logger
except ImportError:
    from app_complete import app, FLASK_DEBUG, logger

if __name__ == '__main__':
    logger.info('Starting Yatrika backend...')
    app.run(host='0.0.0.0', port=5000, debug=FLASK_DEBUG)
