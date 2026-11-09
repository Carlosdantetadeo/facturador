const fs = require('fs');
const vm = require('vm');
const ctx = { console: console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/importe-letras.js', 'utf8'), ctx);
const err = ctx.verificarImporteEnLetras();
console.log(err ? err : 'OK');
['1', '21', '100', '9.995', '1,250.50', '1250,50', '-1', 'abc'].forEach(function (x) {
  console.log(x, ctx.parseImporte(x), ctx.importeEnLetras(x, 'PEN'));
});
process.exit(err ? 1 : 0);
