import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { SignUpController } from './signup';
import { IEmailValidator } from '../protocols/emailValidator';

interface ISutTypes {
    sut: SignUpController;
    emailValidatorStub: IEmailValidator;
}
//factory
const makeSut = (): ISutTypes => {
    //Duble de teste, um fake
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);
    return {
        sut,
        emailValidatorStub,
    };
};

describe('Signup controller', () => {
    test('Should return 400 if no name is provided', () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });

    test('Should return 400 if no email is provided', () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });

    test('Should return 400 if no password is provided', () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });

    test('Should return 400 if no passwordConfirmation is provided', () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                password: 'any_password',
            },
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new MissingParamError('passwordConfirmation')
        );
    });

    test('Should return 400 if an invalid email is provided', () => {
        const { sut, emailValidatorStub } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'invalid_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        //mockar o resultado para este teste
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });
});
