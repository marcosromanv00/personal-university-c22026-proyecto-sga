const express = require("express");
const router = express.Router();
const academicoService = require("../services/academicoService");

// ============================================================================
// SOLICITUDES REST (Semana 2) - Rutas de la Entidad Académica
// ============================================================================

// GET - Resumen para Dashboard (Interfaz 1)
router.get("/dashboard", (req, res) => {
    try {
        const datos = academicoService.obtenerResumenDashboard();
        res.json({
            metodo: "GET",
            recurso: "/api/academico/dashboard",
            status: 200,
            datos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Consultar lista de estudiantes (Interfaz 2)
router.get("/estudiantes", (req, res) => {
    try {
        const estudiantes = academicoService.obtenerEstudiantes();
        res.json({
            metodo: "GET",
            recurso: "/api/academico/estudiantes",
            status: 200,
            total: estudiantes.length,
            datos: estudiantes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Consultar un estudiante específico
router.get("/estudiantes/:id", (req, res) => {
    try {
        const estudiante = academicoService.obtenerEstudiantePorId(req.params.id);
        if (!estudiante) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
        res.json({
            metodo: "GET",
            recurso: `/api/academico/estudiantes/${req.params.id}`,
            status: 200,
            datos: estudiante
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Registrar nuevo estudiante (Interfaz 3)
router.post("/estudiantes", (req, res) => {
    try {
        const { id, nombre, carrera, nivel, email, pais, codigoPais } = req.body;
        if (!id || !nombre) {
            return res.status(400).json({ error: "Cédula/ID y Nombre completo son requeridos." });
        }
        const nuevo = academicoService.crearEstudiante({ id, nombre, carrera, nivel, email, pais, codigoPais });
        res.status(201).json({
            metodo: "POST",
            recurso: "/api/academico/estudiantes",
            status: 201,
            mensaje: "Estudiante registrado satisfactoriamente en el SGA.",
            datos: nuevo
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT - Modificar datos de estudiante (Interfaz 3)
router.put("/estudiantes/:id", (req, res) => {
    try {
        const actualizado = academicoService.actualizarEstudiante(req.params.id, req.body);
        if (!actualizado) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
        res.json({
            metodo: "PUT",
            recurso: `/api/academico/estudiantes/${req.params.id}`,
            status: 200,
            mensaje: "Expediente de estudiante actualizado exitosamente.",
            datos: actualizado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE - Eliminar estudiante (Interfaz 3)
router.delete("/estudiantes/:id", (req, res) => {
    try {
        const eliminado = academicoService.eliminarEstudiante(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ error: "Estudiante no encontrado para eliminación" });
        }
        res.json({
            metodo: "DELETE",
            recurso: `/api/academico/estudiantes/${req.params.id}`,
            status: 200,
            mensaje: `El estudiante con ID ${req.params.id} y su historial fueron eliminados.`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET - Consultar lista de cursos (Interfaz 2)
router.get("/cursos", (req, res) => {
    try {
        const cursos = academicoService.obtenerCursos();
        res.json({
            metodo: "GET",
            recurso: "/api/academico/cursos",
            status: 200,
            total: cursos.length,
            datos: cursos
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST - Registrar nuevo curso (Interfaz 3)
router.post("/cursos", (req, res) => {
    try {
        const { id, nombre, creditos, profesor, aula, horario, cupoMaximo } = req.body;
        if (!id || !nombre) {
            return res.status(400).json({ error: "Código y Nombre del curso son obligatorios." });
        }
        const nuevoCurso = academicoService.crearCurso({ id, nombre, creditos, profesor, aula, horario, cupoMaximo });
        res.status(201).json({
            metodo: "POST",
            recurso: "/api/academico/cursos",
            status: 201,
            mensaje: "Curso registrado exitosamente.",
            datos: nuevoCurso
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST - Matricular estudiante a un curso (Interfaz 3)
router.post("/matriculas", (req, res) => {
    try {
        const { estudianteId, cursoId } = req.body;
        if (!estudianteId || !cursoId) {
            return res.status(400).json({ error: "Identificación de estudiante y código de curso son requeridos." });
        }
        const matricula = academicoService.matricularEstudiante({ estudianteId, cursoId });
        res.status(201).json({
            metodo: "POST",
            recurso: "/api/academico/matriculas",
            status: 201,
            mensaje: "Matrícula procesada correctamente.",
            datos: matricula
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT - Registrar calificaciones (Interfaz 3)
router.put("/calificaciones", (req, res) => {
    try {
        const { matriculaId, parcial1, parcial2, proyecto, laboratorios } = req.body;
        if (!matriculaId) {
            return res.status(400).json({ error: "Identificador de matrícula es requerido." });
        }
        const actualizado = academicoService.registrarCalificaciones(matriculaId, {
            parcial1,
            parcial2,
            proyecto,
            laboratorios
        });
        res.json({
            metodo: "PUT",
            recurso: "/api/academico/calificaciones",
            status: 200,
            mensaje: "Calificaciones y promedio calculados y guardados.",
            datos: actualizado
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
