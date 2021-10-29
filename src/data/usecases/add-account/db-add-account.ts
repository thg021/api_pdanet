import { IAccountModel } from '../../../domain/model/account';
import {
    IAddAccount,
    IAddAccountModel,
} from '../../../domain/usecases/add-account';
import { IEncrypter } from '../../protocols/encripter';

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
