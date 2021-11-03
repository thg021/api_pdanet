import {
    IController,
    IHttpRequest,
    IHttpResponse,
} from '../../presentation/protocols';

export class LogControllerDecorator implements IController {
    constructor(private readonly controller: IController) {}

    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        await this.controller.handle(httpRequest);
        return null;
    }
}
