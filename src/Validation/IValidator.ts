export default interface IValidator {
    readonly ErrorMessage: string;
    IsValid(val: any): boolean;
}