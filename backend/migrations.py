import importlib.util , os
from pathlib import Path
from peewee import SqliteDatabase, Model, CharField

from config import WEBUI_DB

class MigrationHistory(Model):
    filename = CharField(unique=True)

    class Meta:
        database = WEBUI_DB
        table_name = "migration_history"

class RunMigrations:
    def apply_migrations():
        print("📦 Connecting to DB")
        WEBUI_DB.connect()
        WEBUI_DB.create_tables([MigrationHistory])

        migration_dir = Path(__file__).resolve().parent / "services/internal/migrations"
        migration_files = sorted(migration_dir.glob("*.py"))

        for file_path in migration_files:
            filename = file_path.name
            if MigrationHistory.select().where(MigrationHistory.filename == filename).exists():
                print(f"✅ Skipping already applied migration: {filename}")
                print("✅ =============================")
                continue

            print(f"🚀 Applying migration: {filename}")
            spec = importlib.util.spec_from_file_location("migration_module", file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)

            if hasattr(module, "migrate"):
                module.migrate(WEBUI_DB)
                MigrationHistory.create(filename=filename)
                print(f"✅ Migration applied: {filename}")
                print("✅ =============================")
            else:
                print(f"⚠️ No migrate(db) function in {filename}")

        WEBUI_DB.close()
