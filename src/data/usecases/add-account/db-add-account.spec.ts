import {
    IAccountModel,
    IAddAccountModel,
    IEncrypter,
    IAddAccountRepository,
} from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface ISutTypes {
    sut: DbAddAccount;
    encrypterStub: IEncrypter;
    addAccountRepositoryStub: IAddAccountRepository;
}

const makeEncrypter = (): IEncrypter => {
    class EncrypterStub implements IEncrypter {
        async encrypt(value: string): Promise<string> {
            return new Promise(resolve => resolve('hashed_password'));
        }
    }

    return new EncrypterStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
    class AddAccountRepositoryStub implements IAddAccountRepository {
        async add(accountData: IAddAccountModel): Promise<IAccountModel> {
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid',
                email: 'valid_email@mail.com',
                password: 'hashed_password',
            };
            return new Promise(resolve => resolve(fakeAccount));
        }
    }

    return new AddAccountRepositoryStub();
};

const makeSut = (): ISutTypes => {
    const encrypterStub = makeEncrypter();
    const addAccountRepositoryStub = makeAddAccountRepository();
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub,
    };
};

describe('DbAddAccount UseCase', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
        const accountData = {
            name: 'valid',
            email: 'valid_email@mail.com',
            password: 'valid_password',
        };
        await sut.add(accountData);

        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });

    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();
        jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const accountData = {
            name: 'valid',
            email: 'valid_email@mail.com',
            password: 'valid_password',
        };
        const promise = sut.add(accountData);

        await expect(promise).rejects.toThrow();
    });

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        const accountData = {
            name: 'valid',
            email: 'valid_email@mail.com',
            password: 'valid_password',
        };
        await sut.add(accountData);

        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid',
            email: 'valid_email@mail.com',
            password: 'hashed_password',
        });
    });
});
