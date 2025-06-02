// Variables globales de configuración y estado
let capas = [];
let direccionCapa = 1;
let maxCapas = 3;
let cantidadBastones;
let anchoBaston;
let velocidad = 1;
let paletas = [];
let paletaElegida = {};
let fondoElegido;
let tiposTransparencia = ['pocos', 'medios', 'muchos'];
let usadosTransparencia = [];
let mouseEnMovimiento = false;
let ultimaPosX = 0;
let ultimaPosY = 0;
let ultimaDireccionY = 0;
let ultimaDireccionX = 0;
let porcentajeOscurecimiento = 0.50;
let porcentajeDesvanecimiento = 0.25;
let sensibilidadDesplazamiento = 0.1;
let largoMaximoBaston;
let contadorCapas = 0;
let indiceSubgrupoPaleta = 0;
const subgruposPaleta = ["trasera", "media", "superior"];
let factorMovimientoY = 1.0;
let rangoMovimientoY = 5;
let factorFrecuenciaMouse = 0.03;
let factorDesplazamientoAcumulado = 0.8;
let pausado = false;

// Configuración inicial del canvas y paletas
function setup() {
  createCanvas(800, 600);
  frameRate(30);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  largoMaximoBaston = height * 0.8;

  paletas = [
    {
      nombre: "Grupo 1",
      fondo: "#b9b1a5",
      trasera: ["#c4c0af", "#b0a070", "#478a8c", "#0e66a8", "#5c99b4", "#7ca0b3", "#9eaab3", "#aeafa9", "#b9b1a5", "#ab9c83", "#8a7453", "#aea086", "#c4c7c4", "#c7c8c3", "#bd8c2c", "#93855f", "#978c78"],
      media: ["#a19a7c", "#acafb5", "#745e26", "#624d14", "#987755", "#868369", "#6b6d60", "#2f342b", "#9e9990", "#928272", "#884d3b", "#81250e", "#b58c75", "#ae9f77", "#9d9976", "#2d7579", "#073956", "#1e3b33", "#41351c", "#5f3c12", "#8e4907", "#6c1308", "#52140b", "#2f2814"],
      superior: ["#a19a7c", "#acafb5", "#745e26", "#624d14", "#987755", "#868369", "#6b6d60", "#2f342b", "#9e9990", "#928272", "#884d3b", "#81250e", "#b58c75", "#ae9f77", "#9d9976", "#2d7579", "#073956", "#1e3b33", "#41351c", "#5f3c12", "#8e4907", "#6c1308", "#52140b", "#2f2814"]
    },
    {
      nombre: "Grupo 2",
      fondo: "#c8d4de",
      trasera: ["#a5c4d9", "#9dc0d8","#b9cbce","#b1cbe2","#c7c7c0","#bfd4da", "#b5cfe2", "#bec4ce", "#c1d5e0", "#c6bd9d"," #c4c6be", "#c4d7df", "#bebebd","#c1d2e2","#bdd4e4", "#d6dad8", "#c9dce6", "#bfdbe3", "#d7d2c4", "#c2b5a9", "#a1c8dc", "#b0c8cf", "#b2c5c7", "#d0c3b7","#b6c6d2", "#91bfd9", "#aec8d8"],
      media: ["#5b332f","#735c40", "#c6c5c1", "#ad9982", "#b0aa9c", "#c5b6af", "#a99e88", "#695a3e", "#321a14", "#551a09", "#775b3a", "#bcaa90", "#595150", "#201812", "#4e392d", "#a6a1a0", "#c18c4f", "#7f6345", "#2b2522", "#2d180e", "#875e52", "#a7a4a6", "#cc995b", "#b99c6e", "#c7ab7b", "#a38660", "#d4c6a0", "#956127", "#483a24", "#2f2720", "#cdc8a5", "#773a27", "#98755a", "#c6c6c9", "#93481c", "#cc5629", "#513a1d", "#393937", "#1b1813", "#351d11", "#cec0b1", "#241a13", "#592d18", "#c33608", "#411a08", "#bc7a32", "#9e9793", "#beaaa6", "#161a19", "#a38a81", "#a09496", "#c5d1d7", "#a9a0a5", "#362c2a"],
      superior: ["#a99b75", "#7a623b", "#ca9b5c", "#2c2d28", "#932919", "#e3d6c1", "#d3c1a3", "#603128", "#8a7b5b", "#ccbfa3", "#af9d81", "#5a4626", "#bfb19c", "#7a2b1e", "#521f17"]

    },
    {
      nombre: "Grupo 3",
      fondo: "#202a26",
      trasera: ["#0d0a10", "#99c0ba", "#010302", "#99c0ba", "#060606", "#78b6b0", "#a8c6c7", "#151c1e", "#ddcb82", "#1e1b1c", "#1f191d", "#1e1d22", "#080401", "#382322", "#605453", "#4f3728", "#322222", "#362423", "#362523", "#786d7b", "#503e43", "#684830", "#53453f", "#423b3b", "#2c2120", "#50454b", "#7c686c", "#3e3236"],
      media: ["#b7b491", "#eae5b0"],
      superior: ["#d0d3b9", "#b9cabf", "#aec4bb", "#9ab8b5", "#94aeaa", "#afc1c1", "#c5ced0", "#c4cdce", "#d5dedd", "#d2d6d6", "#6a5c4a", "#bed0d7", "#c0d1d9", "#b3c3c7", "#a0abaa", "#c1c2b9", "#9ca69c", "#c2bbbb", "#b2adb1", "#463d3a", "#585051", "#919299", "#b1b1b3", "#afb0b2", "#212329", "#6b695e", "#c3cdd5", "#cacbc7", "#bec8ce", "#625541", "#504042", "#96989a", "#97999b", "#7e7c87", "#746271"]
    },
    {
      nombre: "Grupo 4",
      fondo: "#F2EFE6",
      trasera: ["#FBF3F1", "#AD9A5D","#F9F2F3","#C8BD8A","#AC9864","#937D4B", "#31322D", "#E2E4D8", "#E5F4EE", "#DBD3A0"," #E1A14D", "#E0D4A1", "#C6B276","#BCA771","#ECF6F1"],
      media: ["#3C2629","#1F2128", "#28262D", "#4E3B33", "#8A7450", "#C9B281", "#C1B695", "#702C2D", "#9D8C67", "#7A272A", "#A28B63", "#785C3D", "#7A5B3A", "#968152", "#A7925E", "#CDBE8C", "#DACBA5", "#DDC5A6"],
      superior: ["#A9936A", "#795038", "#785A3F", "#732B2E", "#86302A", "#4E3B33", "#E5F4EE", "#2A2C31", "#444744", "#EEEBD2", "#DDC5A6", "#E1A14D", "#ECF6F1", "#7A5B3A", "#AC9864", "#E2E4D8", "#BCA771", "#31322D"]

    }
  ];

  resetObra();
}

