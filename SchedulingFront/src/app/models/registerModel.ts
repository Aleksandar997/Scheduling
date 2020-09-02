import { User } from '../common/models/user';

export class RegisterModel {
    license: License;
    user: User;
}

export class License {
    value: string;
}
