// Clase que representa cada bastón sinusoidal
class Sinusitis {
  constructor(x, eje, ejeVariante, ancho, color, esTransparente, centroY, frecuenciaLargo, esquinasRedondeadas = 0) {
    this.x = x;
    this.ancho = ancho;
    this.eje = eje;
    this.ejeVariante = ejeVariante;
    this.color = color;
    this.esTransparente = esTransparente;
    this.centroY = centroY;
    this.frecuencia = frecuenciaLargo || 0.05;
    this.frecuenciaOriginal = this.frecuencia;

    this.y = sin(this.x * this.frecuencia + eje + sin(this.x * 0.01 + this.ejeVariante));
    this.largoBase = map(this.y, -1, 1, 200, largoMaximoBaston); // <--- largo base por sinusoide
    this.largo = this.largoBase;

    let yTop = this.centroY - this.largo / 2;
    let yBottom = this.centroY + this.largo / 2;
    if (yTop < 0) {
      this.largo -= (0 - yTop);
      this.centroY = this.largo / 2;
    }
    if (yBottom > height) {
      this.largo -= (yBottom - height);
      this.centroY = height - this.largo / 2;
    }

    this.movimientoBaseY = this.centroY + 30 * sin(this.x * 0.02 + eje + cos(this.x * 0.015 + this.ejeVariante));
    this.hilos = [];
    if (!this.esTransparente) {
      let numLineas = int(random(3, 6));
      for (let i = 0; i < numLineas; i++) {
        let offsetX = random(-this.ancho / 2 + 2, this.ancho / 2 - 2);
        this.hilos.push({ offsetX: offsetX });
      }
    }
    this.esquinasRedondeadas = esquinasRedondeadas;
  }

  // Actualiza la frecuencia y el largo del bastón
  actualizarFrecuencia(frec) {
    this.frecuencia = frec;
    this.y = sin(this.x * this.frecuencia + this.eje + sin(this.x * 0.01 + this.ejeVariante));
    this.largoBase = map(this.y, -1, 1, 200, largoMaximoBaston); // <--- largo base por sinusoide
    this.largo = this.largoBase;

    let yTop = this.centroY - this.largo / 2;
    let yBottom = this.centroY + this.largo / 2;
    if (yTop < 0) {
      this.largo -= (0 - yTop);
      this.centroY = this.largo / 2;
    }
    if (yBottom > height) {
      this.largo -= (yBottom - height);
      this.centroY = height - this.largo / 2;
    }

    this.movimientoBaseY = this.centroY + 30 * sin(this.x * 0.02 + this.eje + cos(this.x * 0.015 + this.ejeVariante));
  }

  // Nuevo método para truncar el largo según el volumen
  truncarLargoPorVolumen(amplitud) {
    const largoMinimo = 40;
    const largoMaximo = largoMaximoBaston;

    let minVol = typeof window.umbralVolumen !== "undefined" ? window.umbralVolumen : 0.003;
    let maxVol = typeof window.volumenMaximo !== "undefined" ? window.volumenMaximo : 0.08;

    // Si el volumen está por debajo del mínimo, el bastón es transparente y de largo mínimo
    if (amplitud <= minVol) {
      this.largo = largoMinimo;
      this.esTransparente = true;
      return;
    } else {
      this.esTransparente = false;
    }

    // Mapeo robusto: si minVol == maxVol, evitar división por cero
    let factor;
    if (maxVol > minVol) {
      factor = (amplitud - minVol) / (maxVol - minVol);
    } else {
      factor = 1; // Si el rango es inválido, usar largo máximo
    }
    factor = constrain(factor, 0, 1);
    this.largo = lerp(largoMinimo, largoMaximo, factor);

    // Ajuste para no salir del canvas
    let yTop = this.centroY - this.largo / 2;
    let yBottom = this.centroY + this.largo / 2;
    if (yTop < 0) {
      this.largo -= (0 - yTop);
      this.centroY = this.largo / 2;
    }
    if (yBottom > height) {
      this.largo -= (yBottom - height);
      this.centroY = height - this.largo / 2;
    }
  }

  // Dibuja el bastón en pantalla
  dibujar(posicion, movimientoYExtra = 0, nuevaTransparencia = null, nuevoColor = null) {
    rectMode(CENTER);
    noStroke();

    // Oscilación vertical lenta de hasta 4px
    let t = millis() * 0.0003 + this.x * 0.05; // velocidad y desfase por bastón
    let oscilacion = sin(t) * 2; // entre -2 y +2 px

    let colorUsado = nuevoColor || this.color;
    let alfa = nuevaTransparencia !== null ? nuevaTransparencia : alpha(colorUsado);

    let c = color(
      hue(colorUsado),
      saturation(colorUsado),
      brightness(colorUsado),
      alfa
    );

    fill(c);
    let largoDibujar = typeof this.largoFijado !== "undefined" ? this.largoFijado : this.largo;
    rect(
      posicion,
      this.movimientoBaseY + movimientoYExtra + oscilacion,
      this.ancho,
      largoDibujar,
      this.esquinasRedondeadas
    );

    if (!this.esTransparente) {
      strokeWeight(0.5);
      for (let hilo of this.hilos) {
        let brilloBase = brightness(c);
        let hiloColor = brilloBase > 60
          ? color(hue(c), saturation(c) * 0.95, brilloBase * 0.85, alfa)
          : color(hue(c), saturation(c) * 0.9, min(100, brilloBase * 1.2), alfa);

        stroke(hiloColor);
        let yCentro = this.movimientoBaseY + movimientoYExtra + oscilacion;
        let y1 = yCentro - largoDibujar / 2;
        let y2 = yCentro + largoDibujar / 2;
        line(posicion + hilo.offsetX, y1, posicion + hilo.offsetX, y2);
      }
      noStroke();
    }
  }
}