import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { SignUpController } from './signup';
import { IEmailValidator } from '../protocols';
import {
    IAddAccount,
    IAddAccountModel,
} from '../../domain/usecases/add-account';
import { IAccountModel } from '../../domain/model/account';

interface ISutTypes {
    sut: SignUpController;
    emailValidatorStub: IEmailValidator;
    addAccountStub: IAddAccount;
}
//factory
const makeEmailValidator = (): IEmailValidator => {
    class EmailValidatorStub implements IEmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

const makeAddAccount = (): IAddAccount => {
    class AddAccountStub implements IAddAccount {
        add(account: IAddAccountModel): IAccountModel {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email',
                password: 'valid_password',
            };

            return fakeAccount;
        }
    }

    return new AddAccountStub();
};

const makeSut = (): ISutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);
    return {
        sut,
        emailValidatorStub,
        addAccountStub,
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

    test('Should return 400 if no password Confirmation fails', () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'invalid_password',
            },
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(
            new InvalidParamError('passwordConfirmation')
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

    test('Should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        //mockar o resultado para este teste
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        sut.handle(httpRequest);
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
    });

    test('Should return 500 if emailvalidator throws', () => {
        const { sut, emailValidatorStub } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new ServerError());
    });

    test('Should call AddAccount with correct values', () => {
        const { sut, addAccountStub } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        //mockar o resultado para este teste
        const addSpy = jest.spyOn(addAccountStub, 'add');

        sut.handle(httpRequest);
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any',
            email: 'any_email@email.com',
            password: 'any_password',
        });
    });
});
