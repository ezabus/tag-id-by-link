module.exports = {
  apps: [{
    name: 'tagid',
    script: './src/tagIdFromLink.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      user: 'ezabus',
      host: ['fishburgfootball.ru'],
      ref: 'origin/master',
      repo: 'git@github.com:ezabus/tag-id-by-link.git',
      path: '/home/ezabus/microservices/tagid',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production'
    }
  }
};
