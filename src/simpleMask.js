const simpleMask = (containerEl, options = {}) => {
    const defaults = {
        format: null,
        inputSelector: null,
        maskPlaceholder: 'X',
        numeric: false,
        alphanumeric: false,
        customPattern: null,
        alphanumericPattern: /^[a-zA-Z0-9\.]*$/,
        numberPattern: /[\d]+/,
        onMaskCallback: null,
        onFailedInputCallback: null,
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
        const formatArrayOfCharacters = settings.format.split('');
        arrayOfSpecialCharactersInFormat = getSpecialCharacters(formatArrayOfCharacters);
    }

    const getSpecialCharacters = arrayOfCharacters => {
        let specialCharactersArray = [];

        arrayOfCharacters.forEach((char, index) => {
            if (char !== settings.maskPlaceholder) {
                specialCharactersArray.push({ char, index });
            }
        });
       
        return specialCharactersArray;
    };

    const bindEvents = () => {
        inputEl.addEventListener('focusin', maskInput);
        inputEl.addEventListener('focusout', maskInput);
        inputEl.addEventListener('change', maskInput);
        inputEl.addEventListener('input', onInput);
    };

    const unbindEvents = () => {
        inputEl.removeEventListener('focusin', maskInput);
        inputEl.removeEventListener('focusout', maskInput);
        inputEl.removeEventListener('change', maskInput);
        inputEl.removeEventListener('input', onInput);
    }

    const maskInput = (e) => {
        const maskMethod = getMaskMethod(e);

        /* 
            Perform masking/unmasking if:
            1) value is not empty,
            2) value meets minimum length of format, and
            3) value will be unmasked or value will be masked and is not already masked
        */
        if (inputEl.value.length !== 0 && 
            inputEl.value.length >= getFormatLength() && 
            (maskMethod !== maskMethods.forward || !isValueMasked(inputEl.value))
        ) {
            const value = getMaskValue(arrayOfSpecialCharactersInFormat, maskMethod);
            setInputValue(value);

            if (settings.onMaskCallback) {
                settings.onMaskCallback(value)
            }
        }
    };

    /* Assume value is masked if it contains at least one special character */
    const isValueMasked = value => {
        return value.split('').some(char => 
            arrayOfSpecialCharactersInFormat.some(specialChar => specialChar.char === char)
        );
    }

    const getMaskMethod = (e) => e.type === 'focusin' ? maskMethods.reverse : maskMethods.forward;

    const setInputValue = (value) => inputEl.value = value;

    const getMaskValue = (arrayOfSpecialCharacters, maskMethod) => {
        return arrayOfSpecialCharacters.reduce((maskedValue, specialCharObject) => {
            maskedValue = buildMaskedValue(specialCharObject, maskMethod, maskedValue);
            return maskedValue;
        }, '');
    };

    const buildMaskedValue = (specialCharObject, maskMethod, maskedValue) => {
        const valueToBuildFrom =  maskedValue.length === 0 ? inputEl.value : maskedValue;

        if(maskMethod === maskMethods.forward ) {
            output = valueToBuildFrom.substring(specialCharObject.index, specialCharObject.char) + specialCharObject.char + valueToBuildFrom.substring(specialCharObject.index);
        } else {
            output = valueToBuildFrom.split(specialCharObject.char).join("")
        }

        return output;
    };

    const onInput = () => {
        const validValue = removeInvalidCharacters(inputEl.value, getKeyPattern(), getFormatLength());

        if(inputEl.value !== validValue) {
            inputEl.value = validValue;

            if(settings.onFailedInputCallback) {
                settings.onFailedInputCallback(inputEl.value);
            }
        }
    }

    const removeInvalidCharacters = (value, pattern, maxLength) => {
        return value.split('').reduce((newValue, char) => {
            if(newValue.length < maxLength && pattern.test(char)) {
                newValue += char;
            }

            return newValue;
        }, '');
    }

    const getFormatLength = () => {
        let formatLength;

        if (arrayOfSpecialCharactersInFormat.length !== 0) {
            formatLength = settings.format.length - arrayOfSpecialCharactersInFormat.length;
        } else {
            formatLength = settings.format.length;
        }

        return formatLength;
    };

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

    const destroy = () => {
        unbindEvents();
    }

    init();

    return {
        destroy
    }
};


export default simpleMask;
