import { IAddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { IAccountModel } from '../../../../domain/model/account';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements IAddAccountRepository {
    async add(accountData: IAddAccountModel): Promise<IAccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts');
        await accountCollection.insertOne(accountData);

        return MongoHelper.map(accountData);
    }
}
