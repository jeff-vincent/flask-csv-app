# -*- coding: utf-8 -*-

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from flask_table import Table, Col

# Local
SQLALCHEMY_DATABASE_URI = 'sqlite:///accounts.db'

# Heroku
#SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

Base = declarative_base()


def db_connect():
    """
    Performs database connection using database settings from settings.py.
    Returns sqlalchemy engine instance
    """
    return create_engine(SQLALCHEMY_DATABASE_URI)


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    username = Column(String(30), unique=True)
    password = Column(String(512))
    email = Column(String(50))

    def __repr__(self):
        return '<User %r>' % self.username

class Property(Base):
    __tablename__ = 'csv'

    id = Column(Integer, primary_key=True)
    csv_column_1 = Column(String(5000))
    csv_column_2 = Column(String(5000))
    csv_column_3 = Column(String(5000)) 


class ItemTable(Table):
    name = Col('Name')
    description = Col('Description')



    
engine = db_connect()  # Connect to database
Base.metadata.create_all(engine)  # Create models
