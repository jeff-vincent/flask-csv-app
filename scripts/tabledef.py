# -*- coding: utf-8 -*-

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from flask_marshmallow import Marshmallow
import app
from app import app

# Local
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost/csvdb'
ma = Marshmallow(app)

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
    __tablename__ = 'property'

    id = Column(Integer, primary_key=True)
    county = Column(String(50))
    municipality_name = Column(String(50))
    block = Column(String(50)) 
    lot = Column(String(50))
    qualifier = Column(String(50))
    owners_name = Column(String(100))
    owners_city = Column(String(50))
    owners_state = Column(String(50))
    owners_zip = Column(String(50))
    owners_mailing_address = Column(String(100))

    def __repr__(self):
        return '<Property %r>' % self.id

class PropertySchema(ma.ModelSchema):
    class Meta:
        model = Property

    
engine = db_connect()  # Connect to database
Base.metadata.create_all(engine)  # Create models
property_schema = PropertySchema(many=True)