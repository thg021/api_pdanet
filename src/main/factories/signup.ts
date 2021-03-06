import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { LogErrorRepository } from '../../infra/db/mongodb/log-repository/log';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { IController } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/log';

export const makeSignUpController = (): IController => {
    const salt = 12;
    const emailValidatorAdapter = new EmailValidatorAdapter();
    const bcryptAdapter = new BcryptAdapter(salt);
    const accountMongoRepository = new AccountMongoRepository();
    const dbAddAccount = new DbAddAccount(
        bcryptAdapter,
        accountMongoRepository
    );
    const signUpController = new SignUpController(
        emailValidatorAdapter,
        dbAddAccount
    );

    const logMongoRepository = new LogErrorRepository();

    return new LogControllerDecorator(signUpController, logMongoRepository);
};
