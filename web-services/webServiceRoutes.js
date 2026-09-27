const express = require("express");
const router = express.Router();
const webService = require("../services/webService");
const academicoService = require("../services/academicoService");

// ============================================================================
// RUTAS DE SERVICIOS WEB (Semana 4)
// ============================================================================

// GET - Consultar catálogo de países para movilidad académica
router.get("/paises", async (req, res) => {
    try {
        const codigo = req.query.codigo;
        const resultado = await webService.consultarConveniosInternacionales(codigo);
        res.json({
            metodo: "GET",
            recurso: "/api/web-services/paises",
            status: 200,
            resultado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Homologación de estudiante foráneo mediante Servicio Web
router.get("/homologacion/:estudianteId", async (req, res) => {
    try {
        const estudiante = academicoService.obtenerEstudiantePorId(req.params.estudianteId);
        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado en el sistema." });
        }
        const homologacion = await webService.homologarEstudianteForaneo(estudiante);
        res.json({
            metodo: "GET",
            recurso: `/api/web-services/homologacion/${req.params.estudianteId}`,
            status: 200,
            datos: homologacion
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
