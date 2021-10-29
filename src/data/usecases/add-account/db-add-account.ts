import {
    IAccountModel,
    IAddAccount,
    IAddAccountModel,
    IEncrypter,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
    private readonly encrypter: IEncrypter;

    constructor(encrypter: IEncrypter) {
        this.encrypter = encrypter;
    }
    async add({ password }: IAddAccountModel): Promise<IAccountModel> {
        await this.encrypter.encrypt(password);
        return new Promise(resolve => resolve(null));
    }
}
