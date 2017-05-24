import parseFieldToGraphQL from './parseFieldToGraphQL';

export default (mongooseFields, ref) => {
  const dependencies = [];
  const typeDependencies = [];
  const loaderDependencies = [];

  const fields = Object.keys(mongooseFields).map(name => {
    const field = parseFieldToGraphQL(mongooseFields[name], ref);

    if (field.graphqlType) {
      if (typeDependencies.indexOf(field.graphqlType) === -1) {
        typeDependencies.push(field.graphqlType);
      }

      if (loaderDependencies.indexOf(field.graphqlLoader) === -1) {
        loaderDependencies.push(field.graphqlLoader);
      }
    } else if (dependencies.indexOf(field.type) === -1) {
      dependencies.push(field.type);
    }

    return field;
  });

  return {
    fields,
    dependencies,
    typeDependencies,
    loaderDependencies
  };
};
