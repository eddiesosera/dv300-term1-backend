import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";

@Entity()
export class Skateboard {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    price!: number;

    @Column()
    craftedOn!: string;

    @Column()
    avaatar!: string;

    @Column()
    craftedBy!: number;

    @Column()
    configuration!: number;

    @ManyToOne(() => Location, (location) => location.skateboards)
    public location?: Location

}