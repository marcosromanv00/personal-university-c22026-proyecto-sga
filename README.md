# Sistema de Gestión Académica Distribuido (SGA-UNA)
## Universidad Nacional (UNA) - Escuela de Informática
### Curso: Sistemas Distribuidos (C2-2026) | Grupo #6: Tema 3

**Integrantes:**
- **Marcos Román Valverde** (Cédula: 3-0529-0253)
- **Emanuel Soto Cordero** (Cédula: 1-1823-0492)
- **Anthony Cerdas Morales** (Cédula: 4-0231-0814)

**Profesor:** M.Sc. Luis Raúl  
**Fecha de Entrega:** 02 de Octubre de 2026  

---

## 1. Descripción del Proyecto
El **Sistema de Gestión Académica Distribuido (SGA-UNA)** es una solución integral desarrollada para administrar estudiantes, cursos, expedientes y calificaciones en la Escuela de Informática. La plataforma integra en una arquitectura unificada los tres mecanismos de comunicación distribuida evaluados en la cátedra:

1. **Semana 2 — Solicitudes REST (CRUD Completo):** Endpoints con verbos `GET`, `POST`, `PUT`, `DELETE` y persistencia en archivos planos (`data/*.json`).
2. **Semana 3 — Solicitudes RPC (JSON-RPC 2.0):** Algoritmos remotos en servidor para el cálculo de promedio ponderado semestral por créditos y analítica estadística de la cohorte estudiantil.
3. **Semana 4 — Servicios Web (GraphQL):** Integración con el servicio web internacional de países y monedas (`https://countries.trevorblades.com/`) para la convalidación y liquidación arancelaria de estudiantes de movilidad académica foránea, con mecanismo de contingencia (*offline fallback*).

---

## 2. Estructura del Proyecto
El código fuente sigue la arquitectura modular requerida en la rúbrica oficial (Sección 8 del PDF):

```text
proyecto/
├── app.js                          # Servidor Express principal y orquestador distribuido
├── package.json                    # Dependencias y scripts del proyecto (Express)
├── Grupo-6.txt                     # Archivo oficial con datos de los integrantes
├── spec.md                         # Especificación técnica formal (SDD)
├── implementation_plan.md          # Plan quirúrgico de implementación
├── GUIA-DEMOSTRACION.md            # Guión cronometrado de 15 minutos para la defensa
├── docs/
│   └── Grupo-6-SD-Explicacion.md   # Documentación técnica completa para entrega PDF
├── data/                           # Persistencia en archivos planos (fs)
│   ├── estudiantes.json            # Base de datos plana de estudiantes
│   ├── cursos.json                 # Catálogo de cursos ofertados
│   └── matriculas.json             # Historial de matrículas y calificaciones
├── rest/                           # Módulo REST (Semana 2)
│   └── academicoRoutes.js          # Rutas GET, POST, PUT, DELETE
├── rpc/                            # Módulo RPC (Semana 3)
│   └── rpcRoutes.js                # Manejador del protocolo JSON-RPC 2.0
├── web-services/                   # Módulo Servicios Web (Semana 4)
│   └── webServiceRoutes.js         # Rutas de homologación y GraphQL
├── services/                       # Capa de Lógica de Negocio y Conectores
│   ├── academicoService.js         # Operaciones CRUD y KPIs
│   ├── rpcService.js               # Algoritmos remotos JSON-RPC
│   └── webService.js               # Conector GraphQL y fallback resiliente
└── public/                         # Archivos estáticos y Vistas
    ├── css/
    │   └── estilos.css             # Estándar Dark Tech Craft y Anti-Slop UX
    ├── js/
    │   └── main.js                 # Inspector de red y utilidades de cliente
    └── views/
        ├── index.html              # Interfaz 1: Dashboard y Monitoreo General
        ├── consulta.html           # Interfaz 2: Consulta REST GET
        ├── gestion.html            # Interfaz 3: Registro y Gestión REST (POST/PUT/DELETE)
        └── reportes.html           # Interfaz 4: Operaciones Especiales RPC y Servicios Web
```

---

