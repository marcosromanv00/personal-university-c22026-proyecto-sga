# Documento de Explicación Técnica y Rúbrica Oficial (Grupo-6-SD-Explicacion)
## Universidad Nacional (UNA) - Escuela de Informática
### Curso: Sistemas Distribuidos (C2-2026) | Grupo #6: Tema 3

---

## 1. Portada Institucional

- **Institución:** Universidad Nacional de Costa Rica (UNA)
- **Facultad / Escuela:** Facultad de Ciencias Exactas y Naturales / Escuela de Informática
- **Curso:** EIF-401 Sistemas Distribuidos (II Ciclo 2026)
- **Proyecto:** Proyecto Grupal - Desarrollo de Aplicación Web con REST, RPC y Servicios Web
- **Tema Asignado:** Tema 3: Sistema de Gestión Académica
- **Grupo:** Grupo #6
- **Integrantes:**
  1. **Marcos Román Valverde** — Cédula: `3-0529-0253` — marcos.roman.valverde@est.una.ac.cr
  2. **Emanuel Soto Cordero** — Cédula: `1-1823-0492` — emanuel.soto.cordero@est.una.ac.cr
  3. **Anthony Cerdas Morales** — Cédula: `4-0231-0814` — anthony.cerdas.morales@est.una.ac.cr
- **Profesor:** M.Sc. Luis Raúl
- **Fecha:** 02 de Octubre del 2026

---

## 2. Introducción
La gestión académica universitaria contemporánea requiere procesar volúmenes crecientes de información distribuida: expedientes estudiantiles, ofertas de asignaturas, registros de matrículas, cálculo algorítmico de ponderaciones curriculares y validación de convenios de movilidad estudiantil con instituciones extranjeras. 

El presente proyecto aborda dicha problemática implementando una arquitectura de software desacoplada de tres niveles (*Three-Tier Architecture*) construida sobre Node.js y Express, fundamentada exclusivamente en los conceptos y técnicas analizadas durante las Semanas 2, 3 y 4 del curso. Se articulan armónicamente tres paradigmas de comunicación: REST para el manejo de recursos y operaciones CRUD, JSON-RPC 2.0 para la invocación remota de procedimientos de analítica académica en el servidor, y Servicios Web basados en GraphQL para la homologación internacional de estudiantes.

---

## 3. Descripción del Sistema

### 3.1 Objetivo General
Desarrollar e implementar una aplicación web funcional y distribuida para la administración integral de estudiantes, cursos, matrículas y calificaciones en la Universidad Nacional, integrando de manera demostrable solicitudes REST, procedimientos remotos RPC y servicios web externos.

### 3.2 Usuarios del Sistema
- **Administrador Académico / Cátedra:** Supervisa el dashboard general, métricas de cohorte, matrícula y cursos.
- **Docentes y Asistentes:** Gestionan el registro y actualización de calificaciones parciales y proyectos.
- **Coordinador de Intercambio Internacional:** Convalida nacionalidades y liquida aranceles diferenciados mediante el servicio web.

### 3.3 Funcionalidades Principales
1. **Monitoreo de Indicadores Clave (Dashboard):** Consulta en tiempo real de población activa, cursos, matrículas y promedio global.
2. **Consulta Dinámica de Expedientes:** Visualización tabular de estudiantes y asignaturas mediante solicitudes REST `GET`.
3. **Ciclo Completo de Gestión (CRUD):** Registro de estudiantes (`POST`), formalización de matrícula (`POST`), asentamiento de notas (`PUT`) y desmatriculación/baja (`DELETE`).
4. **Cálculo de Promedio Ponderado por Procedimiento Remoto:** Ejecución en servidor bajo el protocolo estándar **JSON-RPC 2.0**.
5. **Analítica Estadística de Cohorte:** Procedimiento RPC remoto para media, desviación estándar y porcentaje de aprobación.
6. **Homologación de Estudiantes Foráneos:** Consumo de Servicio Web GraphQL de países y divisas con tolerancia a fallos.

---

## 4. Detalle y Evidencia de las 4 Interfaces Web

### Interfaz 1: Inicio / Dashboard (`/` o `/interfaz1`)
- **Propósito:** Actúa como centro de comando y monitoreo de la aplicación.
- **Componentes:**
  - 4 tarjetas métricas (KPIs): Total de estudiantes (6 activos), Total de cursos (5 asignaturas), Total de matrículas registradas y Promedio general de la cohorte.
  - Tabla de Arquitectura Distribuida con mapa de protocolos (REST en Semana 2, RPC en Semana 3, Servicios Web en Semana 4).
  - Muestra tabular de los últimos estudiantes registrados en el sistema.
  - Inspector de red en vivo que registra las llamadas HTTP `GET /api/academico/dashboard`.

