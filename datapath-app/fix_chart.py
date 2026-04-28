import re
path = r'd:\data anyles proooo\datapath-app\src\components\DataChart.tsx'
with open(path, 'rb') as f:
    content = f.read().decode('utf-8')
# Swap Download icon for Camera
content = content.replace('<Download size={14} />', '<Camera size={14} />')
with open(path, 'wb') as f:
    f.write(content.encode('utf-8'))
print('Patched DataChart icon')
