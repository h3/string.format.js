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
import jsmin, re, os, sys, shutil

LOG      = True
BASE_DIR = os.path.realpath('.')
SRC_DIR  = os.path.join(BASE_DIR, 'src/')

LOGS = {
    'info':         '\n [\x1b\x5b1;31mI\x1b\x5b0;0m] %s',
    'minify':       '\n [\x1b\x5b01;33mM\x1b\x5b0;0m] %s',
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

    # Minify
    minsrc  = os.path.join(os.path.join(SRC_DIR, 'string.format.js'))
    mindest = os.path.join(os.path.join(SRC_DIR, 'string.format.min.js'))
    minify(minsrc, mindest)

    log("Creating and pushing tag v1.0" % VERSION, 'info')
    os.system('git tag -a v%s' % VERSION)
    os.system('git push origin v%s' % VERSION)

    log('Done.\n', 'info')
    log('To delete remote tag in case of errors, type this command:')
    log('git tag -d v%s && git push origin :refs/tags/v%s' % (VERSION, VERSION))

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
