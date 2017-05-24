import getCreateGraphQLConfig from './getCreateGraphQLConfig';

/**
 * Get a directory from the configuration file
 * @param directory {string} The name of the directory, e.g. 'source'/'mutation'
 * @returns {string} The directory path
 */
export default directory =>
  getCreateGraphQLConfig().directories[directory];