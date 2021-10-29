import { IEmailValidator } from '../presentation/protocols/emailValidator';

export class EmailValidatorAdapter implements IEmailValidator {
    isValid(email: string): boolean {
        return false;
    }
}