### Interfaz 2: Consulta de Información (`/consulta` o `/interfaz2`)
- **Propósito:** Demuestra la consulta y filtrado de recursos mediante el verbo HTTP `GET`.
- **Componentes:**
  - Alternador de vistas para alternar entre catálogo de Estudiantes y catálogo de Cursos.
  - Buscador reactivo en memoria que filtra por identificación, nombre completo o código.
  - Botón de "Ver Detalle" que despliega el expediente completo con notas de Parcial 1 (25%), Parcial 2 (25%), Proyecto (30%) y Laboratorios (20%).
  - Inspector de solicitudes REST que visualiza el JSON retornado y la latencia en milisegundos.

### Interfaz 3: Registro y Gestión de Información (`/gestion` o `/interfaz3`)
- **Propósito:** Demuestra las operaciones mutativas del protocolo REST (`POST`, `PUT`, `DELETE`).
- **Componentes:**
  - Formulario 1: Alta de nuevo estudiante (`POST /api/academico/estudiantes` -> HTTP 201).
  - Formulario 2: Matrícula de estudiante en curso (`POST /api/academico/matriculas` -> HTTP 201).
  - Formulario 3: Modificación y cálculo de calificaciones (`PUT /api/academico/calificaciones` -> HTTP 200).
  - Formulario 4: Baja definitiva de estudiante (`DELETE /api/academico/estudiantes/:id` -> HTTP 200).
  - Retroalimentación mediante notificaciones visuales y sincronización inmediata con persistencia local.

### Interfaz 4: Operaciones Especiales y Reportes (`/reportes` o `/interfaz4`)
- **Propósito:** Implementa el procesamiento algorítmico remoto (RPC) y la integración externa (Servicios Web).
- **Componentes:**
  - Módulo RPC A: Cálculo de promedio ponderado y condición de honor (`calcularPromedioPonderado`).
  - Módulo RPC B: Análisis estadístico de la cohorte (`analizarRendimientoGrupo`).
  - Módulo Servicio Web A: Homologación internacional y aranceles mediante GraphQL.
  - Módulo Servicio Web B: Explorador de países con convenio universitario.
  - Consola de traza técnica con el sobre de mensaje crudo JSON-RPC y GraphQL.

---

## 5. Implementación de Solicitudes REST (Semana 2)

### 5.1 Endpoints Implementados
| Método HTTP | Endpoint | Descripción | Código de Estado |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/academico/dashboard` | Resumen de indicadores del sistema | `200 OK` |
| `GET` | `/api/academico/estudiantes` | Obtiene lista enriquecida de estudiantes | `200 OK` |
| `GET` | `/api/academico/estudiantes/:id` | Obtiene expediente por cédula | `200 OK` / `404 Not Found` |
| `POST` | `/api/academico/estudiantes` | Registra un nuevo estudiante | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/academico/estudiantes/:id` | Modifica datos del estudiante | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/academico/estudiantes/:id` | Elimina estudiante y sus matrículas | `200 OK` / `404 Not Found` |
| `GET` | `/api/academico/cursos` | Lista cursos y cupos disponibles | `200 OK` |
| `POST` | `/api/academico/matriculas` | Asigna estudiante a una asignatura | `201 Created` |
| `PUT` | `/api/academico/calificaciones` | Actualiza notas y calcula promedio | `200 OK` |

### 5.2 Ejemplo de Solicitud y Respuesta REST
- **Solicitud de Creación (POST):**
  ```http
  POST /api/academico/estudiantes HTTP/1.1
  Host: localhost:3000
  Content-Type: application/json

  {
    "id": "1-0999-0888",
    "nombre": "Carlos Mora Alvarado",
    "carrera": "Ingeniería en Sistemas de Información",
    "pais": "Costa Rica",
    "codigoPais": "CR"
  }
  ```
- **Respuesta del Servidor (HTTP 201):**
  ```json
  {
    "metodo": "POST",
    "recurso": "/api/academico/estudiantes",
    "status": 201,
    "mensaje": "Estudiante registrado satisfactoriamente en el SGA.",
    "datos": {
      "id": "1-0999-0888",
      "nombre": "Carlos Mora Alvarado",
      "carrera": "Ingeniería en Sistemas de Información",
      "nivel": "I Nivel",
      "email": "109990888@est.una.ac.cr",
      "pais": "Costa Rica",
      "codigoPais": "CR",
      "estado": "Activo"
    }
  }
  ```

---

## 6. Implementación de Procedimientos Remotos RPC (Semana 3)

### 6.1 Fundamentación Técnica
A diferencia de REST donde el cliente navega recursos mediante URIs y verbos HTTP, en RPC el cliente solicita explícitamente al servidor la ejecución de un procedimiento o función remota con paso de parámetros tipados (`params`), encapsulado bajo el estándar **JSON-RPC 2.0**.

### 6.2 Procedimientos Expuestos en `/api/rpc`
1. **`calcularPromedioPonderado`**: Recibe `{ estudianteId: string }`. Multiplica la calificación de cada curso por sus créditos correspondientes, divide entre la sumatoria de créditos cursados y clasifica la condición académica del estudiante (Excelencia con Honor, Sobresaliente, Regular o Alerta).
2. **`analizarRendimientoGrupo`**: Recibe `{ cursoId?: string }`. Itera la cohorte matriculada y calcula media aritmética, desviación estándar poblacional, calificaciones extremas y porcentaje de aprobación.

### 6.3 Ejemplo de Mensaje JSON-RPC 2.0
- **Solicitud Enviada (HTTP POST /api/rpc):**
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
- **Respuesta Recibida (Resultado Procesado):**
  ```json
  {
    "jsonrpc": "2.0",
    "result": {
      "estudianteId": "3-0529-0253",
      "nombre": "Marcos Román Valverde",
      "carrera": "Ingeniería en Sistemas de Información",
      "totalCursos": 2,
      "creditosTotales": 8,
      "creditosAprobados": 8,
      "promedioPonderado": 94,
      "condicionAcademica": "Excelencia Académica (Honor)",
      "desgloseCursos": [
        {
          "cursoId": "EIF-401",
          "cursoNombre": "Sistemas Distribuidos",
          "creditos": 4,
          "notaFinal": 96.2,
          "ponderacion": 384.8,
          "estado": "Aprobado"
        },
        {
          "cursoId": "EIF-402",
          "cursoNombre": "Arquitectura de Software Empresarial",
          "creditos": 4,
          "notaFinal": 91.8,
          "ponderacion": 367.2,
          "estado": "Aprobado"
        }
      ]
    },
    "id": 101
  }
  ```

---

## 7. Implementación de Servicios Web (Semana 4)

### 7.1 Servicio Web Utilizado
Se integró el **Servicio Web GraphQL de Países y Monedas** (`https://countries.trevorblades.com/`), exactamente el mismo servicio estudiado y puesto en práctica en el Laboratorio 2 del curso.

