// Création d'une SYM qui stocke toutes les méthodes
SYM = {};

// Variable globale M (définition des variables et du cadre de l'écran)
var M = {
  margin: {left: 20, top: 30, right: 50, bottom: 0},
  bbox: [485000, 50000, 834000, 296000],
  data: {},
  dataSeries: [],
  dataArray: [],
  dataforYear : []
};

// Initialiser le script de la page
SYM.init = function(){
SYM.creatMap();
//SYM.handleMouseOver();
// SYM.handleMouseOut();

};

// Définition de la carte en SVG avec le cadre notamment
SYM.creatMap = function(){
  M.svg = d3.select(".map").append("svg");
  M.width = $('.map svg').width();
  M.height = $('.map svg').height();

// Définition d'une géométrie géoJSON en SVG
  M.path = d3.geoPath();

  // Importation des données
  // Il faut créer une sorte de boucle (queue) qui permet de charger les données ainsi que les shapefiles
  d3.queue()
    .defer(
      d3.json,
      //"https://cdn.rawgit.com/christiankaiser/d3-topojson-choropleth/ee12f6a108eddaa9cd119866b2e9cd52bb450cbc/data/vec200-topo.json"
      //"https://rawgit.com/ludivinestofer/topo/c07a42bb4d66ae62322507b5f8a5bad4b29f08d5/TopoJson/cantons_lakes_topo.json",
      // Importation du TopoJSON
      '../Symbol_map/TopoJson/cantons_lakes_topo.json'
    )
    .defer(
      d3.json,
      // Importation des données en format JSON
      '../Symbol_map/Data/data.json'
    )
    // La construction de la carte est lancée uniquement quand les 2 fichiers sont chargés
    .await(SYM.buildMap);

}

SYM.loadDataForCurrentYear = function(){

  // Données pour une année précise
  let features = M.dataArray[APP.currentYear];

  let population = [], variation_absolue = [], variation_pourcent = [];

  M.data = {};
  for (let j=0; j < features.length; j++){
    let y = features[j];

    // Array des données pour une année donnée (tous les cantons)
    population.push(y.population);
    variation_pourcent.push(y.variation_pourcent);

    M.data[(j+1)] = y;
  }
  // Transformation dans une autre variable afin de faire la mise en classe
  M.dataSeries = variation_pourcent;


}

SYM.scale = function(){
  // Compute the scale of the transform
  M.scaleX = M.width / (M.bbox[2] - M.bbox[0]),
  M.scaleY = M.height / (M.bbox[3] - M.bbox[1]);
  M.scale = Math.min(M.scaleX, M.scaleY); // Pour garder la même échelle en x et en y afin d'éviter les déformations

  M.dx = -1 * M.scale * M.bbox[0];
  M.dy = M.scale * M.bbox[1] + parseFloat(M.height);
}

SYM.classify = function(){
  // Mise en classe de la carte avec Jenks.
  M.brew = new classyBrew();
  M.brew.setSeries(M.dataSeries);
  M.brew.setNumClasses(4);
  M.brew.setColorCode('RdYlGn');
  M.breaks = M.brew.classify('jenks');

// Sélection des classes et des couleurs
  M.color = d3.scaleThreshold()
    .domain(M.breaks.slice(1,6))
    .range(M.brew.getColors());

}

// Fonction qui permet d'ajouter le titre et le sous-titre
SYM.drawTitle = function(){

  SYM.title = M.svg.append("g")
        .attr("class", "title")
        .append("text");

  SYM.title
      .attr("x", M.margin.left)
        .attr("y", 28 + 6 + 24)
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.8em")
        .attr("fill", "#999999")
        .attr("font-weight", "bold");

  SYM.subtitle = M.svg.append("g")
        .attr("class", "subtitle")
        .append("text")
        .attr("x", M.margin.left)
        .attr("y", 28)
        .text("26 cantons suisses")
        .attr("font-family", "sans-serif")
        .attr("font-size", "0.6em")
        .attr("fill", "#999999")
        .attr("font-weight", "bold");

}

// Fonction qui permet de modifier le titre et le sous-titre
SYM.updateTitle = function(){

  SYM.title
    .text("Evolution de la  population entre le 1er janvier et le 31 décembre " +  APP.currentYear);

}


SYM.drawMap = function(){

  // Définition de la carte
  M.map = M.svg.append('g')
    .attr('class', 'map')
    .attr('transform','matrix('+M.scale+' 0 0 -'+M.scale+' '+M.dx+' '+M.dy+')');

    SYM.classify();
    SYM.drawTitle();
    SYM.updateMap();
}

