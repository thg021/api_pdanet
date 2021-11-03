import {
    IController,
    IHttpRequest,
    IHttpResponse,
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

describe('Log Decorator', () => {
    test('Should call controller handle ', async () => {
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
        const controllerStub = new ControllerStub();
        const handleSpy = jest.spyOn(controllerStub, 'handle');
        const sut = new LogControllerDecorator(controllerStub);
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
