import fs from 'fs';
import path from 'path';

import getCreateGraphQLConfig from './getCreateGraphQLConfig';
import getSchemaDefinition from './getSchemaDefinition';

/**
 * Get the Mongoose model schema code
 * @param modelPath {string} The path of the Mongoose model
 * @returns {string} The code of the Mongoose model
 */

const getModelCode = modelPath => fs.readFileSync(modelPath, 'utf8');

export default ({ model, withTimestamps = false, ref = false }) => {
  const modelDir = getCreateGraphQLConfig().directories.model;

  const modelPath = path.resolve(`${modelDir}/${model}.js`);

  const modelCode = getModelCode(modelPath);

  return getSchemaDefinition(modelCode, withTimestamps, ref);
};
