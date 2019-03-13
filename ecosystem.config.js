module.exports = {
  apps : [{
    name      : 'Satayksi API',
    script    : 'app.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'deploy',
      host : 'testing.icewhistle.com',
      ssh_options: "StrictHostKeyChecking=no",
      ref  : 'origin/master',
      repo : 'git@github.com:cenotaph/101api.git',
      path : '/var/www/satayksi/api',
      'post-deploy' : 'ln -sf /var/www/satayksi/api/shared/data /var/www/satayksi/api/current/data && cp /var/www/satayksi/api/shared/config.json /var/www/satayksi/api/current/config/production.json && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
