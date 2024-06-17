import {Exclude} from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn , AfterInsert , AfterRemove , AfterUpdate } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email:string;

    @Column()
    @Exclude()
    password:string;

    @AfterInsert()
    logInsert() {
        console.log('user inserted with id: ',this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('user updated with id: ',this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('user removed with id: ',this.id);
    }
}