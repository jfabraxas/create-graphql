import path from 'path';
import pkgDir from 'pkg-dir';
import merge from 'lodash.merge';

import parseConfigFile from './parseConfigFile'

const rootPath = pkgDir.sync('.') || '.';

/**
 * Get the `.graphqlrc` config file
 * @returns {object} The content of the config
 */
export default () => {
  // Use default config
  const defaultFilePath = path.resolve(`${__dirname}/graphqlrc.json`);

  const config = parseConfigFile(defaultFilePath);

  try {
    // Check if there is a `.graphqlrc` file in the root path
    const customConfig = parseConfigFile(`${rootPath}/.graphqlrc`);

    merge(config, customConfig);

    // If it does, extend default config with it, so if the custom config has a missing line
    // it won't throw errors
    return config;
  } catch (err) {
    // Return the default config if the custom doesn't exist
    return config;
  }
};