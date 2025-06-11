import { DatabaseConnection } from '../config/DatabaseConnection';
import { Sala } from '../entities/Sala';
import { Status } from '../entities/Status';

export class SalaService {
  private get salaRepository() {
    return DatabaseConnection
      .getDataSource()
      .getRepository(Sala);
  }

  async findById(id: number) {
    return this.salaRepository.findOneBy({ id });
  }

  async findAll() {
    return this.salaRepository.find();
  }

  async create(salaData: Partial<Sala>) {
    if (!salaData.numero) {
      throw new Error('Número da sala é obrigatório');
    }

    const existingNumero = await this.salaRepository.findOneBy({ numero: salaData.numero });
    if (existingNumero) {
      throw new Error('Número de sala já cadastrado');
    }

    const sala = this.salaRepository.create(salaData);
    return this.salaRepository.save(sala);
  }

  async update(id: number, salaData: Partial<Sala>) {
    const salaExistente = await this.salaRepository.findOneBy({ id });
    if (!salaExistente) {
      throw new Error('Sala não encontrada');
    }

    if (salaData.numero && salaData.numero !== salaExistente.numero) {
      const existingNumero = await this.salaRepository.findOneBy({ numero: salaData.numero });
      if (existingNumero) {
        throw new Error('Número de sala já utilizado');
      }
    }

    await this.salaRepository.update(id, salaData);
    return this.salaRepository.findOneBy({ id });
  }

  async desativar(id: number) {
    const sala = await this.salaRepository.findOneBy({ id });
    if (!sala) {
      throw new Error('Sala não encontrada');
    }

    if (sala.status === Status.INATIVO) {
      throw new Error('Sala já está inativa');
    }

    await this.salaRepository.update(id, { status: Status.INATIVO });
    return this.salaRepository.findOneBy({ id });
  }

  async reativar(id: number) {
    const sala = await this.salaRepository.findOneBy({ id });
    if (!sala) {
      throw new Error('Sala não encontrada');
    }

    if (sala.status === Status.ATIVO) {
      throw new Error('Sala já está ativa');
    }

    await this.salaRepository.update(id, { status: Status.ATIVO });
    return this.salaRepository.findOneBy({ id });
  }

  async findInativos(): Promise<Sala[]> {
    return this.salaRepository.find({
      where: { status: Status.INATIVO }
    });
  }

  async findAtivas() {
    return this.salaRepository.find({
      where: { status: Status.ATIVO }
    });
  }
}