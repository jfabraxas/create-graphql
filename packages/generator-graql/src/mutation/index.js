import Generator from 'yeoman-generator';
import last from 'lodash.last';
import {
  getMongooseModelSchema,
  getConfigDir,
  getRelativeConfigDir,
  camelCaseText,
  uppercaseFirstLetter,
} from '../utils';

class MutationGenerator extends Generator {
  constructor(args, options) {
    super(args, options);

    this.argument('name', {
      type: String,
      required: true,
    });

    this.argument('model', {
      type: Object,
      required: false,
    });

    this.destinationDir = getConfigDir('mutation');
  }

  _mutationPath(name,purename) {
    return `${this.destinationDir}/${purename ? purename + '/' : null}${name}Mutation.js`;
  }

  _parseSchema(schema) {
    // Remove `GraphQLString` dependency from import if it exists,
    // it's already hard-coded on `MutationAdd` template.
    const addDependencies = schema.dependencies.filter(dep => ['GraphQLString'].indexOf(dep) === -1);

    // Also remove `GraphQLString`, `GraphQLNonNull` & `GraphQLID` dependencies
    // from import if they exist, they are already hard-coded on `MutationEdit` template.
    const editDependencies = schema.dependencies.filter(dep =>
      ['GraphQLString', 'GraphQLNonNull', 'GraphQLID'].indexOf(dep) === -1,
    );

    // Map through the fields checking if any of them is `required: true`, if so, use `GraphQLNonNull`
    const fields = schema.fields.map((field) => {
      if (!field.required) {
        return field;
      }

      // Add `GraphQLNonNull` to `addDependencies` import if it hasn't been added yet.
      // Won't push to `editDependencies` because it's already specified on the template file.
      if (addDependencies.indexOf('GraphQLNonNull') === -1) {
        addDependencies.push('GraphQLNonNull');
      }

      return {
        ...field,
        type: `new GraphQLNonNull(${field.type})`,
      };
    });

    return {
      ...schema,
      fields,
      addDependencies,
      editDependencies,
    };
  }

  _getConfigDirectories() {
    return getRelativeConfigDir('mutation', ['model', 'type', 'loader', 'connection']);
  }

  generateMutation() {
    let schema = null;
    if (this.options.model) {
      const modelSchema = getMongooseModelSchema({ model: this.options.model });
      schema = this._parseSchema(modelSchema);
    }

    const name = uppercaseFirstLetter(this.options.name);


    const mutations = {
      add: {
        fileName: `create${name}`,
        template: {
          withSchema: 'MutationAddWithSchema.js.template',
          regular: 'MutationAdd.js.template',
        },
      },
      edit: {
        fileName: `update${name}`,
        template: {
          withSchema: 'MutationEditWithSchema.js.template',
          regular: 'MutationEdit.js.template',
        },
      },
      remove: {
        fileName: `delete${name}`,
        template: {
          withSchema: 'MutationRemoveWithSchema.js.template',
          regular: 'MutationRemove.js.template',
        },
      },
    };

    const templateType = schema ? 'withSchema' : 'regular';
    const directories = this._getConfigDirectories();

    const templateVars = {
      name,
      camelCaseName: camelCaseText(this.options.name),
      schema,
      directories,
    };

    // TODO: generate type and loader that do not exist yet

    Object.keys(mutations).forEach((mutationType) => {
      const { template, fileName } = mutations[mutationType];

      this.fs.copyTpl(
        this.templatePath(template[templateType]), this._mutationPath(fileName, name), templateVars,
      );

      this._generateMutationTest({
        name,
        mutationName: fileName,
        template: template[templateType],
        schema,
      });
    });
  }

  _generateMutationTest({ name, mutationName, template, schema }) {
    const templatePath = this.templatePath(`test/${template}`);

    const destinationPath = this.destinationPath(`${this.destinationDir}/__tests__/${mutationName}Mutation.spec.js`);

    const directories = this._getConfigDirectories();

    const templateVars = {
      name,
      camelCaseName: camelCaseText(name),
      mutationName,
      schema,
      directories,
    };

    this.fs.copyTpl(templatePath, destinationPath, templateVars);
  }

  end() {
    this.log('🔥 Mutation created!');
  }
}

module.exports = MutationGenerator;
