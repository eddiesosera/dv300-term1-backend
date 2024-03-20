import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Skateboard } from "./skateboard.model";

@Entity()
export class StockNeeded {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    skateboard_type!: string;

    @Column()
    board_type!: number;

    @Column()
    board_skin!: number;

    @Column()
    trucks!: number;

    @Column()
    wheels!: number;

    @Column()
    bearings!: number;

    @OneToMany(() => Skateboard, (skateboard) => skateboard.stockNeeded)
    @JoinColumn()
    skateboards?: Skateboard[]

}