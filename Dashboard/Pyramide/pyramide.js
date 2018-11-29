// Pyramide des âges - Ludivine Stofer, 2017-2018

// Création d'une PYR qui stocke toutes les variables
PYR = {
  pyrdata: null, // données pour la pyramide d'âge, chargées par fichier JSON plus tard

  currentRegion: 'CH',

  // Définition de la largeur maximale
  // Marge pour le graphique
  margin: {left: 50, top: 60, right: 50, bottom: 30},

  // Le "pont" au milieu entre hommes et femmes
  gutter: 50,

  // Paramètre qui permet de mettre à l'échelle l'histogramme.
  factScale : function(){
    return PYR.popMaxCeil() / PYR.widthMax;
  },

// Définition de palier correspondant au canton sélectionné -> Step dans les axes X.
  step: function(){
    let vmax = PYR.popMax();
    let step = Math.pow(10, Math.floor(Math.log10(vmax)));

    let nsteps = vmax / step;
    let max_steps = Math.floor(PYR.widthMax / 50);
    if (nsteps > max_steps) {
      let f = Math.ceil(nsteps / max_steps);
      step *= f;
    }
    if (nsteps < 2) step /= 2;
    return step;
  },


// Permet d'arrondir la valeur max afin d'améliorer la légende des axes X
  ceilToStep : function(v) {
    let s = PYR.step();
    return Math.round((v / s) + 0.2) * s;
  }
};


/**
 * Fonction qui lance la construction du graph. C'est le point d'entrée
 * pour la création du graphique
 */
PYR.init = function(){

  // Créer le cadre SVG
  PYR.cadre = d3.select(".pyramide").append("svg");

  PYR.largeur = $('.pyramide svg').width(); // grandeur défini dans le css.
  PYR.hauteur = $('.pyramide svg').height();
  PYR.widthMax = (PYR.largeur - PYR.margin.left - PYR.margin.right - PYR.gutter) / 2;
  PYR.heightMax = (PYR.hauteur - PYR.margin.top - PYR.margin.bottom);

  // Position du milieu du graphique
  PYR.milieu = (PYR.largeur - PYR.margin.left - PYR.margin.right) / 2 + PYR.margin.left;

  PYR.half_gutter = PYR.gutter / 2;

  // Espacement entre les barres
  PYR.spaceBar = PYR.margin.left /100;

  // Fonction qui affiche la légende

  // Chargement des données à partir du fichier JSON
  if (PYR.pyrdata == null){
    $.getJSON('../Pyramide/Data/age_cantons.json', function(d){
      PYR.pyrdata = d;
      PYR.buildPyramidGraph();
    });
  } else {
    PYR.buildPyramidGraph();
  }
}


PYR.heightBar = function(){
  var h = PYR.heightMax / PYR.numberOfAgeGroups();
  return h;
}


PYR.resize = function(){
  PYR.largeur = $('.pyramide svg').width();
  PYR.hauteur = $('.pyramide svg').height();
  PYR.widthMax = (PYR.largeur - PYR.margin.left - PYR.margin.right - PYR.gutter) / 2;
  PYR.heightMax = (PYR.hauteur - PYR.margin.top - PYR.margin.bottom);
  PYR.milieu = (PYR.largeur - PYR.margin.left - PYR.margin.right) / 2 + PYR.margin.left;
  PYR.half_gutter = PYR.gutter / 2;
  PYR.spaceBar = PYR.margin.left /100;



  PYR.updateGraph();
}


// Fonction qui permet de construire le graphique
PYR.buildPyramidGraph = function(){

  // Création de la variable année contenant une liste des années en nombre [1991, 1992, ...]
  PYR.years = Object.keys(PYR.pyrdata);
  PYR.years = $.map(PYR.years, function(y){ return parseInt(y); });
  PYR.yearMin = PYR.years[0];
  PYR.yearMax = PYR.years[PYR.years.length-1];

  // Création de la variable canton contenant une liste des cantons ["CH", "ZH", "BE", ... ]
  PYR.cantons = Object.keys(PYR.pyrdata[PYR.years[0]]);

  PYR.loadDataForCurrentYearAndRegion();

  PYR.drawGraph();
  PYR.updateGraph();
};


// Retourne la population maximale du canton pour toutes les années.
// Si elle c'est vide, elle calcule la valeur à partir de PYR.calculatePopMax
PYR.popMax = function(){

  PYR.popMaxRegions = PYR.popMaxRegions || {};
  if (typeof(PYR.popMaxRegions[PYR.currentRegion]) === 'undefined') {
    PYR.calculatePopMax();
  }
  return PYR.popMaxRegions[PYR.currentRegion];

}

