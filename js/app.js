/* ============================================================
   Template logic: render, calibration, persistence, print gate.
   Depends on campos.js and importe-letras.js (loaded first).
   ============================================================ */

var CLAVE_ALMACEN = 'letra_fijos';
var marco, hoja;
var guiasAntesDeImprimir = false;
var loteFilas = [];
var loteIndice = -1;

function val(id){
  var e = document.getElementById(id);
  return e ? String(e.value).trim() : '';
}

function setVal(id, v){
  var e = document.getElementById(id);
  if(e) e.value = v;
}

/* ISO 2026-11-09 from <input type="date"> -> 09/11/2026 on the bill. */
function fechaParaHoja(s){
  var iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if(iso) return iso[3] + '/' + iso[2] + '/' + iso[1];
  return s;
}

function hoyISO(){
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, '0');
  var day = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + m + '-' + day;
}

function textoCampo(id){
  var v = val(id);
  if(id === 'fgiro' || id === 'fvenc') return fechaParaHoja(v);
  return v;
}

function derivados(){
  var mon = val('moneda') || 'PEN';
  var imp = val('importe');
  var n = parseImporte(imp);
  var letras = isNaN(n) ? '' : importeEnLetras(n, mon);

  var l1 = letras, l2 = '';
  if(letras.length > 62){
    var corte = letras.lastIndexOf(' ', 62);
    if(corte < 0) corte = 62;
    l1 = letras.slice(0, corte);
    l2 = letras.slice(corte + 1);
  }

  return {
    _imp:     isNaN(n) ? '' : simboloMoneda(mon) + formatoImporte(n),
    _letras1: l1,
    _letras2: l2
  };
}

function actualizarLetrasVivo(){
  var el = document.getElementById('letrasvivo');
  if(!el) return;
  var extra = derivados();
  var t = (extra._letras1 + ' ' + extra._letras2).trim();
  el.textContent = t || 'Escribe el importe para verlo en letras (es lo que prevalece en la ley).';
}

function ajustar(el, f){
  if(!el.textContent) return;
  var base = 2.5;
  if(f.cls && f.cls.indexOf('sm') >= 0) base = 2.1;
  if(f.cls && f.cls.indexOf('bg') >= 0) base = 2.9;
  var t = base;
  while(el.scrollWidth > el.clientWidth && t > 1.3){
    t -= 0.1;
    el.style.fontSize = t.toFixed(1) + 'mm';
  }
}

function pintar(){
  var ox = parseFloat(val('ox'));
  var oy = parseFloat(val('oy'));
  if(isNaN(ox)) ox = CAL_DEF.ox;
  if(isNaN(oy)) oy = CAL_DEF.oy;

  document.documentElement.style.setProperty('--ox', (BASE_OX + ox) + 'mm');
  document.documentElement.style.setProperty('--oy', oy + 'mm');
  hoja.classList.toggle('guias', document.getElementById('guias').checked);

  var extra = derivados();
  marco.innerHTML = '';

  CAMPOS.forEach(function(f){
    var txt = (f.id.charAt(0) === '_') ? (extra[f.id] || '') : textoCampo(f.id);
    var d = document.createElement('div');
    d.className = 'c ' + (f.cls || '');
    d.style.left   = f.x + 'mm';
    d.style.top    = f.y + 'mm';
    d.style.width  = f.w + 'mm';
    d.style.height = f.h + 'mm';
    d.textContent  = txt;
    marco.appendChild(d);
    ajustar(d, f);
  });

  actualizarLetrasVivo();
  marcarFaltantes();
  guardar();
}

function guardar(){
  try{
    var chk = document.getElementById('recordar');
    if(chk && !chk.checked) return;
    var o = {};
    CAMPOS_FIJOS.forEach(function(k){ o[k] = val(k); });
    localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(o));
    var ok = document.getElementById('calok');
    if(ok) ok.textContent = 'guardado';
  }catch(e){ /* private mode or blocked storage: ignore */ }
}

function cargar(){
  try{
    var o = JSON.parse(localStorage.getItem(CLAVE_ALMACEN) || '{}');
    CAMPOS_FIJOS.forEach(function(k){
      var e = document.getElementById(k);
      if(e && o[k]) e.value = o[k];
    });
  }catch(e){ /* no saved data: keep HTML defaults */ }
}

