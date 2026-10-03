# Documento de Explicación Técnica y Rúbrica Oficial (Grupo-6-SD-Explicacion)
## Universidad Nacional (UNA) - Escuela de Informática
### Curso: Sistemas Distribuidos (EIF-401) | II Ciclo 2026 | Grupo #6: Tema 3

---

## Portada

- **Institución:** Universidad Nacional (UNA) - Escuela de Informática
- **Facultad / Escuela:** Facultad de Ciencias Exactas y Naturales / Escuela de Informática
- **Curso:** EIF-401 Sistemas Distribuidos
- **Proyecto:** Proyecto Grupal: Desarrollo de Aplicación Web con REST, RPC y Servicios Web
- **Tema Seleccionado:** Tema 3: Sistema de gestión académica
- **Grupo:** Grupo #6
- **Integrantes:**
  1. **Marcos Román Valverde** — Cédula: `3-0529-0253` — marcos.roman.valverde@est.una.ac.cr
  2. **Emanuel Soto Cordero** — Cédula: `1-1823-0492` — emanuel.soto.cordero@est.una.ac.cr
  3. **Anthony Cerdas Morales** — Cédula: `4-0231-0814` — anthony.cerdas.morales@est.una.ac.cr
- **Profesor:** M.Sc. Luis Raúl
- **Fecha:** 02 de Octubre del 2026

---

## 1. Introducción

La administración y seguimiento académico en una institución de educación superior contemporánea involucra la gestión coordinada de múltiples procesos transaccionales: control de expedientes de matrícula, asignación y verificación de cupos en asignaturas curriculares, cálculo algorítmico de ponderaciones de calificaciones por créditos, y la vinculación con entidades externas para la homologación de convenios internacionales de movilidad estudiantil.

El problema central que pretende resolver esta aplicación es la integración unificada, eficiente y desacoplada de estos procesos en una única solución de software distribuida. Frecuentemente, en las organizaciones educativas estas operaciones se efectúan de manera aislada o mediante herramientas dispersas, lo cual suscita inconsistencias de información, cuellos de botella en el procesamiento centralizado de notas y retrasos al validar procedencias y aranceles de estudiantes foráneos.

La solución desarrollada articula en una sola plataforma web los tres mecanismos fundamentales de comunicación entre aplicaciones y servicios estudiados en el curso: **solicitudes REST** para la manipulación orientada a recursos y persistencia, **solicitudes RPC** para la ejecución remota de cómputos algorítmicos en el servidor, y **Servicios Web** para la interoperabilidad con servicios externos.

---

## 2. Descripción del Sistema

### 2.1 Objetivo
Desarrollar e implementar una aplicación web distribuida, funcional e integrada para la administración integral de estudiantes, cursos, matrículas y calificaciones de la Escuela de Informática de la Universidad Nacional, demostrando de manera práctica la integración de solicitudes REST, procedimientos remotos RPC y consumo de un Servicio Web externo.

### 2.2 Usuarios del Sistema
- **Administrador Académico / Cátedra:** Supervisa el dashboard general, analiza las métricas de cohorte en tiempo real, monitorea la ocupación de cursos y administra los expedientes del estudiantado.
- **Docentes y Evaluadores:** Consultan listas de clase, asientan y modifican evaluaciones parciales (Parcial 1, Parcial 2, Proyecto, Laboratorios) y verifican el estado de aprobación de los alumnos.
- **Coordinador de Movilidad e Intercambio Internacional:** Valida información geográfica de estudiantes foráneos mediante el servicio web externo y liquida aranceles semestrales diferenciados.