PYR.popMaxCeil = function(){
  return PYR.ceilToStep(PYR.popMax());
}

// Calcule la population maximale pour un canton sur toutes les années.
PYR.calculatePopMax = function(){
  let popMax = 0;
  for (var i=0; i < PYR.years.length; i++){
    // Boucle à travers toutes les années
    let dataYear = PYR.pyrdata[PYR.years[i]];
    let popAnnee = dataYear[PYR.currentRegion] || [];
    for (var j=0; j < popAnnee.length; j++){
      if (popAnnee[j].population > popMax) popMax = popAnnee[j].population;
    }
  }
  PYR.popMaxRegions[PYR.currentRegion] = popMax
}

// Chargement des données pour une année donnée et une région donnée
PYR.loadDataForCurrentYearAndRegion = function(){
  // Features est une variable qui regroupe les 200 lignes pour une région et une années
  // 0: {age: "0", sexe: 1, population: 42541}
  let features = PYR.pyrdata[APP.currentYear][PYR.currentRegion];
  let popH = [], popF = [];

  // Maximum de la variable population qui permettra de déterminer la largeur du graphique.
  //let popMax = {h: 0, f: 0};

  // Boucle pour les données
  for (let j=0; j < features.length; j++){
    let y = features[j];
    // Séparation des données en fonction du sexe
    if (y.sexe == 1){
      popH.push(y);
      //popMax.h = Math.max(popMax.h, y.population);
    } else {
      popF.push(y);
      //popMax.f = Math.max(popMax.f, y.population);
    }
  }
  PYR.data_h = popH;
  PYR.data_f = popF;
}

// Fonction qui permet de déterminer le nombre de classes d'âge
// Utile dans la disposition sur l'axe Y (dessin depuis le bas --> Jeunes en bas et vieux en haut)
PYR.numberOfAgeGroups = function(){
  return Math.max(PYR.data_h.length, PYR.data_f.length);
}

// Création d'une fonction qui dessine le graphique.
PYR.drawGraph = function(){


  let n = PYR.numberOfAgeGroups();


  // Histogramme des femmes
  PYR.groupeBar_f = PYR.cadre.append('g');
  let barF = PYR.groupeBar_f.selectAll(".female")
    .data(PYR.data_f);

  barF.enter()
      .append('rect')
      .attr('class', 'female')
      .attr('width', 0) // mise à l'échelle
      .attr('height', PYR.heightBar() - PYR.spaceBar)
      .attr('x', PYR.milieu + PYR.half_gutter)
      .attr('y', function(d,i){ return (n-i)*PYR.heightBar() + PYR.margin.top ; }) // Définition de l'écartement entre les barres et du sens
      .attr("fill", "#890883")
      .on("mouseover", PYR.handleMouseOver) // Changement lorsque l'on passe la souris sur le graphique
      .on("mouseout", PYR.handleMouseOut) // Changement lorsque l'on enlève la souris du graphique
      .on('mousemove', PYR.TooltipMouse); // Affichage du Tooltip lorsque la souris bouge.


  // Histogramme des hommes
  PYR.groupeBar_h = PYR.cadre.append('g');
  let barH = PYR.groupeBar_h.selectAll(".male")
      .data(PYR.data_h)
      .enter()
        .append('rect')
        .attr('class', 'male')
        .attr('width', 0)
        .attr('height', PYR.heightBar() - PYR.spaceBar)
        .attr('x', function(d,i){ return (PYR.milieu - PYR.half_gutter) - d.population / PYR.factScale(); }) // Symétrie de l'histogramme
        .attr('y', function(d,i){ return (n-i)*PYR.heightBar() + PYR.margin.top; }) // Définition de l'écartement entre les barres et du sens
        .attr("fill", "#6473aa")
        .on("mouseover", PYR.handleMouseOver) // Changement lorsque l'on passe la souris sur le graphique
        .on("mouseout", PYR.handleMouseOut) // Changement lorsque l'on enlève la souris du graphique
        .on('mousemove', PYR.TooltipMouse); // Affichage du Tooltip lorsque la souris bouge.


        PYR.drawAxis();
        PYR.drawLegend();
        PYR.drawTitle();

};

