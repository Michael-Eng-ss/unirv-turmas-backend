import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Status } from './Status';
import { TurmaAluno } from './TurmaAluno';

@Entity({ schema: 'public' })
export class Aluno {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  cpf!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ATIVO
  })
  status!: Status;

  @OneToMany(() => TurmaAluno, turmaAluno => turmaAluno.aluno)
  turmas!: TurmaAluno[];
}