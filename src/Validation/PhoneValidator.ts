import type IValidator from "Validation/IValidator";
export default class PhoneValidator implements IValidator {
    private readonly _sipRegex = /([^-=:][\w-]+[^.-]@[^.:-][.:\w-]+[^.:;-])/;
    private readonly _phoneRegex = /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/;

    public readonly ErrorMessage: string = "Must be a valid phone number/sip";

    public IsValid(val: any): boolean {
        const string = (val as string);

        return string.includes("@") 
            ? this._sipRegex.test(val) : this._phoneRegex.test(val);
    }
}