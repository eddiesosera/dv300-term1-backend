import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";

@Entity()
export class Truck {
    @PrimaryGeneratedColumn()
    id!: number;

    // location
    // ? : not sure how to do this one
    @ManyToOne(()=> Location, (location)=> location.skateboards)
    public location?:Location

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