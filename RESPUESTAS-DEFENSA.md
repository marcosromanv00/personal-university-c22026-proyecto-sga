# Respuestas Rápidas para la Defensa (Grupo #6)
## Universidad Nacional (UNA) | Sistemas Distribuidos
**Integrantes:** Emanuel Soto, Anthony Cerdas, Marcos Román

---

### 1. ¿Por qué no usan controladores?
> **Respuesta:**  
> «Porque en esas semanas no los vimos y seguimos la estructura de capas de los laboratorios: las **rutas** reciben las peticiones y los **servicios** procesan la lógica.»

---

### 2. ¿Cómo hicieron la comunicación del frontend con los servicios?
> **Respuesta:**  
> «Usamos `fetch()` en JavaScript para hacer peticiones asíncronas en formato JSON. Cada botón llama a una ruta de Express (REST, RPC o Servicio Web) y actualiza la pantalla en tiempo real sin recargar la página.»

---

### 3. ¿Por qué en RPC usaron POST y no GET?
> **Respuesta:**  
> «Porque en RPC le enviamos al servidor el nombre de la función que queremos ejecutar y sus parámetros en el cuerpo del mensaje, y el estándar JSON-RPC pide usar POST.»

---

### 4. ¿Dónde se guardan los datos?
> **Respuesta:**  
> «En archivos de texto plano dentro de la carpeta `data/`, usando el módulo `fs` de Node.js para leer y escribir en el disco, tal como se hizo en la práctica de clase.»

---

### 5. ¿Qué ventaja tuvo usar GraphQL en el servicio web?
> **Respuesta:**  
> «Que solo pedimos los 5 datos exactos que necesitamos del país (código, nombre, bandera, capital y moneda), sin traer información de más que gaste internet.»

---

### 6. ¿Qué pasa si no hay internet o se cae el servicio web externo?
> **Respuesta:**  
> «Le pusimos un tiempo de espera de 5 segundos y un respaldo de datos locales para que el sistema nunca se quede pegado ni tire error en la presentación.»

---

### 7. ¿Por qué no usaron React, Angular ni bases de datos pesadas?
> **Respuesta:**  
> «Porque las instrucciones del proyecto piden basarse estrictamente en las tecnologías vistas en clase: Node.js nativo, Express y persistencia plana.»

---

### 8. ¿Cómo se calculan las calificaciones?
> **Respuesta:**  
> «El servidor aplica la fórmula oficial de la UNA: Parcial 1 (25%), Parcial 2 (25%), Proyecto (30%) y Labs (20%). Con 70 o más aprueba, entre 60 y 69 aplaza, y menos de 60 reprueba.»

---

### 9. ¿Quién responde qué?
- **Emanuel:** Preguntas de **REST** (controladores, rutas, persistencia en archivos y comunicación frontend).
- **Anthony:** Preguntas de **RPC** (por qué POST, cálculo de promedios y estadísticas).
- **Marcos:** Preguntas de **Servicios Web** (GraphQL, qué pasa sin internet y países de intercambio).
