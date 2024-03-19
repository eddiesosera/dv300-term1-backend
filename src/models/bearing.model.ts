import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Bearing {
    @PrimaryGeneratedColumn() 
    id!: number;
    // location 

    @Column() // brand
    brand!: string;

    @Column() // color
    color!: string;

    @Column() // price
    price!: number;

    @Column() // stored On
    storedOn!: string; // ? : date

    @Column() // avatar
    avatar!: string;

}