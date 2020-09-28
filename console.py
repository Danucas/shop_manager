#!/usr/local/bin/python3
"""
Shop Shell used to manage and debug the DBEngine behavior
"""

import cmd
import sys
from models import storage
from models.user import User
from models.product import Product
from models.category import Category
from models.shop import Shop
from models.auth import CachedUser
from models.order import Order
from models.client import Client

classes = {
    'User': User,
    'Product': Product,
    'Category': Category,
    'Shop': Shop,
    'CachedUser': CachedUser,
    'Order': Order,
    'Client': Client
}


class ShopShell(cmd.Cmd):
    """
    Interactive propmt to make db requests
    """
    intro = "Welcome to Shop Manager Shell!"
    prompt = '(shpmngr) '
    file = None

    def session_close(self):
        """
        close the DBEngine session
        """
        storage.close()

    def do_all(self, arg):
        """
        all <Class>
        Show all instances by <Class>
        """
        print("{} instances:".format(arg))
        all_instances = storage.all(classes[arg]).values()
        for inst in all_instances:
            print(inst.id)
        storage.close()

    def do_create(self, arg):
        """
        create <Class> <attr:value> <attr:value>
        create a new intance for the given <Class>
        """
        args = parse(arg)
        if len(args) < 2:
            print('Please provide at least one attribute for this class')
        else:
            newInstance = classes[args[0]]()
            print(args[1:])
            for attr in args[1:]:
                att = attr.split(':')[0]
                value = attr.split(':')[1]
                setattr(newInstance, att, value)
                print(att, value)
            newInstance.save()
        storage.close()
        storage.reload()

    def do_show(self, arg):
        """
        show <Class> <instance.id>
        Show the dict reprensentation of an Instances of the given <Class> by id
        """
        args = parse(arg)
        if len(args) < 2:
            print('Please provide the Class and the instance.id to search')
        else:
            print(args)
            print(storage.get(classes[args[0]], args[1]).to_dict())
        storage.close()

    def do_ex(self, arg):
        """
        ex <Class> <id> <function> <args...>
        Execute a function from the intance
        """
        args = parse(arg)
        if len(args) < 2:
            print('Please provide the Class and the function to run')
        else:
            print(args)
            clsObj = storage.get(classes[args[0]], args[1])
            f = getattr(clsObj, args[2])
            print(f)
        storage.close()

    def do_delete_all(self, arg):
        """
        delete_all <Class>
        Delete all instances for the given class (only development purposes)
        """
        print('deleting all {} instances'.format(arg))
        all_inst = storage.all(classes[arg])
        print(all_inst)
        for inst in all_inst.values():
            print(inst.id)
            try:
                storage.delete(inst)
                storage.save()
                storage.reload()
            except Exception as e:
                print(e)
        storage.close()

    def do_exit(self, arg):
        """
        Exits the command prompt
        """
        self.close()

    def close(self):
        """
        Close
        """
        if self.file:
            self.file.close()
            self.file = None

    def do_printdb(self, arg):
        """
        printdb
        print all tables contained in db
        """
        print('db_shop TABLES:')
        print(classes.keys())


def parse(arg):
    """
    Parse the argument string
    """
    return arg.split()

if __name__ == '__main__':
    storage.reload()
    ShopShell().cmdloop()