### 2.3 Funcionalidades Principales
1. **Dashboard de Monitoreo Académico:** Indicadores en tiempo real (KPIs): población estudiantil activa, catálogo de cursos, matrículas formalizadas y porcentaje global de aprobación.
2. **Consulta Reactiva de Expedientes:** Visualización tabular de estudiantes y asignaturas con filtros instantáneos por cédula, nombre o código de materia.
3. **Gestión Integral de Expedientes (CRUD):** Alta de estudiantes, formalización de matrículas con control de cupos, asentamiento ponderado de notas y eliminación en cascada.
4. **Cálculo Remoto de Promedio Ponderado por Créditos (RPC):** Invocación en servidor que pondera las notas según el peso curricular de cada materia y determina la condición de honor.
5. **Análisis Estadístico de Rendimiento de Grupo (RPC):** Cálculo algorítmico centralizado de media aritmética, varianza, desviación estándar poblacional y tasa de aprobación.
6. **Homologación de Estudiantes Extranjeros y Aranceles (Servicio Web):** Consulta de países, capitales y divisas mediante GraphQL con mecanismo de contingencia y tolerancia a fallos.

### 2.4 Tema Seleccionado
Se seleccionó el **Tema 3: Sistema de gestión académica**, correspondiente al catálogo de temas propuestos en la rúbrica oficial (Sección 3 del documento de especificación).

---

## 3. Interfaces

Conforme al punto 4 de la especificación técnica, la aplicación cuenta con 4 interfaces web funcionales, integradas, navegables entre sí mediante una barra de navegación superior estandarizada y con diseño institucional uniforme:

### 3.1 Interfaz 1: Inicio / Dashboard (Ruta: `/`)
- **Función de la Interfaz:** Funciona como la página principal de la aplicación. Ofrece al usuario un centro de monitoreo ejecutivo con el nombre del sistema, el menú de navegación completo, el resumen de información mediante cuatro tarjetas métricas (KPIs), la tabla de arquitectura con el mapeo de tecnologías, el estado de los micro-servicios y el registro de estudiantes recientes.
- **Evidencia Gráfica:** `docs/screenshots/interfaz-1-dashboard.png`

### 3.2 Interfaz 2: Consulta de Información (Ruta: `/consulta`)
- **Función de la Interfaz:** Permite consultar la información almacenada en el sistema mediante solicitudes REST (HTTP GET). Provee alternancia entre la vista de Estudiantes y la vista de Cursos, un buscador reactivo instantáneo por cédula o nombre, un modal interactivo con el desglose de notas parciales y un inspector técnico que expone los datos de la petición REST efectuada.
- **Evidencia Gráfica:** `docs/screenshots/interfaz-2-consulta.png`

### 3.3 Interfaz 3: Registro / Gestión de Información (Ruta: `/gestion`)
- **Función de la Interfaz:** Permite crear, modificar y gestionar la información académica del sistema a través de las operaciones mutativas del protocolo REST. Contiene cuatro formularios específicos para registrar estudiantes (POST), formalizar matrículas (POST), asentar y actualizar calificaciones (PUT) y tramitar la baja de estudiantes (DELETE), con retroalimentación visual inmediata mediante mensajes de éxito y error.
- **Evidencia Gráfica:** `docs/screenshots/interfaz-3-gestion.png`

### 3.4 Interfaz 4: Operaciones Especiales / Reportes (Ruta: `/reportes`)
- **Función de la Interfaz:** Implementa las operaciones avanzadas del sistema mediante RPC y Servicios Web. Permite ejecutar remotamente el cálculo de promedio ponderado y la estadística de rendimiento de grupo (RPC), así como homologar estudiantes extranjeros consultando datos geográficos y calculando aranceles en tiempo real (Servicio Web GraphQL), mostrando en vivo las tramas técnicas enviadas y recibidas.
- **Evidencia Gráfica:** `docs/screenshots/interfaz-4-reportes-rpc-ws.png`

---

## 4. REST

### 4.1 Endpoints Utilizados y Métodos HTTP Implementados

