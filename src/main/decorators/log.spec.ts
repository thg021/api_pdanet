import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import { IAccountModel } from '../../domain/model/IAccountModel';
import { ok, serverError } from '../../presentation/helpers/http-helper';
import {
    IController,
    IHttpRequest,
    IHttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

const makeController = (): IController => {
    class ControllerStub implements IController {
        async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
            const httpResponse: IHttpResponse = ok(makeFakeAccount());
            return new Promise(resolve => resolve(httpResponse));
        }
    }
    return new ControllerStub();
};

const makeLogErrorRepository = (): ILogErrorRepository => {
    class LogErrorRepositoryStub implements ILogErrorRepository {
        async log(stack: string): Promise<void> {
            return new Promise(resolve => resolve());
        }
    }
    return new LogErrorRepositoryStub();
};

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

const makeServerError = (): IHttpResponse => {
    const fakeError = new Error();
    fakeError.stack = 'any_error';

    const error = serverError(fakeError);
    return error;
};

interface ISutType {
    sut: LogControllerDecorator;
    controllerStub: IController;
    logErrorRepositoryStub: ILogErrorRepository;
}

const makeSut = (): ISutType => {
    const controllerStub = makeController();
    const logErrorRepositoryStub = makeLogErrorRepository();
    const sut = new LogControllerDecorator(
        controllerStub,
        logErrorRepositoryStub
    );

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub,
    };
};

describe('Log Decorator', () => {
    test('Should call controller handle ', async () => {
        const { sut, controllerStub } = makeSut();
        const handleSpy = jest.spyOn(controllerStub, 'handle');

        await sut.handle(makeFakeRequest());
        expect(handleSpy).toHaveBeenLastCalledWith(makeFakeRequest());
    });

    test('Should return the same result of the controller ', async () => {
        const { sut } = makeSut();

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(ok(makeFakeAccount()));
    });

    test('Should call LogErrorRepository with correct error if controller return a server error ', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            new Promise(resolve => resolve(makeServerError()))
        );

        await sut.handle(makeFakeRequest());
        expect(logSpy).toHaveBeenCalledWith('any_error');
    });
});
