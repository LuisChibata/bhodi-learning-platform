/**
 * API Communication Module
 * Handles environment detection and backend communication
 */

window.BhodiAPI = (function() {
    'use strict';
    
    // Environment detection and API configuration
    const ENVIRONMENT = {
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
        isProduction: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    };

    /**
     * Get the appropriate API base URL based on environment
     */
    function getApiBaseUrl() {
        // Debug logging
        console.log('🔍 Environment Detection Debug:');
        console.log('  Hostname:', ENVIRONMENT.hostname);
        console.log('  Protocol:', ENVIRONMENT.protocol);
        console.log('  Is Development:', ENVIRONMENT.isDevelopment);
        console.log('  Is Production:', ENVIRONMENT.isProduction);
        
        // Force production API for Netlify domains
        if (ENVIRONMENT.hostname.includes('netlify.app') || 
            ENVIRONMENT.hostname.includes('luischibata.com') ||
            ENVIRONMENT.isProduction) {
            
            const productionApiUrl = 'https://bhodi-learning-backend.fly.dev';
            console.log('🚀 Using Production API:', productionApiUrl);
            return productionApiUrl;
        }
        
        // Development mode
        const developmentApiUrl = 'http://localhost:5000';
        console.log('🔧 Using Development API:', developmentApiUrl);
        return developmentApiUrl;
    }

    // Set API base URL
    const API_BASE_URL = getApiBaseUrl();

    // Log environment information
    console.log(`🌍 Environment: ${ENVIRONMENT.isDevelopment ? 'Development' : 'Production'}`);
    console.log(`🔗 API URL: ${API_BASE_URL}`);
    console.log(`🏠 Hostname: ${ENVIRONMENT.hostname}`);

    /**
     * Test backend connection
     */
    async function testBackendConnection() {
        try {
            console.log('🔍 Testing backend connection...');
            const response = await fetch(`${API_BASE_URL}/health`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Backend connection successful:', data);
            
            return {
                status: 'success',
                message: 'Backend connected successfully',
                data: data
            };
        } catch (error) {
            console.error('❌ Backend connection failed:', error);
            return {
                status: 'error',
                message: `Backend connection failed: ${error.message}`,
                error: error
            };
        }
    }

    // Public API
    return {
        ENVIRONMENT,
        API_BASE_URL,
        getApiBaseUrl,
        testBackendConnection
    };
})();