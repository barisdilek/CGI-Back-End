const handleError = (err, res) => {
  console.dir(err);
  const { statusCode, result } = err;
  res.status(statusCode).json({
    result : result
  });
};

module.exports = {
  handleError
}