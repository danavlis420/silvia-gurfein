// --- Variables globales de configuración y estado ---
let capas = []; 
let direccionCapa = 1;
let maxCapas = 4;
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
let porcentajeDesvanecimiento = 0.30;
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
let umbralVolumen = 0.003; // Más sensible al micrófono
let dibujandoPorSonido = false;
let volumenActual = 0;
let rangoCentroY = 40;
let sensibilidadFrecuencia = 0.8;
let fft;
let volumenMaximo = 0.08; // Ajustá este valor según tu micro
let volumenSuavizado = 0; // Volumen suavizado para bastones nuevos
let mostrarCartelInicio = true;
let enCalibracion = false;
let calibrando = false;
let calibracionEnProgreso = false;
let muestrasSilencio = [];
let tiempoInicioCalibracion = 0;
let duracionCalibracion = 5000; // 5 segundos

// --- NUEVAS VARIABLES GLOBALES ---
let etapaCalibracion = 0; // 0: silencio, 1: instrucciones aplauso, 2: aplausos, 3: instrucciones grito, 4: grito, 5: final
let muestrasAplausos = [];
let aplausosDetectados = [];
let tiempoInicioAplausos = 0;
let duracionAplausos = 5000;
let cantidadAplausosNecesarios = 3;
let muestrasGrito = [];
let tiempoInicioGrito = 0;
let duracionGrito = 3000; // 3 segundos para gritar

