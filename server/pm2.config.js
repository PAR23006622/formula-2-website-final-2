module.exports = {
  apps: [
    {
      name: 'f2-scraper-service',
      script: './server/scraper-service.js',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      exp_backoff_restart_delay: 100,
      error_file: './logs/scraper-error.log',
      out_file: './logs/scraper-output.log',
      time: true,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}; 