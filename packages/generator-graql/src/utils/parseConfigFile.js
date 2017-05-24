import fs from 'fs';
import pkgDir from 'pkg-dir';

const rootPath = pkgDir.sync('..') || '..';

/**
 * Parse `.graphqlrc` config file and retrieve its contents
 * @param filePath {string} The path of the config file
 * @returns {*}
 */

export default filePath => {
  const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const directories = Object.keys(
    config.directories
  ).reduce((data, directory) => {
    if (directory === 'source') {
      return {
        ...data,
        [directory]: `${rootPath}/${config.directories[directory]}`
      };
    }

    return {
      ...data,
      [directory]: `${config.directories.source}/${config.directories[directory]}`
    };
  }, {});

  return {
    ...config,
    directories: {
      ...config.directories,
      ...directories
    }
  };
};