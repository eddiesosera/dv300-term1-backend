import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import { Configuration } from "./configuration.model";


@Entity()
export class Bearing {
    @PrimaryGeneratedColumn() 
    id!: number;

    // location 
    @ManyToOne(()=>Location, (location)=> location.skateboards)
    public location?:Location

    @Column() // brand
    brand!: string;

    @Column() // color
    color!: string;

    @Column() // price
    price!: number;

    @Column() // stored On
    storedOn!: string; 

    @Column() // avatar
    avatar!: string;

    @OneToMany(()=> Configuration, (config)=> config.bearings)
    public configuration?: Configuration[]

}