| Método | Endpoint | Propósito / Descripción | Código HTTP |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/academico/dashboard` | Retorna los 4 KPIs globales y estado del sistema | `200 OK` |
| `GET` | `/api/academico/estudiantes` | Retorna lista de estudiantes con notas y cursos | `200 OK` |
| `GET` | `/api/academico/estudiantes/:id` | Consulta expediente individual por cédula | `200 / 404` |
| `GET` | `/api/academico/cursos` | Retorna catálogo de asignaturas y cupos | `200 OK` |
| `POST` | `/api/academico/estudiantes` | Crea un nuevo estudiante en archivo plano | `201 / 400` |
| `POST` | `/api/academico/matriculas` | Formaliza matrícula verificando cupo activo | `201 / 400` |
| `PUT` | `/api/academico/calificaciones` | Actualiza notas y calcula promedio ponderado | `200 / 400` |
| `DELETE` | `/api/academico/estudiantes/:id` | Elimina estudiante y matrículas en cascada | `200 / 404` |

### 4.2 Información Enviada e Información Recibida
- **Consultas GET:** Parámetros en URL (ej. `:id` con la cédula). Servidor devuelve 200 OK y el arreglo/objeto JSON respectivo.
- **Alta de Estudiantes (POST):** Cliente envía JSON con `id`, `nombre`, `carrera`, `pais`, `codigoPais`. Servidor valida, persiste y retorna 201 Created con el expediente generado.
- **Matrícula (POST):** Cliente envía `estudianteId` y `cursoId`. Servidor valida cupo disponible, persiste y retorna 201 Created.
- **Calificaciones (PUT):** Cliente envía notas parciales (Parcial 1: 25%, Parcial 2: 25%, Proyecto: 30%, Labs: 20%). Servidor actualiza y responde 200 OK.
- **Eliminación (DELETE):** Parámetro en URL. Servidor remueve expediente y sus vínculos en cascada, retornando confirmación 200 OK.

### 4.3 Ejemplos de Solicitudes y Respuestas
- **Solicitud de Alta (POST /api/academico/estudiantes):**
  ```http
  POST /api/academico/estudiantes HTTP/1.1
  Host: localhost:3000
  Content-Type: application/json

  {
    "id": "1-0999-0888",
    "nombre": "Carlos Mora Alvarado",
    "carrera": "Informática",
    "pais": "Costa Rica",
    "codigoPais": "CR"
  }
  ```
- **Respuesta del Servidor (HTTP 201 Created):**
  ```json
  {
    "metodo": "POST",
    "status": 201,
    "mensaje": "Estudiante registrado con éxito.",
    "datos": {
      "id": "1-0999-0888",
      "nombre": "Carlos Mora Alvarado",
      "email": "109990888@est.una.ac.cr",
      "estado": "Activo"
    }
  }
  ```

---

## 5. RPC

### 5.1 Funcionalidad Implementada
Se implementó un despachador formal bajo el estándar **JSON-RPC 2.0** en la ruta `/api/rpc`, el cual atiende dos procedimientos algorítmicos integrados en la lógica académica del sistema:
- `calcularPromedioPonderado`: Realiza el cómputo formal del promedio ponderado multiplicando la calificación final por los créditos curriculares de cada materia matriculada, dividiendo entre los créditos totales y clasificando la condición de honor.
- `analizarRendimientoGrupo`: Procesa el análisis estadístico de la cohorte matriculada (global o por asignatura), calculando media aritmética, varianza, desviación estándar poblacional y tasa de aprobación.

### 5.2 Cómo se Realiza la Llamada RPC
El cliente despacha una solicitud HTTP `POST` hacia el endpoint único `/api/rpc` con un sobre JSON conteniendo los cuatro campos requeridos por el estándar: `jsonrpc: "2.0"`, `method` con el nombre de la función, `params` con los argumentos requeridos, y un `id` numérico correlativo.

### 5.3 Parámetros Enviados
```json
{
  "jsonrpc": "2.0",
  "method": "calcularPromedioPonderado",
  "params": {
    "estudianteId": "3-0529-0253"
  },
  "id": 101
}
```

### 5.4 Resultado Obtenido
```json
{
  "jsonrpc": "2.0",
  "result": {
    "estudianteId": "3-0529-0253",
    "nombre": "Marcos Román Valverde",
    "creditosTotales": 8,
    "creditosAprobados": 8,
    "promedioPonderado": 94.0,
    "condicionAcademica": "Excelencia (Honor)",
    "desgloseCursos": [
      { "cursoId": "EIF-401", "cred": 4, "nota": 96.2 },
      { "cursoId": "EIF-402", "cred": 4, "nota": 91.8 }
    ]
  },
  "id": 101
}
```

---

## 6. Servicios Web

### 6.1 Servicio Implementado / Utilizado
Se integró el **Servicio Web público de Países y Divisas basado en GraphQL** (`https://countries.trevorblades.com/`), aplicando rigurosamente los conceptos y el código estudiados durante la Semana 4 y el Laboratorio 2 del curso.