// Dibuja el estado actual de la obra
function draw() {
  if (pausado) return;
  background(fondoElegido);

  mouseEnMovimiento = (mouseX !== ultimaPosX || mouseY !== ultimaPosY);

  // Detecta dirección del mouse
  if (mouseX > ultimaPosX) ultimaDireccionX = 1;
  else if (mouseX < ultimaPosX) ultimaDireccionX = -1;
  else ultimaDireccionX = 0;

  if (mouseY > ultimaPosY) ultimaDireccionY = 1;
  else if (mouseY < ultimaPosY) ultimaDireccionY = -1;
  else ultimaDireccionY = 0;

  ultimaPosX = mouseX;
  ultimaPosY = mouseY;

  let desplazamiento = int(map(mouseX, 0, width, -cantidadBastones * sensibilidadDesplazamiento, cantidadBastones * sensibilidadDesplazamiento));

  // Dibuja cada capa y sus bastones
  for (let i = 0; i < capas.length; i++) {
    let capa = capas[i];

    // Modifica la frecuencia de los bastones si el mouse está presionado
    if (mouseIsPressed) {
      let frecOffset = map(mouseX, 0, width, -0.03, 0.03);
      for (let baston of capa.bastones) {
        baston.actualizarFrecuencia(baston.frecuenciaOriginal + frecOffset);
      }
    }

    // Agrega bastones progresivamente en la capa activa
    if (mouseEnMovimiento && i === capas.length - 1 && capa.contadorBastones < cantidadBastones) {
      capa.contadorBastones += velocidad;
    }

    // Transiciones de alpha y brillo para capas anteriores
    let capaNueva = capas[capas.length - 1];
    if (i !== capas.length - 1 && capas.length === maxCapas) {
      let progreso = capaNueva.contadorBastones / (cantidadBastones * 0.5);
      progreso = constrain(progreso, 0, 1);
      let t = easeOutQuad(progreso);
      if (capa.alphaTarget !== undefined && capa.startAlpha !== undefined) {
        capa.alpha = lerp(capa.startAlpha, capa.alphaTarget, t);
        capa.brightnessFactor = lerp(capa.startBrightness, capa.brightnessTarget, t);

        if (i === 0 && capas.length === maxCapas) {
          let progresoFinal = constrain((capaNueva.contadorBastones - cantidadBastones * 2 / 3) / (cantidadBastones / 3), 0, 1);
          let tf = easeOutQuad(progresoFinal);
          capa.alpha = lerp(capa.alpha, 0, tf);
        }
      }
    }

    // Dibuja los bastones de la capa
    for (let j = 0; j < capa.contadorBastones && j < capa.bastones.length; j++) {
      let baston = capa.bastones[j];
      let posicionX = capa.direccion === 1 ? j * anchoBaston : width - j * anchoBaston;
      let movimientoFactor = mouseEnMovimiento ? factorMovimientoY : 0.3;
      let movimientoYExtra = movimientoFactor * map(mouseY, 0, height, -rangoMovimientoY, rangoMovimientoY) * sin(j * 0.3 + frameCount * 0.1);
      let alphaBase = baston.esTransparente ? 0 : capa.alpha;
      let colorLooped = capa.colores[j % cantidadBastones];
      baston.dibujar(posicionX, movimientoYExtra, alphaBase, colorLooped);
    }
  }

  // Cuando la capa activa termina, rota capas y crea una nueva
  let capaActiva = capas[capas.length - 1];
  if (capaActiva.contadorBastones >= cantidadBastones) {
    if (capas.length >= maxCapas) capas.shift();
    direccionCapa *= -1;
    crearNuevaCapa();
  }
}

