var mymap = L.map('map').setView([36.008929, -117.837364], 6);

var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {minZoom: 5, maxZoom: 18,
attribution: '&copy;OpenStreetMap contributors'
});


mymap.setMinZoom(4);
mymap.setMaxZoom(16);

mymap.setMaxBounds([[39.7281, -122.6246],[33.3349, -112.7809]]);

var osmLayer = L.tileLayer('https://api.mapbox.com/styles/v1/lstofer/cjea2xr0495fk2snrf872kldb/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHN0b2ZlciIsImEiOiJjaXZhcnkzdWgwMHQxMzNtcWpzdXY1YzR3In0.iWEaiGk446kaDHiDNmw5Uw', {
attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors'
});

var osmNoirBlanc = L.tileLayer(
  'https://api.mapbox.com/styles/v1/lstofer/cjea2otlvbb732rlynxl1c5kf/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHN0b2ZlciIsImEiOiJjaXZhcnkzdWgwMHQxMzNtcWpzdXY1YzR3In0.iWEaiGk446kaDHiDNmw5Uw', {
    attribution: ' &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors'
  }
);


var outDoor = L.tileLayer (
  'https://api.mapbox.com/styles/v1/lstofer/cjea2zqr329l52rpdrp8upf41/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHN0b2ZlciIsImEiOiJjaXZhcnkzdWgwMHQxMzNtcWpzdXY1YzR3In0.iWEaiGk446kaDHiDNmw5Uw', {
    attribution: ' &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors'
  }
);

var satelite = L.tileLayer (
  'https://api.mapbox.com/styles/v1/lstofer/cjea31jp6bbit2rlyzotbd08m/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibHN0b2ZlciIsImEiOiJjaXZhcnkzdWgwMHQxMzNtcWpzdXY1YzR3In0.iWEaiGk446kaDHiDNmw5Uw', {
    attribution: ' &copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org">OpenStreetMap</a> contributors'
  }
);

osmNoirBlanc.addTo(mymap);

var baseLayers = {
    "Street" : osmLayer,
    "Light": osmNoirBlanc,
    "Photos aériennes": satelite,
    "Parc": outDoor
};
var overlays = {};
L.control.layers(baseLayers, overlays).addTo(mymap);

// Ajouter une échelle métrique
L.control.scale({imperial: false, position: 'bottomleft'}).addTo(mymap);


// Création d'îcones

var icone = {};

// // Icône lit
// icone['Lit'] = L.icon({
//     iconUrl:'icones/icon_rouge.png',
//     iconSize: [18, 23],
//     iconAnchor: [10,20], // Modifie le décalage.
//     popupAnchor: [0, -40]
// });

// Icône bleue
icone ['Rouge'] = L.icon({
    iconUrl:'icones/icon_rouge.png',
    iconSize: [22, 27],
    iconAnchor: [12,25],
    popupAnchor: [0, -40]
});

// // Icône Avion
// icone ['Avion'] = L.icon({
// iconUrl:'icones/avion1.png',
// iconSize: [18, 20],
// iconAnchor: [10,25],
// popupAnchor: [0, -40]
// });


