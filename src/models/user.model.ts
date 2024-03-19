import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";

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

    @ManyToOne(() => Location, (location) => location.skateboards)
    public location?: Location

}