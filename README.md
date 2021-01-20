# simpleMask
![Run Tests](https://github.com/DEGJS/expander/workflows/Run%20Tests/badge.svg)
simpleMask is a masking plugin that leverages the focusout and focusin events to provide a more accessible, less intrusive masking experience.

## Install
simpleMask is an ES6 module. Consequently, you may need a transpiler ([Babel](https://babeljs.io) is a nice one) to compile DomEvent into compatible Javascript for your runtime environment.

If you're using NPM, you can install DomEvent with the following command:

```
$ npm install @degjs/simple-mask
```

## Usage
``` javascript
import simpleMask from '@degjs/simple-mask';

const container = document.querySelector('.container');

    simpleMask(container, {
        inputSelector: '.js-mask',
        format: 'XXX-XX-XXXX',
        numeric: true
    })
```

With the setup above, after a user has met the expected character length (automatically determined by the ```format``` parameter) and then triggers the focusout event, the input value will become ```XXX-XX-XXXX```, with ```X``` representing characters typed.

For example: If a user typed ```000000000``` it will become ```000-00-0000```.

When a user focuses the input again, the value will then revert back to its previous state, in the case above: ```000000000```


simpleMask looks at the charcters in the ```format``` parameter to determine which characters to replace. By default,  ```X``` is used to represent expected user input.

You can set the parameter ```maskPlaceholder``` to whatever you'd like, to change it.

## Parameters

### inputSelector
Type: `string`
The selector for the input that will be masked.

Default: `null`

### format
Type: `string`
This will determine how the input value should be masked.

Default: `null`

### maskPlaceholder
Type: `string`
This will be used to determine what characters in the format `parameter` are expected to be user input.

Default: `X`

### numeric
Type: `boolean`
Determines if users will be allowed to type numbers.

Default: `false`

### alphanumeric
Type: `boolean`
Determines if users will be allowed to type numbers and letters

Default: `false`

### alphanumericPattern
Type: `RegExp`
Determines the `RegExp` pattern for numbers and letters.

Default: `/^[a-zA-Z0-9\.]*$/`

### numericPattern
Type: `RegExp`
Determines the `RegExp` pattern for numbers.

Default: `[0-9\/]+/`

### customPattern
Type: `RegExp`
Allows for a custom `RegExp` pattern to be used to restrict user input in any way that you may need.

Default: `[0-9\/]+/`

### onMaskCallback
Type: `Function`
Callback that fires when an input has been masked.

Default: `null`

### onFailedInputCallback
Type: `Function`
Callback that fires when an a restricted key has been pressed

Default: `null`