// Crea una nueva capa de bastones con parámetros aleatorios y progresivos
function crearNuevaCapa() {
  if (contadorCapas % 3 === 0 && contadorCapas !== 0) {
    let seleccion = random(paletas);
    paletaElegida = seleccion;
    fondoElegido = hexToHSB(seleccion.fondo);
  }

  let nombreSubgrupo = subgruposPaleta[indiceSubgrupoPaleta];
  let paleta = paletaElegida[nombreSubgrupo];
  indiceSubgrupoPaleta = (indiceSubgrupoPaleta + 1) % subgruposPaleta.length;
  contadorCapas++;

  let nueva = {
    bastones: [],
    colores: [],
    direccion: direccionCapa,
    contadorBastones: 0,
    alpha: 100,
    brightnessFactor: 1
  };

  let offsetSinusoide = capas.length * 0.5;
  let eje = random(TWO_PI) + offsetSinusoide * 2.0;
  let ejeVariante = random(TWO_PI) + offsetSinusoide * 2.5;

  for (let i = 0; i < capas.length; i++) {
    capas[i].alphaTarget = capas[i].alpha * (1 - porcentajeDesvanecimiento);
    capas[i].brightnessTarget = capas[i].brightnessFactor * (1 - porcentajeOscurecimiento);
    capas[i].startAlpha = capas[i].alpha;
    capas[i].startBrightness = capas[i].brightnessFactor;
  }

  let disponibles = tiposTransparencia.filter(t => !usadosTransparencia.includes(t));
  let tipo = random(disponibles);
  usadosTransparencia.push(tipo);
  if (usadosTransparencia.length === tiposTransparencia.length) usadosTransparencia = [];

  let rango = {
    pocos: [0, 0.1],
    medios: [0.2, 0.3],
    muchos: [0.5, 0.75]
  };

  let [min, max] = rango[tipo];
  let porcentaje = random(min, max);
  let cantidadTransparentes = int(cantidadBastones * porcentaje);
  let indicesTransparentes = generarGruposNaturales(cantidadBastones, cantidadTransparentes, 5, 20);

  let coloresHSB = paleta.map(hex => hexToHSB(hex));
  let inicioAleatorio = int(random(coloresHSB.length));

  let margenSuperior = height * 0.1;
  let margenInferior = height * 0.9;
  let desplazamientoMax = (margenInferior - margenSuperior) * factorDesplazamientoAcumulado;
  let desplazamientoAcumulado = 0;
  let frecuenciaLargoBase = 0.05 + ultimaDireccionY * (factorFrecuenciaMouse * 4);

  // Selecciona el 35% de los bastones para tener esquinas redondeadas (1-3px)
  let porcentajeRedondeados = 0.35;
  let cantidadRedondeados = int(cantidadBastones * porcentajeRedondeados);
  let indicesRedondeados = [];
  while (indicesRedondeados.length < cantidadRedondeados) {
    let idx = int(random(0, cantidadBastones));
    if (!indicesRedondeados.includes(idx)) indicesRedondeados.push(idx);
  }

  for (let i = 0; i < cantidadBastones; i++) {
    let centroBase = height / 2;
    desplazamientoAcumulado += ultimaDireccionX * random(0, desplazamientoMax / cantidadBastones);
    let centroY = constrain(centroBase + desplazamientoAcumulado, margenSuperior, margenInferior);
    let idxColor = (i + inicioAleatorio) % coloresHSB.length;
    let col = coloresHSB[idxColor];
    let esTransparente = indicesTransparentes.includes(i);
    let esquinasRedondeadas = indicesRedondeados.includes(i) ? int(random(1, 4)) : 0;
    nueva.bastones.push(new Sinusitis(i, eje, ejeVariante, anchoBaston, col, esTransparente, centroY, frecuenciaLargoBase, esquinasRedondeadas));
    nueva.colores.push(col);
  }

  capas.push(nueva);
}

