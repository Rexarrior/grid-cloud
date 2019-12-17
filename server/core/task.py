
def fact(n):
    factorial = 1
    while n > 1:
        factorial *= n
        n -= 1
    
    return factorial

import sys
import requests


if __name__ == '__main__':
    id = int(sys.argv[1])
    arg = int(sys.argv[2])
    addr = sys.argv[3]
    ans = fact(arg)
    params = {'id': id, 'answer': ans}
    r = requests.get(url=addr, params=params)