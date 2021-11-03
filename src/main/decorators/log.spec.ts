import {
    IController,
    IHttpRequest,
    IHttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('Log Decorator', () => {
    interface ISutType {
        sut: LogControllerDecorator;
        controllerStub: IController;
    }

    const makeController = (): IController => {
        class ControllerStub implements IController {
            async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
                const httpResponse: IHttpResponse = {
                    statusCode: 200,
                    body: {
                        name: 'thiago silvaq',
                    },
                };
                return new Promise(resolve => resolve(httpResponse));
            }
        }
        return new ControllerStub();
    };

    const makeSut = (): ISutType => {
        const controllerStub = makeController();
        const sut = new LogControllerDecorator(controllerStub);

        return {
            sut,
            controllerStub,
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
});
