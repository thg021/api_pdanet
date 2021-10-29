import { IEncrypter } from '../../data/protocols/encripter';
import bcript from 'bcrypt';

export class BcryptAdapter implements IEncrypter {
    constructor(private readonly salt: number) {}
    async encrypt(value: string): Promise<string> {
        await bcript.hash(value, this.salt);
        return '';
    }
}
