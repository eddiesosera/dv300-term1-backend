import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import { Configuration } from "./configuration.model";

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
    storedOn!: string; // ? : date?

    // avatar
    @Column()
    avatar!: string;

    @OneToMany(()=> Configuration,(config)=> config.trucks)
    public configuration?: Configuration[]


}