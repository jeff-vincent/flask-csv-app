# -*- coding: utf-8 -*-
from flask import Flask, redirect, url_for, render_template, request, session, jsonify
import json
import sys
import os
import csv, io, requests
import logging

from scripts import forms

app = Flask(__name__)
app.secret_key = os.urandom(12)

from scripts import tabledef
from scripts import helpers


# ======== Routing =========================================================== #
# -------- Login ------------------------------------------------------------- #
@app.route('/', methods=['GET', 'POST'])
def login():
    if not session.get('logged_in'):
        form = forms.LoginForm(request.form)
        if request.method == 'POST':
            username = request.form['username'].lower()
            password = request.form['password']
            if form.validate():
                if helpers.credentials_valid(username, password):
                    session['logged_in'] = True
                    session['username'] = username
                    return json.dumps({'status': 'Login successful'})
                return json.dumps({'status': 'Invalid user/pass'})
            return json.dumps({'status': 'Both fields required'})
        return render_template('login.html', form=form)
    user = helpers.get_user()
    return render_template('query.html', user=user)


@app.route("/logout")
def logout():
    session['logged_in'] = False
    return redirect(url_for('login'))


# -------- Signup ---------------------------------------------------------- #
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if not session.get('logged_in'):
        form = forms.LoginForm(request.form)
        if request.method == 'POST':
            username = request.form['username'].lower()
            password = helpers.hash_password(request.form['password'])
            email = request.form['email']
            if form.validate():
                if not helpers.username_taken(username):
                    helpers.add_user(username, password, email)
                    session['logged_in'] = True
                    session['username'] = username
                    return json.dumps({'status': 'Signup successful'})
                return json.dumps({'status': 'Username taken'})
            return json.dumps({'status': 'User/Pass required'})
        return render_template('login.html', form=form)
    return redirect(url_for('login'))


# -------- Settings ---------------------------------------------------------- #
@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if session.get('logged_in'):
        if request.method == 'POST':
            password = request.form['password']
            if password != "":
                password = helpers.hash_password(password)
            email = request.form['email']
            helpers.change_user(password=password, email=email)
            return json.dumps({'status': 'Saved'})
        user = helpers.get_user()
        return render_template('settings.html', user=user)
    return redirect(url_for('login'))