// --- Configuración inicial del canvas y paletas ---
function setup() {

  let canvas = createCanvas(800, 600); // <-- guardá el canvas en una variable
  frameRate(24);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  largoMaximoBaston = height * 0.8;

  // Iniciar audio tras interacción del usuario
  getAudioContext().suspend();
  canvas.elt.addEventListener('mousedown', () => {
    if (mostrarCartelInicio) {
      mostrarCartelInicio = false;
      userStartAudio();
      getAudioContext().resume();
    }
  });

  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

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
      media: ["#5b332f","#735c40", "#c6c5c1", "#ad9982", "#b0aa9c", "#c5b6af", "#a99e88", "#695a3e", "#321a14", "#551a09", "#775b3a", "#bcaa90", "#595150", "#201812", "#4e392d", "#a6a1a0", "#c18c4f", "#7f6345", "#2b2522", "#2d180e", "#875e52", "#a7a4a6", "#cc995b", "#b99c6e", "#c7ab7b", "#a38660", "#d4c6a0", "#956127", "#483a24", "#2f2720", "#cdc8a5", "#773a27", "#98775a", "#c6c6c9", "#93481c", "#cc5629", "#513a1d", "#393937", "#1b1813", "#351d11", "#cec0b1", "#241a13", "#592d18", "#c33608", "#411a08", "#bc7a32", "#9e9793", "#beaaa6", "#161a19", "#a38a81", "#a09496", "#c5d1d7", "#a9a0a5", "#362c2a"],
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

// --- Detección de aplauso/snare para cambiar paleta ---
let ultimoCambioPaletaPorAplauso = 0;
let tiempoEntreCambios = 500; // milisegundos entre cambios de paleta por aplauso/snare
let umbralAplauso = 0.02;      // mayor que 0.0075
let umbralEnergiaAltos = 10;   // mayor que 5.07 (así solo un pico fuerte lo supera)
let umbralGraves = 100;        // opcional, bajalo si querés filtrar más graves

let lastClapTime = 0;
let clapMinInterval = 200; // ms entre aplausos válidos

function detectClapFromBuffer(buffer) {
  let t = millis();
  if (t - lastClapTime < clapMinInterval) return false;
  let zeroCrossings = 0, highAmp = 0;
  for (let i = 1; i < buffer.length; i++) {
    if (Math.abs(buffer[i]) > 0.25) highAmp++;
    if ((buffer[i] > 0 && buffer[i - 1] < 0) || (buffer[i] < 0 && buffer[i - 1] > 0)) zeroCrossings++;
  }
  if (highAmp > 20 && zeroCrossings > 30) {
    lastClapTime = t;
    return true;
  }
  return false;
}

function detectarAplausoYOtroSonido() {
  if (calibrando) return;
  if (!fft) return;
  let buffer = fft.waveform();
  if (detectClapFromBuffer(buffer)) {
    let idxActual = paletas.indexOf(paletaElegida);
    let idxSiguiente = (idxActual + 1) % paletas.length;
    cambiarPaleta(idxSiguiente);
    ultimoCambioPaletaPorAplauso = millis();
    console.log('¡Aplauso detectado!');
  }
}

// --- Loop principal de dibujo ---
function draw() {
  detectarAplausoYOtroSonido();

  // --- ETAPA 0: SILENCIO ---
  if (calibrando && calibracionEnProgreso && etapaCalibracion === 0) {
    let ahora = millis();
    let nivel = mic.getLevel();
    muestrasSilencio.push(nivel);

    let segundosRestantes = Math.ceil((duracionCalibracion - (ahora - tiempoInicioCalibracion)) / 1000);
    const mensaje = document.getElementById('calibracion-mensaje');
    if (mensaje) {
      mensaje.innerHTML =
        `<div>Por favor, hacé silencio durante <b>${segundosRestantes}</b> segundos...</div>
        <div style="margin-top:12px; font-size:1.2em;">
          Nivel actual: <b>${nivel.toFixed(5)}</b>
          </div>`;
    }

    if (ahora - tiempoInicioCalibracion >= duracionCalibracion) {
      calibracionEnProgreso = false;
      // Calcular umbral de ruido
      let suma = muestrasSilencio.reduce((a, b) => a + b, 0);
      let promedio = suma / muestrasSilencio.length;
      let margen = 0.003;
      umbralVolumen = promedio + margen;

      // Mensaje intermedio e ir a etapa 1
      etapaCalibracion = 1;
      if (mensaje) {
        mensaje.innerHTML = `<b>¡Listo!</b> Umbral de silencio calibrado: <b>${umbralVolumen.toFixed(5)}</b><br><br>
        Ahora vamos a calibrar los aplausos.<br>
        Cuando estés listo, apretá <b>Siguiente</b> y aplaudí <b>3 veces</b> en 5 segundos.<br><br>
        <button id="btn-calibrar-siguiente" style="font-size:1.1em; padding:8px 24px;">Siguiente</button>`;
      }
      setTimeout(() => {
        const btnSiguiente = document.getElementById('btn-calibrar-siguiente');
        if (btnSiguiente) {
          btnSiguiente.onclick = () => {
            etapaCalibracion = 2;
            muestrasAplausos = [];
            aplausosDetectados = [];
            tiempoInicioAplausos = millis();
            calibracionEnProgreso = true;
          };
        }
      }, 100);
    }
    return;
  }

  // --- ETAPA 2: DETECCIÓN DE APLAUSOS ---
  if (calibrando && calibracionEnProgreso && etapaCalibracion === 2) {
    let ahora = millis();
    let nivel = mic.getLevel();
    let energiaAltos = fft.getEnergy("treble");
    muestrasAplausos.push({nivel, energiaAltos, tiempo: ahora});

    // Mostramos en consola para ajustar si hace falta
    console.log('Aplauso: nivel', nivel, 'agudos', energiaAltos);

    // Detección de picos de aplauso (solo volumen, para no perder ninguno)
    if (
      nivel > umbralVolumen + 0.03 && // margen menor para facilitar detección
      (aplausosDetectados.length === 0 || ahora - aplausosDetectados[aplausosDetectados.length-1].tiempo > 200)
    ) {
      aplausosDetectados.push({nivel, energiaAltos, tiempo: ahora});
    }

    let segundosRestantes = Math.ceil((duracionAplausos - (ahora - tiempoInicioAplausos)) / 1000);
    const mensaje = document.getElementById('calibracion-mensaje');
    if (mensaje) {
      mensaje.innerHTML =
        `<div>Aplaudí <b>3 veces</b> en <b>${segundosRestantes}</b> segundos...</div>
         <div style="margin-top:12px; font-size:1.2em;">
           Nivel actual: <b>${nivel.toFixed(5)}</b><br>
           Agudos: <b>${energiaAltos.toFixed(2)}</b><br>
           Aplausos detectados: <b>${aplausosDetectados.length}</b>
         </div>`;
    }

    if (
      ahora - tiempoInicioAplausos >= duracionAplausos ||
      aplausosDetectados.length >= cantidadAplausosNecesarios
    ) {
      calibracionEnProgreso = false;
      // Tomar los 3 picos más altos
      let niveles = aplausosDetectados.map(a => a.nivel).sort((a, b) => b - a).slice(0, 3);
      let agudos = aplausosDetectados.map(a => a.energiaAltos).sort((a, b) => b - a).slice(0, 3);
      let promedioAplausos = niveles.reduce((a, b) => a + b, 0) / niveles.length;
      let promedioAgudos = agudos.reduce((a, b) => a + b, 0) / agudos.length;
      let margenAplauso = 0.01;
      let margenAgudos = 1;
      umbralAplauso = promedioAplausos - margenAplauso;
      umbralEnergiaAltos = Math.max(0.5, promedioAgudos - margenAgudos); // Asegura que el umbral no sea menor a 5

      // Mensaje intermedio e ir a etapa 3 (instrucción grito)
      etapaCalibracion = 3;
      if (mensaje) {
        mensaje.innerHTML =
          `<b>¡Listo!</b> Umbral de aplauso calibrado: <b>${umbralAplauso.toFixed(5)}</b><br>
           Umbral de agudos calibrado: <b>${umbralEnergiaAltos.toFixed(2)}</b><br><br>
           Ahora vamos a calibrar el volumen máximo.<br>
           Cuando estés listo, apretá <b>Siguiente</b> y gritá fuerte durante <b>3 segundos</b>.<br><br>
           <button id="btn-calibrar-grito" style="font-size:1.1em; padding:8px 24px;">Siguiente</button>`;
      }
      setTimeout(() => {
        const btnGrito = document.getElementById('btn-calibrar-grito');
        if (btnGrito) {
          btnGrito.onclick = () => {
            etapaCalibracion = 4;
            muestrasGrito = [];
            tiempoInicioGrito = millis();
            calibracionEnProgreso = true;
          };
        }
      }, 100);
    }
    return;
  }

  // --- ETAPA 4: GRITO ---
  if (calibrando && calibracionEnProgreso && etapaCalibracion === 4) {
    let ahora = millis();
    let nivel = mic.getLevel();
    muestrasGrito.push(nivel);

    let segundosRestantes = Math.ceil((duracionGrito - (ahora - tiempoInicioGrito)) / 1000);
    const mensaje = document.getElementById('calibracion-mensaje');
    if (mensaje) {
      mensaje.innerHTML =
        `<div>¡Gritá fuerte durante <b>${segundosRestantes}</b> segundos!</div>
         <div style="margin-top:12px; font-size:1.2em;">
           Nivel actual: <b>${nivel.toFixed(5)}</b>
         </div>`;
    }

    if (ahora - tiempoInicioGrito >= duracionGrito) {
      calibracionEnProgreso = false;
      // Tomar el máximo nivel registrado
      volumenMaximo = Math.max(...muestrasGrito);

      // Mensaje final
      etapaCalibracion = 5;
      if (mensaje) {
        mensaje.innerHTML =
          `<b>¡Listo!</b> Volumen máximo calibrado: <b>${volumenMaximo.toFixed(5)}</b><br>
     ¡Calibración completa!<br><br>
     <button id="btn-calibrar-finalizar" style="font-size:1.1em; padding:8px 24px;">Finalizar</button>`;
        // Asignar evento inmediatamente después de crear el botón
        setTimeout(() => {
          const btnFinalizar = document.getElementById('btn-calibrar-finalizar');
          if (btnFinalizar) {
            btnFinalizar.style.display = "";
            btnFinalizar.onclick = () => {
              calibrando = false;
              pausado = false;
              const modal = document.getElementById('calibracion-modal'); // <--- NUEVO
              if (modal) modal.style.display = "none";                   // <--- NUEVO
              mostrarCartelInicio = false; // Para que la obra arranque
              resetObra();
            };
          }
        }, 50);
      }
    }
    return;
  }

  // --- ETAPAS INTERMEDIAS: solo mostrar el pop-up, sin tomar muestras ---
  if (calibrando) return;

  if (mostrarCartelInicio) {
    fill(30);
    textAlign(CENTER, CENTER);
    textSize(32);
    if (enCalibracion) {
      background(20);
      fill(200);
      text("calibrando...", width/2, height/2 - 20);
    } else {
      text("click para comenzar", width/2, height/2 - 20);
    }
    // Logo de reproducir (triángulo)
    fill(30);
    noStroke();
    let size = 48;
    let x = width/2;
    let y = height/2 + 32;
    triangle(
      x - size/2, y - size/2,
      x - size/2, y + size/2,
      x + size/2, y
    );
    return;
  }

  if (pausado) return;
  background(fondoElegido);

  // Actualiza el volumen del micrófono
  volumenActual = mic.getLevel();
  // Suaviza el volumen para el próximo bastón
  volumenSuavizado = lerp(volumenSuavizado, volumenActual, 0.15);

  // Controla si se debe dibujar por sonido
  dibujandoPorSonido = volumenActual >= umbralVolumen;

  // Dibuja y actualiza cada capa
  for (let i = 0; i < capas.length; i++) {
    let capa = capas[i];

    // Agrega bastones progresivamente en la capa activa
    if (i === capas.length - 1 && capa.contadorBastones < cantidadBastones) {
      let desde = Math.floor(capa.contadorBastones);
      let hasta = Math.min(Math.floor(capa.contadorBastones + velocidad), cantidadBastones);

      // Variable para suavizar el volumen entre bastones
      if (typeof capa.ultimoVolumenBaston === "undefined") capa.ultimoVolumenBaston = volumenSuavizado;

      for (let idx = desde; idx < hasta; idx++) {
        if (idx < capa.bastones.length && capa.alphas[idx] === null) {
          let alphaBase = (volumenActual < umbralVolumen) ? 0 : (capa.bastones[idx].esTransparente ? 0 : capa.alpha);

          let baston = capa.bastones[idx];
          if (baston && typeof baston.largoFijado === "undefined") {
            // Suavizá el volumen entre el último y el actual
            capa.ultimoVolumenBaston = lerp(capa.ultimoVolumenBaston, volumenSuavizado, 0.25);
            baston.truncarLargoPorVolumen(capa.ultimoVolumenBaston);
            baston.largoFijado = baston.largo;
          }
          capa.alphas[idx] = alphaBase;
        }
      }
      capa.contadorBastones += velocidad;
    }

    // Transición y desvanecimiento de capas viejas
    let capaNueva = capas[capas.length - 1];
    if (i !== capas.length - 1 && capas.length === maxCapas) {
      let progreso = capaNueva.contadorBastones / (cantidadBastones * 0.5);
      progreso = constrain(progreso, 0, 1);
      let t = easeOutQuad(progreso);
      if (capa.alphaTarget !== undefined && capa.startAlpha !== undefined) {
        capa.alpha = lerp(capa.startAlpha, capa.alphaTarget, t);
        capa.brightnessFactor = lerp(capa.startBrightness, capa.brightnessTarget, t);
      }
      if (i === 0 && capas.length === maxCapas) {
        if (!capa.desvaneciendo) {
          capa.desvaneciendo = true;
          capa.progresoDesvanecimiento = 0;
          capa.alphaInicial = capa.alpha;
        }
        if (capa.desvaneciendo) {
          capa.progresoDesvanecimiento += 0.02;
          let tf = easeOutQuad(constrain(capa.progresoDesvanecimiento, 0, 1));
          capa.alpha = lerp(capa.alphaInicial, 0, tf);
          for (let j = 0; j < capa.alphas.length; j++) {
            capa.alphas[j] = lerp(capa.alphas[j], 0, tf);
          }
        }
      }
    }

    // Dibuja los bastones de la capa y actualiza su largo según la amplitud
    for (let j = 0; j < capa.contadorBastones && j < capa.bastones.length; j++) {
      let baston = capa.bastones[j];

      let posicionX = capa.direccion === 1
        ? map(j, 0, cantidadBastones - 1, anchoBaston / 2, width - anchoBaston / 2)
        : map(j, 0, cantidadBastones - 1, width - anchoBaston / 2, anchoBaston / 2);
      let movimientoYExtra = 0;
      let alphaBase = capa.alphas[j] !== null ? capa.alphas[j] : 0;
      let colorLooped = capa.colores[j % cantidadBastones];
      baston.dibujar(posicionX, movimientoYExtra, alphaBase, colorLooped);
    }
  }

  // Maneja la rotación y creación/eliminación de capas
  let capaActiva = capas[capas.length - 1];
  if (capaActiva.contadorBastones >= cantidadBastones) {
    if (capas.length >= maxCapas && capas[0].desvaneciendo && capas[0].progresoDesvanecimiento >= 1) {
      capas.shift();
    }
    if (capas.length < maxCapas) {
      direccionCapa *= -1;
      crearNuevaCapa();
    }
  }

  // --- Actualiza el medidor de micrófono fuera del canvas ---
  let bar = document.getElementById('mic-bar');
  let barBg = document.getElementById('mic-bar-bg');
  let minDiv = document.getElementById('mic-min');
  let maxDiv = document.getElementById('mic-max');
  let valueSpan = document.getElementById('mic-value');
  if (bar && barBg && minDiv && maxDiv && valueSpan) {
    let h = barBg.offsetHeight;
    let minY = h - Math.round(map(umbralVolumen, 0, volumenMaximo, 0, h, true));
    let maxY = h - Math.round(map(volumenMaximo, 0, volumenMaximo, 0, h, true));
    let valY = h - Math.round(map(volumenActual, 0, volumenMaximo, 0, h, true));
    bar.style.height = (h - valY) + "px";
    minDiv.style.bottom = minY + "px";
    maxDiv.style.bottom = maxY + "px";
    valueSpan.textContent = volumenActual.toFixed(4);
  }
}




// --- Crea una nueva capa de bastones con parámetros aleatorios ---
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
    alphas: [],
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
  let frecuenciaLargoBase = 0.05;

  let porcentajeRedondeados = 0.35;
  let cantidadRedondeados = int(cantidadBastones * porcentajeRedondeados);
  let indicesRedondeados = [];
  while (indicesRedondeados.length < cantidadRedondeados) {
    let idx = int(random(0, cantidadBastones));
    if (!indicesRedondeados.includes(idx)) indicesRedondeados.push(idx);
  }

  for (let i = 0; i < cantidadBastones; i++) {
    let centroBase = height / 2;

    // Análisis real de frecuencia
    let spectrum = fft.analyze();
    let freq = fft.getEnergy("bass") * 0.5 + fft.getEnergy("mid") * 0.3 + fft.getEnergy("treble") * 0.2;
    let freqNorm = map(fft.getCentroid(), 100, 5000, 0, 1, true); // 100Hz a 5kHz
    let variacionY = map(freqNorm, 0, 1, rangoCentroY, -rangoCentroY); // Graves abajo, agudos arriba

    let centroY = constrain(centroBase + variacionY, centroBase - rangoCentroY, centroBase + rangoCentroY);
    let idxColor = (i + inicioAleatorio) % coloresHSB.length;
    let col = coloresHSB[idxColor];
    let esTransparente = indicesTransparentes.includes(i);
    let esquinasRedondeadas = indicesRedondeados.includes(i) ? int(random(1, 4)) : 0;
    let baston = new Sinusitis(
      i, eje, ejeVariante, anchoBaston, col, esTransparente, centroY, frecuenciaLargoBase, esquinasRedondeadas
    );
    // Usar volumen suavizado para el largo
    baston.truncarLargoPorVolumen(volumenSuavizado);
    nueva.bastones.push(baston);
    nueva.colores.push(col);
    nueva.alphas.push(null);
  }

  capas.push(nueva);
}

