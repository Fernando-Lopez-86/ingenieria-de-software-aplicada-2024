module.exports = {
    apps: [
      {
        name: 'pedidosAppBackend',
        script: 'src/app.js', // Asegúrate de que el camino al script sea correcto
        env: {
          NODE_ENV: 'development',
          DOTENV_CONFIG_PATH: '.env.development'
        },
        env_development: {
          NODE_ENV: 'development',
          DOTENV_CONFIG_PATH: '.env.development',
        },
        env_production: {
          NODE_ENV: 'production',
          DOTENV_CONFIG_PATH: '.env.production',
        }
      }
    ]
  };