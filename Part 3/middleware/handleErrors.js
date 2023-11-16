module.exports = (error, request, response, next) => {
  console.log(error);
  error.name === 'CastError'
    ? response
        .status(400)
        .send({ error: 'the information provided is not correct' })
    : response.status(500).end();
};
