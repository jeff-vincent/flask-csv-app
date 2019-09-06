# -*- coding: utf-8 -*-

import sys
import os
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from marshmallow import Schema, fields

from main import app


# Local
SQLALCHEMY_DATABASE_URI = os.environ['SQLALCHEMY_DATABASE_URI']


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
    x = Column(String(50))
    y = Column(String(50))
    pams_pin = Column(String(50)) 
    municipal_code = Column(String(50))
    block = Column(String(50))
    lot = Column(String(100))
    qualifier = Column(String(50))
    prop_class = Column(String(50))
    county = Column(String(50))
    municipal_name = Column(String(100))
    property_location = Column(String(50))
    owner_name = Column(String(50))
    owner_st_address = Column(String(50)) 
    owner_city_state = Column(String(100))
    owner_zip_code = Column(String(50))
    land_val = Column(String(100))
    imprvt_val = Column(String(50))
    net_value = Column(String(50))
    last_yr_tx = Column(String(50))
    bldg_desc = Column(String(1100))
    land_desc = Column(String(1100))
    calc_acre = Column(String(100))
    add_lots1 = Column(String(100))
    add_lots2 = Column(String(100))
    fac_name = Column(String(100))
    prop_use = Column(String(100))
    bldg_class = Column(String(100))
    deed_book = Column(String(100))
    deed_page = Column(String(100))
    deed_date = Column(String(100))
    yr_constr = Column(String(100))
    sales_code = Column(String(100))
    sale_price = Column(String(100))
    dwell = Column(String(100))
    comm_dwell = Column(String(100))
    latitude = Column(String(100))
    longitude = Column(String(100))
    accuracy_score = Column(String(100))
    accuracy_type = Column(String(100))
    number = Column(String(100))
    property_street = Column(String(100))
    street = Column(String(100))
    city = Column(String(100))
    state = Column(String(100))
    zipcode = Column(String(100))
    county = Column(String(100))
    source = Column(String(100))
    summary = Column(String(10000))
    delivery_line_1 = Column(String(100))
    delivery_line_2 = Column(String(100))
    city_name = Column(String(100))
    state_abbreviation = Column(String(100))
    full_zipcode = Column(String(100))
    notes = Column(String(100))
    county_name = Column(String(100))
    rdi = Column(String(100))
    precision = Column(String(100))
    dpv_match_code = Column(String(100))
    dpv_footnotes = Column(String(100))
    footnotes = Column(String(100))
    zip_type = Column(String(100))
    carrier_route = Column(String(100))
    dpv_vacant = Column(String(100))
    active = Column(String(100))
    urbanization = Column(String(100))

    def __repr__(self):
        return '<Property %r>' % self.id


class PropertySchema(Schema):
    class Meta:
        fields = ('x','y','pams_pin','municipal_code','block','lot','qualifier','prop_class','county','municipal_name','property_location','owner_name','owner_st_address','owner_city_state','owner_zip_code','land_val','imprvt_val','net_value','last_yr_tx','bldg_desc','land_desc','calc_acre','add_lots1','add_lots2','fac_name','prop_use','bldg_class','deed_book','deed_page','deed_date','yr_constr','sales_code','sale_price','dwell','comm_dwell','latitude','longitude','accuracy_score','accuracy_type','number','property_street','street','city','state','zipcode','source','summary','delivery_line_1','delivery_line_2','city_name','rdi','precision','dpv_match_code','dpv_footnotes','footnotes','zip_type','carrier_route','dpv_vacant','active','urbanization')

    
engine = db_connect()  # Connect to database
Base.metadata.create_all(engine)  # Create models
property_schema = PropertySchema(many=True)