/* "001" -> "002", "LC-12" -> "LC-13". Empty if there is no trailing number. */
function siguienteNumero(s){
  var m = /(\d+)$/.exec(String(s || ''));
  if(!m) return '';
  var n = String(parseInt(m[1], 10) + 1);
  while(n.length < m[1].length) n = '0' + n;
  return s.slice(0, m.index) + n;
}

function limpiarVariables(){
  intentoImprimir = false;
  var next = siguienteNumero(val('numero'));
  CAMPOS_VARIABLES.forEach(function(k){
    var e = document.getElementById(k);
    if(e) e.value = '';
  });
  if(next) setVal('numero', next);
  setVal('fgiro', hoyISO());
  pintar();
  var p = document.getElementById('numero');
  if(p) p.focus();
}

function nudge(id, delta){
  var n = parseFloat(val(id));
  if(isNaN(n)) n = 0;
  setVal(id, (n + delta).toFixed(1));
  pintar();
}

function restablecerCalibracion(){
  setVal('ox', String(CAL_DEF.ox));
  setVal('oy', String(CAL_DEF.oy));
  pintar();
}

function copiarCalibracion(){
  var txt = 'ox=' + val('ox') + '  oy=' + val('oy');
  function ok(){
    var n = document.getElementById('calok');
    if(n) n.textContent = 'copiado: ' + txt;
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(ok).catch(function(){ window.prompt('Copia estos valores y pégalos en la impresora', txt); });
  }else{
    window.prompt('Copia estos valores y pégalos en la impresora', txt);
  }
}

var CAMPOS_OBLIGATORIOS = [
  {id:'numero',  label:'Número',                      falta:function(){ return !val('numero'); }},
  {id:'fgiro',   label:'Fecha de giro',                falta:function(){ return !val('fgiro'); }},
  {id:'fvenc',   label:'Vencimiento',                  falta:function(){ return !val('fvenc'); }},
  {id:'importe', label:'Importe (número válido)',      falta:function(){ return isNaN(parseImporte(val('importe'))); }},
  {id:'orden1',  label:'Beneficiario (a la orden de)', falta:function(){ return !val('orden1'); }},
  {id:'gdo_nom', label:'Girado (quien debe pagar)',    falta:function(){ return !val('gdo_nom'); }},
  {id:'gdr_nom', label:'Girador (quien emite)',        falta:function(){ return !val('gdr_nom'); }}
];

function camposObligatoriosFaltantes(){
  var falta = [];
  CAMPOS_OBLIGATORIOS.forEach(function(c){
    if(c.falta()) falta.push(c.label);
  });
  return falta;
}

/* Only paints the red "falta" highlight after the first print attempt,
   so a blank new form doesn't look like it's full of errors. */
var intentoImprimir = false;

function marcarFaltantes(){
  if(!intentoImprimir) return;
  CAMPOS_OBLIGATORIOS.forEach(function(c){
    var e = document.getElementById(c.id);
    if(e) e.classList.toggle('falta', c.falta());
  });
}

function mostrarAviso(msg, tipo){
  var el = document.getElementById('aviso');
  if(!el) return;
  el.textContent = msg || '';
  el.className = 'aviso' + (tipo ? ' ' + tipo : '');
}

