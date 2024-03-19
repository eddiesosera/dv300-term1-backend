import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import { Configuration } from "./configuration.model";

@Entity()
export class Skateboard {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    price!: number;

    @Column()
    craftedOn!: string;

    @Column()
    avatar!: string;

    @Column()
    craftedBy!: number;

    @OneToOne(() => Configuration)
    @JoinColumn()
    configuration?: Configuration | null

    @ManyToOne(() => Location, (location) => location.skateboards)
    public location?: Location

}