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
    
    # CORS configuration for production
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
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
    CORS_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000']
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    # Production CORS origins - update these with your actual domains
    CORS_ORIGINS = [
        'https://bhodi-coding-plataform.netlify.app',  # Current Netlify site
        'https://luischibata.com',
        'https://learn.luischibata.com',
        'https://bhodi.luischibata.com'
    ]
    
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