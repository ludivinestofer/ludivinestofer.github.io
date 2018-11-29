import json

infile = 'age_cantons.csv'
outfile = 'age_cantons.json'

data = {}

f = open(infile)
h = f.readline().strip().split(';')
indata = f.readlines()
for d in indata:
    v = d.strip().split(';')
    kt = v[1]
    print(v)
    annee = int(v[0])
    dicoAnnee = data.get(annee, {})
    listCanton = dicoAnnee.get(kt, [])
    listCanton.append( {"age": v[3], "sexe": int(v[4]), "population": int(0 if v[5] == '' else v[5])} )
    dicoAnnee[kt] = listCanton
    data[annee] = dicoAnnee

f.close()

f = open(outfile, 'w')
f.write(json.dumps(data, indent=4, sort_keys=False))