// Fonction qui permet de recharger/redessiner le graphique
PYR.updateGraph = function(){
  let transitionDuration = 500;

  let t = d3.transition()
      .duration(transitionDuration);

// Histogramme des femmes
  PYR.groupeBar_f.selectAll(".female")
    .data(PYR.data_f)
    .transition(t)
    .attr('width', function(d){ return d.population / PYR.factScale(); })
    .attr('x', PYR.milieu + PYR.half_gutter);

  // Histogramme des hommes
  PYR.barM = PYR.groupeBar_h.selectAll(".male")
        .data(PYR.data_h)
        .transition(t)
        .attr('width', function(d){ return d.population / PYR.factScale(); })
        .attr('x', function(d,i){ return (PYR.milieu - PYR.half_gutter) - d.population / PYR.factScale(); }); // Symétrie de l'histogramme

  PYR.updateAxis();
  PYR.updateTitle();
}

// Fonction qui permet d'afficher la légende
PYR.drawLegend = function(){

  PYR.legend_m = PYR.cadre.append("g")
        .attr("class", "legend_m")
        .append("text")
        .attr("x", PYR.milieu - ((PYR.widthMax + PYR.gutter) / 2))
        .attr("y", PYR.margin.top + 50)
        .text("Homme")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "#6473aa")
        .attr("font-weight", "bold")
        .attr('text-anchor', 'middle');


  PYR.legend_f = PYR.cadre.append("g")
        .attr("class", "legend_f")
        .append("text")
        .attr("x", PYR.milieu + ((PYR.widthMax + PYR.gutter + PYR.gutter) / 2))
        .attr("y", PYR.margin.top + 50)
        .text("Femme")
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("fill", "#890883")
        .attr("font-weight", "bold")
        .attr('text-anchor', 'middle');

}

// Fonction qui permet d'ajouter le titre et le sous-titre
PYR.drawTitle = function(){

  PYR.title = PYR.cadre.append("g")
        .attr("class", "title")
        .append("text")

  PYR.title
        .attr("x", PYR.margin.left)
        .attr("y", 16)
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.5em")
        .attr("fill", "#999999")
        .attr("font-weight", "bold");

  PYR.subtitle = PYR.cadre.append("g")
        .attr("class", "subtitle")
        .append("text")
        .attr("x", PYR.margin.left)
        .attr("y", 16 + 6 + 18)
        .text("Nombre de personnes en milliers")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.4em")
        .attr("fill", "#999999")
        .attr("font-weight", "bold");


}

// Fonction qui permet d'ajouter le titre et le sous-titre
PYR.updateTitle = function(){

  PYR.title
        .text("Population résidente permanente à la fin de l'année pour " + PYR.currentRegion)
}

// Fonction qui permet de dessiner les axes la première fois
PYR.drawAxis = function(){

  let n = PYR.numberOfAgeGroups();

  // Création des axes
  // Axe X1
  PYR.scaleX_h = d3.scaleLinear()
          .domain([0, PYR.popMaxCeil()]) // Défini le début et la fin de l'axe
          .range([PYR.widthMax,0]) // Défini la taille de l'axe
          .nice() // Permet d'arrondir la valeur afin que cela soit joli.

  PYR.xAxis1 = d3.axisBottom(PYR.scaleX_h)
                  .tickValues(d3.range(0, PYR.popMaxCeil() + 1, PYR.step())) // Défini les intervalles affichés
                  .tickFormat(d3.format("10")); // Indique le format (pour afficher les chiffres)

  PYR.axis_m = PYR.cadre.append("g")
        .attr('transform', 'translate('+PYR.margin.left+', '+(PYR.margin.top + n*PYR.heightBar() + 10)+')')
        .attr("class", "axis_m")
        .call(PYR.xAxis1);

   // Axe X2
   PYR.scaleX_f = d3.scaleLinear()
                    .domain([0, PYR.popMaxCeil()]) // Défini le début et la fin de l'axe
                    .range([0, PYR.widthMax]) // Défini la taille de l'axe
                    .nice() // Permet d'arrondir la valeur afin que cela soit joli.

   PYR.xAxis2 = d3.axisBottom(PYR.scaleX_f)
                  .tickValues(d3.range(0, PYR.popMaxCeil() + 1, PYR.step())) // Défini les intervalles affichés
                  .tickFormat(d3.format("10")); // Indique le format (pour afficher les chiffres)

   PYR.axis_f = PYR.cadre.append("g")
        .attr('transform', 'translate('+(PYR.milieu + PYR.half_gutter)+', '+(PYR.margin.top + n*PYR.heightBar() + 10)+')')
        .attr("class", "axis_f")
        .call(PYR.xAxis2)

  // Axe Y
    let scaleY = d3.scaleLinear()
            .domain([0, n])
            .range([n*PYR.heightBar(), 0])

    let yAxis = d3.axisLeft(scaleY)

    PYR.axis_y = PYR.cadre.append("g")
      // Placer l'axe au milieu. Le +9 vient du fait que d3 décale les labels d'un axisLeft
      // de 9 pixel à gauche.
       .attr("transform", "translate("+(PYR.milieu+9)+","+PYR.margin.top+")")
       .attr("class", "axisY")
       .call(yAxis)

}

