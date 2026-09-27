# Especificación Técnica (spec.md) - Sistema de Gestión Académica Distribuido
## Universidad Nacional (UNA) - Escuela de Informática
### Curso: Sistemas Distribuidos (C2-2026) | Grupo #6: Tema 3

**Integrantes:**
- Marcos Román Valverde (Cédula: 305290253)
- Emanuel Soto Cordero
- Anthony Cerdas Morales

---

## 1. Propósito y Alcance del Sistema
El **Sistema de Gestión Académica Distribuido (SGA-UNA)** es una aplicación web empresarial desacoplada desarrollada para administrar estudiantes, cursos, matrículas y calificaciones. El proyecto demuestra de manera práctica y verificable la integración de tres paradigmas fundamentales de comunicación distribuida estudiados en el curso:
1. **Semana 2 - Solicitudes REST:** Endpoints canónicos (`GET`, `POST`, `PUT`, `DELETE`) para el ciclo de vida de estudiantes, cursos y matrículas.
2. **Semana 3 - Solicitudes RPC:** Ejecución de procedimientos remotos bajo el estándar **JSON-RPC 2.0** (`calcularPromedioPonderado`, `analizarRendimientoGrupo`) para procesamiento algorítmico distribuido en el servidor.
3. **Semana 4 - Servicios Web:** Integración con servicio web externo (GraphQL Countries API) para homologación de nacionalidades y convenios de intercambio estudiantil internacional, con tolerancia a fallos y fallback local.

---

## 2. Requerimientos de Interfaces Web (4 Interfaces)

### Interfaz 1: Inicio / Dashboard
- Nombre formal del sistema y acreditación académica (UNA, Escuela de Informática).
- Menú de navegación accesible y consolidado (Header único sin barras accesorias).
- Resumen en tiempo real (KPIs): Total de estudiantes, cursos habilitados, matrículas activas y promedio general de la cohorte.
- Monitor de salud de servicios distribuidos: Estado de servicio REST (Puerto 3000), servicio RPC y Servicio Web GraphQL.
- Visión arquitectónica de 3 capas (Presentación, Lógica/Servicios Distribuidos, Persistencia de Datos).

### Interfaz 2: Consulta de Información (REST GET)
- Consulta en vivo mediante llamadas `GET /api/academico/estudiantes` y `GET /api/academico/cursos`.
- Búsqueda y filtrado en tiempo real por texto (cédula, nombre, carrera) y estado académico.
- Vista expandible del expediente del estudiante con cursos matriculados, notas parciales y promedio.
- **Inspector Técnico en Vivo:** Panel que muestra la URL del recurso REST consumido, encabezados HTTP, código de estado (`200 OK`) y el payload JSON retornado.

### Interfaz 3: Registro y Gestión de Información (REST POST / PUT / DELETE)
- Formulario de Registro de Estudiante (`POST /api/academico/estudiantes`).
- Formulario de Matrícula y Asignación de Calificaciones (`POST /api/academico/matriculas`, `PUT /api/academico/calificaciones`).
- Gestión y actualización de cursos (`POST /api/academico/cursos`).
- Eliminación controlada de registros (`DELETE /api/academico/estudiantes/:id`).
- Notificaciones de éxito y error con manejo semántico de códigos HTTP (`201 Created`, `400 Bad Request`, `404 Not Found`).

### Interfaz 4: Operaciones Especiales y Reportes (RPC + Servicios Web)
- **Módulo RPC (Semana 3):**
  - Invocación de método remoto `calcularPromedioPonderado` vía JSON-RPC 2.0.
  - Invocación de método remoto `analizarRendimientoGrupo` para estadísticas de la cohorte.
  - Consola interactiva con visualización del sobre JSON-RPC (`jsonrpc: "2.0"`, `method`, `params`, `id`) y el resultado procesado por el servidor.
- **Módulo Servicio Web (Semana 4):**
  - Consulta de Servicio Web GraphQL para convalidación de estudiantes foráneos y programas de movilidad académica.
  - Muestra la consulta GraphQL (`query { countries { ... } }`) y los datos recuperados de la nube.

---

## 3. Contratos de Datos y APIs

### 3.1 REST API (`/api/academico`)
- `GET /api/academico/estudiantes` -> Lista todos los estudiantes con su expediente.
- `GET /api/academico/estudiantes/:id` -> Obtiene un estudiante por su cédula/ID.
- `POST /api/academico/estudiantes` -> Registra un nuevo estudiante. Retorna `201`.
- `PUT /api/academico/estudiantes/:id` -> Actualiza los datos del estudiante.
- `DELETE /api/academico/estudiantes/:id` -> Elimina un estudiante y sus matrículas.
- `GET /api/academico/cursos` -> Lista todos los cursos y cupos.
- `POST /api/academico/cursos` -> Registra un nuevo curso.
- `POST /api/academico/matriculas` -> Asigna un estudiante a un curso.
- `PUT /api/academico/calificaciones` -> Registra o actualiza notas parciales.

### 3.2 RPC Protocol (`POST /api/rpc`)
- Estándar: JSON-RPC 2.0
- Métodos expuestos:
  1. `calcularPromedioPonderado`: Parámetros `{ estudianteId: string }`. Retorna promedio ponderado, créditos aprobados y condición académica (Aprobado con Distinción, Regular, Aplazado).
  2. `analizarRendimientoGrupo`: Parámetros `{ cursoId?: string }`. Retorna media, nota máxima, nota mínima, tasa de aprobación y distribución de calificaciones.

### 3.3 Servicio Web (`GET /api/web-services/paises` y `GET /api/web-services/tipo-cambio`)
- Integración externa GraphQL con `https://countries.trevorblades.com/` para validación de origen geográfico, moneda de arancel y código ISO.
- Fallback con caché local estructurado para garantizar funcionamiento offline durante la evaluación local.

---

## 4. Persistencia de Datos
- Almacenamiento en archivos planos en carpeta `data/`:
  - `data/estudiantes.json` (o `.txt` estructurado)
  - `data/cursos.json`
  - `data/matriculas.json`
- Mecanismo seguro de lectura y escritura síncrona/asíncrona mediante módulo nativo `fs` de Node.js, tal como se implementó en `s5SD-lab3`.

---

## 5. Criterios de Diseño y Anti-Slop UX
- **Zero-Badges:** Ningún elemento flotante decorativo ("chips", "pills") sobre títulos.
- **Tipografía Serena:** Tipografía sans-serif limpia (Inter/system), pesos 400 y 500/600, sin pesadez visual.
- **Header Único:** Sin top-bars accesorias.
- **Footer Tradicional 4 Columnas:** Identidad UNA, Módulos, Contexto de Cátedra, Contacto e Integrantes.
- **Micro-interacciones y Feedback:** Modales y tablas compactas con respuesta visual en menos de 100ms.
