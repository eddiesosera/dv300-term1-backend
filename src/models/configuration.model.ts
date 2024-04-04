import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skateboard } from "./skateboard.model";
import { BoardType } from "./boardtype.model";
import { Wheel } from "./wheel.model";
import { Bearing } from "./bearing.model";
import { Truck } from "./truck.model"
import { Skin } from './skin.model'

@Entity()
export class Configuration {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => BoardType, (type) => type.configuration)
    public board_type?: BoardType

    // @Column()
    // board_skin!: number;
    @ManyToOne(() => Skin, (skin) => skin.configuration)
    public board_skin?: Skin

    // @Column()
    // trucks!: number;
    @ManyToOne(() => Truck, (truck) => truck.configuration)
    public trucks?: Truck

    // @Column()
    // wheels!: number;
    @ManyToOne(() => Wheel, (wheel) => wheel.configuration)
    public wheels?: Wheel

    // @Column()
    // bearings!: number;
    @ManyToOne(() => Bearing, (bearing) => bearing.configuration)
    public bearings?: Bearing

    @OneToOne(() => Skateboard)
    @JoinColumn()
    skateboard?: Skateboard | null

}