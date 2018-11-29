// Dashboard - Ludivine Stofer

APP = {
currentYear : 1997
};

APP.init = function(){
  SYM.init();
  PYR.init();
};

APP.resize = function(){
  //SYM.init();
  PYR.resize();
};

window.onresize = function() {
  APP.resize();
  // let url = window.location.href;
  // window.location.href = url;
};

// Fonction qui permet de changer d'année
function changeYearEvent(e){
  let yr = $('#yearSelect').val();
  APP.currentYear = yr;
  PYR.loadDataForCurrentYearAndRegion();
  PYR.updateGraph();
  SYM.loadDataForCurrentYear();
  SYM.updateMap();
  };

// Fonction qui permet de mettre à jour les graphiques
//lorsque l'utilisateur click sur une région
APP.selectCanton = function(d){
// Fonctionne uniquement avec les symboles.
  let ct = d.abbr || APP.canton_no2abbr[d.properties.KTNR];
  PYR.currentRegion = ct;
  PYR.loadDataForCurrentYearAndRegion();
  PYR.updateGraph();
}


APP.canton_no2abbr = {
  1: 'ZH', 2: 'BE', 3: 'LU', 4: 'UR', 5: 'SZ', 6: 'OW', 7: 'NW', 8: 'GL', 9: 'ZG', 10: 'FR', 11: 'SO', 12: 'BS', 13: 'BL', 14: 'SH', 15: 'AR', 16: 'AI', 17: 'SG', 18: 'GR', 19: 'AG', 20: 'TG', 21: 'TI', 22: 'VD', 23: 'VS', 24: 'NE', 25: 'GE', 26: 'JU'
}

// Création du tooltip avec opacité lors du survol avec la souris
let toolTip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
