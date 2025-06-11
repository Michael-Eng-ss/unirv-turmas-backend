import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Turma } from './Turma';
import { Aluno } from './Aluno';

@Entity({ schema: 'public' })
export class TurmaAluno {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Turma, turma => turma.alunos)
  turma!: Turma;

  @ManyToOne(() => Aluno, aluno => aluno.turmas)
  aluno!: Aluno;
}