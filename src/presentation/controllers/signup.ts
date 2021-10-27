import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helper';
import { IController } from '../protocols/controller';
import { IEmailValidator } from '../protocols/emailValidator';
import { IHttpRequest, IHttpResponse } from '../protocols/http';

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator;
    constructor(emailValidator: IEmailValidator) {
        this.emailValidator = emailValidator;
    }
    public handle(httpRequest: IHttpRequest): IHttpResponse {
        try {
            const { email } = httpRequest.body;
            const requiredFields = [
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ];

            for (const field of requiredFields) {
                if (!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field));
                }
            }

            const isValid = this.emailValidator.isValid(email);

            if (!isValid) {
                return badRequest(new InvalidParamError('email'));
            }
        } catch (error) {
            return serverError();
        }
    }
}
