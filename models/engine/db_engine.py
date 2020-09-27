#!/usr/bin/python3
"""
DB engine, stablish connection with the MSSQL DB
"""

from models.base import Base, BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import pyodbc


class DBEngine:
    __engine = None
    __session = None

    def __init__(self):
        """
        Create Engine using Environment variables
        """
        user = 'sa'
        password = 'Shop_dev'
        host = 'sqlserver'
        db = 'db_shop'
        print('Driver:')
        print(pyodbc.drivers()[0])
        driver = pyodbc.drivers()[0]
        # driver = 'SQL Server'
        self.__engine = create_engine(
            "mssql+pyodbc://{}:{}@{}:1433/{}?driver={}".format(
                user,
                password,
                host,
                db,
                driver.replace(' ', '+')
            )
        )

    def reload(self):
        """
        Creates the model based on the metadata from Base
        """
        try:
            Base.metadata.create_all(self.__engine)
            sess_factory = sessionmaker(bind=self.__engine,
                                        expire_on_commit=False)
            Session = scoped_session(sess_factory)
            self.__session = Session
        except Exception as e:
            print(e)

    def close(self):
        """
        Close the actual session
        """
        self.__session.remove()

    def save(self):
        """
        Save changes in session
        """
        self.__session.commit()

    def new(self, obj):
        """
        Add a new instance to DB
        """
        self.__session.add(obj)

    def get_user(self, cls=None, username=None):
        """
        Get an Unique user
        """
        user = self.__session.query(cls).filter_by(username=username).first()
        return user

    def all(self, cls=None):
        """
        Return all records from a cls table
        """
        instances = {}
        objects = self.__session.query(cls).all()
        for obj in objects:
            key = obj.__class__.__name__ + '.' + obj.id
            instances[key] = obj
        return instances

    def get(self, cls, obj_id):
        """
        Get an object by the given id
        """
        objs = self.__session.query(cls).filter_by(id=obj_id).first()
        return objs

    def filter_by(self, cls, attr, value):
        """
        Return a dict with all the instances filtered by attr and value
        """
        query = {
            attr: value
        }
        objs = self.__session.query(cls).filter_by(**query).all()
        return objs

    def session(self):
        """
        return the session
        """
        return self.__session

    def delete(self, obj):
        """
        Delete an object instances from the db
        """
        self.__session.delete(obj)