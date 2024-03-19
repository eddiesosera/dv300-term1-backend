import {Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Location} from "./location.model"

@Entity()
export class Wheel {
    @PrimaryGeneratedColumn()
    id!: number;

    // @Column()
    // location: number;

    @ManyToOne(()=> Location, (location)=> location)
    public location?: Location

    @Column()
    type!: string;
}