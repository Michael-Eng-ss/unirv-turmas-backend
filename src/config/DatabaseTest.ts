import { DatabaseConnection } from "./DatabaseConnection";

export class DatabaseTest {
    public static async connect() {
        try {
            await DatabaseConnection.connect();
            console.log("✅ Banco de dados conectado com sucesso");
        } catch (error) {
            console.error("❌ Erro ao conectar ao banco de dados", error);
            process.exit(1);
        }
    }

    public static async disconnect() {
        await DatabaseConnection.disconnect();
        console.log("🔌 Conexão com o banco de dados encerrada");
    }
}