SYM.buildMap = function(error, mapdata, data){
  if (error) throw error;

  //console.log(data.features);

  M.dataArray = data.features;

  // Création de la variable année contenant une liste des années en nombre [1991, 1992, ...]
  M.years = Object.keys(M.dataArray);
  M.years = $.map(M.years, function(y){return parseInt(y); });
  M.yearMin = M.years[0];
  M.yearMax = M.years[M.years.length-1];

// Chargement des données pour l'année donnée
  SYM.loadDataForCurrentYear();

// Chargement de l'échelle
  SYM.scale();

  SYM.drawMap();
  //SYM.updateMap();


  // The TopoJSON contains raw coordinates in CRS CH1903/LV03.
  // As this is already a projected CRS, we can use an SVG transform
  // to fit the map into the SVG view frame.
  // In a first step, we compute the transform parameters.
  M.cantons = topojson.feature(mapdata, mapdata.objects.cantons).features;
  M.cantonsIdx = {};
  for (var i=0; i < M.cantons.length; i++){
    M.cantonsIdx[M.cantons[i].properties.KTNR.toString()] = M.cantons[i];
  }

  // Création de la couche des cantons
  M.map
    .append('g').attr('class', 'cantons')
    .selectAll('path')
    .data(M.cantons) // Utilisation et conversion du TopoJSON
    .enter()
    .append('path')
    .attr('class', 'canton')
    .attr('fill', function(d){
      return '#ccc';
      //return M.color(M.data[d.properties.KTNR].variation_pourcent)
      //  '#fff'; // Code couleur pour les données manquantes.
    })
    .on('mouseover', SYM.handleMouseOver)
    .on('mouseout', SYM.handleMouseOut)
    .on('mousemove', SYM.TooltipMouse)
    .on('click', APP.selectCanton)
    .attr('id', d => d.properties.KTNR)
    .attr('stroke', '#fff').attr('stroke-width', '200')
    .attr('d', M.path);

// Création de la couche des lacs
    M.map
      .append('g').attr('class', 'lacs')
      .selectAll('path')
      .data(topojson.feature(mapdata, mapdata.objects.lacs).features)
      .enter().append('path')
      .attr('fill', '#EAEAEA').attr('d', M.path);

// Création des symboles proportionnels
    M.map
      .append('g').attr('class', 'symbol')
      .selectAll('path')
      .data(M.dataArray[APP.currentYear].sort(function(a, b) { return b.variation_absolue - a.variation_absolue; }))
      .enter()
      .append('circle')
      .attr('cx', function(d){
        return M.cantonsIdx[d.kt].properties.X_CNTR;
      })
      .attr('cy', function(d){
        return M.cantonsIdx[d.kt].properties.Y_CNTR;
      })
      .attr('r', function(d) {

        let rayon = 100 * Math.pow(Math.abs(d.variation_absolue), 0.57)

        if(rayon <= 2000){
          rayon = 2000
        }
        return rayon;

      })
      .attr('fill', function(d){
        return M.color(d.variation_pourcent)
      })
      .on('mouseover', SYM.handleSymbolOver)
      .on('mouseout', SYM.handleSymbolOut)
      .on('mousemove', SYM.TooltipMouse)
      .on('click', APP.selectCanton)
      .style('opacity', 0.8)
      .attr('id', f => `${f.kt}`)
      .attr('stroke', '#fff').attr('stroke-width', '200');


  }

// Fonction qui met à jour la carte en redessinant les symboles
SYM.updateMap  = function(){

    let transitionDuration = 500;

    let t = d3.transition()
        .duration(transitionDuration);

    // Création des symboles proportionnels
        d3.selectAll('circle')
          .data(M.dataArray[APP.currentYear].sort(function(a, b) {
            return b.variation_absolue - a.variation_absolue;
           }))
          .transition(t)
          .attr('r', function(d) {

            // Définition du rayon du cercle avec correction de Flannery
            let rayon = 100 * Math.pow(Math.abs(d.variation_absolue), 0.57)

            // Seuil minimum pour la taille du cercle
            if(rayon <= 2000){
              rayon = 2000
            }
            return rayon;
          })

    SYM.classify();
    SYM.updateTitle();
  }

//Fonction qui met la barre plus transparente et qui affiche le tooltip lors du passage de la souris
SYM.handleMouseOver = function (d, i){

  let onKT = this.id;
  //console.log(onKT);
  d3.select(this)
  .style("opacity", 0.6)
  .attr('fill', 'grey')

  d3.selectAll('circle')
    .filter(f => f.kt == onKT)
    .attr('stroke-width', '400')
    .style('opacity', 1);


  toolTip.transition()
    .duration(100)
    .style("opacity", 0.9);
  };


SYM.TooltipMouse = function (d){
    let onKT = this.id;
    toolTip.html(`<b>${M.dataArray[APP.currentYear].filter(i => i.kt == onKT)[0].canton}</b> <br> Variation de population : ${M.dataArray[APP.currentYear].filter(i => i.kt == onKT)[0].variation_absolue} <br> Evolution en % : ${M.dataArray[APP.currentYear].filter(i => i.kt == onKT)[0].variation_pourcent}`)
            .style("left", `${d3.event.pageX-100}px`)
            .style("top", `${d3.event.pageY-40}px`)
            .style ("color", "grey")
            .style('opacity', 1);
  }

// Fonction qui remet l'opacité et le tooltip à zéro une fois que la souris est passé
SYM.handleMouseOut = function (d){
  d3.select(this)
    .style("opacity", 1)
    .attr('fill', '#ccc')

  d3.selectAll('circle')
    .attr('stroke-width', '200')
    .style('opacity', 0.8);
  toolTip.transition()
         .duration(500)
         .style("opacity", 0);
}

SYM.handleSymbolOver = function(d, i){
  let onKT = this.id;

  d3.selectAll('.canton')
    .filter(d => d.properties.KTNR == onKT)
    .style("opacity", 0.6)
    .attr('fill', 'grey');

    d3.selectAll('circle')
      .filter(f => f.kt == onKT)
      .attr('stroke-width', '400')
      .style('opacity', 1);
}

SYM.handleSymbolOut = function(d){
  d3.select(this)

  d3.selectAll('.canton')
    .style("opacity", 1)
    .attr('fill', '#ccc');

    d3.selectAll('circle')
      .attr('stroke-width', '200')
      .style('opacity', 0.8);

    toolTip.transition()
           .duration(500)
           .style("opacity", 0);
}
