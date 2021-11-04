import {
    InvalidParamError,
    MissingParamError,
    ServerError,
} from '../../errors';
import { SignUpController } from './signup';
import {
    IEmailValidator,
    IAddAccount,
    IAddAccountModel,
    IAccountModel,
    IHttpRequest,
} from './sign-protocols';
import { badRequest, ok, serverError } from '../../helpers/http-helper';

interface ISutTypes {
    sut: SignUpController;
    emailValidatorStub: IEmailValidator;
    addAccountStub: IAddAccount;
}
//factory
const makeFakeRequest = (): IHttpRequest => ({
    body: {
        name: 'any',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
    },
});

const makeFakeAccount = (): IAccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@email.com',
    password: 'valid_password',
});

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
        async add(account: IAddAccountModel): Promise<IAccountModel> {
            return new Promise(resolve => resolve(makeFakeAccount()));
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
    test('Should be call correct', () => {});

    test('Should return 400 if no name is provided', async () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
    });

    test('Should return 400 if no email is provided', async () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('email'))
        );
    });

    test('Should return 400 if no password is provided', async () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('password'))
        );
    });

    test('Should return 400 if no passwordConfirmation is provided', async () => {
        //system under test
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                name: 'any',
                email: 'any_email@email.com',
                password: 'any_password',
            },
        };

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('passwordConfirmation'))
        );
    });

    test('Should return 400 if no password Confirmation fails', async () => {
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

        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('passwordConfirmation'))
        );
    });

    test('Should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();

        //mockar o resultado para este teste
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('email'))
        );
    });

    test('Should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        //mockar o resultado para este teste
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        await sut.handle(makeFakeRequest());
        expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
    });

    test('Should return 500 if emailvalidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpResponse = await sut.handle(makeFakeRequest());

        expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('Should call AddAccount with correct values', async () => {
        const { sut, addAccountStub } = makeSut();
        //mockar o resultado para este teste
        const addSpy = jest.spyOn(addAccountStub, 'add');

        await sut.handle(makeFakeRequest());
        expect(addSpy).toHaveBeenCalledWith({
            name: 'any',
            email: 'any_email@email.com',
            password: 'any_password',
        });
    });

    test('Should return 500 if addAccount throws', async () => {
        const { sut, addAccountStub } = makeSut();

        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
            return new Promise((resolve, reject) => reject(new Error()));
        });

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(null)));
    });

    test('Should return 200 if valid data is provided', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(ok(makeFakeAccount()));
    });
});
