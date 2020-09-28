#!/usr/bin/python
"""
Test Shop storage behavior
"""

import unittest
from models import storage
from models.user import User
from models.shop import Shop
from models.client import Client
from models.category import Category
from models.product import Product
from tests.test_models.test_category import create_shop


class TestShop(unittest.TestCase):
    """
    test DBEngine functionality
    """
    def test_create(self):
        """
        Test a shop creation
        """
        shop = create_shop()
        user = storage.get(User, shop.user)
        self.assertEqual(shop, user.shops[0])
        storage.delete(user)
        storage.save()
        storage.close()


if __name__ == '__main__':
    unittest.main()
