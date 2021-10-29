import { EmailValidatorAdapter } from './email-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
    isEmail(): Boolean {
        return true;
    },
}));

describe('EmailValidator Adapter ', () => {
    test('Should return false if validator return false', () => {
        const sut = new EmailValidatorAdapter();
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
        const isValid = sut.isValid('invalid_email@mail.com');
        expect(isValid).toBe(false);
    });

    test('Should return true if validator return true', () => {
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid('valid_email@mail.com');
        expect(isValid).toBe(true);
    });

    test('Should class validator if correct email', () => {
        const sut = new EmailValidatorAdapter();
        const isEmailSpy = jest.spyOn(validator, 'isEmail');
        sut.isValid('any_email@mail.com');
        expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
    });
});
