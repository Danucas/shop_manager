#!/usr/bin/python3
"""
Base model for MSSQL SQL ORM
"""

import models
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
import uuid
import json

Base = declarative_base()


class BaseModel:
    """
    This model starts a new instance applying
    a uuid record
    """
    id = Column(String(64), primary_key=True)

    def __init__(self):
        """Apply a new id"""
        self.id = str(uuid.uuid4())

    def save(self):
        """
        Saves the inherited object
        """
        models.storage.new(self)
        models.storage.save()

    def to_dict(self):
        """
        Returns a Json representation for the inherited model
        """
        dic = self.__dict__.copy()
        if '_sa_instance_state' in dic:
            del dic['_sa_instance_state']
        return dic