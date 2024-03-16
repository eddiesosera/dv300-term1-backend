import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    inventoryAmount!: number

    // DIFFERENT STOCK AMOUNT ON SITE

    // DIFFERENT INVENTORY AMOUNT ON SITE

}