import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skateboard } from "./skateboard.model";

@Entity()
export class Configuration {
    @PrimaryGeneratedColumn()
    id!: number;

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

    @OneToOne(() => Skateboard, (skateboard) => skateboard.configuration)
    public skateboard?: Skateboard

}