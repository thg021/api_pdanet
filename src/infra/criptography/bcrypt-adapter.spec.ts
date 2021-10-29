import { BcryptAdapter } from './bcrypt-adapter';
import bcript from 'bcrypt';
describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct value', async () => {
        const salt = 12;
        const sut = new BcryptAdapter(salt);
        const hashSpy = jest.spyOn(bcript, 'hash');
        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
    });
});
