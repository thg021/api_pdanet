import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/http';

export class SignUpController {
    public handle(httpRequest: HttpRequest): HttpResponse {
        const { name, email, password, passwordConfirmation } =
            httpRequest.body;

        if (!name) {
            return badRequest(new MissingParamError('name'));
        }

        if (!email) {
            return badRequest(new MissingParamError('email'));
        }
    }
}
