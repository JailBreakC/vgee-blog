import os,re

def get_head(name):
    head = []
    try:
        if not re.match(r'^\d{4}-\d{1,2}-\d\d-',name) : 
            print('ignore file '+name)
            return None
        for i in open(name).read().splitlines():
            if re.match(r'^[\-=]*$',i):break
            head.append(i)
        head.append('url: %s'%name)
        print('success name '+name)
        return '\n'.join(head)
    except Exception as e:
        print('error file '+name)
        print(e)
        return None


file_list = os.listdir('.')
file_list.sort()
head = filter(None,map(get_head,file_list))[::-1]
open('list.md','w').write('\n-------\n'.join(head))