# -----------Upload View------------------------------------------------------------#
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if session.get('logged_in'):
        if request.method == 'POST':
            file = request.files['file']
            stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
            csv_input = csv.DictReader(stream)
            items = []
            for row in csv_input:

                #--------------------Parse Data----------------------#

                x = row['X']
                y = row["Y"]
                pams_pin = row['PAMS_PIN']
                municipal_code = row['Municipal Code']
                block = row['Block']
                lot = row['Lot']
                qualifier = row['Qualifier']
                prop_class = row['PROP_CLASS']
                county = row['COUNTY']
                municipal_name = ['MUNICIPAL NAME']
                property_location = row['PROPERTY LOCATION']
                owner_name = row['OWNER_NAME']
                owner_st_address = row['Owner_ST_ADDRESS']
                owner_city_state = row['Owner_CITY_STATE']
                owner_zip_code = ['Owner_ZIP_CODE']
                land_val = row['LAND_VAL']
                imprvt_val = row['IMPRVT_VAL']
                net_value = row['NET_VALUE']
                last_yr_tx = row['LAST_YR_TX']
                bldg_desc = row['BLDG_DESC']
                land_desc = row['LAND_DESC']
                calc_acre = row['CALC_ACRE']
                add_lots1 = row['ADD_LOTS1']
                add_lots2 = row['ADD_LOTS2']
                fac_name = row['FAC_NAME']
                prop_use = row['PROP_USE']
                bldg_class = row['BLDG_CLASS']
                deed_book = row['DEED_BOOK']
                deed_page = row['DEED_PAGE']
                deed_date = row['DEED_DATE']
                yr_constr = row['YR_CONSTR']
                sales_code = row['SALES_CODE']
                sale_price = row['SALE_PRICE']
                dwell = row['DWELL']
                comm_dwell = row['COMM_DWELL']
                latitude = row['Latitude']
                longitude = row['Longitude']
                accuracy_score = row['Accuracy Score']
                accuracy_type = row['Accuracy Type']
                number = ['Number']
                property_street = row['PropertyStreet']
                street = row['Street ']
                city = row['City']
                state = row['State']
                zipcode = row['Zipcode']
                source = row['Source']
                summary = row['[summary]']
                delivery_line_1 = row['[delivery_line_1]']
                delivery_line_2 = row['[delivery_line_2]']
                city_name = row['[city_name]']
                state_abbreviation = row['[state_abbreviation]']
                full_zipcode = row['[full_zipcode]']
                notes = row['[notes]']
                county_name = row['[county_name]']
                rdi = row['[rdi]']
                precision = row['[precision]']
                dpv_match_code = row['[dpv_match_code]']
                dpv_footnotes = row['[dpv_footnotes]']
                footnotes = row['[footnotes]']
                zip_type = row['[zip_type]']
                carrier_route = row['[carrier_route]']
                dpv_vacant = row['[dpv_vacant]']
                active = row['[active]']
                urbanization = row['[urbanization]']

                #------------------- CALL Address Clean-up API ---------------#
                # data = {'address': property_location}
                # r = requests.post('http://some-url.com', data)
                # address = r.content


                #-----------------Insert Clean Record into MySQL--------------#

                Session = helpers.get_session()
                _property = tabledef.Property(
                    x=x,
                    y=y,
                    pams_pin=pams_pin,
                    municipal_code=municipal_code,
                    block=block,
                    lot=lot,
                    qualifier=qualifier,
                    prop_class=prop_class,
                    county=county,
                    municipal_name=municipal_name,
                    property_location=property_location,
                    owner_name=owner_name,
                    owner_st_address=owner_st_address,
                    owner_city_state=owner_city_state,
                    owner_zip_code=owner_zip_code,
                    land_val=land_val,
                    imprvt_val=imprvt_val,
                    net_value=net_value,
                    last_yr_tx=last_yr_tx,
                    bldg_desc=bldg_desc,
                    land_desc=land_desc,
                    calc_acre=calc_acre,
                    add_lots1=add_lots1,
                    add_lots2=add_lots2,
                    fac_name=fac_name,
                    prop_use=prop_use,
                    bldg_class=bldg_class,
                    deed_book=deed_book,
                    deed_page=deed_page,
                    deed_date=deed_date,
                    yr_constr=yr_constr,
                    sales_code=sales_code,
                    sale_price=sale_price,
                    dwell=dwell,
                    comm_dwell=comm_dwell,
                    latitude=latitude,
                    longitude=longitude,
                    accuracy_score=accuracy_score,
                    accuracy_type=accuracy_type,
                    number=number,
                    property_street=property_street,
                    street=street,
                    city=city,
                    state=state,
                    zipcode=zipcode,
                    source=source,
                    summary=summary,
                    delivery_line_1=delivery_line_1,
                    delivery_line_2=delivery_line_2,
                    city_name=city_name,
                    rdi=rdi,
                    precision=precision,
                    dpv_match_code=dpv_match_code,
                    dpv_footnotes=dpv_footnotes,
                    footnotes=footnotes,
                    zip_type=zip_type,
                    carrier_route=carrier_route,
                    dpv_vacant=dpv_vacant,
                    active=active,
                    urbanization=urbanization)
                Session.add(_property)
                Session.commit()
                Session.close()
                
            return '<h1 style="color: green;">Upload Successful</h1>'
        else:
            user = helpers.get_user()
            return render_template('upload.html', user=user)
    return redirect(url_for('login'))


#----------------------- Query View -----------------------------------------#
@app.route('/query', methods=['POST'])
def query():

    #------------------- Parse Request -----------------------#
    query_string = request.form['query_string']

    Session = helpers.get_session()
    data = Session.execute(query_string)

    data = tabledef.property_schema.dump(data)

    return jsonify(data)

#----------------------- Get CSV Mapping ------------------------------------#
@app.route('/mapping', methods=['POST'])
def mapping():
    if session.get('logged_in'):
        if request.method == 'POST':
            file = request.files['file']
            stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
            csv_input = csv.reader(stream)
            for row in csv_input:
                header_list = row
                break
            full_string = ''
            for header in header_list:
                html = '<div>{}</div><select><option value="test">The Presets will go here.</option><option value="test">And here.</option></select>'.format(header)
                full_string += html
            return full_string
    return redirect(url_for('login'))

#--------------------- Config View -------------------------------------------#
@app.route('/config', methods=['GET', 'POST'])
def config():
    return render_template('config.html')

# ======== Main ============================================================== #
if __name__ == "__main__":
    
    app.run()
