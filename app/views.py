"""
Flask Documentation:     https://flask.palletsprojects.com/
Jinja2 Documentation:    https://jinja.palletsprojects.com/
Werkzeug Documentation:  https://werkzeug.palletsprojects.com/
This file creates your application.
"""

from app import app, db
from flask import render_template, request, jsonify, send_file
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import User
import os


###
# Routing for application.
###

@app.route('/')
def index():
    return jsonify(message="This is the beginning of our API")

bot = TherapyBot()

@app.route('/chat', methods=['POST'])
def chat():
    message = request.json.get('message')
    response = bot.get_response(message)
    return jsonify({'response': response})

# Here we define a function to collect form errors from Flask-WTF
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username'], password=data['password']).first()
    if user:
        token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        return jsonify(token=token, user_id=user.id)
    return jsonify(message="Invalid credentials"), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    user = User(username=data['username'], password=data['password'], name=data['name'], email=data['email'])
    db.session.add(user)
    db.session.commit()
    return jsonify(message="User registered successfully"), 201