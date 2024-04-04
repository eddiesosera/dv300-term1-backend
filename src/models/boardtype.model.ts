import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import exp from "constants";
import { Configuration } from "./configuration.model";

@Entity()
export class BoardType {
    @PrimaryGeneratedColumn() // ID
    id!: number;

    // location
    @ManyToOne(() => Location, (location) => location.skateboards)
    public location?: Location

    @Column() // name 
    name!: string;

    @Column()
    type!: string;

    @Column() // back color 
    backColor!: string;

    @Column() // price
    price!: number;

    @Column() // stored on
    storedOn?: string;

    @Column() // avatar
    avatar!: string;

    // @Column()
    // quantity!: number;

    @OneToMany(() => Configuration, (config) => config.board_type)
    public configuration?: Configuration[]
}