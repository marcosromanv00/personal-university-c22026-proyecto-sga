// ============================================================================
// UNIVERSIDAD NACIONAL (UNA) - ESCUELA DE INFORMÁTICA
// SISTEMAS DISTRIBUIDOS (C2-2026) - PROYECTO DE CURSO
// GRUPO #6: Emanuel Soto Cordero, Anthony Cerdas Morales, Marcos Román Valverde
// TEMA 3: Sistema de Gestión Académica (SGA-UNA)
// ============================================================================

const express = require("express");
const path = require("path");

const academicoRoutes = require("./rest/academicoRoutes");
const rpcRoutes = require("./rpc/rpcRoutes");
const webServiceRoutes = require("./web-services/webServiceRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================================
// MIDDLEWARES BASE (Semanas 1 y 2)
// ============================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (CSS, JS cliente, assets)
app.use(express.static(path.join(__dirname, "public")));

// ============================================================================
// RUTAS DE LAS 4 INTERFACES WEB REQUERIDAS
// ============================================================================

// Interfaz 1: Inicio / Dashboard
app.get(["/", "/interfaz1", "/dashboard"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Interfaz 2: Consulta de Información (REST GET)
app.get(["/consulta", "/interfaz2"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "consulta.html"));
});

// Interfaz 3: Registro / Gestión de Información (REST POST/PUT/DELETE)
app.get(["/gestion", "/interfaz3"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "gestion.html"));
});

// Interfaz 4: Operaciones Especiales / Reportes (RPC + Servicios Web)
app.get(["/reportes", "/interfaz4"], (req, res) => {
    res.sendFile(path.join(__dirname, "views", "reportes.html"));
});

// ============================================================================
// CAPA DE SERVICIOS Y COMUNICACIÓN DISTRIBUIDA
// ============================================================================

// 1. Solicitudes REST (Semana 2)
app.use("/api/academico", academicoRoutes);

// 2. Solicitudes RPC (Semana 3) - compatible con /api/rpc y /rpc
app.use("/api/rpc", rpcRoutes);
app.use("/rpc", rpcRoutes);

// 3. Servicios Web (Semana 4)
app.use("/api/web-services", webServiceRoutes);

// ============================================================================
// MANEJO DE ERRORES 404 Y SERVIDOR
// ============================================================================
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada",
        mensaje: `El recurso '${req.originalUrl}' no existe en el servidor SGA.`,
        rutasDisponibles: ["/", "/consulta", "/gestion", "/reportes", "/api/academico", "/api/rpc", "/api/web-services"]
    });
});

const server = app.listen(PORT, () => {
    console.log("=================================================================");
    console.log("   SISTEMA DE GESTIÓN ACADÉMICA DISTRIBUIDO (SGA-UNA)");
    console.log("   Universidad Nacional - Escuela de Informática (C2-2026)");
    console.log("   Grupo #6: Emanuel Soto | Anthony Cerdas | Marcos Román");
    console.log("=================================================================");
    console.log(`-> Servidor principal activo en: http://localhost:${PORT}`);
    console.log("-> Interfaz 1 (Dashboard):      http://localhost:3000/");
    console.log("-> Interfaz 2 (Consulta REST):  http://localhost:3000/consulta");
    console.log("-> Interfaz 3 (Gestión REST):   http://localhost:3000/gestion");
    console.log("-> Interfaz 4 (RPC & Web Serv): http://localhost:3000/reportes");
    console.log("=================================================================");
    console.log("   REST API:     /api/academico");
    console.log("   RPC API:      /api/rpc (Protocolo JSON-RPC 2.0)");
    console.log("   Web Services: /api/web-services (GraphQL Integración)");
    console.log("=================================================================\n");
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`\n[AVISO] El puerto ${PORT} ya está en uso por otro proceso de Node.`);
        console.error(`Puedes liberarlo rápidamente ejecutando en PowerShell:`);
        console.error(`Get-Process node | Stop-Process -Force\n`);
    } else {
        console.error("Error en servidor:", err);
    }
});

