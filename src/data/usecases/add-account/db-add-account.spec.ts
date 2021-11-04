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
            return new Promise(resolve => resolve(makeFakeAccount()));
        }
    }

    return new AddAccountRepositoryStub();
};

const makeFakeAccount = (): IAccountModel => ({
    id: 'valid_id',
    name: 'valid',
    email: 'valid_email@mail.com',
    password: 'hashed_password',
});

const makeFakeAccountData = (): IAddAccountModel => ({
    name: 'valid',
    email: 'valid_email@mail.com',
    password: 'valid_password',
});

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
        await sut.add(makeFakeAccountData());

        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });

    test('Should throw if Encrypter throws', async () => {
        const { sut, encrypterStub } = makeSut();
        jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const promise = sut.add(makeFakeAccountData());

        await expect(promise).rejects.toThrow();
    });

    test('Should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
        await sut.add(makeFakeAccountData());

        expect(addSpy).toHaveBeenCalledWith({
            name: 'valid',
            email: 'valid_email@mail.com',
            password: 'hashed_password',
        });
    });

    test('Should throw if DbAddAccount throws', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const promise = sut.add(makeFakeAccountData());

        await expect(promise).rejects.toThrow();
    });

    test('Should return an account on success', async () => {
        const { sut } = makeSut();
        const account = await sut.add(makeFakeAccountData());

        expect(account).toEqual(makeFakeAccount());
    });
});
