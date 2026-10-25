function errorHandler(error, request, response, next) {
  if (response.headersSent) return next(error)

  const status = error.name === 'ValidationError' ? 400 : (error.name === 'CastError' ? 400 : 500)
  response.status(status).json({
    success: false,
    message: error.name === 'ValidationError'
      ? Object.values(error.errors).map((item) => item.message).join(', ')
      : error.name === 'CastError'
        ? 'Invalid medicine ID'
        : error.message && process.env.NODE_ENV !== 'production'
          ? error.message
          : 'A server error occurred'
  })
}

module.exports = errorHandler
