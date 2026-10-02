# Banco de Preguntas y Respuestas Técnicas para la Defensa
## Universidad Nacional (UNA) - Escuela de Informática
### Curso: Sistemas Distribuidos (C2-2026) | Grupo #6: Tema 3 (SGA)
**Integrantes:** Emanuel Soto Cordero, Anthony Cerdas Morales, Marcos Román Valverde

---

Este documento contiene las respuestas directas, ordenadas y fundamentadas en la materia de clase y pizarras del profesor **M.Sc. Luis Raúl**, estructuradas para responder con rapidez y precisión técnica durante la presentación de 15 minutos.

---

## 📌 Preguntas Formuladas por el Profesor en Evaluaciones

---

### Pregunta 1: «¿Por qué no usan controladores?»

- **Quién responde:** Cualquiera del equipo (Emanuel o Marcos).
- **Respuesta Directa (10 segundos):**
  > *"Porque en estas semanas no se vieron en clase y porque el enfoque del curso no es un MVC monolítico tradicional, sino una arquitectura de sistemas distribuidos en capas."*
- **Fundamentación Técnica de Pizarra (Semana 3 y 4):**
  > *"En la materia de clase vimos que en sistemas distribuidos desacoplamos la aplicación bajo una **arquitectura de 3 niveles (Three-Tier)** basada en **dominios distribuidos**:*
  > 1. *Capa de Presentación (`views/` y `public/`).*
  > 2. *Capa de Rutas y Orquestación (`routes/`): Cada archivo atiende un dominio distribuido (URLs de REST, RPC o GraphQL) y no está acoplado a una vista específica.*
  > 3. *Capa de Servicios e Integración (`services/`): Resuelve la lógica de negocio y las llamadas externas.*
  > 4. *Capa de Persistencia (`data/`): Almacenamiento plano sin modelos pesados ni DAOs.*
  > 
  > *Por lo tanto, las rutas funcionan como orquestadores de protocolos y los servicios como unidades de integración, tal como se estructuraron los laboratorios."*

---

### Pregunta 2: «Expliquen cómo desarrollaron la comunicación del frontend con los servicios»

- **Quién responde:** Emanuel Soto (o Marcos Román).
- **Respuesta Directa (15 segundos):**
  > *"La comunicación es 100% asíncrona mediante la API nativa `fetch()` de JavaScript con `async/await`, sin recargar la página. El frontend envía y recibe paquetes en formato JSON consumiendo los endpoints de Express según cada protocolo: verbos semánticos para REST, sobre JSON-RPC 2.0 por POST para RPC, y llamadas intermediadas por Express como Gateway hacia la API GraphQL externa."*
- **Desglose Técnico en 3 Puntos (si pide detallar):**
  1. **Transporte Asíncrono en Cliente:** Usamos `fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })`. Todas las peticiones capturan la respuesta con `await respuesta.json()`, manejan errores con `try/catch` y actualizan el DOM en tiempo real en menos de 50 ms.
  2. **Diferenciación de Protocolos:**
     - **En REST (Semana 2):** Consultamos colecciones con `GET`, enviamos datos de formulario con `POST` serializado en el body para dar de alta recursos (retornando `201 Created`), actualizamos actas con `PUT` y desmatriculamos con `DELETE`.
     - **En RPC (Semana 3):** Apuntamos a un único endpoint `/api/rpc` por HTTP `POST` enviando el sobre estándar `{ jsonrpc: "2.0", method, params, id }`, recibiendo el objeto procesado `{ jsonrpc: "2.0", result, id }`.
     - **En Servicios Web (Semana 4):** El frontend consume `/api/web-services/homologacion/:id`, donde nuestro servidor Express actúa como **API Gateway** hacia el servidor externo GraphQL (`countries.trevorblades.com`), enviando la consulta declarativa `query { countries { ... } }`, calculando los aranceles y entregando los datos consolidados.
  3. **Trazabilidad y Auditoría:** Cada solicitud calcula su latencia mediante `performance.now()` y alimenta en vivo la consola inferior del sistema, mostrando el método, endpoint, código de respuesta y el payload JSON transferido.

---

## 📌 Preguntas Estratégicas Adicionales de la Cátedra

---

### Pregunta 3: «¿Por qué en RPC usaron HTTP POST y no GET?»

- **Quién responde:** Anthony Cerdas.
- **Respuesta:**
  > *"Porque RPC está orientado a la ejecución de procedimientos o funciones remotas con paso de parámetros complejos (`params`), donde no se consulta un recurso estático indexable por URL. Además, la especificación oficial del estándar **JSON-RPC 2.0** define que el transporte sobre HTTP debe realizarse típicamente mediante **POST** con cuerpo de mensaje JSON."*

---

### Pregunta 4: «¿Dónde y cómo persisten los datos? ¿Qué pasa si reinicio el servidor?»

