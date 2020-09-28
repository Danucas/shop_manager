#!/usr/bin/python3
"""
Unittest for user model
"""

import unittest
from models import storage
from models.user import User
from models.shop import Shop
from models.client import Client


class TestUser(unittest.TestCase):
    """
    Model User tester class
    """
    def test_create(self):
        """
        test a single user creation
        """
        user = User()
        self.assertIsNotNone(user)

    def test_create_and_save(self):
        """
        Test the storage behavior when saving a user instance
        """
        user = User()
        user.username = 'test_user'
        user.passwd = 'test_pass'
        user.save()
        storage.close()
        storage.reload()
        # Compare with the updated
        compUser = storage.get(User, user.id)
        self.assertIsNotNone(user)
        self.assertIsNotNone(compUser)
        storage.delete(compUser)
        storage.save()
        storage.close()

    def test_shops(self):
        """
        test the @property shop to retrieve a
        list of shop correspoding to this user
        """
        user = User()
        user.username = 'test_user'
        user.passwd = 'test_pass'
        user.save()
        client = Client()
        client.username = 'test_user'
        client.email = 'test_phone'
        client.phone = 'test_pass'
        client.save()
        user.save()
        shop = Shop()
        shop.user = user.id
        shop.client = client.id
        shop.save()
        req_shop = user.shops[0]
        self.assertIsNotNone(req_shop)
        storage.delete(user)
        storage.save()
        storage.close()


if __name__ == '__main__':
    unittest.main() 