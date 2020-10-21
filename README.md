# SimpleMask
SimpleMask is a masking plugin that leverages the focusout and focusin events based on a custom format.

## Install
DomEvent is an ES6 module. Consequently, you may need a transpiler ([Babel](https://babeljs.io) is a nice one) to compile DomEvent into compatible Javascript for your runtime environment.

If you're using NPM, you can install DomEvent with the following command:

```
$ npm install @degjs/simple-mask
```

## Usage
``` javascript
import simpleMask from '@degjs/simple-mask';

const containerEl = document.querySelector('.some-element');
const inputEl = document.querySelector('.some-input-element');
