import { SignUpController } from './signup';

describe('Signup controller', () => {
    test('Should return 400 if no name is provided', () => {
        //system under test
        const sut = new SignUpController();
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new Error('Missing param: name'));
    });
});
