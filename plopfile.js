const fs = require('fs');
const path = require('path');
const { paramCase } = require('param-case');

module.exports = function (plop) {
  plop.setGenerator('api-command', {
    description: 'Create a new API-based VSCode command',
    prompts: [
      {
        type: 'input',
        name: 'functionName',
        message: 'Function name (camelCase):'
      },
      {
        type: 'input',
        name: 'title',
        message: 'Command title (for Command Palette): '
      },
      {
        type: 'input',
        name: 'apiUrl',
        message: 'API URL to call (e.g. https://api.example.com/my-endpoint): '
      },
      {
        type: 'input',
        name: 'conversationId',
        message: 'Conversation ID: '
      },
      {
        type: 'input',
        name: 'dataSource',
        message: 'Datasource: '
      }

    ],
    actions: function (data) {
      data.commandId = paramCase(data.functionName); // e.g., getDataframe → get-dataframe

      const actions = [
        {
          type: 'add',
          path: 'src/commands/{{kebabCase functionName}}.ts',
          templateFile: 'plop-templates/api-command.ts.hbs'
        },
        {
          type: 'modify',
          path: 'src/extension.ts',
          pattern: /(\/\/ PLOP_IMPORT_MARKER)/,
          template: `import { {{functionName}} } from './commands/{{kebabCase functionName}}';\n$1`
        },
        {
          type: 'modify',
          path: 'src/extension.ts',
          pattern: /(\/\/ PLOP_REGISTER_MARKER)/,
          template: `  {{functionName}}(context);\n$1`
        },
        function updatePackageJson(data) {
          const pkgPath = path.resolve(__dirname, 'package.json');
          const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

          const fullCommandId = `extension-plop.${data.commandId}`;

          pkg.activationEvents = pkg.activationEvents || [];
          pkg.contributes = pkg.contributes || {};
          pkg.contributes.commands = pkg.contributes.commands || [];

          if (!pkg.activationEvents.includes(`onCommand:${fullCommandId}`)) {
            pkg.activationEvents.push(`onCommand:${fullCommandId}`);
          }

          const exists = pkg.contributes.commands.some(c => c.command === fullCommandId);
          if (!exists) {
            pkg.contributes.commands.push({
              command: fullCommandId,
              title: data.title
            });
          }

          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
          return '✅ Updated package.json';
        }
      ];

      return actions;
    }
  });
};
