import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError } from '../../helpers/http-helper';
import {
    IHttpRequest,
    IHttpResponse,
    IController,
    IEmailValidator,
    IAddAccount,
} from './sign-protocols';

export class SignUpController implements IController {
    private readonly emailValidator: IEmailValidator;
    private readonly addAccount: IAddAccount;

    constructor(emailValidator: IEmailValidator, addAccount: IAddAccount) {
        this.emailValidator = emailValidator;
        this.addAccount = addAccount;
    }

    public async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
        try {
            const { name, email, password, passwordConfirmation } =
                httpRequest.body;
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

            if (passwordConfirmation !== password) {
                return badRequest(
                    new InvalidParamError('passwordConfirmation')
                );
            }

            const account = await this.addAccount.add({
                name,
                email,
                password,
            });

            return ok(account);
        } catch (error) {
            return serverError(error);
        }
    }
}
