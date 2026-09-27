const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILE_ESTUDIANTES = path.join(DATA_DIR, "estudiantes.json");
const FILE_CURSOS = path.join(DATA_DIR, "cursos.json");
const FILE_MATRICULAS = path.join(DATA_DIR, "matriculas.json");

function leerArchivo(ruta, fallback = []) {
    try {
        if (!fs.existsSync(ruta)) return fallback;
        const contenido = fs.readFileSync(ruta, "utf8");
        return JSON.parse(contenido);
    } catch (error) {
        console.error(`Error leyendo ${ruta}:`, error.message);
        return fallback;
    }
}

function guardarArchivo(ruta, datos) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2), "utf8");
}

function obtenerEstudiantes() {
    const estudiantes = leerArchivo(FILE_ESTUDIANTES);
    const matriculas = leerArchivo(FILE_MATRICULAS);
    const cursos = leerArchivo(FILE_CURSOS);

    return estudiantes.map(est => {
        const estMatriculas = matriculas.filter(m => m.estudianteId === est.id).map(m => {
            const curso = cursos.find(c => c.id === m.cursoId);
            return {
                ...m,
                cursoNombre: curso ? curso.nombre : m.cursoId,
                creditos: curso ? curso.creditos : 0
            };
        });

        const sumaNotas = estMatriculas.reduce((acc, curr) => acc + (curr.notaFinal || 0), 0);
        const promedio = estMatriculas.length > 0 ? Number((sumaNotas / estMatriculas.length).toFixed(1)) : 0;

        return {
            ...est,
            totalMatriculas: estMatriculas.length,
            promedioGeneral: promedio,
            matriculas: estMatriculas
        };
    });
}

function obtenerEstudiantePorId(id) {
    const estudiantes = obtenerEstudiantes();
    return estudiantes.find(e => e.id.toLowerCase() === id.toLowerCase()) || null;
}

function crearEstudiante(estudiante) {
    const estudiantes = leerArchivo(FILE_ESTUDIANTES);
    if (estudiantes.some(e => e.id.toLowerCase() === estudiante.id.toLowerCase())) {
        throw new Error(`El estudiante con identificación ${estudiante.id} ya existe.`);
    }
    const nuevo = {
        id: estudiante.id.trim(),
        nombre: estudiante.nombre.trim(),
        carrera: estudiante.carrera || "Ingeniería en Sistemas de Información",
        nivel: estudiante.nivel || "I Nivel",
        email: estudiante.email || `${estudiante.id.replace(/[^a-zA-Z0-9]/g, "")}@est.una.ac.cr`,
        pais: estudiante.pais || "Costa Rica",
        codigoPais: (estudiante.codigoPais || "CR").toUpperCase(),
        estado: estudiante.estado || "Activo"
    };
    estudiantes.push(nuevo);
    guardarArchivo(FILE_ESTUDIANTES, estudiantes);
    return nuevo;
}

function actualizarEstudiante(id, cambios) {
    const estudiantes = leerArchivo(FILE_ESTUDIANTES);
    const indice = estudiantes.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
    if (indice === -1) return null;
    estudiantes[indice] = { ...estudiantes[indice], ...cambios, id: estudiantes[indice].id };
    guardarArchivo(FILE_ESTUDIANTES, estudiantes);
    return estudiantes[indice];
}

function eliminarEstudiante(id) {
    const estudiantes = leerArchivo(FILE_ESTUDIANTES);
    const filtrados = estudiantes.filter(e => e.id.toLowerCase() !== id.toLowerCase());
    if (filtrados.length === estudiantes.length) return false;
    guardarArchivo(FILE_ESTUDIANTES, filtrados);

    const matriculas = leerArchivo(FILE_MATRICULAS);
    const matriculasFiltradas = matriculas.filter(m => m.estudianteId.toLowerCase() !== id.toLowerCase());
    guardarArchivo(FILE_MATRICULAS, matriculasFiltradas);
    return true;
}

function obtenerCursos() {
    const cursos = leerArchivo(FILE_CURSOS);
    const matriculas = leerArchivo(FILE_MATRICULAS);
    return cursos.map(curso => {
        const inscritos = matriculas.filter(m => m.cursoId === curso.id).length;
        return {
            ...curso,
            inscritos,
            cuposDisponibles: Math.max(0, (curso.cupoMaximo || 30) - inscritos)
        };
    });
}

