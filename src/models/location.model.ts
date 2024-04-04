import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Skateboard } from "./skateboard.model";
import { User } from "./user.model";
import { Skin } from "./skin.model";
import { Bearing } from "./bearing.model";
import { Truck } from './truck.model';
import { Wheel } from "./wheel.model";
import { BoardType } from "./boardtype.model";

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

    // for skin
    // this will put the array of the skins into the location object 
    //  it finding all skins with the location id that matches that specific location id
    @OneToMany(() => Skin, (skins) => skins.location)
    public skins?: Skin[]

    // for bearing
    @OneToMany(() => Bearing, (bearings) => bearings.location)
    public bearings?: Bearing[]

    // truck
    @OneToMany(() => Truck, (trucks) => trucks.location)
    public trucks?: Truck[]

    // wheel 
    @OneToMany(() => Wheel, (wheels) => wheels.location)
    public wheels?: Wheel[]

    @OneToMany(()=> BoardType, (type)=> type.location)
    public board_type?: BoardType[]

    // DIFFERENT STOCK AMOUNT ON SITE

    // DIFFERENT INVENTORY AMOUNT ON SITE

}