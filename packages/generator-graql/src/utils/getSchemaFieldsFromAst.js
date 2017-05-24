import getSchemaTimestampsFromAst from './getSchemaTimestampsFromAst';

export default (node, withTimestamps) => {
  const astSchemaFields = node.arguments[0].properties;

  const fields = [];
  // MemberExpression: { field1: Schema.Types.ObjectId }
  // Identifier: { field1: ObjectId }
  const validSingleValueTypes = ['MemberExpression', 'Identifier'];

  astSchemaFields.forEach(field => {
    const name = field.key.name;

    const fieldDefinition = {};

    if (field.value.type === 'ArrayExpression') {
      return;
    } else if (validSingleValueTypes.indexOf(field.value.type) !== -1) {
      fieldDefinition.type = field.value.property
        ? field.value.property.name
        : field.value.name;
    } else {
      field.value.properties.forEach(({ key, value }) => {
        fieldDefinition[key.name] = value.name || value.value;
      });
    }

    fields[name] = {
      name,
      ...fieldDefinition
    };
  });

  if (withTimestamps) {
    const astSchemaTimestamp = getSchemaTimestampsFromAst(
      node.arguments[1].properties
    );

    return {
      ...fields,
      ...astSchemaTimestamp
    };
  }

  return fields;
};