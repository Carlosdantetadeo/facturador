/* ============================================================
   MAPA DE CAMPOS
   Coordenadas en milimetros, medidas sobre el escaneo a 300 dpi
   del formato preimpreso. El origen (0,0) es la esquina superior
   izquierda del MARCO IMPRESO, no del papel.

   Eje x : a lo largo del recibo  (0 = lado "Clausulas Especiales",
                                   202.2 = lado "Moneda e Importe")
   Eje y : a lo ancho del recibo  (0 = lado de la cabecera NUMERO,
                                   90.1 = lado "No escribir debajo")

   El desfase entre el borde del papel y el marco se corrige con
   CAL_DEF (ox, oy), copiados a --ox y --oy. Son los unicos numeros
   de calibracion; no los dupliques en HTML ni en CSS.

   Los ids que empiezan con "_" son campos calculados, no se
   escriben a mano: los produce derivados() en app.js.
   ============================================================ */

/* Default paper-to-frame offset, from the 300 dpi scan (estimated). */
var CAL_DEF = { ox: 3.9, oy: 4.95 };

var CAMPOS = [

  /* --- Cabecera: 6 columnas. Separadores reales en
         34.3 | 61.0 | 87.7 | 114.5 | 141.2 | 167.8 | 193.6
         Zona de llenado: y 6.5 a 13.5 (debajo de DIA/MES/ANO) --- */
  {id:'numero',   x:34.3,  y:7.6,  w:26.7,  h:5.2, cls:'ctr'},
  {id:'ref',      x:61.0,  y:7.6,  w:26.7,  h:5.2, cls:'ctr'},
  {id:'lugar',    x:87.7,  y:7.6,  w:26.8,  h:5.2, cls:'ctr'},
  {id:'fgiro',    x:114.5, y:7.6,  w:26.7,  h:5.2, cls:'ctr'},
  {id:'fvenc',    x:141.2, y:7.6,  w:26.6,  h:5.2, cls:'ctr'},
  {id:'_imp',     x:167.8, y:7.6,  w:25.8,  h:5.2, cls:'ctr bg'},

  /* --- "...a la Orden de": linea punteada a y=17.3,
         el texto impreso del formato termina en x≈128 --- */
  {id:'orden1',   x:129.0, y:13.9, w:63.5,  h:3.2},
  /* --- segunda linea punteada a y=22.7, termina antes de
         "La cantidad de" que empieza en x≈162 --- */
  {id:'orden2',   x:35.0,  y:19.3, w:125.0, h:3.2},

  /* --- Caja del importe en letras: y 23.7 a 32.8 --- */
  {id:'_letras1', x:35.0,  y:24.6, w:157.0, h:3.4},
  {id:'_letras2', x:35.0,  y:28.4, w:157.0, h:3.4},

  /* --- Caja inferior izquierda (x 34.3 a 111.3).
         Lineas punteadas medidas en:
         42.3 Girado / 47.3 continuacion / 52.2 Domicilio /
         57.1 DOI-TEL / 62.5 Aval / 68.5 Domicilio aval /
         73.3 DOI-TEL aval / 78.2 Firma (manual) /
         82.5 Nombre del Representante --- */
  {id:'gdo_nom',  x:50.0,  y:39.0, w:58.0,  h:3.2},
  {id:'gdo_nom2', x:35.0,  y:44.0, w:73.0,  h:3.2},
  {id:'gdo_dom',  x:50.0,  y:48.9, w:58.0,  h:3.2},
  {id:'gdo_doi',  x:46.0,  y:53.8, w:46.0,  h:3.2},
  {id:'gdo_tel',  x:103.5, y:53.8, w:7.3,   h:3.2, cls:'sm'},

  {id:'av_nom',   x:57.0,  y:59.3, w:51.0,  h:3.2},
  {id:'av_dom',   x:50.0,  y:65.2, w:58.0,  h:3.2},
  {id:'av_doi',   x:46.0,  y:70.0, w:46.0,  h:3.2},
  {id:'av_tel',   x:103.5, y:70.0, w:7.3,   h:3.2, cls:'sm'},
  {id:'av_rep',   x:66.0,  y:79.2, w:42.0,  h:3.2},

  /* --- Tabla del banco: celdas y 47.0 a 56.2
         columnas 111.4 | 132.7 | 152.7 | 184.5 | 193.6 --- */
  {id:'bco',      x:111.4, y:49.5, w:21.3,  h:4.5, cls:'ctr'},
  {id:'ofi',      x:132.7, y:49.5, w:20.0,  h:4.5, cls:'ctr'},
  {id:'cta',      x:152.7, y:49.5, w:31.8,  h:4.5, cls:'ctr'},
  {id:'dc',       x:184.5, y:49.5, w:9.1,   h:4.5, cls:'ctr'},

  /* --- Bloque del girador, a la derecha de las etiquetas
         "Nombre / Denominado o" (y 58.5),
         "Razon Social del Girador" (y 62.5),
         "D.O.I." (y 66.5) --- */
  {id:'gdr_nom',  x:143.0, y:55.5, w:49.0,  h:3.2, cls:'sm'},
  {id:'gdr_nom2', x:143.0, y:59.5, w:49.0,  h:3.2, cls:'sm'},
  {id:'gdr_doi',  x:122.0, y:63.5, w:70.0,  h:3.2, cls:'sm'}
];

/* Campos que se conservan entre letras (datos propios + calibracion) */
var CAMPOS_FIJOS = ['gdr_nom','gdr_nom2','gdr_doi','bco','ofi','cta','dc','lugar','moneda','ox','oy'];

/* Campos que se limpian al empezar una letra nueva */
var CAMPOS_VARIABLES = [
  'numero','ref','fgiro','fvenc','importe','orden1','orden2',
  'gdo_nom','gdo_nom2','gdo_dom','gdo_doi','gdo_tel',
  'av_nom','av_dom','av_doi','av_tel','av_rep'
];
