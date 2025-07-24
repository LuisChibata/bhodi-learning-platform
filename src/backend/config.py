"""
Configuration settings for Bhodi Learning Platform Backend
"""
import os
import secrets

class Config:
    """Base configuration"""
    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)
    DEBUG = False
    TESTING = False
    
    # CORS configuration - will be set in __init__
    CORS_ORIGINS = ['*']  # Default fallback
    
    # Code execution settings
    EXECUTION_TIMEOUT = int(os.environ.get('EXECUTION_TIMEOUT', '10'))
    MAX_CODE_LENGTH = int(os.environ.get('MAX_CODE_LENGTH', '10000'))
    MAX_OUTPUT_LENGTH = int(os.environ.get('MAX_OUTPUT_LENGTH', '50000'))
    
    # Security settings
    ENABLE_CODE_EXECUTION = os.environ.get('ENABLE_CODE_EXECUTION', 'true').lower() == 'true'
    
    # Logging
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    CORS_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000', 'https://bhodi-coding-plataform.netlify.app']
    LOG_LEVEL = 'DEBUG'

# Helper function to get CORS origins with smart fallback
def _get_production_cors_origins():
    """Get CORS origins with smart fallback logic"""
    # Try environment variable first
    env_origins = os.environ.get('CORS_ORIGINS')
    if env_origins and env_origins.strip() and env_origins != '*':
        origins = [origin.strip() for origin in env_origins.split(',')]
        # Ensure our Netlify domain is always included
        netlify_domain = 'https://bhodi-coding-plataform.netlify.app'
        if netlify_domain not in origins:
            origins.append(netlify_domain)
        return origins
    
    # Fallback to hard-coded production domains if env var fails
    return [
        'https://bhodi-coding-plataform.netlify.app',  # Current Netlify site
        'https://luischibata.com',
        'https://learn.luischibata.com', 
        'https://bhodi.luischibata.com'
    ]

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    CORS_ORIGINS = _get_production_cors_origins()
    
    # Enhanced security for production
    EXECUTION_TIMEOUT = int(os.environ.get('EXECUTION_TIMEOUT', '5'))  # Shorter timeout in prod
    MAX_CODE_LENGTH = int(os.environ.get('MAX_CODE_LENGTH', '5000'))   # Smaller limit in prod

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    CORS_ORIGINS = ['http://localhost:8000']
    ENABLE_CODE_EXECUTION = False  # Disable code execution in tests

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get the appropriate configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default']) 