### 7.2 Propósito y Utilidad en el SGA
Permite homologar automáticamente expedientes de estudiantes foráneos que cursan materias en la Escuela de Informática bajo convenios de movilidad académica internacional (por ejemplo, el caso de prueba de *Elena Becker* proveniente de Alemania). El servicio web suministra el código oficial del país, nombre, emoji de bandera, capital y moneda local, permitiendo calcular el arancel arancelario semestral en dólares ($USD) con recargo foráneo legal.

### 7.3 Modo de Comunicación
El servidor Express (`services/webService.js`) realiza una llamada HTTP `POST` hacia la URL del servicio GraphQL enviando en el cuerpo del mensaje la consulta declarativa:
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

### 7.4 Mecanismo de Tolerancia a Fallos (Offline Resilience)
Para cumplir rigurosamente con la Rúbrica Oficial (Regla 5a: *"Si la aplicación no funciona, genera errores... se asignará nota cero"*), se implementó un mecanismo de *timeout* (5 segundos) con **caché local estructurado de contingencia**. En caso de que la red del aula o la conexión a internet presente intermitencia durante la defensa presencial, el servicio conmuta automáticamente a la caché local sin arrojar excepciones ni congelar la interfaz gráfica.

---

## 8. Conclusiones Individuales de los Integrantes

### 8.1 Conclusión de Marcos Román Valverde (Cédula: 3-0529-0253)
> *"El desarrollo del proyecto permitió comprender de manera tangible la distinción operativa entre arquitecturas orientadas a recursos (REST) y modelos orientados a ejecución de funciones remotas (RPC). La implementación de JSON-RPC 2.0 sobre Node.js demostró que desacoplar la lógica de cómputo algorítmico pesado del navegador alivia el procesamiento del cliente y unifica reglas de negocio críticas, como la ponderación de notas por créditos. Asimismo, la estructuración de persistencia en archivos planos mediante Node.js nativo reforzó la importancia del control de concurrencia y la tolerancia a fallos en sistemas distribuidos reales."*

### 8.2 Conclusión de Emanuel Soto Cordero (Cédula: 1-1823-0492)
> *"La integración del servicio web GraphQL evidenció las ventajas del paradigma de consulta declarativa frente al over-fetching común de ciertas APIs REST tradicionales. Poder solicitar únicamente los campos `code`, `name`, `capital` y `currency` reduce drásticamente el consumo de ancho de banda y la sobrecarga de serialización entre servidores distribuidos. El proyecto nos capacitó para coordinar servicios heterogéneos y diseñar arquitecturas web resistentes a fallos de conectividad mediante patrones de respaldo local."*

### 8.3 Conclusión de Anthony Cerdas Morales (Cédula: 4-0231-0814)
> *"El valor fundamental de este proyecto radicó en consolidar en una única aplicación los conceptos vistos en las Semanas 2, 3 y 4, logrando que el frontend no actúe de manera aislada sino como un consumidor transparente de múltiples protocolos. Entender cómo Express puede servir simultáneamente como API Gateway para llamadas REST, despachador de procedimientos RPC y cliente consumidor de servicios web externos nos brindó una perspectiva práctica de cómo se estructuran las plataformas empresariales en la industria tecnológica."*