- **Quién responde:** Emanuel Soto.
- **Respuesta:**
  > *"Los datos persisten en archivos planos dentro del directorio `data/` del servidor (`estudiantes.json`, `cursos.json`, `matriculas.json`), tal como se autoriza en la nota técnica del proyecto. Se manipulan mediante el módulo nativo `fs` de Node.js (`readFileSync` y `writeFileSync`). Si el servidor se apaga o reinicia, toda la información de estudiantes, cursos y actas de notas permanece íntegra en el disco local."*

---

### Pregunta 5: «¿Qué ventaja técnica ofreció usar GraphQL frente a REST en el Servicio Web?»

- **Quién responde:** Marcos Román.
- **Respuesta:**
  > *"La eliminación del **over-fetching** (sobreconsumo o desperdicio de datos). Con una API REST tradicional de países habríamos recibido un payload masivo con decenas de propiedades innecesarias (fronteras, coordenadas, husos horarios, subdivisiones). Con la consulta declarativa de GraphQL solicitamos de forma quirúrgica únicamente los 5 campos requeridos (`code`, `name`, `emoji`, `capital` y `currency`), optimizando el ancho de banda y la memoria del servidor."*

---

### Pregunta 6: «¿Qué pasa si la máquina se queda sin internet durante la prueba o el servicio externo se cae?»

- **Quién responde:** Marcos Román.
- **Respuesta:**
  > *"El sistema continúa operando sin errores. En `services/webService.js` implementamos un patrón de **tolerancia a fallos y resiliencia**: la llamada tiene un `AbortSignal.timeout(5000)` respaldado por una **caché local estructurada de contingencia**. Si la red externa no responde o falla la conexión, el servidor captura la excepción automáticamente y sirve los datos locales de contingencia sin arrojar un error HTTP 500 ni interrumpir la interfaz."*

---

### Pregunta 7: «¿Por qué no utilizaron React, Angular, Tailwind o una base de datos como MongoDB?»

- **Quién responde:** Cualquiera del equipo.
- **Respuesta:**
  > *"Por apego estricto a las directrices de cátedra y las instrucciones del proyecto (Reglas 3 y 4 del PDF), donde se estipula fundamentar el código exclusivamente en las tecnologías y pasos vistos en clase. Desarrollar la solución sobre Node.js nativo, Express y Vanilla JS nos permitió demostrar el dominio directo de los protocolos distribuidos (HTTP, JSON-RPC y GraphQL) sin capas de abstracción de terceros que enmascaren la comunicación de red."*

---

### Pregunta 8: «¿Cómo se calculan las calificaciones y qué regla de negocio sigue la ponderación?»

- **Quién responde:** Anthony Cerdas / Emanuel Soto.
- **Respuesta:**
  > *"Nos basamos en el Reglamento de Régimen Académico Estudiantil de la UNA:*
  > 1. *En la evaluación de cada curso se contemplan 4 rubros: **Parcial 1 (25%), Parcial 2 (25%), Proyecto de Sistemas Distribuidos (30%) y Laboratorios (20%)**.*
  > 2. *La condición final clasifica en: **Aprobado** ($\ge 70.0$), **Aplazado** con derecho a prueba extraordinaria ($60.0 - 69.9$) y **Reprobado** ($< 60.0$).*
  > 3. *En el procedimiento RPC calculamos la ponderación curricular oficial: $\frac{\sum (\text{Nota Final} \times \text{Créditos})}{\sum \text{Créditos Totales}}$, asignando la condición de **Excelencia Académica / Matrícula de Honor** a promedios iguales o superiores a 90.0."*

---

### Pregunta 9: «¿Cómo manejan los errores de comunicación y datos?»

- **Quién responde:** Anthony Cerdas.
- **Respuesta:**
  > *"Manejamos validación en dos niveles distintos según lo visto en clase:*
  > - *A nivel de **protocolo**, validando códigos de estado HTTP semánticos (`200 OK`, `201 Created`, `400 Bad Request` por campos faltantes y `404 Not Found`).*
  > - *A nivel de **formato JSON-RPC**, devolviendo el objeto canónico de error `{ jsonrpc: "2.0", error: { code: -32602, message: "..." }, id }` cuando un parámetro es inválido, sin que el servidor sufra caídas (*crashes*)."*

---

## 📋 Resumen Táctico de Asignación por Miembro

| Integrante | Especialidad Asignada | Preguntas Clave a Responder |
| :--- | :--- | :--- |
| **Emanuel Soto** | Solicitudes REST (Semana 2) | Controladores, Arquitectura Three-Tier, CRUD, Persistencia `fs`, Códigos HTTP. |
| **Anthony Cerdas** | Procedimientos Remotos RPC (Semana 3) | ¿Por qué POST en RPC?, JSON-RPC 2.0, Formato de sobres, Ponderación de notas. |
| **Marcos Román** | Servicios Web GraphQL (Semana 4) | Ventajas de GraphQL vs REST, Over-fetching, Resiliencia offline, API Gateway. |
