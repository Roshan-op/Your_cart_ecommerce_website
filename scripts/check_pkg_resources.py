import sys
try:
    import pkg_resources
    print('pkg_resources available at:', pkg_resources.__file__)
except Exception as e:
    print('pkg_resources import failed:', type(e).__name__, e)
print('python executable:', sys.executable)
print('python version:', sys.version)
print('sys.path sample:', sys.path[:10])
