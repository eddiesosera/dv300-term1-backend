import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Skateboard } from "./skateboard.model";
import { User } from "./user.model";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    street!: string;

    @Column()
    city!: string;

    @Column()
    description!: string;

    @Column()
    stockAmount!: number

    @OneToMany(() => User, (user) => user.location)
    public users?: User[]

    @OneToMany(() => Skateboard, (skateboards) => skateboards.location)
    public skateboards?: Skateboard[]

    // DIFFERENT STOCK AMOUNT ON SITE

    // DIFFERENT INVENTORY AMOUNT ON SITE

}