const { createStream } = require('rotating-file-stream');

module.exports = (options) => {
  const { filename, size, maxSize, interval, compress, path, ...otherOptions } =
    options;
  return createStream(filename, {
    // Set some default values
    size: size || '100M',
    maxSize: maxSize || '1G',
    interval: interval || '7d',
    compress: compress || 'gzip',
    path,
    maxFiles: 10,
    initialRotation: true,
    immutable: true,
  });
};
