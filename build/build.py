#!/usr/bin/python
# -*- coding: utf-8 -*-

# jQuery utils python build system 
# http://code.google.com/p/jquery-utils/
#
# (c) Maxime Haineault <haineault@gmail.com> 
# http://haineault.com
#
# MIT License (http://www.opensource.org/licenses/mit-license.php

from optparse import OptionParser
from glob import glob
import jsmin, re, os, shutil, sys, tarfile, yaml

LOG      = True
BASE_DIR = os.path.realpath('.')
DIST_DIR = os.path.join(BASE_DIR, 'dist/')
SRC_DIR  = os.path.join(BASE_DIR, 'src/')
TMP_DIR  = os.path.join(BASE_DIR, '.tmp/')

LOGS = {
    'info':         '\n [\x1b\x5b1;31mI\x1b\x5b0;0m] %s',
    'minify':       '\n [\x1b\x5b01;33mM\x1b\x5b0;0m] %s',
    'gzip':         '\n [\x1b\x5b01;32mG\x1b\x5b0;0m] %s',
    'copy':         '\n [\x1b\x5b1;36mC\x1b\x5b0;0m] %s',
    'tag':          '\n [\x1b\x5b1;34mC\x1b\x5b0;0m] %s',
    'error':        'Error: %s',
}

def get_version(src):
    f = os.path.join(BASE_DIR, src)
    c = slurp(f)
    try:
        return re.search("version: (.*)", c).group().split(' ')[1]
    except:
        return 'unknown'


def log(msg, log_type=False):
    if LOG:
        print LOGS.get(log_type, '%s') % msg

def legend():
    for k in LOGS:
        if k not in ('list', 'error'):
            print LOGS[k] % k

def create_dir_if_not_exists(path):
    if not os.path.exists(path):
        log("creating directory: %s/" % path, 'list')
        os.mkdir(path)
    return path


def minify(src, dst):
    log('%s -> %s' % (src, dst), 'minify')
    try:
        fin = open(src)
        if not os.path.exists(dst):
            os.system('touch %s' % dst)
        fout = open(dst, 'w')
        jsm = jsmin.JavascriptMinify()
        jsm.minify(fin, fout)
        fin.close()
        fout.close()
    except Exception, e:
        log('Cannot minify %s -> %s (%s)' % (src, dst, e), 'error')

def cp(src, dest):
    log('%s -> %s' % (src, dest), 'copy')
    if os.path.isdir(src):
        shutil.copytree(src, dest)
    else:
        shutil.copy(src, dest)

def create_gzip(src, dst, exclusions=[]):
    create_dir_if_not_exists(os.path.dirname(dst))
    log('%s -> %s' % (src, dst), 'gzip')
    tar = tarfile.open(dst, 'w:gz')
    tar.add(src, recursive=True, arcname=os.path.basename(dst).replace('.tar.gz',''))
    tar.close()

def slurp(f):
    """
    Returns file content as string
    """
    fd = open(f)
    buf = fd.readlines()
    fd.close()
    return ''.join(buf)

def make(options):
    global LOG
    if options.quiet:
        LOG = False

    VERSION  = get_version('src/string.format.js')

    log("Building string.format.js v%s" % VERSION, 'info')

    if os.path.exists(TMP_DIR):
        shutil.rmtree(TMP_DIR)

    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)

    os.mkdir(DIST_DIR)
    os.mkdir(TMP_DIR)
    os.mkdir(os.path.join(TMP_DIR, 'src/'))

    # Copy files
    cp(os.path.join(BASE_DIR, 'LICENSE'), TMP_DIR)
    cp(os.path.join(BASE_DIR, 'README.rst'), TMP_DIR)
    cp(os.path.join(BASE_DIR, 'tests/'), os.path.join(TMP_DIR, 'tests/'))
    cp(os.path.join(SRC_DIR,  'string.format.js'), os.path.join(TMP_DIR, 'src/'))

    # Minify
    minsrc  = os.path.join(os.path.join(TMP_DIR, 'src/string.format.js'))
    mindest = os.path.join(os.path.join(TMP_DIR, 'src/string.format.min.js'))
    minify(minsrc, mindest)

    # Create archive
    destgzip = 'string-format-js-%s.tar.gz' % VERSION
    create_gzip(TMP_DIR, os.path.join(DIST_DIR, destgzip))

    # if confirm ..
   #log("Creating and pushing tag v1.0", 'info')

    shutil.rmtree(TMP_DIR)
    log('Done.\n', 'info')


if __name__ == '__main__':
    usage = "usage: %prog [options] <module>"

    parser = OptionParser(usage=usage)

    parser.add_option('-q', '--quiet', dest='quiet',
                      help='Not console output',
                      action='store_true', default=False)
    parser.add_option('-l', '--legend', dest='legend',
                      help='Print legend',
                      action='store_true', default=False)

    (options, args) = parser.parse_args()



    if options.legend:
        legend()
    else:
        make(options)

