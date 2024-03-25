import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";

@Entity()
export class Skin {
    @PrimaryGeneratedColumn() // ID
    id!: number;

    // todo : location, skins
    @ManyToOne(()=> Location, (location)=> location.skateboards)
    public location?:Location

    @Column() // name
    name!: string;

    @Column() //price
    price!: number;

    @Column() // stored on
    storedOn!: string;

    @Column() // avatar
    avatar!: string; 
}