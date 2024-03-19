import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import { Skateboard } from "./skateboard.model";

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

    @ManyToOne(() => Location, (location) => location.skateboards)
    public location?: Location

    @OneToMany(() => Skateboard, (skatboard) => skatboard.craftedBy)
    public skateboards?: Skateboard[]

}