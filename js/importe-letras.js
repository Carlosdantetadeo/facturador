/* ============================================================
   Conversion of amount to words (Peruvian Spanish).
   Output: "MIL DOSCIENTOS CINCUENTA CON 50/100 SOLES"

   If the amount in words disagrees with the digits, the words win
   (Ley 27287 art. 5). Keep parseImporte and importeEnLetras in sync.
   ============================================================ */

var _U = ['','UNO','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE',
          'DIEZ','ONCE','DOCE','TRECE','CATORCE','QUINCE','DIECISEIS','DIECISIETE',
          'DIECIOCHO','DIECINUEVE','VEINTE'];
var _D = ['','','VEINTI','TREINTA','CUARENTA','CINCUENTA','SESENTA','SETENTA','OCHENTA','NOVENTA'];
var _C = ['','CIENTO','DOSCIENTOS','TRESCIENTOS','CUATROCIENTOS','QUINIENTOS',
          'SEISCIENTOS','SETECIENTOS','OCHOCIENTOS','NOVECIENTOS'];

/* Bills of exchange on this form stay below one billion (mil millones). */
var IMPORTE_MAX = 999999999.99;

function dosCifras(n){
  if(n <= 20) return _U[n];
  var d = Math.floor(n/10), u = n%10;
  if(d === 2) return u ? 'VEINTI'+_U[u] : 'VEINTE';
  return _D[d] + (u ? ' Y '+_U[u] : '');
}

function tresCifras(n){
  if(n === 100) return 'CIEN';
  var c = Math.floor(n/100), r = n%100;
  return (_C[c] + (r ? ' '+dosCifras(r) : '')).trim();
}

function aLetras(n){
  n = Math.floor(n);
  if(n === 0) return 'CERO';
  var out = '';
  var mill = Math.floor(n/1000000);
  var mil  = Math.floor((n%1000000)/1000);
  var res  = n%1000;
  if(mill) out += (mill === 1 ? 'UN MILLON' : tresCifras(mill)+' MILLONES') + ' ';
  if(mil)  out += (mil  === 1 ? 'MIL'       : tresCifras(mil)+' MIL')       + ' ';
  if(res)  out += tresCifras(res);
  return out.trim().replace(/\s+/g,' ');
}

/* Turns what the user typed into a number, or NaN if it is not usable. */
function parseImporte(valor){
  var s = String(valor == null ? '' : valor).trim().replace(/\s/g,'');
  if(!s) return NaN;
  var hasDot = s.indexOf('.') >= 0;
  var hasComma = s.indexOf(',') >= 0;
  if(hasDot && hasComma){
    if(s.lastIndexOf(',') > s.lastIndexOf('.')){
      s = s.replace(/\./g,'').replace(',', '.'); /* 1.250,50 */
    }else{
      s = s.replace(/,/g,''); /* 1,250.50 */
    }
  }else if(hasComma){
    s = s.replace(',', '.'); /* 1250,50 */
  }
  if(!/^\d+(\.\d+)?$/.test(s)) return NaN;
  /* Round from the written digits so 9.995 becomes 10.00, not 9.99. */
  var parts = s.split('.');
  var whole = Number(parts[0]);
  var frac = parts[1] || '';
  if(frac.length === 0) frac = '00';
  if(frac.length === 1) frac = frac + '0';
  var bump = 0;
  if(frac.length > 2){
    if(Number(frac.charAt(2)) >= 5) bump = 1;
    frac = frac.slice(0, 2);
  }
  var cents = whole * 100 + Number(frac) + bump;
  if(!isFinite(cents) || cents < 0 || cents > IMPORTE_MAX * 100) return NaN;
  return cents / 100;
}

function importeEnLetras(valor, moneda){
  var n = parseImporte(valor);
  if(isNaN(n)) return '';
  var ent  = Math.floor(n);
  var cent = Math.round((n - ent) * 100);
  if(cent === 100){ ent += 1; cent = 0; }
  var nombre = (moneda === 'USD') ? 'DOLARES AMERICANOS' : 'SOLES';
  return aLetras(ent) + ' CON ' + String(cent).padStart(2,'0') + '/100 ' + nombre;
}

function simboloMoneda(m){ return (m === 'USD') ? 'US$ ' : 'S/ '; }

function formatoImporte(valor){
  var n = parseImporte(valor);
  if(isNaN(n)) return '';
  return n.toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2});
}

/* Silent self-check. Returns '' if every case matches, or an error message. */
function verificarImporteEnLetras(){
  var casos = [
    ['1', 'PEN', 'UNO CON 00/100 SOLES'],
    ['21', 'PEN', 'VEINTIUNO CON 00/100 SOLES'],
    ['100', 'PEN', 'CIEN CON 00/100 SOLES'],
    ['101', 'PEN', 'CIENTO UNO CON 00/100 SOLES'],
    ['1000', 'PEN', 'MIL CON 00/100 SOLES'],
    ['1250.50', 'PEN', 'MIL DOSCIENTOS CINCUENTA CON 50/100 SOLES'],
    ['1,250.50', 'PEN', 'MIL DOSCIENTOS CINCUENTA CON 50/100 SOLES'],
    ['1250,50', 'PEN', 'MIL DOSCIENTOS CINCUENTA CON 50/100 SOLES'],
    ['0.5', 'USD', 'CERO CON 50/100 DOLARES AMERICANOS'],
    ['9.995', 'PEN', 'DIEZ CON 00/100 SOLES'],
    ['1000000', 'PEN', 'UN MILLON CON 00/100 SOLES'],
    ['2000000', 'PEN', 'DOS MILLONES CON 00/100 SOLES']
  ];
  for(var i = 0; i < casos.length; i++){
    var c = casos[i];
    var got = importeEnLetras(c[0], c[1]);
    if(got !== c[2]) return 'Caso ' + c[0] + ' => "' + got + '" (esperado "' + c[2] + '")';
  }
  if(!isNaN(parseImporte('-1'))) return 'No debe aceptar negativos';
  if(!isNaN(parseImporte('1000000000'))) return 'No debe aceptar mil millones';
  return '';
}
