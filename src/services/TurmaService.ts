import { DatabaseConnection } from '../config/DatabaseConnection';
import { Turma } from '../entities/Turma';
import { Status } from '../entities/Status';
import { TurmaAluno } from '../entities/TurmaAluno';
import { Aluno } from '../entities/Aluno';
import { LessThan, MoreThan, Not } from 'typeorm';

export class TurmaService {
  private get turmaRepository() {
    return DatabaseConnection
      .getDataSource()
      .getRepository(Turma);
  }

  private get turmaAlunoRepository() {
    return DatabaseConnection
      .getDataSource()
      .getRepository(TurmaAluno);
  }

  async findAll() {
    return this.turmaRepository.find({
      relations: ['professor', 'disciplina', 'sala', 'alunos', 'alunos.aluno']
    });
  }

  async findById(id: number) {
    return this.turmaRepository.findOne({
      where: { id },
      relations: ['professor', 'disciplina', 'sala', 'alunos', 'alunos.aluno']
    });
  }

  async create(turmaData: any) {
    const horarioInicio = new Date(turmaData.horario_inicio);
    const horarioTermino = new Date(turmaData.horario_termino);

    if (horarioInicio >= horarioTermino) {
      throw new Error('Horário de início deve ser antes do término');
    }

    const conflito = await this.turmaRepository.findOne({
      where: {
        sala: { id: turmaData.sala.id },
        horario_inicio: LessThan(horarioTermino),
        horario_termino: MoreThan(horarioInicio)
      }
    });

    if (conflito) {
      throw new Error('Conflito de horário na sala selecionada');
    }

    const turma = this.turmaRepository.create({
      ...turmaData,
      horario_inicio: horarioInicio,
      horario_termino: horarioTermino
    });

    return this.turmaRepository.save(turma);
  }

  async update(id: number, turmaData: any) {
    const turmaExistente = await this.turmaRepository.findOneBy({ id });
    if (!turmaExistente) {
      throw new Error('Turma não encontrada');
    }

    const horarioInicio = turmaData.horario_inicio ?
      new Date(turmaData.horario_inicio) : turmaExistente.horario_inicio;

    const horarioTermino = turmaData.horario_termino ?
      new Date(turmaData.horario_termino) : turmaExistente.horario_termino;

    if (horarioInicio >= horarioTermino) {
      throw new Error('Horário de início deve ser antes do término');
    }

    const salaId = turmaData.sala?.id || turmaExistente.sala.id;

    const conflito = await this.turmaRepository.findOne({
      where: {
        id: Not(id),
        sala: { id: salaId },
        horario_inicio: LessThan(horarioTermino),
        horario_termino: MoreThan(horarioInicio)
      }
    });

    if (conflito) {
      throw new Error('Conflito de horário na sala selecionada');
    }

    await this.turmaRepository.update(id, {
      ...turmaData,
      horario_inicio: horarioInicio,
      horario_termino: horarioTermino
    });

    return this.turmaRepository.findOne({
      where: { id },
      relations: ['professor', 'disciplina', 'sala']
    });
  }

  async desativar(id: number) {
    const turma = await this.turmaRepository.findOneBy({ id });
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    if (turma.status === Status.INATIVO) {
      throw new Error('Turma já está inativa');
    }

    await this.turmaRepository.update(id, { status: Status.INATIVO });
    return this.turmaRepository.findOneBy({ id });
  }

  async reativar(id: number) {
    const turma = await this.turmaRepository.findOneBy({ id });
    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    if (turma.status === Status.ATIVO) {
      throw new Error('Turma já está ativa');
    }

    await this.turmaRepository.update(id, { status: Status.ATIVO });
    return this.turmaRepository.findOneBy({ id });
  }

  async adicionarAluno(turmaId: number, alunoId: number) {
    const turma = await this.turmaRepository.findOne({
      where: { id: turmaId },
      relations: ['alunos'],
    });
    const aluno = await DatabaseConnection.getDataSource().getRepository(Aluno).findOneBy({ id: alunoId });

    if (!turma || !aluno) {
      throw new Error('Turma ou aluno não encontrado');
    }

    if (turma.alunos.length >= turma.capacidade) {
      throw new Error('Turma já atingiu a capacidade máxima de alunos');
    }

    const existingMatricula = await this.turmaAlunoRepository.findOne({
      where: {
        turma: { id: turmaId },
        aluno: { id: alunoId }
      }
    });

    if (existingMatricula) {
      throw new Error('Aluno já está matriculado nesta turma');
    }

    const turmaAluno = this.turmaAlunoRepository.create({
      turma: { id: turmaId },
      aluno: { id: alunoId }
    });

    return this.turmaAlunoRepository.save(turmaAluno);
  }

  async removerAluno(turmaId: number, alunoId: number) {
    const result = await this.turmaAlunoRepository.delete({
      turma: { id: turmaId },
      aluno: { id: alunoId }
    });

    if (result.affected === 0) {
      throw new Error('Aluno não encontrado na turma');
    }

    return { success: true };
  }

  async findInativas(): Promise<Turma[]> {
    return this.turmaRepository.find({
      where: { status: Status.INATIVO },
      relations: ['professor', 'disciplina', 'sala', 'alunos', 'alunos.aluno']
    });
  }

  async findAtivas(): Promise<Turma[]> {
    return this.turmaRepository.find({
      where: { status: Status.ATIVO },
      relations: ['professor', 'disciplina', 'sala', 'alunos', 'alunos.aluno']
    });
  }

  async contarAlunos(turmaId: number): Promise<number> {
    const turma = await this.turmaRepository.findOne({
      where: { id: turmaId },
      relations: ['alunos']
    });
    if (!turma) throw new Error('Turma não encontrada');
    return turma.alunos.length;
  }

  async getAlunosDaTurma(turmaId: number) {
  const turmaRepository = DatabaseConnection.getDataSource().getRepository(Turma);
  const turma = await turmaRepository.findOne({
    where: { id: turmaId },
    relations: ['alunos', 'alunos.aluno'], 
  });
  if (!turma) {
    throw new Error('Turma não encontrada');
  }

  return turma.alunos.map((ta: TurmaAluno) => ta.aluno);
}

}