// --- Convierte un color HEX a HSB ---
function hexToHSB(hexColor) {
  let c = color(hexColor);
  return color(hue(c), saturation(c), brightness(c), 100);
}

// --- Easing cuadrático para transiciones suaves ---
function easeOutQuad(t) {
  return t * (2 - t);
}

// --- Genera grupos de índices para transparencias naturales ---
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

// --- Control de teclado: R para resetear, Espacio para pausar/reanudar ---
function keyPressed() {
  if (key === 'r' || key === 'R') resetObra();
  if (key === ' ') pausado = !pausado;

  // Cambia la paleta con las teclas 1, 2, 3, 4
  if (['1', '2', '3', '4'].includes(key)) {
    cambiarPaleta(int(key) - 1);
  }

  // Toggle menú y medidor con "M"
  if (key === 'm' || key === 'M') {
    const infoControles = document.getElementById('info-controles');
    const infoTP = document.getElementById('info-tp');
    const micMeter = document.getElementById('mic-meter');
    if (infoControles) infoControles.style.display = (infoControles.style.display === "none" ? "" : "none");
    if (infoTP) infoTP.style.display = (infoTP.style.display === "none" ? "" : "none");
    if (micMeter) micMeter.style.display = (micMeter.style.display === "none" ? "" : "none");
  }

  // Toggle fullscreen con "F"
  if (key === 'f' || key === 'F') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
}

