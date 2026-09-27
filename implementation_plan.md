# Plan Quirúrgico de Implementación (implementation_plan.md)
## Proyecto: Sistema de Gestión Académica Distribuido (SGA-UNA)
### Grupo 6 (Emanuel Soto, Anthony Cerdas, Marcos Román)

---

## Fases de Implementación

### Fase 1: Estructura de Proyecto y Archivos de Integrantes
- Inicializar `package.json` con dependencias mínimas requeridas (`express`).
- Crear archivo `Grupo-6.txt` según la rúbrica oficial (página 11 del PDF) con integrantes y cédulas.
- Configurar estructura de carpetas: `data/`, `rest/`, `rpc/`, `web-services/`, `services/`, `public/css/`, `public/js/`, `views/`.

### Fase 2: Capa de Persistencia y Datos Iniciales
- Crear semillas en `data/estudiantes.json`, `data/cursos.json`, `data/matriculas.json`.
- Implementar `services/academicoService.js` con métodos para leer y persistir en disco.

### Fase 3: Servicios REST (Semana 2)
- Implementar `rest/academicoRoutes.js` con soporte para GET, POST, PUT, DELETE.
- Montar las rutas en `app.js` bajo `/api/academico`.

### Fase 4: Servicios RPC (Semana 3)
- Implementar `services/rpcService.js` con procedimientos remotos `calcularPromedioPonderado` y `analizarRendimientoGrupo`.
- Implementar `rpc/rpcRoutes.js` con manejo del protocolo JSON-RPC 2.0 en `POST /api/rpc`.

### Fase 5: Servicios Web (Semana 4)
- Implementar `services/webService.js` con consulta GraphQL a Countries API (`https://countries.trevorblades.com/`) y fallback local con caché en caso de fallo de red.
- Implementar `web-services/webServiceRoutes.js` bajo `/api/web-services`.

### Fase 6: Frontend y las 4 Interfaces Web (Anti-Slop UX)
- Crear hoja de estilos unificada `public/css/estilos.css` con estética sobria y editorial de alta gama.
- Implementar `views/index.html` (Interfaz 1: Dashboard y Monitoreo).
- Implementar `views/consulta.html` (Interfaz 2: Consulta REST GET con Inspector JSON en vivo).
- Implementar `views/gestion.html` (Interfaz 3: Registro y Gestión REST POST/PUT/DELETE).
- Implementar `views/reportes.html` (Interfaz 4: Operaciones Especiales RPC y Servicios Web).
- Implementar scripts interactivos modulares en `public/js/`.

### Fase 7: Servidor Express y Orquestación
- Configurar `app.js` para servir las 4 interfaces, montar las APIs y manejar archivos estáticos.
- Probar que el servidor arranque limpiamente en el puerto 3000.

### Fase 8: Documentación y Material de Defensa
- Crear `README.md` exhaustivo con comandos de ejecución.
- Crear `GUIA-DEMOSTRACION.md` con el guion paso a paso de 15 minutos cronometrados para el grupo.
- Generar `docs/Grupo-6-SD-Explicacion.md` con la justificación técnica requerida por el profesor en la pág 9 del PDF.
- Validar funcionamiento en vivo ejecutando el servidor y probando las 4 interfaces y endpoints.
