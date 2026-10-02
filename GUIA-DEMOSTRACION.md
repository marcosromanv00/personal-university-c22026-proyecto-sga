# Guía Rápida y Guión de Demostración (15 Minutos)

## Universidad Nacional (UNA) - Escuela de Informática

### Sistemas Distribuidos | Grupo #6: Tema 3 (Sistema de Gestión Académica)

**Integrantes y Roles de Exposición:**

- **Emanuel Soto Cordero** — Especialista en **Solicitudes REST** (Semana 2)
- **Anthony Cerdas Morales** — Especialista en **Procedimientos Remotos RPC** (Semana 3)
- **Marcos Román Valverde** — Especialista en **Servicios Web GraphQL** (Semana 4)

---

## 🚀 Preparación Técnica Previa (30 segundos)

1. En la máquina que proyectará, abrir terminal y ejecutar:
   ```bash
   node app.js
   ```
2. Verificar que aparezca en consola:
   ```text
   =================================================================
      SISTEMA DE GESTIÓN ACADÉMICA DISTRIBUIDO (SGA-UNA)
      Servidor principal activo en: http://localhost:3000
   =================================================================
   ```
3. Abrir navegador en: `http://localhost:3000/`.

---

## 🎤 Guión Quirúrgico por Expositor

---

### BLOQUE 1: Introducción y las 4 Interfaces (Abre Emanuel Soto)

- **Tiempo:** 0:00 a 2:30 | **Puntos:** 15 pts (15 pts por las 4 interfaces y navegación)
- **Intervención:**
  > _"Buenos días profesor y compañeros. Somos el Grupo número 6, integrado por Anthony Cerdas, Marcos Román y mi persona Emanuel Soto. Nos correspondió el Tema 3: Sistema de Gestión Académica. Desarrollamos una aplicación web empresarial desacoplada en Node.js 24 y Express, siguiendo exclusivamente la teoría y laboratorios de clase sin librerías externas superfluas."_
- **Acción en Pantalla:**
  1. Mostrar **Dashboard** (`http://localhost:3000/`): Señalar las tarjetas con métricas en tiempo real (estudiantes, cursos, matrículas, promedio global) y la tabla de arquitectura.
  2. Hacer click en **"Consulta REST"** (`/consulta`).
  3. Hacer click en **"Gestión Académica"** (`/gestion`).
  4. Hacer click en **"RPC y Servicios Web"** (`/reportes`).
- **Cierre del Bloque:**
  > _"Como se aprecia, contamos con las 4 interfaces funcionales requeridas, navegables con un header único y sin elementos decorativos invasivos."_

---

### BLOQUE 2: Demostración de REST (Emanuel Soto)

- **Tiempo:** 2:30 a 6:30 | **Puntos:** 25 pts (Solicitud REST funcionando)
- **Intervención:**
  > _"A mí me corresponde exponer la implementación de las Solicitudes REST, basadas en los contenidos de la Semana 2. En nuestro sistema, la entidad académica se gestiona mediante endpoints orientados a recursos bajo los verbos canónicos GET, POST, PUT y DELETE, con persistencia en archivos planos mediante el módulo nativo fs."_
- **Acción en Pantalla:**
  1. Ir a la pestaña **"Gestión Académica"** (`/gestion`).
  2. En la sección 1 (_Registrar Nuevo Estudiante_), registrar a un estudiante:
     - Identificación: `1-0999-0888`
     - Nombre: `Carlos Mora Alvarado`
     - Carrera: `Ingeniería en Sistemas de Información`
     - Procedencia: `Costa Rica (CR)`
  3. Click en el botón **"Registrar Estudiante (POST /api/academico/estudiantes)"**.
  4. **Mostrar el Inspector de Traza inferior:**
     - Señalar al profesor que se envió una petición HTTP `POST` con cuerpo JSON y el servidor devolvió un código `201 Created` con el recurso creado.
  5. En la sección 2 (_Matricular Estudiante_), seleccionar a `Carlos Mora Alvarado` en el curso `EIF-401 Sistemas Distribuidos` y hacer click en **"Formalizar Matrícula"** (nuevo `POST 201`).
  6. En la sección 3 (_Actualizar Calificaciones_), seleccionar la matrícula recién creada y colocar notas:
     - Parcial 1: `90`, Parcial 2: `85`, Proyecto: `95`, Laboratorios: `90`.
     - Click en **"Guardar Calificaciones"**: mostrar que dispara un `PUT /api/academico/calificaciones` devolviendo HTTP `200 OK` con la ponderación calculada.
  7. Ir a la pestaña **"Consulta REST"** (`/consulta`) y escribir `Carlos Mora`: mostrar que aparece con sus notas y promedio registrado.
- **Cierre de Emanuel:**
  > _"Esto demuestra el ciclo completo CRUD sobre el servicio REST cumpliendo al 100% la Semana 2. Le doy la palabra a mi compañero Anthony para la demostración de RPC."_

---

### BLOQUE 3: Demostración de RPC (Anthony Cerdas)

- **Tiempo:** 6:30 a 10:00 | **Puntos:** 25 pts (Operación RPC funcionando)
- **Intervención:**
  > _"Siguiendo con la materia de la Semana 3, a mí me corresponde exponer las Solicitudes RPC. Como explicó el profesor en las notas de clase y pizarras, RPC se diferencia de REST porque no está orientado a consultar o mutar un recurso URL estático, sino a ejecutar una función o procedimiento remoto en el servidor pasando parámetros específicos. Nosotros implementamos el estándar formal JSON-RPC 2.0 sobre HTTP POST."_
