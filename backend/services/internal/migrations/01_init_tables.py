from peewee import *

def migrate(db):
    class Documents(Model):
        document_id = AutoField()
        file_key = CharField(max_length=255)
        file_name = CharField(max_length=255)
        file_type = CharField(max_length=255)
        file_size = CharField(max_length=255)

        class Meta:
            database = db
            table_name = "documents"

    if not Documents.table_exists():
        db.create_tables([Documents])
        print("✅ Table 'documents' created.")
    else:
        print("⚠️ Table 'documents' already exists.")