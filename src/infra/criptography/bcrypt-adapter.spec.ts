import { BcryptAdapter } from './bcrypt-adapter';
import bcript, { hash } from 'bcrypt';

jest.mock('bcrypt', () => ({
    async hash(): Promise<string> {
        return new Promise(resolve => resolve('hashmockada'));
    },
}));
describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const salt = 12;
        const sut = new BcryptAdapter(salt);
        const hashSpy = jest.spyOn(bcript, 'hash');
        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });

    test('Should return a hash on success', async () => {
        const salt = 12;
        const sut = new BcryptAdapter(salt);
        const hash = await sut.encrypt('any_value');

        expect(hash).toBe('hashmockada');
    });
});