function crearCurso(curso) {
    const cursos = leerArchivo(FILE_CURSOS);
    if (cursos.some(c => c.id.toLowerCase() === curso.id.toLowerCase())) {
        throw new Error(`El curso con código ${curso.id} ya se encuentra registrado.`);
    }
    const nuevo = {
        id: curso.id.trim().toUpperCase(),
        nombre: curso.nombre.trim(),
        creditos: Number(curso.creditos) || 3,
        profesor: curso.profesor || "Profesor Asignado",
        aula: curso.aula || "Laboratorio Informática",
        horario: curso.horario || "Horario Regular",
        cupoMaximo: Number(curso.cupoMaximo) || 30,
        ciclo: curso.ciclo || "II Ciclo 2026"
    };
    cursos.push(nuevo);
    guardarArchivo(FILE_CURSOS, cursos);
    return nuevo;
}

function matricularEstudiante({ estudianteId, cursoId }) {
    const estudiantes = leerArchivo(FILE_ESTUDIANTES);
    const cursos = leerArchivo(FILE_CURSOS);
    const matriculas = leerArchivo(FILE_MATRICULAS);

    const estudiante = estudiantes.find(e => e.id.toLowerCase() === estudianteId.toLowerCase());
    if (!estudiante) throw new Error(`Estudiante ${estudianteId} no encontrado.`);

    const curso = cursos.find(c => c.id.toLowerCase() === cursoId.toLowerCase());
    if (!curso) throw new Error(`Curso ${cursoId} no encontrado.`);

    const yaMatriculado = matriculas.some(
        m => m.estudianteId.toLowerCase() === estudianteId.toLowerCase() && m.cursoId.toLowerCase() === cursoId.toLowerCase()
    );
    if (yaMatriculado) throw new Error("El estudiante ya está matriculado en este curso.");

    const id = `MAT-2026-${String(matriculas.length + 1).padStart(3, "0")}`;
    const nuevaMatricula = {
        id,
        estudianteId: estudiante.id,
        cursoId: curso.id,
        parcial1: 0,
        parcial2: 0,
        proyecto: 0,
        laboratorios: 0,
        notaFinal: 0,
        estado: "En Curso"
    };
    matriculas.push(nuevaMatricula);
    guardarArchivo(FILE_MATRICULAS, matriculas);
    return nuevaMatricula;
}

function registrarCalificaciones(matriculaId, { parcial1, parcial2, proyecto, laboratorios }) {
    const matriculas = leerArchivo(FILE_MATRICULAS);
    const idx = matriculas.findIndex(m => m.id === matriculaId);
    if (idx === -1) throw new Error("Registro de matrícula no encontrado.");

    const p1 = Number(parcial1);
    const p2 = Number(parcial2);
    const py = Number(proyecto);
    const lb = Number(laboratorios);

    // Ponderación estándar UNA: Parcial 1 (25%), Parcial 2 (25%), Proyecto (30%), Laboratorios (20%)
    const notaFinal = Number(((p1 * 0.25) + (p2 * 0.25) + (py * 0.30) + (lb * 0.20)).toFixed(1));
    let estado = "Reprobado";
    if (notaFinal >= 70) estado = "Aprobado";
    else if (notaFinal >= 60) estado = "Aplazado";

    matriculas[idx] = {
        ...matriculas[idx],
        parcial1: p1,
        parcial2: p2,
        proyecto: py,
        laboratorios: lb,
        notaFinal,
        estado
    };
    guardarArchivo(FILE_MATRICULAS, matriculas);
    return matriculas[idx];
}

function obtenerResumenDashboard() {
    const estudiantes = leerArchivo(FILE_ESTUDIANTES);
    const cursos = leerArchivo(FILE_CURSOS);
    const matriculas = leerArchivo(FILE_MATRICULAS);

    const notasValidas = matriculas.map(m => m.notaFinal).filter(n => typeof n === "number" && n > 0);
    const promedioGeneral = notasValidas.length > 0
        ? Number((notasValidas.reduce((a, b) => a + b, 0) / notasValidas.length).toFixed(1))
        : 0;
    const aprobados = matriculas.filter(m => m.estado === "Aprobado").length;
    const porcentajeAprobacion = matriculas.length > 0 ? Math.round((aprobados / matriculas.length) * 100) : 0;

    return {
        totalEstudiantes: estudiantes.length,
        totalCursos: cursos.length,
        totalMatriculas: matriculas.length,
        promedioGeneral,
        porcentajeAprobacion,
        sistema: "SGA-UNA v1.0",
        cicloLectivo: "II Ciclo 2026",
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante,
    obtenerCursos,
    crearCurso,
    matricularEstudiante,
    registrarCalificaciones,
    obtenerResumenDashboard
};
