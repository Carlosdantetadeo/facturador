# Medidas del formato preimpreso

Todas las cifras salen del escaneo `formato-escaneado.pdf`, rasterizado a 300 dpi
y corregido de inclinación (0,7°). Error estimado: ±0,3 mm.

El origen (0,0) es la **esquina superior izquierda del marco impreso**, no del papel.

- Eje **x**: a lo largo del recibo. 0 = lado "Cláusulas Especiales", 202,2 = lado "Moneda e Importe".
- Eje **y**: a lo ancho del recibo. 0 = lado de la cabecera NUMERO, 90,1 = lado "No escribir debajo".

## Dimensiones generales

| Elemento | Medida |
|---|---|
| Papel | 100 × 210 mm |
| Marco impreso | 202,2 × 90,1 mm |
| Margen estimado papel→marco | 3,9 mm (largo) / 4,95 mm (ancho) |

El margen es **estimado**: el escaneo da dónde está la tinta, no dónde está el borde del
papel. Se corrige con `--ox` y `--oy`.

## Líneas horizontales detectadas (y, en mm)

| y | Qué es |
|---|---|
| 0,1 | Borde superior del marco |
| 3,3 | Borde superior de la tabla de cabecera |
| 6,3 | Línea bajo DIA/MES/AÑO (solo columnas Fecha y Vencimiento) |
| 13,9 | Borde inferior de la tabla de cabecera |
| 17,3 | Línea punteada "...a la Orden de" |
| 22,7 | Línea punteada que termina en "La cantidad de" |
| 23,7 | Borde superior de la caja del importe en letras |
| 32,8 | Borde inferior de la caja del importe en letras |
| 38,0 | Borde superior de la caja inferior |
| 41,7 | Línea bajo "Importe a debitar en la siguiente cuenta..." |
| 42,3 | Punteada: Girado |
| 46,7 | Línea bajo BANCO / OFICINA / NUMERO DE CUENTA / D.C |
| 47,3 | Punteada: continuación del Girado |
| 52,2 | Punteada: Domicilio |
| 56,2 | Borde inferior de las celdas del banco |
| 57,1 | Punteada: D.O.I. / TEL. del girado |
| 62,5 | "Aval Permanente:" (solo etiqueta) |
| 68,5 | Punteada: Domicilio del aval |
| 73,3 | Punteada: D.O.I. / TEL. del aval |
| 78,2 | Punteada: Firma (va a mano) |
| 82,5 | Punteada: Nombre del Representante |
| 85,1 | Borde inferior del marco |
| 87,0 | Línea "No escribir ni firmar debajo de esta línea" |

## Líneas verticales detectadas (x, en mm)

### Tabla de cabecera
| x | Qué es |
|---|---|
| 18,0 | Separador de la columna de cláusulas |
| 28,1 | Caja "Aceptante" |
| 34,3 | Inicio de la columna NUMERO |
| 61,0 | NUMERO \| REF. DEL GIRADOR |
| 87,7 | REF. DEL GIRADOR \| LUGAR DE GIRO |
| 114,5 | LUGAR DE GIRO \| FECHA DE GIRO |
| 141,2 | FECHA DE GIRO \| VENCIMIENTO |
| 167,8 | VENCIMIENTO \| MONEDA E IMPORTE |
| 193,6 | Borde derecho del marco |

### Tabla del banco
| x | Qué es |
|---|---|
| 111,4 | Divisor entre la caja del girado y la del banco |
| 132,7 | BANCO \| OFICINA |
| 152,7 | OFICINA \| NUMERO DE CUENTA |
| 184,5 | NUMERO DE CUENTA \| D.C |
| 193,6 | Borde derecho |

## Limitaciones conocidas

1. **Casilla TEL.**: el espacio útil va de x 103,5 a 110,8 — apenas 7,3 mm. Un número de
   9 dígitos no entra a tamaño legible. El campo reduce la fuente automáticamente, pero
   lo razonable es dejarlo vacío.
2. **Zona muerta de impresión**: la Epson L5590 no imprime los últimos ~14 mm del borde
   de salida. El recibo debe entrar con el lado de "Cláusulas Especiales" al final, que
   es el que no lleva datos.
3. **El margen papel→marco es estimado.** Requiere una prueba de calibración.
