import simpleMask from './simpleMask';

describe('Error is thrown', () => {
    it('When parameters are missing', () => {
        expect(simpleMask).toThrow(
            'Missing one or many of the following: containerEl, input selector, numeric, alphanumeric or custom pattern'
        );
    });
});

describe('Mask functionality', () => {
    jest.useFakeTimers();
    document.body.innerHTML = `
        <div class="container">
        <input value='111111111' class="js-mask"></input>
        </div>`;

    const container = document.querySelector('.container');
    const inputEl = container.querySelector('.js-mask');

    simpleMask(container, {
        inputSelector: '.js-mask',
        format: 'XXX-XX-XXXX',
        numeric: true,
    });

    it('When input loses focus, value should mask', () => {
        const focusEvent = new FocusEvent('focusout');
        inputEl.dispatchEvent(focusEvent);
        expect(inputEl.value).toBe('111-11-1111');
    });

    it('When input is focused, value should reset to unmasked state', () => {
        const focusEvent = new FocusEvent('focusin');
        inputEl.dispatchEvent(focusEvent);
        expect(inputEl.value).toBe('111111111');
    });
});


describe('Input validation', () => {
    let containerEl;
    let inputEl;

    beforeEach(() => {      
        document.body.innerHTML = `
            <div class="container">
                <input value=""></input>
            </div>`;
        containerEl = document.querySelector('.container');
        inputEl = containerEl.querySelector('input');
    });

    it('Should remove invalid characters after input', () => {
        simpleMask(containerEl, {
            inputSelector: 'input',
            format: 'XXX-XXX-XXXX',
            numeric: true
        });

        inputEl.value = 'abc123';
        inputEl.dispatchEvent(new Event('input'));

        expect(inputEl.value).toBe('123');
    });

    it('Should trim the length of the input value when input changes', () => {
        simpleMask(containerEl, {
            inputSelector: 'input',
            format: 'XXX-XXX-XXXX',
            numeric: true
        });

        inputEl.value = 'abc1234567abc12345abc';
        inputEl.dispatchEvent(new Event('input'));

        expect(inputEl.value).toBe('1234567123');
    });

});

describe('Destroy', () => {
    let containerEl;
    let inputEl;

    beforeEach(() => {      
        document.body.innerHTML = `
            <div class="container">
                <input value="111111111"></input>
            </div>`;
        containerEl = document.querySelector('.container');
        inputEl = containerEl.querySelector('input');
    });

    it('Should remove event bindings', () => { 
        const removeEventListenerSpy = jest.spyOn(inputEl, 'removeEventListener');

        const simpleMaskInst = simpleMask(containerEl, {
            inputSelector: 'input',
            format: 'XXX-XXX-XXXX',
            numeric: true
        });

        simpleMaskInst.destroy();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(4);

        removeEventListenerSpy.mockRestore();
    });
});