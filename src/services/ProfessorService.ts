import { DatabaseConnection } from '../config/DatabaseConnection';
import { Professor } from '../entities/Professor';
import { Status } from '../entities/Status';
import { validarCPF } from '../utils/cpfValidator';

export class ProfessorService {
    private get professorRepository() {
        return DatabaseConnection
            .getDataSource()
            .getRepository(Professor);
    }

    async findAll() {
        return this.professorRepository.find();
    }

    async findById(id: number) {
        return this.professorRepository.findOneBy({ id });
    }

    async create(professorData: Partial<Professor>) {
        if (professorData.cpf && !validarCPF(professorData.cpf)) {
            throw new Error('CPF inválido');
        }

        if (professorData.cpf) {
            const existingCPF = await this.professorRepository.findOneBy({ cpf: professorData.cpf });
            if (existingCPF) {
                throw new Error('CPF já cadastrado');
            }
        }

        const professor = this.professorRepository.create(professorData);
        return this.professorRepository.save(professor);
    }

    async update(id: number, professorData: Partial<Professor>) {
        const professorExistente = await this.professorRepository.findOneBy({ id });
        if (!professorExistente) {
            throw new Error('Professor não encontrado');
        }

        if (professorData.cpf && !validarCPF(professorData.cpf)) {
            throw new Error('CPF inválido');
        }

        if (professorData.cpf && professorData.cpf !== professorExistente.cpf) {
            const existingCPF = await this.professorRepository.findOneBy({ cpf: professorData.cpf });
            if (existingCPF) {
                throw new Error('CPF já cadastrado para outro professor');
            }
        }

        await this.professorRepository.update(id, professorData);
        return this.professorRepository.findOneBy({ id });
    }

    async desativar(id: number) {
        const professor = await this.professorRepository.findOneBy({ id });
        if (!professor) {
            throw new Error('Professor não encontrado');
        }

        if (professor.status === Status.INATIVO) {
            throw new Error('Professor já está inativo');
        }

        await this.professorRepository.update(id, { status: Status.INATIVO });
        return this.professorRepository.findOneBy({ id });
    }

    async reativar(id: number) {
        const professor = await this.professorRepository.findOneBy({ id });
        if (!professor) {
            throw new Error('Professor não encontrado');
        }

        if (professor.status === Status.ATIVO) {
            throw new Error('Professor já está ativo');
        }

        await this.professorRepository.update(id, { status: Status.ATIVO });
        return this.professorRepository.findOneBy({ id });
    }

    async findInativos(): Promise<Professor[]> {
        return this.professorRepository.find({
            where: { status: Status.INATIVO }
        });
    }

    async findAtivos(): Promise<Professor[]> {
        return this.professorRepository.find({
            where: { status: Status.ATIVO }
        });
    }
}