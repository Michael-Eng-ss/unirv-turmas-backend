import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Status } from './Status';
import { Turma } from './Turma';

@Entity({ schema: 'public' })
export class Disciplina {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  codigo!: string;

  @Column()
  nome!: string;

  @Column()
  periodo!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ATIVO
  })
  status!: Status;


  @OneToMany(() => Turma, turma => turma.disciplina)
  turmas!: Turma[];
}