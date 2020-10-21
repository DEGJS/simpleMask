import simpleMask from './simpleMask.js'

const index = () => {
    const container = document.querySelector('.container');

    simpleMask(container, {
        inputSelector: '.js-mask',
        format: 'XXX-XX-XXXX',
        numeric: true
    })
}

export default index();
