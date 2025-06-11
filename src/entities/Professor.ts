import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Status } from './Status';
import { Turma } from './Turma';

@Entity({ schema: 'public' })
export class Professor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column()
  titulacao!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ATIVO
  })
  status!: Status;


  @OneToMany(() => Turma, turma => turma.professor)
  turmas!: Turma[];
}