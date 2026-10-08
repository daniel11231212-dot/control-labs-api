const health = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'ControlLabs está funcionando',
    timestamp: new Date().toISOString()
  });
};

module.exports = { health };