## 3. Requisitos del Sistema
- **Node.js:** Versión 20.x o superior (desarrollado y probado bajo **Node.js v24.11.1** con `fetch` nativo).
- **NPM:** Versión 10.x o superior.
- **Navegador Web:** Chrome, Firefox, Edge o Safari moderno.

---

## 4. Instrucciones de Instalación y Ejecución

### Paso 1: Clonar o Descargar el Proyecto
Navegar a la carpeta del proyecto en la terminal:
```bash
cd "proyecto"
```

### Paso 2: Instalar Dependencias
Instalar el framework Express:
```bash
npm install
```

### Paso 3: Iniciar el Servidor
Ejecutar la aplicación:
```bash
npm start
```
*(O de manera directa con `node app.js`)*

### Paso 4: Abrir las Interfaces en el Navegador
El servidor se iniciará en el puerto 3000. Acceder a las rutas oficiales:

| Interfaz | URL Local | Descripción Técnica |
| :--- | :--- | :--- |
| **Interfaz 1: Dashboard** | `http://localhost:3000/` | Panel central con KPIs en tiempo real y mapa de protocolos. |
| **Interfaz 2: Consulta REST** | `http://localhost:3000/consulta` | Búsqueda y visualización de expedientes vía solicitudes `GET`. |
| **Interfaz 3: Gestión REST** | `http://localhost:3000/gestion` | Alta de estudiantes (`POST`), matrícula (`POST`), notas (`PUT`) y bajas (`DELETE`). |
| **Interfaz 4: Operaciones Especiales** | `http://localhost:3000/reportes` | Procedimientos remotos **JSON-RPC 2.0** y consumo de **GraphQL**. |

---

## 5. Endpoints de la Capa Distribuida

### 5.1 Servicio REST (`/api/academico`)
- `GET /api/academico/dashboard`: Resumen de métricas y tasa de aprobación.
- `GET /api/academico/estudiantes`: Lista todos los estudiantes con su expediente completo.
- `GET /api/academico/estudiantes/:id`: Consulta un estudiante por su cédula.
- `POST /api/academico/estudiantes`: Registra un nuevo estudiante (HTTP 201).
- `PUT /api/academico/estudiantes/:id`: Actualiza datos de un estudiante.
- `DELETE /api/academico/estudiantes/:id`: Da de baja a un estudiante y sus matrículas.
- `GET /api/academico/cursos`: Consulta el catálogo de asignaturas y cupos disponibles.
- `POST /api/academico/matriculas`: Formaliza una matrícula estudiantil (HTTP 201).
- `PUT /api/academico/calificaciones`: Registra o actualiza notas parciales y calcula la nota final.

### 5.2 Servicio RPC (`/api/rpc` y `/rpc`)
Protocolo: **JSON-RPC 2.0** sobre transporte `HTTP POST`.
- `calcularPromedioPonderado`: Calcula la ponderación académica `(nota * créditos) / totalCréditos`, créditos aprobados y condición de honor.
  ```json
  {
    "jsonrpc": "2.0",
    "method": "calcularPromedioPonderado",
    "params": { "estudianteId": "3-0529-0253" },
    "id": 1
  }
  ```
- `analizarRendimientoGrupo`: Calcula media aritmética, desviación estándar, notas extremas y tasa de éxito de la cohorte.

### 5.3 Servicios Web (`/api/web-services`)
- `GET /api/web-services/paises`: Ejecuta consulta GraphQL contra `https://countries.trevorblades.com/`.
- `GET /api/web-services/homologacion/:estudianteId`: Convalida origen internacional y liquida arancel diferenciado.

---

## 6. Empaquetado para el Aula Virtual
Para generar el archivo ZIP de entrega exigido en la rúbrica oficial (nombre: `ProyectoP1-SD-Grupo-6.zip`):
```bash
# En Windows PowerShell (excluyendo node_modules para ligereza):
Compress-Archive -Path app.js, package.json, Grupo-6.txt, README.md, spec.md, implementation_plan.md, GUIA-DEMOSTRACION.md, docs, data, rest, rpc, web-services, services, public, views -DestinationPath ProyectoP1-SD-Grupo-6.zip
```
