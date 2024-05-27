module.exports = (err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: (statusCode = 500 ? "An error occured on the server" : message),
  });
};

// app.use((err, req, res, next) => {
//   console.error(err);
//   // if an error has no status, set it to 500
//   const { statusCode = 500, message } = err;
//   res
//     .status(statusCode)
//     .send({
//       // check the status and display a message based on it
//       message: statusCode === 500
//         ? 'An error occurred on the server'
//         : message
//     });
// });
