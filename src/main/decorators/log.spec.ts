import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
import {
    IController,
    IHttpRequest,
    IHttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('Log Decorator', () => {
    const makeController = (): IController => {
        class ControllerStub implements IController {
            async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
                const httpResponse: IHttpResponse = {
                    statusCode: 200,
                    body: {
                        name: 'thiago silva',
                    },
                };
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

    test('Should call controller handle ', async () => {
        const { sut, controllerStub } = makeSut();
        const handleSpy = jest.spyOn(controllerStub, 'handle');
        const httpRequest = {
            body: {
                email: 'valid@mail.com',
                name: 'valid_name',
                password: 'valid_password',
                password_confirmation: 'valid_password',
            },
        };
        await sut.handle(httpRequest);
        expect(handleSpy).toHaveBeenLastCalledWith(httpRequest);
    });

    test('Should return the same result of the controller ', async () => {
        const { sut } = makeSut();

        const httpRequest = {
            body: {
                email: 'valid@mail.com',
                name: 'valid_name',
                password: 'valid_password',
                password_confirmation: 'valid_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'thiago silva',
            },
        });
    });

    test('Should call LogErrorRepository with correct error if controller return a server error ', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
        const fakeError = new Error();
        fakeError.stack = 'any_error';

        const error = serverError(fakeError);
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');

        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            new Promise(resolve => resolve(error))
        );

        const httpRequest = {
            body: {
                email: 'valid@mail.com',
                name: 'valid_name',
                password: 'valid_password',
                password_confirmation: 'valid_password',
            },
        };
        await sut.handle(httpRequest);
        expect(logSpy).toHaveBeenCalledWith('any_error');
    });
});
