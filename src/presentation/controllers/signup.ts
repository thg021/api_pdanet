import { HttpRequest, HttpResponse } from 'presentation/protocols/http';

export class SignUpController {
    public handle(httpRequest: HttpRequest): HttpResponse {
        const { name, email, password, passwordConfirmation } =
            httpRequest.body;

        if (!name) {
            return {
                statusCode: 400,
                body: new Error('Missing param: name'),
            };
        }

        if (!email) {
            return {
                statusCode: 400,
                body: new Error('Missing param: email'),
            };
        }
    }
}
