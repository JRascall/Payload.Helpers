import EmailValidator from "./EmailValidator";
import type IValidator from "Validation/IValidator";
import PhoneValidator from "./PhoneValidator";
import RequiredValidator from "./RequiredValidator";
import PostCodeValidator from "./PostCodeValidator";

export default class ValidationHandler {
    protected readonly types: Map<string, IValidator>;

    public constructor() {
        this.types = new Map<string, IValidator>();
        this.types.set("required", new RequiredValidator());
        this.types.set("email", new EmailValidator());
        this.types.set("phone", new PhoneValidator());
        this.types.set("postcode", new PostCodeValidator("en"));
    }

    public Validate(types: string[], val: any): [boolean, string | undefined] {
        if (types === null || types.length <= 0) return [true, ""];

        for (const type of types.map(x => x.toLowerCase())) {
            const validation = this.types.get(type);
            const isValid = validation?.IsValid(val);
            if (isValid === false) {
                return [false, validation?.ErrorMessage];
            }
        }

        return [true, ""];
    }
}