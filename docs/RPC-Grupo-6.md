# Grupo 6 - Tema 3: Sistema de gestión académica

## Parte RPC de Anthony

La operación principal calcula el promedio ponderado de un estudiante a partir de las calificaciones y los créditos de sus cursos. La segunda operación resume el rendimiento de un curso o de todos los cursos. Ambas están integradas en la interfaz 4, `/reportes`, del mismo sistema que registra estudiantes, cursos, matrículas y calificaciones.

## Base del laboratorio

Referencia local: `C:\Users\Anthony Cerdas\Desktop\Universidad Nacional\2026\Sist. Distribuidos\SWRCP`.

| Laboratorio | Aplicación al tema académico |
| --- | --- |
| `app.js`: Express y archivos estáticos | El servidor existente sirve las cuatro interfaces y monta `/api/rpc`. |
| `routes/rpcRoutes.js`: rutas y respuesta JSON | `rpc/rpcRoutes.js` recibe la llamada y devuelve el resultado. |
| `services/rpcServices.js`: mensaje con `jsonrpc`, `method`, `params`, `id` | El navegador envía el mismo tipo de mensaje para invocar un cálculo académico. |
| `fetch`, POST, Content-Type y JSON.stringify | Las funciones `invocarRpcPromedio` e `invocarRpcEstadisticas` en `views/reportes.html` realizan la llamada. |
| Comprobación HTTP y del campo `error` | La interfaz muestra los errores y el inspector permite revisar solicitud y respuesta. |

El laboratorio consume procedimientos de proveedores externos. Aquí el navegador es el cliente y el servidor Express del sistema académico ejecuta los procedimientos. Esta es la adaptación al Tema 3; los métodos de criptomonedas del laboratorio no forman parte del sistema. Se mantiene JavaScript, Node.js, Express y `fetch`, sin agregar frameworks ni bibliotecas RPC.

## Flujo

1. El usuario selecciona un estudiante o curso en Reportes.
2. El navegador construye el mensaje JSON-RPC y lo envía por HTTP POST a `/api/rpc`.
3. La ruta llama a `procesarMensajeRPC`.
4. El servicio identifica el método, valida parámetros y consulta `academicoService`.
5. Se calculan los resultados con los datos de `data/estudiantes.json`, `data/cursos.json` y `data/matriculas.json`.
6. El servidor devuelve `{ jsonrpc, result, id }`, o `{ jsonrpc, error, id }`.
7. La interfaz presenta el resultado y el inspector muestra los mensajes.

## Operación principal: calcularPromedioPonderado

Solicitud:

```json
{
  "jsonrpc": "2.0",
  "method": "calcularPromedioPonderado",
  "params": { "estudianteId": "4-0231-0814" },
  "id": 101
}
```

Fórmula: `suma(notaFinal * creditos) / suma(creditos)`.

Con los datos iniciales de ese estudiante: `(95.3 * 4 + 88.8 * 3) / 7 = 92.51`.

El resultado incluye nombre, carrera, promedio, créditos totales, créditos aprobados, condición académica y desglose por curso. `totalCursos` cuenta los cursos evaluados. Se excluyen las matrículas con estado `En Curso`, porque su nota inicial cero no es una calificación definitiva. Una calificación definitiva de cero sí participa en el cálculo. Los créditos cero se conservan, sin sustituirlos por tres.

Las etiquetas de condición y los umbrales son reglas de demostración del proyecto, no una certificación de la normativa oficial de la universidad. Si no existen calificaciones, se muestra `Sin Calificaciones Registradas`.

## Operación adicional: analizarRendimientoGrupo

```json
{
  "jsonrpc": "2.0",
  "method": "analizarRendimientoGrupo",
  "params": { "cursoId": "EIF-401" },
  "id": 102
}
```

`cursoId` es opcional; `{}` o `{ "cursoId": null }` resume todos los cursos. Devuelve cantidad de evaluados, media, desviación estándar poblacional, notas mínima y máxima, aprobados, aplazados, reprobados y porcentaje de aprobación. Para EIF-401, con los datos iniciales: 6 evaluados, media 87.93 y aprobación 83.3%. Los resultados cambian al actualizar las calificaciones del sistema.

## Errores y alcance

- `-32600`: mensaje inválido.
- `-32601`: método desconocido.
- `-32602`: parámetros inválidos.
- `-32001`: estudiante o curso inexistente.
- `-32002`: nota o créditos inválidos en los datos.

El cliente debe revisar `error` aunque HTTP devuelva 200. La interfaz utiliza llamadas individuales con parámetros nombrados y un `id` que se conserva en la respuesta. Las notificaciones sin `id` reciben HTTP 204. No se implementan lotes de llamadas ni parámetros posicionales; este módulo cubre las operaciones utilizadas por la aplicación, no todos los casos del estándar JSON-RPC.

## Ejecutar y verificar

Desde la carpeta raíz del repositorio:

```powershell
npm install
npm start
```

Abrir `http://localhost:3000/reportes`. Para ejecutar la verificación del módulo:

```powershell
node tests/rpc.test.js
```

La prueba realiza llamadas HTTP a un servidor temporal y comprueba los cálculos, errores, curso sin evaluaciones y exclusión de matrículas pendientes. No modifica los datos persistidos.

## Guion breve para presentar

1. Abrir Reportes, seleccionar el estudiante `4-0231-0814` y ejecutar el promedio ponderado.
2. Mostrar 92.51 con los datos iniciales y explicar la fórmula con los créditos de ambos cursos.
3. Mostrar en el inspector `method`, `params`, `id` y `result`.
4. Seleccionar EIF-401 y ejecutar las estadísticas.
5. Explicar que las notas registradas en Gestión se usan en estos cálculos, demostrando la integración del sistema.
6. Mostrar `rpc/rpcRoutes.js` y `services/rpcService.js`: el navegador solicita el procedimiento y el cálculo se ejecuta en el servidor.

Explicación oral: «Mi parte implementa las llamadas RPC del sistema de gestión académica del Grupo 6. La página envía el nombre del procedimiento y la identificación del estudiante o curso en un mensaje JSON-RPC. El servidor consulta las matrículas y calificaciones, realiza el cálculo y devuelve el resultado con el mismo identificador de la solicitud».

## Evidencias para el documento del grupo

Capturar el promedio en Reportes, las estadísticas por curso y los mensajes de solicitud y respuesta en el inspector. Esta guía documenta la parte RPC; la entrega completa del grupo también requiere las otras interfaces y tecnologías del enunciado.