/* Minimal CSV parser: comma-separated, double-quoted fields with "" escapes. */
function parseLineaCSV(linea){
  var out = [];
  var cur = '';
  var enComillas = false;
  for(var i = 0; i < linea.length; i++){
    var c = linea.charAt(i);
    if(enComillas){
      if(c === '"'){
        if(linea.charAt(i + 1) === '"'){ cur += '"'; i++; }
        else enComillas = false;
      }else cur += c;
    }else{
      if(c === '"') enComillas = true;
      else if(c === ','){ out.push(cur); cur = ''; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

function parseCSV(texto){
  var lineas = texto.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
    .filter(function(l){ return l.trim() !== ''; });
  if(!lineas.length) return [];
  var encabezados = parseLineaCSV(lineas[0]).map(function(h){ return h.trim(); });
  var filas = [];
  for(var i = 1; i < lineas.length; i++){
    var valores = parseLineaCSV(lineas[i]);
    var fila = {};
    encabezados.forEach(function(h, idx){ fila[h] = valores[idx] !== undefined ? valores[idx] : ''; });
    filas.push(fila);
  }
  return filas;
}

function descargarPlantillaCSV(){
  var encabezados = CAMPOS_VARIABLES.join(',');
  var blob = new Blob([encabezados + '\n'], {type: 'text/csv;charset=utf-8;'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'plantilla_letras.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function actualizarLoteUI(){
  var nav = document.getElementById('loteNav');
  var contador = document.getElementById('loteContador');
  if(!nav || !contador) return;
  if(!loteFilas.length){
    nav.style.display = 'none';
    return;
  }
  nav.style.display = '';
  contador.textContent = 'Letra ' + (loteIndice + 1) + ' de ' + loteFilas.length;
}

function cargarFilaLote(i){
  if(i < 0 || i >= loteFilas.length) return;
  loteIndice = i;
  var fila = loteFilas[i];
  CAMPOS_VARIABLES.forEach(function(campo){
    setVal(campo, Object.prototype.hasOwnProperty.call(fila, campo) ? fila[campo] : '');
  });
  intentoImprimir = false;
  pintar();
  actualizarLoteUI();
}

function loteSiguiente(){
  if(loteIndice + 1 < loteFilas.length) cargarFilaLote(loteIndice + 1);
}

function loteAnterior(){
  if(loteIndice - 1 >= 0) cargarFilaLote(loteIndice - 1);
}

function salirLote(){
  loteFilas = [];
  loteIndice = -1;
  actualizarLoteUI();
  var info = document.getElementById('loteInfo');
  if(info) info.textContent = '';
  var fileInput = document.getElementById('csvFile');
  if(fileInput) fileInput.value = '';
}

function imprimirLetra(){
  intentoImprimir = true;
  marcarFaltantes();
  var falta = camposObligatoriosFaltantes();
  if(falta.length){
    mostrarAviso('Falta: ' + falta.join(', ') + '.', 'warn');
    if(!window.confirm('Falta completar:\n- ' + falta.join('\n- ') + '\n\n¿Imprimir igual? El papel valorizado no se recupera.')){
      return;
    }
  }else{
    mostrarAviso('Abre el diálogo de Chrome: papel Letra 100x210, escala 100 %, márgenes Ninguno, encabezados desactivados.', 'ok');
  }
  window.print();
}

function normalizarImporte(){
  var el = document.getElementById('importe');
  if(!el) return;
  var n = parseImporte(el.value);
  if(!isNaN(n)) el.value = n.toFixed(2);
  pintar();
}

document.addEventListener('DOMContentLoaded', function(){
  marco = document.getElementById('marco');
  hoja  = document.getElementById('hoja');

  document.getElementById('ox').value = CAL_DEF.ox;
  document.getElementById('oy').value = CAL_DEF.oy;

  document.querySelectorAll('input,select,textarea').forEach(function(e){
    e.addEventListener('input',  pintar);
    e.addEventListener('change', pintar);
  });

  var imp = document.getElementById('importe');
  if(imp) imp.addEventListener('blur', normalizarImporte);

  var csvInput = document.getElementById('csvFile');
  if(csvInput) csvInput.addEventListener('change', function(e){
    var file = e.target.files && e.target.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(ev){
      loteFilas = parseCSV(String(ev.target.result));
      var info = document.getElementById('loteInfo');
      if(!loteFilas.length){
        if(info) info.textContent = 'El CSV no tiene filas de datos.';
        return;
      }
      if(info) info.textContent = loteFilas.length + ' letras cargadas de "' + file.name + '".';
      cargarFilaLote(0);
    };
    reader.readAsText(file, 'UTF-8');
  });

  cargar();
  if(!val('fgiro')) setVal('fgiro', hoyISO());

  var err = verificarImporteEnLetras();
  if(err){
    mostrarAviso('Error interno en importe en letras: ' + err, 'warn');
    console.error(err);
  }

  pintar();

  window.addEventListener('beforeprint', function(){
    guiasAntesDeImprimir = document.getElementById('guias').checked;
    document.getElementById('guias').checked = false;
    pintar();
  });
  window.addEventListener('afterprint', function(){
    document.getElementById('guias').checked = guiasAntesDeImprimir;
    pintar();
    if(loteFilas.length && loteIndice < loteFilas.length - 1){
      loteSiguiente();
      mostrarAviso('Siguiente: Letra ' + (loteIndice + 1) + ' de ' + loteFilas.length + '. Carga la hoja y toca Imprimir.', 'ok');
    }else if(loteFilas.length){
      mostrarAviso('Lote terminado: ' + loteFilas.length + ' letras.', 'ok');
    }
  });
});
