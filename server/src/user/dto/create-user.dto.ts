import { Plan } from '../../utils/constants';

export class CreateUserDto {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    plan: Plan;
}