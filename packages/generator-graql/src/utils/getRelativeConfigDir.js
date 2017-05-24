import path from 'path';

import getCreateGraphQLConfig from './getCreateGraphQLConfig'

/**
 * Get the relative path directory between two directories specified on the config file
 * @param from {string} The calling directory of the script
 * @param to {[string]} The destination directories
 * @returns {string} The relative path, e.g. '../../src'
 */

export default (from, to) => {
  const config = getCreateGraphQLConfig().directories;

  return to.reduce((directories, dir) => {
    const relativePath = path.posix.relative(config[from], config[dir]);

    return {
      ...directories,
      [dir]: relativePath === '' ? '.' : relativePath
    };
  }, {});
};