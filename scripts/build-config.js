const fs = require('fs');
const path = require('path');

console.log('Starting config generation...');

try {
    // Read .env file
    const envPath = path.resolve(__dirname, '../.env');
    console.log('Looking for .env file at:', envPath);
    
    if (!fs.existsSync(envPath)) {
        console.error(' .env file not found at:', envPath);
        process.exit(1);
    }
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log(' .env file content:', envContent);
    
    // Parse .env content
    const envVars = {};
    const lines = envContent.split('\n');
    
    lines.forEach((line, index) => {
        line = line.trim();
        if (line && !line.startsWith('#') && line.includes('=')) {
            const equalIndex = line.indexOf('=');
            const key = line.substring(0, equalIndex).trim();
            let value = line.substring(equalIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            if (key) {
                envVars[key] = value;
                console.log(` Parsed: ${key} = ${value}`);
            }
        }
    });
    
    if (Object.keys(envVars).length === 0) {
        console.warn('  No environment variables found in .env file');
    }
    
    // Create config content as a JavaScript module
    const configModuleContent = `sap.ui.define([], function () {
    "use strict";
    
    // Set global APP_CONFIG
    window.APP_CONFIG = ${JSON.stringify(envVars, null, 2)};
    
    console.log('APP_CONFIG loaded via module:', window.APP_CONFIG);
    
    return window.APP_CONFIG;
});`;

    // Create config content as a regular script (fallback)
    const configScriptContent = `// Auto-generated config file from .env
window.APP_CONFIG = ${JSON.stringify(envVars, null, 2)};
console.log('APP_CONFIG loaded:', window.APP_CONFIG);`;
    
    // Save both versions
    const configModulePath = path.resolve(__dirname, '../webapp/model/AppConfig.js');
    const configScriptPath = path.resolve(__dirname, '../webapp/config.js');
    
    fs.writeFileSync(configModulePath, configModuleContent);
    fs.writeFileSync(configScriptPath, configScriptContent);
    
    console.log('Config module generated successfully at:', configModulePath);
    console.log('Config script generated successfully at:', configScriptPath);
    console.log('Generated module content:');
    console.log(configModuleContent);
    
} catch (error) {
    console.error('Error generating config:', error);
    process.exit(1);
}