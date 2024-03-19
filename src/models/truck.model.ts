import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Truck {
    @PrimaryGeneratedColumn()
    id!: number;

    // location
    // ? : not sure how to do this one

    // color
    @Column()
    color!: string;

    // Stiffness
    @Column()
    stiffness!: number;

    // price
    @Column()
    price!: number;

    //stored on
    @Column()
    storedOn!: number; // ? : date?

    // avatar
    @Column()
    avatar!: string;


}