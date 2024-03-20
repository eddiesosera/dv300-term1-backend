import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import { Skateboard } from "./skateboard.model";
import * as bcrypt from 'bcrypt'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    surname!: string;

    @Column()
    email!: string;

    @Column()
    isEmailVerified!: boolean;

    @Column()
    avatar!: string;

    @Column()
    password!: string;

    @Column()
    dateJoined!: string;

    @Column()
    isUserGlobalAdmin!: boolean;

    @Column()
    isUserLocalAdmin!: boolean;

    @ManyToOne(() => Location, (location) => location.users)
    public location?: Location

    @OneToMany(() => Skateboard, (skateboard) => skateboard.craftedBy)
    public skateboard?: Skateboard[]

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        console.log("Password being hashed: " + this.password)
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt)
    }

}