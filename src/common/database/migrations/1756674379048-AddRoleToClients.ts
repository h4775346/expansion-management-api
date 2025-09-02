import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRoleToClients1756674379048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('clients', new TableColumn({
            name: 'role',
            type: 'varchar',
            length: '50',
            default: `'client'`,
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('clients', 'role');
    }

}