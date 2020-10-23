import simpleMask from './src/simpleMask.js';

const container = document.querySelector('.js-container');

const init = () => {
    simpleMask(container, {
        inputSelector: '.js-input',
        format: 'XXX****XX****XXXX',
        numeric: true,
    });
};

init()
