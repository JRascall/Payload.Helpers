import type IValidator from "./IValidator";

export default class PostCodeValidator implements IValidator {
    private readonly _countryRegex = {
        AT: /^([1-9]{1})(\d{3})$/,
        BG: /^([1-9]{1}[0-9]{3})$/,
        BR: /^(\d{2})([\.]?)(\d{3})([\-]?)(\d{3})$/,
        CA: /^(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|X|Y){1}[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}\s?[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}[0-9]{1}$/i,
        CH: /^([1-9]{1})(\d{3})$/,
        CZ: /^(\d{3})([ ]?)(\d{2})$/,
        DE: /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/,
        DK: /^(DK(-|\s)?)?\d{4}$/i,
        ES: /^(?:0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/,
        FR: /^[0-9]{5}$/i,
        IN: /^\d{3}\s?\d{3}$/,
        IE: /^(D6W|[ACDEFHKNPRTVWXY]\d{2})\s[0-9ACDEFHKNPRTVWXY]{4}$/,
        IT: /^(I-|IT-)?\d{5}$/i,
        MA: /^[1-9][0-9]{4}$/i,
        NL: /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i,
        PL: /^[0-9]{2}\-[0-9]{3}$/,
        PT: /^[1-9]\d{3}-\d{3}$/,
        RO: /^(0[1-8]{1}|[1-9]{1}[0-5]{1})?[0-9]{4}$/i,
        RU: /^[0-9]{6}$/i,
        SE: /^(S-)?\d{3}\s?\d{2}$/i,
        SG: /^([0][1-9]|[1-6][0-9]|[7]([0-3]|[5-9])|[8][0-2])(\d{4})$/i,
        SK: /^(\d{3})([ ]?)(\d{2})$/,
        US: /^\d{4,5}([\-]?\d{4})?$/
    };

    public readonly ErrorMessage: string = "Must be a valid zip/post code";

    constructor(
        private readonly _languageCode: string
    ) { }

    public IsValid(val: any): boolean {
        if (this._languageCode === "GB") {
            return this.GreatBritishRegex(val);
        }

        // @ts-ignore;
        const regex = this._countryRegex[this._languageCode];
        if (regex === null) {
            console.warn(`Missing regex for country - ${this._languageCode}`);
            return true;
        }

        return regex.test(val);
    }

    private GreatBritishRegex(val: string): boolean {
        const firstChar = '[ABCDEFGHIJKLMNOPRSTUWYZ]',     // Does not accept QVX
            secondChar = '[ABCDEFGHKLMNOPQRSTUVWXY]',     // Does not accept IJZ
            thirdChar = '[ABCDEFGHJKPMNRSTUVWXY]',
            fourthChar = '[ABEHMNPRVWXY]',
            fifthChar = '[ABDEFGHJLNPQRSTUWXYZ]',
            regexps = [
                // AN NAA, ANN NAA, AAN NAA, AANN NAA format
                new RegExp('^(' + firstChar + '{1}' + secondChar + '?[0-9]{1,2})(\\s*)([0-9]{1}' + fifthChar + '{2})$', 'i'),
                // ANA NAA
                new RegExp('^(' + firstChar + '{1}[0-9]{1}' + thirdChar + '{1})(\\s*)([0-9]{1}' + fifthChar + '{2})$', 'i'),
                // AANA NAA
                new RegExp('^(' + firstChar + '{1}' + secondChar + '{1}?[0-9]{1}' + fourthChar + '{1})(\\s*)([0-9]{1}' + fifthChar + '{2})$', 'i'),

                new RegExp('^(BF1)(\\s*)([0-6]{1}[ABDEFGHJLNPQRST]{1}[ABDEFGHJLNPQRSTUWZYZ]{1})$', 'i'),        // BFPO postcodes
                /^(GIR)(\s*)(0AA)$/i,                       // Special postcode GIR 0AA
                /^(BFPO)(\s*)([0-9]{1,4})$/i,               // Standard BFPO numbers
                /^(BFPO)(\s*)(c\/o\s*[0-9]{1,3})$/i,        // c/o BFPO numbers
                /^([A-Z]{4})(\s*)(1ZZ)$/i,                  // Overseas Territories
                /^(AI-2640)$/i                              // Anguilla
            ];

        for (let i = 0; i < regexps.length; i++) {
            if (regexps[i].test(val)) {
                return true;
            }
        }

        return false;
    }
}