#! /bin/python

from distutils.dir_util import copy_tree
import json
from os import path
import shutil 

dir_path = path.dirname(path.realpath(__file__))

def handle_package(config, package_name):
    lib_path = config["packages"][package_name]["depPath"]
    lib_path = path.join(dir_path, lib_path) 
    dep_list = config["packages"][package_name]["deps"]
    for dep_name in dep_list:
        dep = config["deps"][dep_name]
        dep_path = dep["path"]
        dep_path = path.join(dir_path, dep_path)
        dep_alias = dep["alias"]
        dest_path = path.join(lib_path, dep_alias)
        dest_path = path.join(dir_path, dest_path)
        shutil.rmtree(dest_path, ignore_errors= True)
        copy_tree(dep_path, dest_path)

if __name__ == "__main__":
    with open('deps.json') as config_file:
        config = json.load(config_file)
        for key in config["packages"]:
            handle_package(config, key)