// Fonction qui met à jour les axes à chaque changement
PYR.updateAxis = function(){

  let transitionDuration = 500;

// Mise à jour de l'axe X des hommes
PYR.scaleX_m = d3.scaleLinear()
                 .domain([0, PYR.popMaxCeil()]) // Défini le début et la fin de l'axe
                 .range([PYR.widthMax, 0]) // Défini la taille de l'axe
                 .nice() // Permet d'arrondir la valeur afin que cela soit joli.


      //if (PYR.popMaxCeil() < 7000) {
          PYR.xAxis1 = d3.axisBottom(PYR.scaleX_m)
                .tickValues(d3.range(0, PYR.popMaxCeil() + 1, PYR.step())) // Défini les intervalles affichés
                .tickFormat(d3.format("10")); // Indique le format (pour afficher les chiffres)
      // } else {
      //     PYR.xAxis1 = d3.axisBottom(PYR.scaleX_m)
      //           .tickValues(d3.range(0, PYR.popMaxCeil() + 1, 10000)) //PYR.step_grand())) // Défini les intervalles affichés
      //           .tickFormat(d3.format("10")); // Indique le format (pour afficher les chiffres)
      // }
      //
      //          console.log(PYR.popMaxCeil());

// console.log(PYR.popMax());
// console.log(PYR.step());
// console.log(PYR.xAxis1.tickValues());

PYR.new_axis_f = d3.select('.axis_m')
     .transition()
     .duration(transitionDuration)
     .call(PYR.xAxis1)

// Mise à jour de l'axe X des femmes
  PYR.scaleX_f = d3.scaleLinear()
                   .domain([0, PYR.popMaxCeil()]) // Défini le début et la fin de l'axe
                   .range([0, PYR.widthMax]) // Défini la taille de l'axe
                   .nice() // Permet d'arrondir la valeur afin que cela soit joli.

      //if (PYR.popMaxCeil() < 7000) {
                PYR.xAxis2 = d3.axisBottom(PYR.scaleX_f)
                             .tickValues(d3.range(0, PYR.popMaxCeil() + 1, PYR.step())) // Défini les intervalles affichés
                             .tickFormat(d3.format("10")); // Indique le format (pour afficher les chiffres)
      // } else {
      //           PYR.xAxis2 = d3.axisBottom(PYR.scaleX_f)
      //                        .tickValues(d3.range(0, PYR.popMaxCeil() + 1, 10000)) //PYR.step_grand())) // Défini les intervalles affichés
      //                        .tickFormat(d3.format("10")); // Indique le format (pour afficher les chiffres)
      // }

  PYR.new_axis_f = d3.select('.axis_f')
       .transition()
       .duration(transitionDuration)
       .call(PYR.xAxis2)

};

//Fonction qui met la barre plus transparente et qui affiche le tooltip lors du passage de la souris
PYR.handleMouseOver = function(d, i){
  d3.select(this)
    .attr("opacity", "0.3");



  toolTip.transition()
    .duration(100)
    .style("opacity", 0.9);
  }

PYR.TooltipMouse = function(d, i){
  d3.select(this)

  if (d.sexe == 1){
    toolTip.html(`Age : ${i} <br> Population : ${d.population}`)
      .style("left", `${d3.event.pageX-100}px`)
      .style("top", `${d3.event.pageY-40}px`)
      .style ("color", "#6473aa");
  } else {
    toolTip.html(`Age : ${i} <br> Population : ${d.population}`)
      .style("left", `${d3.event.pageX-20}px`) // Eloignement de gauche à droite
      .style("top", `${d3.event.pageY-40}px`) // Eloignement de haut en bas
      .style ("color", "#890883");
  }


}

// Fonction qui remet l'opacité et le tooltip à zéro une fois que la souris est passé
PYR.handleMouseOut = function(d){
  d3.select(this)
    .attr("opacity", "1")
  toolTip.transition()
         .duration(500)
         .style("opacity", 0);
}


function changeCantonEvent(e){
  let ct = $('#cantonsSelect').val();
  PYR.currentRegion = ct;
  PYR.loadDataForCurrentYearAndRegion();
  PYR.updateGraph();
  // PYR.updateAxis();
};
