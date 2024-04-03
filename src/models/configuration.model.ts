import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skateboard } from "./skateboard.model";
import { BoardType } from "./boardtype.model";

@Entity()
export class Configuration {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => BoardType, (type) => type.configuration)
    public board_type?: BoardType

    @Column()
    board_skin!: number;

    @Column()
    trucks!: number;

    @Column()
    wheels!: number;

    @Column()
    bearings!: number;

    @OneToOne(() => Skateboard)
    @JoinColumn()
    skateboard?: Skateboard | null

}