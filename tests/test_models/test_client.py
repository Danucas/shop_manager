#!/usr/bin/python
"""
Test Client storage behavior
"""

import unittest
from models import storage
from models.user import User
from models.shop import Shop
from models.client import Client
from models.category import Category
from models.product import Product


class TestClient(unittest.TestCase):
    """
    test DBEngine functionality
    """
    def test_create(self):
        """
        Test a client creation
        """
        client = Client()
        client.username = 'test_user'
        client.email = 'test_phone'
        client.phone = 'test_pass'
        client.save()
        storage.close()
        savedClient = storage.get(Client, client.id)
        self.assertIsNotNone(savedClient)
        storage.delete(savedClient)
        storage.save()
        storage.close()


if __name__ == '__main__':
    unittest.main()
