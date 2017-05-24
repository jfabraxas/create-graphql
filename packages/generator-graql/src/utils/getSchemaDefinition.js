import recast from 'recast';
import getSchemaFieldsFromAst from './getSchemaFieldsFromAst';
import parseGraphQLSchema from './parseGraphQLSchema';

const { visit } = recast.types;

export default (modelCode, withTimestamps, ref) => {
  const ast = recast.parse(modelCode, {
    parser: {
      parse: source =>
        require('babylon').parse(source, {
          // eslint-disable-line global-require
          sourceType: 'module',
          plugins: [
            'asyncFunctions',
            'asyncGenerators',
            'classConstructorCall',
            'classProperties',
            'flow',
            'objectRestSpread',
            'trailingFunctionCommas'
          ]
        })
    }
  });

  let fields = null;

  visit(ast, {
    visitExpression: function visitExpression(expressionPath) {
      // eslint-disable-line object-shorthand
      const { node } = expressionPath;

      if (
        node.type === 'NewExpression' &&
        ( 
          node.callee.object.name === 'arangoose' ||
          node.callee.object.name === 'mongoose'
        ) &&
        node.callee.property.name === 'Schema'
      ) {
        fields = getSchemaFieldsFromAst(node, withTimestamps);

        this.abort();
      }

      return this.traverse(expressionPath);
    }
  });

  return parseGraphQLSchema(fields, ref);
};
