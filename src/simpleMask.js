const simpleMask = (containerEl, options = {}) => {
    const defaults = {
        format: null,
        inputEl: null,
        inputSelector: null,
        maskPlaceholder: 'X',
        onMaskCallback: null,
        onFailedInputCallback: null,
        numeric: false,
        alphanumeric: false,
        customPattern: null,
        alphanumericPattern: /^[a-zA-Z0-9\.]*$/,
        numberPattern: /[0-9\/]+/
    };

    const settings = { ...defaults, ...options };

    const maskMethods = {
        reverse: 'reverse',
        forward: 'forward'
    }

    const availableCharacterPatterns =  [settings.numeric, settings.alphanumeric, !!settings.customPattern]
    const requiredParams = [containerEl, settings.inputSelector, settings.format]


    let inputEl;
    let output;
    let builtValue;
    let formatArrayOfCharacters;
    let arrayOfSpecialCharactersInFormat;


    const init = () => {
        if (settingsAreValid()) {
            inputEl = containerEl.querySelector(settings.inputSelector);
            initPatternData();
            bindEvents();
        } else {
            throw new Error('Missing one or many of the following: containerEl, input selector, numeric, alphanumeric or custom pattern')
        }

    };

    const settingsAreValid = () => {
        const selectedCharacterPattern = availableCharacterPatterns.filter(pattern => pattern === true);
        const requiredParamsArePresent = requiredParams.every(param => param);

        let settingsAreValid = true;

        if(selectedCharacterPattern.length !== 1 || !requiredParamsArePresent) {
            settingsAreValid = false;
        }

        return settingsAreValid;
    }

    const initPatternData = () => {
        formatArrayOfCharacters = settings.format.split('');
        arrayOfSpecialCharactersInFormat = getSpecialCharacters(formatArrayOfCharacters);
    }

    const getSpecialCharacters = arrayOfCharacters => {
        let object = [];

        arrayOfCharacters.forEach((char, index) => {
            if (char !== settings.maskPlaceholder) {
                object.push({ char, index });
            }
        });

        return object;
    };

    const bindEvents = () => {
        inputEl.addEventListener('focusin', maskInput);
        inputEl.addEventListener('focusout', maskInput);
        inputEl.addEventListener('keypress', checkForInvalidKey);
    };

    const maskInput = (e) => {
        if (inputEl.value.length !== 0 && inputEl.value.length >= getFormatLength() ) {
            const value = getMaskValue(arrayOfSpecialCharactersInFormat, getMaskMethod(e));
            setInputValue(value);

            if (settings.onMaskCallback) {
                settings.onMaskCallback(value)
            }
        }
    };

    const getMaskMethod = (e) => e.type === 'focusin' ? maskMethods.reverse : maskMethods.forward;

    const setInputValue = (value) => inputEl.value = value;

    const getMaskValue = (arrayOfSpecialCharacters, maskMethod) => {
        let maskedValue;

        arrayOfSpecialCharacters.forEach(specialCharObject => {
            if (specialCharObject.char) {
                maskedValue = buildMaskedValue(inputEl.value, specialCharObject, maskMethod);
            }
        });

        builtValue = null;
        return maskedValue;
    };

    const buildMaskedValue = (inputValue, specialCharObject, maskMethod) => {
        if (builtValue) {
            inputValue = builtValue;
        }

        if(maskMethod === maskMethods.forward ) {
            output = inputValue.substring(specialCharObject.index, specialCharObject.char) + specialCharObject.char + inputValue.substring(specialCharObject.index);
        } else {
            output = inputValue.split(specialCharObject.char).join("")
        }

        builtValue = output;

        return builtValue;
    };


    const checkForInvalidKey = e => {
        if (inputEl.value.length === getFormatLength() || !keyMatchesPattern(e.key)) {
            e.preventDefault();

            if(settings.onFailedInputCallback) {
                settings.onFailedInputCallback(inputEl.value);
            }
        }
    };

    const getFormatLength = () => {
        let formatLength;

        if (arrayOfSpecialCharactersInFormat.length !== 0) {
            formatLength = settings.format.length - arrayOfSpecialCharactersInFormat.length;
        } else {
            formatLength = settings.format.length;
        }

        return formatLength;
    };

    const keyMatchesPattern = (pressedKey) => {
        const keyPattern = getKeyPattern();

        return keyPattern.test(pressedKey);
    }

    const getKeyPattern = () => {
        let keyPattern;

        if (settings.customPattern) {
            keyPattern = settings.customPattern;
        } else if (settings.alphanumeric) {
            keyPattern = settings.alphanumericPattern;
        } else if (settings.numeric) {
            keyPattern = settings.numberPattern;
        }

        return keyPattern
    };

    init();
};


export default simpleMask;
