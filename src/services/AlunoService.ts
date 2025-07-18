import { DatabaseConnection } from '../config/DatabaseConnection';
import { Aluno } from '../entities/Aluno';
import { Status } from '../entities/Status';
import { validarCPF } from '../utils/cpfValidator';

export class AlunoService {
  private get alunoRepository() {
    return DatabaseConnection
      .getDataSource()
      .getRepository(Aluno);
  }

  async findAll() {
    return this.alunoRepository.find();
  }

  async findById(id: number) {
    return this.alunoRepository.findOneBy({ id });
  }

  async create(alunoData: Partial<Aluno>) {

    if (!validarCPF(alunoData.cpf || '')) {
      throw new Error('CPF inválido');
    }

    const existingCPF = await this.alunoRepository.findOneBy({ cpf: alunoData.cpf });
    if (existingCPF) {
      throw new Error('CPF já cadastrado');
    }

    alunoData.status = alunoData.status
      ? (alunoData.status as string).toUpperCase() as Status
      : Status.ATIVO;


    const aluno = this.alunoRepository.create(alunoData);
    return this.alunoRepository.save(aluno);
  }

  async update(id: number, alunoData: Partial<Aluno>) {
    const alunoExistente = await this.alunoRepository.findOneBy({ id });
    if (!alunoExistente) {
      throw new Error('Aluno não encontrado');
    }

    if (alunoData.cpf && !validarCPF(alunoData.cpf)) {
      throw new Error('CPF inválido');
    }

    if (alunoData.cpf && alunoData.cpf !== alunoExistente.cpf) {
      const existingCPF = await this.alunoRepository.findOneBy({ cpf: alunoData.cpf });
      if (existingCPF) {
        throw new Error('CPF já cadastrado para outro aluno');
      }
    }

    await this.alunoRepository.update(id, alunoData);
    return this.alunoRepository.findOneBy({ id });
  }

  async desativar(id: number) {
    const aluno = await this.alunoRepository.findOneBy({ id });
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    if (aluno.status === Status.INATIVO) {
      throw new Error('Aluno já está inativo');
    }

    await this.alunoRepository.update(id, { status: Status.INATIVO });
    return this.alunoRepository.findOneBy({ id });
  }

  async reativar(id: number) {
    const aluno = await this.alunoRepository.findOneBy({ id });
    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    if (aluno.status === Status.ATIVO) {
      throw new Error('Aluno já está ativo');
    }

    await this.alunoRepository.update(id, { status: Status.ATIVO });
    return this.alunoRepository.findOneBy({ id });
  }

  async findInativos() {
    return this.alunoRepository.find({
      where: { status: Status.INATIVO }
    });
  }
}