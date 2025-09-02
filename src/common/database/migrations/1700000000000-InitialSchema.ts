import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create clients table
        await queryRunner.createTable(new Table({
            name: "clients",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "email",
                    type: "varchar",
                    length: "255",
                    isUnique: true
                },
                {
                    name: "password",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        // Create projects table
        await queryRunner.createTable(new Table({
            name: "projects",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "client_id",
                    type: "int"
                },
                {
                    name: "country",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "budget",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "50",
                    default: "'active'"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        // Add foreign key for projects.client_id
        await queryRunner.createForeignKey("projects", new TableForeignKey({
            columnNames: ["client_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "clients",
            onDelete: "CASCADE"
        }));

        // Create vendors table
        await queryRunner.createTable(new Table({
            name: "vendors",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255"
                },
                {
                    name: "rating",
                    type: "float",
                    isNullable: true
                },
                {
                    name: "response_sla_hours",
                    type: "int",
                    isNullable: true
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        // Create services table
        await queryRunner.createTable(new Table({
            name: "services",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    isUnique: true
                }
            ]
        }), true);

        // Create matches table
        await queryRunner.createTable(new Table({
            name: "matches",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "project_id",
                    type: "int"
                },
                {
                    name: "vendor_id",
                    type: "int"
                },
                {
                    name: "score",
                    type: "float"
                },
                {
                    name: "created_at",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                }
            ]
        }), true);

        // Add unique index for matches (project_id, vendor_id)
        await queryRunner.createIndex("matches", new TableIndex({
            name: "IDX_MATCHES_PROJECT_VENDOR",
            columnNames: ["project_id", "vendor_id"],
            isUnique: true
        }));

        // Add foreign keys for matches
        await queryRunner.createForeignKey("matches", new TableForeignKey({
            columnNames: ["project_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "projects",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("matches", new TableForeignKey({
            columnNames: ["vendor_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "vendors",
            onDelete: "CASCADE"
        }));

        // Create project_services table
        await queryRunner.createTable(new Table({
            name: "project_services",
            columns: [
                {
                    name: "project_id",
                    type: "int"
                },
                {
                    name: "service_id",
                    type: "int"
                }
            ]
        }), true);

        // Add composite primary key for project_services
        await queryRunner.createPrimaryKey("project_services", ["project_id", "service_id"]);

        // Add foreign keys for project_services
        await queryRunner.createForeignKey("project_services", new TableForeignKey({
            columnNames: ["project_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "projects",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("project_services", new TableForeignKey({
            columnNames: ["service_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "services",
            onDelete: "CASCADE"
        }));

        // Create vendor_services table
        await queryRunner.createTable(new Table({
            name: "vendor_services",
            columns: [
                {
                    name: "vendor_id",
                    type: "int"
                },
                {
                    name: "service_id",
                    type: "int"
                }
            ]
        }), true);

        // Add composite primary key for vendor_services
        await queryRunner.createPrimaryKey("vendor_services", ["vendor_id", "service_id"]);

        // Add foreign keys for vendor_services
        await queryRunner.createForeignKey("vendor_services", new TableForeignKey({
            columnNames: ["vendor_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "vendors",
            onDelete: "CASCADE"
        }));

        await queryRunner.createForeignKey("vendor_services", new TableForeignKey({
            columnNames: ["service_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "services",
            onDelete: "CASCADE"
        }));

        // Create vendor_countries table
        await queryRunner.createTable(new Table({
            name: "vendor_countries",
            columns: [
                {
                    name: "vendor_id",
                    type: "int"
                },
                {
                    name: "country",
                    type: "varchar",
                    length: "255"
                }
            ]
        }), true);

        // Add composite primary key for vendor_countries
        await queryRunner.createPrimaryKey("vendor_countries", ["vendor_id", "country"]);

        // Add foreign key for vendor_countries
        await queryRunner.createForeignKey("vendor_countries", new TableForeignKey({
            columnNames: ["vendor_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "vendors",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        const tableNames = ["matches", "project_services", "vendor_services", "vendor_countries", "projects"];
        for (const tableName of tableNames) {
            const table = await queryRunner.getTable(tableName);
            if (table) {
                const foreignKeys = table.foreignKeys;
                for (const foreignKey of foreignKeys) {
                    await queryRunner.dropForeignKey(tableName, foreignKey);
                }
            }
        }

        // Drop primary keys for junction tables
        const junctionTables = ["project_services", "vendor_services", "vendor_countries"];
        for (const tableName of junctionTables) {
            const table = await queryRunner.getTable(tableName);
            if (table && table.primaryColumns.length > 0) {
                await queryRunner.dropPrimaryKey(tableName);
            }
        }

        // Drop unique index
        const matchesTable = await queryRunner.getTable("matches");
        if (matchesTable) {
            const index = matchesTable.indices.find(i => i.name === "IDX_MATCHES_PROJECT_VENDOR");
            if (index) {
                await queryRunner.dropIndex("matches", index);
            }
        }

        // Drop tables
        const tables = ["clients", "projects", "vendors", "services", "matches", "project_services", "vendor_services", "vendor_countries"];
        for (const tableName of tables) {
            await queryRunner.dropTable(tableName, true);
        }
    }
}