# caffo

> CLI for quick and easy scaffolding in your apps

🚧 STILL A WIP 🚧

Caffo is a command line tool (cli) that allows you to scaffold your apps with minimal configuration. A typical workflow (from install to usage) is shown below:

1. install `caffo`

```bash
# install caffo
npm i caffo
```

2. add the `caffo` script to you `package.json`

```diff
{
+  "caffo": "caffo"
}
```

3. create a `templates` directory

```bash
mkdir templates
```

4. populate your newly created `templates` directory with your templates. Your new templates can contain variables adhering to the handlebars syntax. For example:

```jsx
// sample template file
import React, {component} from 'react'

class {{componentName}} extends Component {
  render() {
    return (
      <div>Hello {{name}} from {{componentName}}</div>
    )
  }
}
```

You can also have directories inside of the `templates` directory where all of the items inside of that directory are templates that will be created a one time. For example:

```
📂 templates
⎿ 📂 newComponent
  ⎿ 📝 template.js
     📝 template.css
```

5. use `caffo`

```bash
# use the script created in step 2
npm run caffo
```

This will walk you through the process of filling in the variables in your templates. It will also ask you where you want your templates to be outputted.

6. That's it!!!
