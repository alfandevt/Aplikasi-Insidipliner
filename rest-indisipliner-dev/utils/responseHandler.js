const message = (res, status, message) => {
  res.status(status).json({
    statusCode: status,
    message: message,
  });
};
const messageWithHeader = (res, status, message, headers) => {
  res.set(headers).status(status).json({
    statusCode: status,
    message: message,
  });
};
const data = (res, status, data) => {
  res.status(status).json({
    statusCode: status,
    data: data,
  });
};
const dataWithHeader = (res, status, data, headers) => {
  res.set(headers).status(status).json({
    statusCode: status,
    data: data,
  });
};
const file = (res, status, path) => {
  res.status(status).sendFile(path);
};
const fileWithHeader = (res, status, path, headers) => {
  res.set(headers).status(status).sendFile(path);
};
/* Module Exprort */
module.exports = {
  message,
  messageWithHeader,
  data,
  dataWithHeader,
  file,
  fileWithHeader,
};
