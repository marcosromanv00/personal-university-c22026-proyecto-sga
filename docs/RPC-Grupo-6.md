# RPC - Grupo 6, Tema 3: Sistema de gestión académica

En Reportes se puede calcular el promedio ponderado de un estudiante y consultar las estadísticas de calificaciones por curso.

## Archivos

- `rpc/rpcRoutes.js`: recibe las solicitudes en `POST /api/rpc`.
- `services/rpcService.js`: valida los parámetros y realiza los cálculos.
- `views/reportes.html`: envía la solicitud con `fetch` y muestra el resultado.

La comunicación usa la estructura del laboratorio SWRCP: Node.js, Express, HTTP POST y mensajes con `jsonrpc`, `method`, `params` e `id`. En este proyecto el procedimiento se ejecuta en el servidor académico y consulta las matrículas, cursos y estudiantes mediante `academicoService`.

## Promedio ponderado

```json
{
  "jsonrpc": "2.0",
  "method": "calcularPromedioPonderado",
  "params": { "estudianteId": "4-0231-0814" },
  "id": 101
}
```

Se suman las notas multiplicadas por los créditos y se divide entre el total de créditos. Con los datos iniciales del estudiante: `(95.3 * 4 + 88.8 * 3) / 7 = 92.51`.

El resultado contiene el promedio, los créditos totales y aprobados, la condición académica y el desglose por curso. Las matrículas con estado `En Curso` se excluyen porque todavía no tienen una calificación definitiva. Una nota definitiva de cero sí se incluye. `totalCursos` cuenta los cursos evaluados.

Las condiciones académicas corresponden a los umbrales definidos en el proyecto. Si no hay calificaciones, se devuelve `Sin Calificaciones Registradas`.

## Estadísticas por curso

```json
{
  "jsonrpc": "2.0",
  "method": "analizarRendimientoGrupo",
  "params": { "cursoId": "EIF-401" },
  "id": 102
}
```

Devuelve cantidad de evaluados, media, desviación estándar poblacional, notas mínima y máxima, aprobados, aplazados, reprobados y porcentaje de aprobación. Con los datos iniciales de EIF-401: 6 evaluados, media 87.93 y aprobación 83.3%.

Para consultar todos los cursos se envía `params: {}`. Los resultados cambian al registrar calificaciones desde Gestión.

## Respuestas y errores

La respuesta conserva el `id` de la solicitud y devuelve `result` o `error`. Los errores RPC se revisan aunque la respuesta HTTP sea 200.

| Código | Error |
| --- | --- |
| -32600 | Solicitud inválida |
| -32601 | Método desconocido |
| -32602 | Parámetros inválidos |
| -32001 | Estudiante o curso inexistente |
| -32002 | Nota o créditos inválidos |

Se usan llamadas individuales con parámetros nombrados. No se admiten lotes ni parámetros posicionales. Las notificaciones sin `id` reciben HTTP 204.

## Ejecución

```powershell
npm install
npm start
```

Abrir `http://localhost:3000/reportes`. La prueba se ejecuta con `node tests/rpc.test.js` y no modifica los archivos de datos.

Para la demostración, calcular el promedio de un estudiante, consultar EIF-401 y mostrar la solicitud y respuesta en el inspector. Las capturas de estos resultados sirven como evidencia de la parte RPC.
