import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./location.model";
import { Configuration } from "./configuration.model";
import { User } from "./user.model";
import { StockNeeded } from "./stockNeeded.model";

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

    @ManyToOne(() => User, (user) => user.skateboard)
    @JoinColumn()
    craftedBy!: User | null

    @OneToOne(() => Configuration)
    @JoinColumn()
    configuration?: Configuration | null

    @ManyToOne(() => Location, (location) => location.skateboards)
    public location?: Location

    @ManyToOne(() => StockNeeded)
    @JoinColumn()
    stockNeeded?: StockNeeded | null

}