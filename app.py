# -*- coding: utf-8 -*-

from scripts import tabledef
from scripts import forms
from scripts import helpers
from flask import Flask, redirect, url_for, render_template, request, session, jsonify
import json
import sys
import os
import csv, io, requests

app = Flask(__name__)

# Heroku
#from flask_heroku import Heroku
#heroku = Heroku(app)

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
                property_location = row['Property Location']
                county = row['County']
                municipality_name=row['Municipality Name']
                block=row['Block']
                lot=row['Lot']
                qualifier=row['Qualifier']
                owners_name=row['Owner(s) Name']
                owners_city=row['Owner(s) City']
                owners_state=row['Owner(s) State']
                owners_zip=row['Owner(s) Zip']
                owners_mailing_address=row['Owner(s) Mailing Address']

                #------------------- CALL Address Clean-up API ---------------#
                # data = {'address': property_location}
                # r = requests.post('http://some-url.com', data)
                # address = r.content


                #-----------------Insert Clean Record into MySQL--------------#
                Session = helpers.get_session()
                _property = tabledef.Property(
                    county=county,
                    municipality_name=municipality_name,
                    block=block,
                    lot=lot,
                    qualifier=qualifier,
                    owners_name=owners_name,
                    owners_city=owners_city,
                    owners_state=owners_state,
                    owners_zip=owners_zip,
                    owners_mailing_address=owners_mailing_address)
                Session.add(_property)
                Session.commit()
                Session.close()

                errors = []
                # Session = helpers.get_session()
                # try:
                #     q = Session.query(Property).filter(Property.name != 'some name')
                #     Session.execute(q)
                # except:
                #     errors.append(owners_mailing_address)
                #     continue
                # with open('log.txt', 'w+') as log:
                #     error_string = ''.join(errors)
                #     log.write(error_string)


                #------------------- Flask_Table -----------------------#

                #-----------Sample Data-------------------#
                # Creating a dict to pass to Flask Tables
                estate = dict(
                    county=row['County'], 
                    municipality_name=row['Municipality Name'],
                    block=row['Block'],
                    lot=row['Lot'],
                    qualifier=row['Qualifier'],
                    owners_name=row['Owner(s) Name'],
                    owners_city=row['Owner(s) City'],
                    owners_state=row['Owner(s) State'],
                    owners_zip=row['Owner(s) Zip'],
                    owners_mailing_address=row['Owner(s) Mailing Address'])
                
                items.append(estate)

                # Populate the table
                table = tabledef.ItemTable(items)
                html = table.__html__()

            return html
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
    return jsonify(data.data)







#--------------------- Config View -------------------------------------------#
@app.route('/config', methods=['GET', 'POST'])
def config():
    return render_template('config.html')

# ======== Main ============================================================== #
if __name__ == "__main__":
    app.secret_key = os.urandom(12)  # Generic key for dev purposes only
    app.run(debug=True, use_reloader=True)
