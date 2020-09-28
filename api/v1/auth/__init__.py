#!/usr/bin/python3
"""
API Auth service
"""

from flask import Blueprint, jsonify, request, current_app
import jwt
from functools import wraps
from models import storage
from models.user import User
from models.auth import CachedUser
import traceback

app_auth = Blueprint(
    'api_auth',
    __name__,
    url_prefix='/api/auth'
)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('authorization')
        if not token:
            return jsonify({'message': 'Token is missing'})
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'])
            print('Data:', data)
            user = storage.filter_by(User, 'id', data['user_id'])[0]
            # Add a feature to handle expired tokens and CachedUsers
            print('User:', user)
            request.user = user.id
        except Exception as e:
            traceback.print_exc()
            print(e)
            return jsonify({
                'message': 'Token is invalid',
                'type': 'error'}), 401
        return f(*args, **kwargs)

    return decorated

from api.v1.auth.shops import *
