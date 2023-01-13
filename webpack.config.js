const nodeEnv = (process.env.NODE_ENV || 'development').trim()

module.exports = nodeEnv === 'development'
  ? require('./config/webpack.config.dev')
  : require('./config/webpack.config.prod')