// --- Reinicia la obra con nuevos parámetros aleatorios ---
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

// --- Botón para guardar imagen y slider de sensibilidad ---
window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-save');
  if (btn) {
    btn.addEventListener('click', () => {
      saveCanvas('IA2_CARRER_SCARAMUZZA_SILVA', 'jpg');
    });
  }
  // Botón de calibración
  const btnCalibrar = document.getElementById('btn-calibrar');
  const modal = document.getElementById('calibracion-modal');
  const btnComenzar = document.getElementById('btn-calibrar-comenzar');
  const btnFinalizar = document.getElementById('btn-calibrar-finalizar');
  const mensaje = document.getElementById('calibracion-mensaje');

  if (btnCalibrar && modal && btnComenzar && btnFinalizar && mensaje) {
    btnCalibrar.addEventListener('click', () => {
      calibrando = true;
      pausado = true;
      modal.style.display = "flex";
      mensaje.textContent = "¿Listo para calibrar el micrófono?";
      btnComenzar.style.display = "";
      btnFinalizar.style.display = "none";
      calibracionEnProgreso = false;
    });

    btnComenzar.addEventListener('click', () => {
      // ACTIVAR AUDIO CONTEXT Y MICRÓFONO SI NO ESTÁN ACTIVOS
      if (getAudioContext().state !== 'running') {
        userStartAudio();
        getAudioContext().resume();
        if (mic) mic.start();
      }
      mensaje.textContent = "Por favor, hacé silencio durante 5 segundos...";
      btnComenzar.style.display = "none";
      btnFinalizar.style.display = "none";
      muestrasSilencio = [];
      calibracionEnProgreso = true;
      tiempoInicioCalibracion = millis();
    });

  }
});

function cambiarPaleta(idx) {
  if (paletas[idx]) {
    paletaElegida = paletas[idx];
    fondoElegido = hexToHSB(paletaElegida.fondo);
    for (let c = 0; c < capas.length; c++) {
      let nombreSubgrupo = subgruposPaleta[c % subgruposPaleta.length];
      let paletaNueva = paletaElegida[nombreSubgrupo].map(hex => hexToHSB(hex));
      for (let j = 0; j < capas[c].colores.length; j++) {
        capas[c].colores[j] = paletaNueva[j % paletaNueva.length];
        capas[c].bastones[j].color = capas[c].colores[j];
      }
    }
  }
}