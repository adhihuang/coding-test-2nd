from peewee import *

from config import (
    settings , 
    WEBUI_DB
)

class Documents(Model):
        document_id = AutoField()
        file_key = CharField(max_length=255)
        file_name = CharField(max_length=255)
        file_type = CharField(max_length=255)
        file_size = CharField(max_length=255)

        class Meta:
            database = WEBUI_DB
            table_name = "documents"

class ModelDocuments:
    def __init__(self):
        self.model = Documents

    def getTotal(self):
        model = self.model 
        documents = model.select(
                fn.COUNT(model.document_id).alias('total_uploaded')
            ).dicts().get()
        
        return documents

    def getDocuments(self):
        model = self.model
        document = list(model.select().dicts())

        return document
    
    def insertDocument(self , file_key , file_name , file_type , file_size):
        try:
            return self.model.create(
                file_key = file_key , 
                file_name = file_name , 
                file_type = file_type , 
                file_size = file_size , 
            )
        except Exception as e:
            print(f"Error inserting documents: {e}")
            return None