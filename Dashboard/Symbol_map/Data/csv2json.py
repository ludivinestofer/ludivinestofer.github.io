import json

infile = 'evo_pop.csv'
outfile = 'evo_pop.json'

data = {}

f = open(infile)
h = f.readline().strip().split(';')
indata = f.readlines()
for d in indata:
    v = d.strip().split(';')
    print(v)
    annee = int(v[0])
    dicoAnnee = data.get(annee, {})
    dicoAnnee.append( {"kt" : int(v[1]), "abbr" : int(v[2]), "population": int(v[4]), "variation_absolue": int(v[5]), "variation_pourcent": float(v[6]), "naissance" : int(v[7]), "deces" : int(v[8]), "accroissement_naturel" : int(v[9])} )
    data[annee] = dicoAnnee

f.close()

f = open(outfile, 'w')
f.write(json.dumps(data, indent=4, sort_keys=False))