var spot = {
   Losa : {nom: "Los Angeles", type: "ville", icone: "Rouge", descr: "<p> Los Angeles est la deuxième ville la peuplée des Etats-Unis après New York. La population est de presque 4 millions en 2016. Elle est mondialement connue pour les studios de cinéma et son quartier hollywoodien.  </p>", photo: 'icones/los-angeles.png', source: "http://www.routard.com/guide/code_dest/los_angeles.htm", activity1: "<a href = 'https://www.nhl.com/ducks/'>Ducks - Anaheim </a>", activity2: "<a href = 'https://www.sixflags.com/magicmountain'>Six flags Magic Mountain </a>", activity3: "<a href = 'http://www.nba.com/lakers/'>NBA Lakers </a>", coords: [34.0522342, -118.2436849]},

  Lasv: {nom: "Las Vegas", type: "ville", icone: "Rouge", descr: "Las Vegas est la plus grande ville de l'État du Nevada, aux États-Unis. Elle est située au milieu du désert des Mojaves (le plus sec des quatre déserts nord-américains). </p><p>Les mormons fondèrent la ville en 1855, qui devint au début du xxe siècle une bourgade agricole. Grâce aux lois libérales en matière de jeux de l'État du Nevada, la ville a acquis une renommée mondiale pour ses casinos et ses revues. ", photo: 'icones/las-vegas.png', source: "http://www.qxmagazine.com/2018/02/queer-guide-las-vegas/", activity1: "<a href = 'https://www.cirquedusoleil.com/fr/o'>Cirque du soleil O </a>", activity2: "<a href = ''> </a>", activity3: "<a href = ''> </a>", coords: [36.1058, -115.1887]},
  Sequ: {nom: "Sequoia National Park", type: "parc", icone: "Rouge", descr: "<p>Le parc national de Sequoia est protégé depuis 1870 par le gouvernement américain.</p><p>Il est renommé pour ses nombreux séquoias géants ; on y trouve notamment le General Sherman, un séquoia mesurant 83 mètres de hauteur : il est parfois considéré comme l'être vivant le plus volumineux de la planète (1 487 mètres cubes en 2002). De nombreux sentiers permettent de s'approcher de ces grands arbres et d'apprendre leur histoire. ", photo: 'icones/seq.png', source : "http://www.visitcalifornia.com/attraction/what-do-sequoia-kings-canyon-national-parks", activity1: "<a href = 'https://www.nps.gov/seki/index.htm'>Sequoia National Park </a>", activity2: "<a href = ''> </a>", activity3: "<a href = ''> </a>", coords: [36.4880, -118.6558]},
  Bish: {nom: "Bishop", type: "ville", icone: "Rouge", descr: "<p>Bishop est une municipalité du comté d'Inyo en Californie, aux États-Unis. Sa population était de 3 428 habitants au recensement de 2009. Bishop est notamment réputé pour ses nombreux parcs et forêts qui entourent la ville</p> ", photo: 'icones/bishop.png', source: "https://bishopchamberofcommerce.com/",activity1: "<a href = 'https://www.mammothmountain.com/'>Mammoth Mountain </a>", activity2: "<a href = ''> </a>", activity3: "<a href = ''> </a>", coords: [37.3495, -118.4196]},
  Squaw: {nom: "Squaw Valley", type: "ville", icone: "Rouge", descr: "<p>Squaw Valley est une grande station de sports d'hiver aux États-Unis. Située dans la Comté de Placer, en Californie, elle a accueilli les Jeux olympiques d'hiver de 1960.</p><p>Il s'agit du deuxième plus grand domaine du Lac Tahoe après Heavenly. ", photo: 'icones/squaw-valley.png', source: "http://www.tahoeactivities.com/squaw-valley-ski-resort/", activity1: "<a href = 'http://squawalpine.com/'>Squaw Valley - Ski </a>", activity2: "<a href = ''> </a>", activity3: "<a href = ''> </a>", coords: [39.1879, -120.2076]},
  Sanf : {nom: "San Francisco", type: "ville", icone: "Rouge", descr: "<p> San Francisco est située à l'extrémité nord de la péninsule de San Francisco, entre l'océan Pacifique à l'ouest et la baie de San Francisco à l'est.</p><p> Aujourd'hui San Francisco est la ville la plus densément peuplée des États-Unis après New York. </p><p> La municipalité de San Francisco compte 805 235 habitants dans ses limites administratives6 et plus de 7 millions de personnes vivent dans l'aire métropolitaine de La Baie </p><p> La partie sud de cette dernière est occupée par la municipalité de San José et la Silicon Valley, premier pôle de hautes technologies des États-Unis qui accueille un nombre important d'entreprises de technologie de pointe de renommée mondiale. </p><p> Dans le domaine universitaire, elle accueille les prestigieuses9 université Stanford et université de Californie à Berkeley.", photo: 'icones/san-francisco.png', source: "http://www.routard.com/guide/code_dest/san_francisco.htm",activity1: "<a href = 'http://www.visitcalifornia.com/fr/attraction/golden-gate-bridge'>Golden Gate Bridge </a>", activity2: "<a href = ''> </a>",
  activity3: "<a href = ''> </a>", coords: [37.7580, -122.4521]},
};

