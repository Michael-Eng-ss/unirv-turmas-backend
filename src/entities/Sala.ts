import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Status } from './Status';
import { Turma } from './Turma';

@Entity({ schema: 'public' })
export class Sala {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  numero!: string;

  @Column()
  nome!: string;

  @Column()
  local!: string;

  @Column()
  capacidade!: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ATIVO
  })
  status!: Status;

  @OneToMany(() => Turma, turma => turma.sala)
  turmas!: Turma[];
}