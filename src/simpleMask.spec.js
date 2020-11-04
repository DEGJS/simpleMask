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
            format: 'XXX-XX-XXXX',
            numeric: true
        });

        simpleMaskInst.destroy();

        expect(removeEventListenerSpy).toHaveBeenCalledTimes(3);

        removeEventListenerSpy.mockRestore();
    });
});