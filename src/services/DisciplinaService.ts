import { DatabaseConnection } from '../config/DatabaseConnection';
import { Disciplina } from '../entities/Disciplina';
import { Status } from '../entities/Status';

export class DisciplinaService {
  private get disciplinaRepository() {
    return DatabaseConnection
      .getDataSource()
      .getRepository(Disciplina);
  }

  async findById(id: number) {
    return this.disciplinaRepository.findOneBy({ id });
  }

  async findAll() {
    return this.disciplinaRepository.find();
  }

  async create(disciplinaData: Partial<Disciplina>) {
    if (!/^[A-Z0-9]{3,10}$/.test(disciplinaData.codigo || '')) {
      throw new Error('Código inválido. Deve conter 3 a 10 caracteres alfanuméricos');
    }

    const existingCodigo = await this.disciplinaRepository.findOneBy({ codigo: disciplinaData.codigo });
    if (existingCodigo) {
      throw new Error('Código já utilizado por outra disciplina');
    }

    const disciplina = this.disciplinaRepository.create(disciplinaData);
    return this.disciplinaRepository.save(disciplina);
  }

  async update(id: number, disciplinaData: Partial<Disciplina>) {
    const disciplinaExistente = await this.disciplinaRepository.findOneBy({ id });
    if (!disciplinaExistente) {
      throw new Error('Disciplina não encontrada');
    }

    if (disciplinaData.codigo && !/^[A-Z0-9]{3,10}$/.test(disciplinaData.codigo)) {
      throw new Error('Código inválido. Deve conter 3 a 10 caracteres alfanuméricos');
    }

    if (disciplinaData.codigo && disciplinaData.codigo !== disciplinaExistente.codigo) {
      const existingCodigo = await this.disciplinaRepository.findOneBy({ codigo: disciplinaData.codigo });
      if (existingCodigo) {
        throw new Error('Código já utilizado por outra disciplina');
      }
    }

    await this.disciplinaRepository.update(id, disciplinaData);
    return this.disciplinaRepository.findOneBy({ id });
  }

  async desativar(id: number) {
    const disciplina = await this.disciplinaRepository.findOneBy({ id });
    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    if (disciplina.status === Status.INATIVO) {
      throw new Error('Disciplina já está inativa');
    }

    await this.disciplinaRepository.update(id, { status: Status.INATIVO });
    return this.disciplinaRepository.findOneBy({ id });
  }

  async reativar(id: number) {
    const disciplina = await this.disciplinaRepository.findOneBy({ id });
    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    if (disciplina.status === Status.ATIVO) {
      throw new Error('Disciplina já está ativa');
    }

    await this.disciplinaRepository.update(id, { status: Status.ATIVO });
    return this.disciplinaRepository.findOneBy({ id });
  }

  async findInativos(): Promise<Disciplina[]> {
    return this.disciplinaRepository.find({
      where: { status: Status.INATIVO }
    });
  }
}