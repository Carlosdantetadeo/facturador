# Llenado de letras de cambio — formato 100 × 210 mm

Plantilla para imprimir sobre letras de cambio preimpresas (formato autorizado,
10 × 21 cm) con una Epson L5590 por la bandeja posterior.

No usa Word. Cada dato se posiciona en milímetros absolutos sobre la hoja, de modo
que cae siempre en el mismo sitio sin importar la fuente, la versión del navegador
ni la PC. Las coordenadas salen de medir el formato escaneado a 300 dpi.

## Uso diario

1. Doble clic en `abrir.bat` (abre Chrome). O abrir `index.html` en Chrome.
2. Completar **una vez** los datos del girador y la cuenta. Quedan guardados en esta PC.
3. Llenar número, fechas, importe, beneficiario y girado. El importe en letras se arma solo;
   revísalo bajo el campo Importe antes de imprimir.
4. Botón **Imprimir**. Si falta un dato clave, avisa y pide confirmación.
5. En el diálogo de Chrome usa la tabla de abajo. **Escala 100 %** y **márgenes Ninguno**.
6. Botón **Letra nueva**: limpia lo variable, pone la fecha de hoy y sube el número (001 → 002).

El importe en letras se genera solo a partir del monto y la moneda.

## Configuración de impresión (una sola vez)

En el driver: Panel de control → Dispositivos e impresoras → L5590 → Preferencias →
Definido por el usuario → crear **"Letra 100x210"** con 100 × 210 mm.

En el diálogo de Chrome:

| Opción | Valor |
|---|---|
| Destino | EPSON L5590 |
| Tamaño de papel | Letra 100x210 |
| Escala | **100 %** — nunca "Ajustar al área de impresión" |
| Márgenes | Ninguno |
| Origen del papel | Alimentación posterior |
| Calidad | Estándar, papel normal |

**El recibo entra con el lado de "Cláusulas Especiales" al final.** La L5590 no imprime
los últimos ~14 mm del borde de salida, y ese extremo es el único que no lleva datos.

## Calibración (una sola vez)

1. Marcar **Mostrar guías**. Aparecen recuadros rojos punteados donde irá cada dato.
2. Imprimir sobre una **hoja blanca cortada a 10 × 21 cm**. No sobre una letra valorizada.
3. Superponer esa hoja a la letra amarilla a contraluz.
4. Si está corrido, ajustar **Offset largo** y **Offset ancho** los milímetros que falten
   y repetir. Son los dos únicos valores que se tocan.
5. Desmarcar las guías. La calibración queda guardada en el navegador.

Anotar los dos números finales en un papel pegado a la impresora: si alguien borra los
datos de navegación de Chrome, se pierden y hay que volver a escribirlos.

## Estructura

```
letra-de-cambio/
├── index.html              formulario + vista previa
├── css/
│   └── estilos.css         geometría de la hoja y calibración (--ox, --oy)
├── js/
│   ├── campos.js           mapa de coordenadas de cada casilla
│   ├── importe-letras.js   conversión de importe a letras
│   └── app.js              render, calibración, persistencia
└── docs/
    ├── medidas.md          todas las medidas del formato y cómo se obtuvieron
    ├── calibrador.html     grilla de 5 mm, por si hace falta remedir
    └── formato-escaneado.pdf
```

## Para mover un campo

Editar su línea en `js/campos.js`. `x` e `y` son milímetros desde la esquina superior
izquierda del **marco impreso**; `w` y `h` el tamaño de la casilla. Las medidas de
referencia están en `docs/medidas.md`.

## Limitaciones

- **La casilla TEL. mide 7,3 mm.** Un celular de 9 dígitos no entra legible. El campo
  reduce la fuente sola, pero conviene dejarlo vacío: no es requisito del art. 119 de la
  Ley de Títulos Valores.
- **Firmas y aceptación van a mano**, siempre.
- **La bandeja posterior de la L5590 toma una hoja a la vez.** Para varias letras el
  cuello de botella es la alimentación, no la plantilla.
- **La tinta de inyección sobre papel delgado tarda en secar.** Calidad Estándar y dejar
  secar unos segundos antes de apilar.

## Siguiente paso posible

Si el volumen crece, el mismo mapa de coordenadas sirve para generar letras en lote
desde un Excel o una base de datos, sin tipear una por una. La parte difícil —medir el
formato— ya está hecha y vive en `js/campos.js`.
