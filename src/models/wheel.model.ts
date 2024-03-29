import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model"

@Entity()
export class Wheel {
    @PrimaryGeneratedColumn()
    id!: number;

    // @Column()
    // location: number;

    // ? just check this if it is correct
    @ManyToOne(()=> Location, (location)=> location.skateboards)
    public location?:Location

    @Column()
    name!: string;

    @Column()
    type!: string;

    @Column()
    size!: number;

    @Column()
    price!: number;

    @Column()
    storedOn!: string; // ?

    // @Column()
    // avatar!: string;
}