### 6.2 Función del Servicio
El servicio web resuelve una necesidad operativa concreta del Sistema de Gestión Académica: la homologación de estudiantes foráneos de intercambio internacional (por ejemplo, el caso de prueba de la estudiante *Elena Becker* procedente de Alemania). A partir del código de país, el servicio obtiene en tiempo real los datos geográficos oficiales (nombre internacional, bandera emoji, ciudad capital y moneda oficial), permitiendo liquidar automáticamente los aranceles de matrícula diferenciados en dólares ($USD) conforme a la reglamentación institucional.

### 6.3 Datos Enviados y Recibidos
- **Datos Enviados (Consulta GraphQL):**
  ```graphql
  query ObtenerPaisesConvenio {
    countries {
      code
      name
      emoji
      capital
      currency
    }
  }
  ```
- **Datos Recibidos (Estructura JSON):**
  ```json
  {
    "data": {
      "countries": [
        { "code": "DE", "name": "Germany", "emoji": "🇩🇪", "capital": "Berlin", "currency": "EUR" },
        { "code": "CR", "name": "Costa Rica", "emoji": "🇨🇷", "capital": "San José", "currency": "CRC" }
      ]
    }
  }
  ```

### 6.4 Forma en que se Integra con la Aplicación
La integración se ejecuta mediante el módulo backend `services/webService.js` en Node.js. Cuando el usuario interactúa con la Interfaz 4 o cuando se consulta la ficha de un estudiante internacional, la aplicación consulta el endpoint GraphQL y expone los datos procesados en la vista.

Para asegurar el funcionamiento continuo en el aula y proteger la aplicación ante contingencias de conectividad (cumpliendo con la regla 5a de la rúbrica), el servicio incorpora **tolerancia a fallos** mediante un timeout de 5000 ms y **caché estructurada en disco**. Si la red externa no responde, conmuta en 0 ms al respaldo local sin generar errores ni interrumpir la navegación del usuario.

---

## 7. Conclusiones

### 7.1 Conclusión: Marcos Román Valverde (Cédula: 3-0529-0253)
> *"El desarrollo del proyecto permitió comprender de manera tangible la distinción operativa entre arquitecturas orientadas a recursos (REST) y modelos orientados a ejecución de funciones remotas (RPC). La implementación de JSON-RPC 2.0 sobre Node.js demostró que desacoplar la lógica de cómputo algorítmico pesado del navegador alivia el procesamiento del cliente y unifica reglas de negocio críticas, como la ponderación de notas por créditos. Asimismo, la estructuración de persistencia en archivos planos mediante Node.js nativo reforzó la importancia del control de concurrencia y la tolerancia a fallos en sistemas distribuidos reales."*

### 7.2 Conclusión: Emanuel Soto Cordero (Cédula: 1-1823-0492)
> *"La integración del servicio web GraphQL evidenció las ventajas del paradigma de consulta declarativa frente al over-fetching común de ciertas APIs REST tradicionales. Poder solicitar únicamente los campos code, name, capital y currency reduce drásticamente el consumo de ancho de banda y la sobrecarga de serialización entre servidores distribuidos. El proyecto nos capacitó para coordinar servicios heterogéneos y diseñar arquitecturas web resistentes a fallos de conectividad mediante patrones de respaldo local."*

### 7.3 Conclusión: Anthony Cerdas Morales (Cédula: 4-0231-0814)
> *"El valor fundamental de este proyecto radicó en consolidar en una única aplicación los conceptos vistos en las Semanas 2, 3 y 4, logrando que el frontend no actúe de manera aislada sino como un consumidor transparente de múltiples protocolos. Entender cómo Express puede servir simultáneamente como API Gateway para llamadas REST, despachador de procedimientos RPC y cliente consumidor de servicios web externos nos brindó una perspectiva práctica de cómo se estructuran las plataformas empresariales en la industria tecnológica."*
