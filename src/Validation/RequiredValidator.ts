import type IValidator from "./IValidator";

export default class RequiredValidator implements IValidator {
    private readonly _regex = /^.*\S.*$/;

    public readonly ErrorMessage: string = "Field cannot be empty";

    public IsValid(val: string): boolean {
        if (val === null || val === undefined) return false;

        return this._regex.test(val.trim());
    }
}