const pkg = require('./package.json');

module.exports = {
  apps: [{
    name: pkg.name,
    script: './bin/www.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      CURRENT_ENV: 'prod'
    },
    watch: true,
    ignore_watch: ['logs', 'node_modules', 'uploads'],
    source_map_support: false,
    instances: 2
  }]
};
