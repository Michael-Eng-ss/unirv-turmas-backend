import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Status } from './Status';
import { Professor } from './Professor';
import { Disciplina } from './Disciplina';
import { Sala } from './Sala';
import { TurmaAluno } from './TurmaAluno';

@Entity({ schema: 'public' })
export class Turma {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  codigo_turma!: string;

  @Column()
  semestre_ano!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.ATIVO
  })
  status!: Status;

  @Column({ type: 'timestamp' })
  horario_inicio!: Date;

  @Column({ type: 'timestamp' })
  horario_termino!: Date;

  @Column()
  dia_semana!: string;

  @Column({ type: 'int', default: 30 })
  capacidade!: number;

  @ManyToOne(() => Professor, professor => professor.turmas)
  @JoinColumn({ name: 'professor_id' })
  professor!: Professor;

  @ManyToOne(() => Disciplina, disciplina => disciplina.turmas)
  @JoinColumn({ name: 'disciplina_id' })
  disciplina!: Disciplina;

  @ManyToOne(() => Sala, sala => sala.turmas)
  @JoinColumn({ name: 'sala_id' })
  sala!: Sala;

  @OneToMany(() => TurmaAluno, turmaAluno => turmaAluno.turma)
  alunos!: TurmaAluno[];
}