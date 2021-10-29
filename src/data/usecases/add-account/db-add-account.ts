import {
    IAccountModel,
    IAddAccount,
    IAddAccountModel,
    IEncrypter,
    IAddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
    constructor(
        private readonly encrypter: IEncrypter,
        private readonly addAccountRepository: IAddAccountRepository
    ) {}

    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
        const hashedPassword = await this.encrypter.encrypt(
            accountData.password
        );

        await this.addAccountRepository.add(
            Object.assign({}, accountData, {
                password: hashedPassword,
            })
        );
        return new Promise(resolve => resolve(null));
    }
}