// var autre = {
//   Omé: {nom: "Oména hôtel Helsinki Lonnrotinkatu", url: "<a href = 'https://www.omenahotels.com/fi/hotellit/helsinki-lonnrotinkatu/'>Oména hôtel Helsinki Lonnrotinkatu </a>", type: "hôtel", icone: "Lit", descr: "", coords: [60.1644732, 24.933078600000044]},
//   Gue: {nom: "Guesthouse Borealis Apartment", url: "<a href = 'http://www.guesthouseborealis.com/'>Guesthouse Borealis Apartment </a>", type: "hôtel", icone: "Lit", descr: "Ville du père Noël", coords: [66.499451, 25.70682869999996]},
//   Lap: {nom: "Lapland Hotel Akäshotelli", type: "hôtel", url: "<a href = 'https://www.laplandhotels.com/'>Lapland Hotel Akäshotelli </a>", icone: "Lit", descr: "...", coords: [67.6037734, 24.172665400000028]},
//   Levir: {nom: "Levikaira apartment Alpine Chalet Levin Kultarine", url: "<a href = 'http://www.levikaira.fi/en/accommodation'>Levikaira apartment Alpine Chalet Levin Kultarine </a>", type: "hôtel", icone: "Lit", descr: "...", coords: [67.8059281, 24.811075999999957]},
//   Nav: {nom: "Naverniemi Holiday Center", type: "hôtel", url: "<a href = 'http://www.narkka.com/'>Naverniemi Holiday Center </a>", icone: "Lit", descr: "...", coords: [68.6433983, 27.529307399999993]},
//   AHEL: {url: "Aéroport d'Helsinki", type: "Aéroport", icone: "Avion", descr: "...", coords:[60.318, 24.955]},
//   AROV: {url: "Aéroport de Rovaniemi", type: "Aéroport", icone: "Avion", descr: "...", coords: [66.563, 25.830]},
//   AIVA: {url: "Aéroport d'Ivalo", type: "Aéroport", icone: "Avion", descr: "...", coords: [68.606, 27.402]}
// };
//
// Declaring empty array
// var arrayMarks = [];
//
// // Marqueur
//   for (var k in autre) {
//     var aut = autre[k];
//     var iconeMarqueur = icone[aut.icone];
//     var marqueur1 = L.marker(aut.coords, {icon: iconeMarqueur});
//
//     // Putting the marqueur1 variable into the arrayMarks array
//     arrayMarks.push(marqueur1);
//     marqueur1.autre = aut;
//
//     marqueur1.on('click', function(e){
//       var aut = e.target.autre;
//       var html = '<table cellpadding = "5">';
//       html += '       <tr>';
//       html += '         <td><b> Nom : </b></td>';
//       html += '         <td>' + aut.url + '</td>';
//       html += '       </tr>';
//       html += '   </table>';
//       $('.infobox').html(html);
//       if(mymap.getZoom()<12){
//         mymap.flyTo(aut.coords, 12);
//       }
//     });
//   };
//
// // Declaring layerGroup feature that includes all markers in arrayMarks
// var otherMarks = L.layerGroup(arrayMarks);
//
// // Apparition des icônes avec le zoom
// mymap.on('zoomend', function() {
//     if (mymap.getZoom() < 10){
//       if (mymap.hasLayer(otherMarks)) {
//           mymap.removeLayer(otherMarks);
//       } else {
//        console.log("no point layer active");
//       }
//     } else {
//       if (mymap.hasLayer(otherMarks)) {
//         console.log("layer already added");
//     } else {
//       mymap.addLayer(otherMarks);
//       }
//     }
// });
//
for (var k in spot){
  var spo = spot[k];
  var iconeMarqueur = icone[spo.icone];
  var marqueur = L.marker(spo.coords, {icon: iconeMarqueur}).addTo(mymap);

marqueur.spot = spo;

marqueur.on('click', function(e){
    var spo = e.target.spot;
    var html = '<table cellpadding = "3">';
    html += '       <tr>';
    html += '         <td><b> Ville :</b>' + " " + spo.nom + '</td>';
    html += '       </tr>';
    html += '       <tr></tr>';
    html += '       </tr><tr>';
    html += '       <tr>';
    html += '         <td VALIGN="TOP"><b> Description : </b></td>';
    html += '       </tr><tr>';
    html += '         <td colspan=2>' + spo.descr + '</td>';
    html += '       </tr>';
    html += '       <tr>';
    html += '         <td VALIGN="TOP"><b> Activité :</b></td>';
    html += '       </tr>';
    html += '       <tr>';
    html += '         <td colspan=2>' + spo.activity1 + '<br/>' + spo.activity2 + '<br/>' + spo.activity3 + '</td>';
    html += '       </tr>';
    html += '       <tr></tr>';
    html += '       <tr>';
    html += '       <td VALIGN="TOP"><b> Photo :</b></td>';
    html += '       <tr></tr>';
    html += '       <td colspan=2, align = "center">';
    html += '       <img style ="max-width: 220px", src = "'+ spo.photo + '"/>'
    html += '       </td>';
    html += '       </tr>';
    html += '       <tr>';
    html += '         <td style = "font-size: 8pt">' + spo.source + '</td>';
    html += '       </tr>';
    html += '   </table>';
    $('.infobox').html(html);
    if(mymap.getZoom()<12){
      mymap.flyTo(spo.coords, 12);
    }
  });
}

// Style de la couche et changement des couleurs
for (var i in chemins_json.features) {
  var feature = chemins_json.features[i];
  var cheminStyle = {
    "color": feature.properties.color,
    "weight": 3.5,
    "opacity": 1.5,
    "dashArray": feature.properties.dash,
    "nom" : feature.properties.nom,
    "distance" : feature.properties.distance
  };
  let chemins = L.geoJSON(feature, cheminStyle).addTo(mymap);

  chemins.on('click', function (e) {
  feature = e.target.options;
  console.log(feature);
  var html = '';
  html += '     <p>';
  html += '       <br/>';
  html += '       <b>' + feature.nom
  html += '       </b>';
  html += '     </p>';
  html += '     <tr>';
  html += '       <td><b>Distance : </b></td>';
  html += '       <td>' + feature.distance + '</td>';
  html += '     </tr>';
  html += '   </table>';
  $('.infobox').html(html);
});
}

$('.recherche select').on('change', function(e) {
  var id_spot = $('.recherche select').val();
  if (id_spot == "") return;
  var spo = spot[id_spot];
  mymap.panTo(spo.coords, {animate: true});
  mymap.flyTo(spo.coords, 10);
});
