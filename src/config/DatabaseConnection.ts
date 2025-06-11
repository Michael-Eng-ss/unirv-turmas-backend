import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Professor } from '../entities/Professor';
import { Disciplina } from '../entities/Disciplina';
import { Sala } from '../entities/Sala';
import { Turma } from '../entities/Turma';
import { Aluno } from '../entities/Aluno';
import { TurmaAluno } from '../entities/TurmaAluno';

dotenv.config();

export class DatabaseConnection {
    private static dataSource: DataSource;
    private static isInitializing = false;
    private static isInitialized = false;

    public static getDataSource(): DataSource {
        if (!this.dataSource) {
            throw new Error("DataSource não inicializado. Chame connect() primeiro.");
        }
        return this.dataSource;
    }

    private static initializeDataSource() {
        this.dataSource = new DataSource({
            type: "postgres",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "5432"),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            schema: "public", // ADICIONE ESTA LINHA
            synchronize: true,
            logging: false,
            entities: [
                Professor,
                Disciplina,
                Sala,
                Turma,
                Aluno,
                TurmaAluno
            ],
            migrations: [],
            subscribers: [],
        });
    }

    public static async connect(): Promise<void> {
        if (this.isInitialized) return;
        if (this.isInitializing) return;
        
        this.isInitializing = true;
        
        try {
            this.initializeDataSource();
            await this.dataSource.initialize();
            this.isInitialized = true;
            console.log("✅ Banco de dados conectado com sucesso");
        } catch (error) {
            console.error("❌ Erro ao conectar ao banco de dados", error);
            process.exit(1);
        } finally {
            this.isInitializing = false;
        }
    }

    public static async disconnect(): Promise<void> {
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            this.isInitialized = false;
            console.log("🔌 Conexão com o banco de dados encerrada");
        }
    }
}