// Convierte un color HEX a HSB
function hexToHSB(hexColor) {
  let c = color(hexColor);
  return color(hue(c), saturation(c), brightness(c), 100);
}

// Easing para transiciones suaves
function easeOutQuad(t) {
  return t * (2 - t);
}

// Genera grupos de índices para transparencias
function generarGruposNaturales(total, cantidad, minGrupo, maxGrupo) {
  let indices = [];
  let usados = new Set();
  let restantes = cantidad;
  while (restantes > 0) {
    let inicio = int(random(0, total - 1));
    let tamGrupo = int(random(minGrupo, maxGrupo));
    for (let i = 0; i < tamGrupo && restantes > 0; i++) {
      let idx = inicio + i;
      if (idx < total && !usados.has(idx)) {
        indices.push(idx);
        usados.add(idx);
        restantes--;
      }
    }
  }
  return indices;
}

// Control de teclado: R para resetear, Espacio para pausar/reanudar
function keyPressed() {
  if (key === 'r' || key === 'R') resetObra();
  if (key === ' ') pausado = !pausado;
}

// Reinicia la obra con nuevos parámetros aleatorios
function resetObra() {
  background(255);
  capas = [];
  usadosTransparencia = [];
  direccionCapa = 1;
  cantidadBastones = (random(1) < 0.7) ? int(random(70, 100)) : int(random(100, 200));
  anchoBaston = width / cantidadBastones;
  let seleccion = random(paletas);
  paletaElegida = seleccion;
  fondoElegido = hexToHSB(seleccion.fondo);
  contadorCapas = 0;
  indiceSubgrupoPaleta = 0;
  crearNuevaCapa();
}

// Botón para guardar imagen
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-save');
  if (btn) {
    btn.addEventListener('click', () => {
      saveCanvas('IA2_CARRER_SCARAMUZZA_SILVA', 'jpg');
    });
  }
});