- **Acción en Pantalla:**
  1. Ir a la pestaña **"RPC y Servicios Web"** (`/reportes`).
  2. En el recuadro A (_Cálculo de Promedio Ponderado por Créditos_), seleccionar al estudiante `Marcos Román Valverde (3-0529-0253)`.
  3. Click en **"Ejecutar RPC (JSON-RPC 2.0)"**.
  4. **Mostrar el resultado en pantalla y en el Inspector de Protocolos:**
     - En pantalla se despliega el resultado procesado: Promedio ponderado (`94`), Condición académica (`Excelencia Académica - Honor`), créditos cursados (`8`) y créditos aprobados (`8`).
     - **Enfatizar la estructura técnica en el inspector inferior:**
       - Mostrar el sobre JSON-RPC enviado:
         ```json
         {
           "jsonrpc": "2.0",
           "method": "calcularPromedioPonderado",
           "params": { "estudianteId": "3-0529-0253" },
           "id": 101
         }
         ```
       - Mostrar la respuesta estructurada devuelta por el servidor con `result` y el mismo `id`.
  5. En el recuadro B (_Analítica Estadística de Cohorte_), seleccionar el curso `EIF-401` y click en **"Calcular Estadísticas Remotas"**. Mostrar que el método remoto `analizarRendimientoGrupo` calcula media aritmética, desviación estándar poblacional y porcentaje de aprobación.
- **Cierre de Anthony:**
  > _"El procedimiento no se calcula en el cliente; el servidor Express procesa la fórmula estadística y responde bajo el protocolo estándar. Ahora mi compañero Marcos expondrá la parte de Servicios Web."_

---

### BLOQUE 4: Demostración de Servicios Web (Marcos Román)

- **Tiempo:** 10:00 a 13:00 | **Puntos:** 20 pts (Servicio Web funcionando)
- **Intervención:**
  > _"Para la Semana 4 se nos requirió implementar al menos un Servicio Web que aporte una funcionalidad real a la aplicación. Siguiendo el Laboratorio 2 donde trabajamos con servicios GraphQL externos, conectamos nuestro sistema al Servicio Web GraphQL de Países y Monedas (countries.trevorblades.com) para resolver un problema crítico: la convalidación y liquidación arancelaria de estudiantes de intercambio internacional."_
- **Acción en Pantalla:**
  1. En la misma interfaz de **"RPC y Servicios Web"** (`/reportes`), bajar a la Sección 2.
  2. En el recuadro A (_Convalidación de Estudiante Foráneo_), seleccionar a la estudiante de intercambio `Elena Becker (P-9021-4410) - Alemania`.
  3. Click en **"Homologar con Servicio Web"**.
  4. **Explicar la respuesta técnica en pantalla:**
     - El servicio web externo devolvió el país oficial `Germany 🇩🇪`, la capital `Berlin` y la moneda oficial `EUR`.
     - Nuestro servidor calculó automáticamente el arancel diferenciado de matrícula internacional (`$138 USD`, aplicando el recargo del 15%).
  5. En el recuadro B (_Catálogo GraphQL_), escribir un código como `CR`, `ES` o `US` y click en **"Consultar Servicio Web"**.
  6. **Señalar el Inspector:** Mostrar la consulta GraphQL ejecutada:
     ```graphql
     query {
       countries {
         code
         name
         emoji
         capital
         currency
       }
     }
     ```
  7. **Resaltar la Resiliencia / Tolerancia a Fallos:**
     > _"Un detalle arquitectónico fundamental que implementamos es que si la red del laboratorio llegara a fallar, el servicio cuenta con un mecanismo de timeout y respaldo en caché local para que la aplicación nunca se caiga ni genere errores, cumpliendo estrictamente la regla de continuidad de servicio."_

---

### BLOQUE 5: Cierre, Comunicación Frontend-Servicios y Preguntas (13:00 a 15:00)

- **Puntos:** 15 pts (Comunicación frontend y servicios + funcionalidad completa).
- **Intervención del grupo:**
  > _"Como se evidenció a lo largo de las 4 interfaces, cada botón realiza una comunicación asíncrona real con el backend mediante fetch(), manejando tiempos de respuesta menores a 50 milisegundos y reflejando las actualizaciones de estado en la UI sin necesidad de recargar la página. Quedamos atentos a cualquier pregunta o verificación de código que desee realizar."_

---

## 💡 Banco de Respuestas Rápidas para Preguntas del Profesor

- **¿Por qué RPC va por HTTP POST y no por GET?**  
  _Anthony:_ _"Porque RPC está diseñado para invocar un procedimiento o método específico con paso de parámetros complejos (`params`). No representa un recurso estático identificable por URL, y la especificación oficial JSON-RPC 2.0 define el transporte típicamente sobre POST."_

- **¿Dónde se persisten los datos del sistema?**  
  _Emanuel:_ _"En la carpeta `data/` del servidor en formato JSON/texto plano (`estudiantes.json`, `cursos.json`, `matriculas.json`), utilizando el módulo nativo `fs` de Node.js mediante lecturas y escrituras síncronas/asíncronas tal como vimos en la práctica."_

- **¿Qué ventaja técnica ofreció GraphQL frente a una API REST tradicional en el Servicio Web?**  
  _Marcos:_ _"La eliminación del over-fetching. En lugar de recibir un objeto masivo con docenas de campos innecesarios sobre cada país, con la consulta declarativa de GraphQL solicitamos puntualmente `code`, `name`, `capital` y `currency`, optimizando el consumo de red y el procesamiento en el servidor."_
