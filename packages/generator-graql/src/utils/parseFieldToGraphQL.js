import uppercaseFirstLetter from './uppercaseFirstLetter';

export default (field, ref) => {
  const graphQLField = {
    name: field.name,
    description: field.description,
    required: !!field.required,
    originalType: field.type,
    resolve: `obj.${field.name}`
  };

  const name = uppercaseFirstLetter(field.name);
  const typeFileName = `${name}Type`;
  const loaderFileName = `${name}Loader`;
  const checkRequired = type => field.required ? `new GraphQLNonNull( ${type} )` : type;

  switch (field.type) {
    case 'Number':
      return {
        ...graphQLField,
        type: 'GraphQLInt',
        flowType: 'number'
      };
    case 'Boolean':
      return {
        ...graphQLField,
        type: 'GraphQLBoolean',
        flowType: 'boolean'
      };
    case 'ObjectId':
      if (ref) {
        return {
          ...graphQLField,
          type: typeFileName,
          flowType: 'string',
          resolve: `await ${loaderFileName}.load(user, obj.${field.name})`,
          resolveArgs: 'async (obj, args, { user })',
          graphqlType: typeFileName,
          graphqlLoader: loaderFileName
        };
      }
      return {
        ...graphQLField,
        type: 'GraphQLID',
        flowType: 'string'
      };
    case 'ArangoId':
      return {
        ...graphQLField,
        type: 'GraphQLID',
        flowType: 'string'
      };
    case 'Date':
      return {
        ...graphQLField,
        type: 'GraphQLString',
        flowType: 'string',
        resolve: `obj.${field.name}.toISOString()`
      };
    default:
      return {
        ...graphQLField,
        type: 'GraphQLString',
        flowType: 'string'
      };
  }
};
