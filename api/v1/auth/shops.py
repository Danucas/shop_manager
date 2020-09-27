#!/usr/bin/python3
"""
Check and Handle the Auth flow
"""

from api.v1.auth import app_auth, token_required
from models import storage
from models.user import User
from models.auth import CachedUser
from flask import request, jsonify, current_app
import jwt
from datetime import datetime, timedelta

@app_auth.route('/login',
                methods=['POST'],
                strict_slashes=False)
def login():
    """
    User verification for login and Auth
    """
    user = request.values.get('username')
    passwd = request.values.get('password')
    user_check = storage.get_user(User, user)
    if not user:
        return jsonify(message='username not provided'), 401
    if not user_check:
        return jsonify(message='user does not exists'), 401
    if user == user_check.username and passwd == user_check.passwd:
        return 'Success the user exists'
    if user == user_check.username and passwd != user_check.passwd:
        return jsonify(message='authorization failed'), 403
    return 'Failed Authorization required'


@app_auth.route('/tmp_user',
                methods=['POST'],
                strict_slashes=False)
def tmp_user():
    """
    Create a temporal user
    """
    user = request.values.get('username')
    passwd = request.values.get('password')
    if not user or not passwd:
        user = request.get_json()['username']
        passwd = request.get_json()['password']
    if not user or not passwd:
        return jsonify(message="Please include your username and password"), 401
    user_instance = User()
    user_instance.username = user
    user_instance.passwd = passwd
    token = jwt.encode(
        {
            'user_id': user_instance.id,
            'exp': datetime.utcnow() + timedelta(minutes=60)
        },
        current_app.config['SECRET_KEY']
    )
    token = token.decode('UTF-8')
    cached_user = CachedUser()
    cached_user.user_id = user_instance.id
    cached_user.token = token
    user_instance.save()
    cached_user.save()
    return jsonify(token=token, id=user_instance.id)


@app_auth.route('/test',
                methods=['GET'],
                strict_slashes=False)
@token_required
def test():
    """
    Testing endpoint
    """
    print(request.user)
    return 'Success'

@app_auth.route('/create_admin',
                methods=['POST'],
                strict_slashes=False)
@token_required
def create_admin():
    """
    User verification for login and Auth
    """
    user = request.values.get('username')
    passwd = request.values.get('password')
    tmptoken = request.values.get('tmptoken')
    user_check = storage.get_user(User, user)
    print(tmptoken)
    if user_check:
        return jsonify(message='username not provided'), 409
    if tmptoken:
        tmpuser = storage.get_user(User, tmpuser)
    if user == user_check.username and passwd == user_check.passwd:
        return 'Success the user exists'
    if user == user_check.username and passwd != user_check.passwd:
        return jsonify(message='authorization failed'), 403
    return 'Failed Authorization required'

@app_auth.route('/status')
@token_required
def auth_status():
    """
    Check the token validation from the client
    """
    return jsonify(message='Success')