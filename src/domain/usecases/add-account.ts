import { IAccountModel } from '../model/account';

//regras de negocio
export interface IAddAccountModel {
    name: string;
    email: string;
    password: string;
}

export interface IAddAccount {
    add(account: IAddAccountModel): Promise<IAccountModel>;
}
