import { Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, AfterInsert, Entity } from "typeorm";
import { Plan, Role } from "../../utils/constants";

@Entity('users')
export class UserEntity {
    @PrimaryColumn({ type: 'uuid' })
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    // Email/password accounts have no avatar_url in Supabase metadata.
    // type must be explicit: with a `string | null` property, TypeORM can't
    // infer the Postgres column type from TS reflection metadata (it sees "Object").
    @Column({ type: 'varchar', nullable: true })
    avatar: string | null;

    @Column({ type: 'enum', enum: Plan, default: Plan.FREE })
    plan: Plan;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @AfterInsert()
    logInsert() {
        console.log('User created, id: ', this.id);
    }
}
