import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import exp from "constants";

@Entity()
export class BoardType {
    @PrimaryGeneratedColumn() // ID
    id!: number;

    // location
    @ManyToOne(()=> Location, (location) => location.skateboards) // ? is it all supposed to be skateboards ?
    public location?: Location

    @Column() // name 
    name!: string;

    @Column() // back color 
    backColor!:string;

    @Column() // price
    price!: number;

    @Column() // stored on
    storedOn!: number;

    @Column() // avatar
    avatar!: string;
}