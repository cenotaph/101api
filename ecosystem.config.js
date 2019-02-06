module.exports = {
  apps : [{
    name      : 'API',
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
      path : '/var/www/testing/api',
      'post-deploy' : 'ln -sf /var/www/testing/api/shared/data /var/www/testing/api/current/data && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
