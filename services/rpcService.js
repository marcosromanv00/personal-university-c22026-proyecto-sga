const academicoService = require("./academicoService");

function calcularPromedioPonderado({ estudianteId }) {
    if (typeof estudianteId !== "string" || !estudianteId.trim()) {
        throw { code: -32602, message: "Parámetro 'estudianteId' inválido o ausente." };
    }

    const estudiante = academicoService.obtenerEstudiantePorId(estudianteId.trim());
    if (!estudiante) {
        throw { code: -32001, message: `Estudiante con ID '${estudianteId}' no encontrado en el sistema.` };
    }

    const matriculas = (estudiante.matriculas || []).filter(m => m.estado !== "En Curso");
    if (matriculas.length === 0) {
        return {
            estudianteId: estudiante.id,
            nombre: estudiante.nombre,
            carrera: estudiante.carrera,
            totalCursos: 0,
            creditosTotales: 0,
            creditosAprobados: 0,
            promedioPonderado: 0,
            condicionAcademica: "Sin Calificaciones Registradas",
            desgloseCursos: []
        };
    }

    let sumaPonderada = 0;
    let totalCreditos = 0;
    let creditosAprobados = 0;

    const desglose = matriculas.map(m => {
        const creditos = m.creditos;
        if (typeof creditos !== "number" || !Number.isFinite(creditos) || creditos < 0) {
            throw { code: -32002, message: `Créditos inválidos para el curso '${m.cursoId}'.` };
        }
        const nota = m.notaFinal;
        if (typeof nota !== "number" || !Number.isFinite(nota) || nota < 0 || nota > 100) {
            throw { code: -32002, message: `Nota inválida para el curso '${m.cursoId}'.` };
        }
        sumaPonderada += (nota * creditos);
        totalCreditos += creditos;
        if (nota >= 70) creditosAprobados += creditos;

        return {
            cursoId: m.cursoId,
            cursoNombre: m.cursoNombre,
            creditos,
            notaFinal: nota,
            ponderacion: Number((nota * creditos).toFixed(1)),
            estado: m.estado
        };
    });

    const promedioPonderado = totalCreditos > 0 ? Number((sumaPonderada / totalCreditos).toFixed(2)) : 0;

    let condicionAcademica = "En Observación";
    if (promedioPonderado >= 90) condicionAcademica = "Excelencia Académica (Honor)";
    else if (promedioPonderado >= 80) condicionAcademica = "Rendimiento Sobresaliente";
    else if (promedioPonderado >= 70) condicionAcademica = "Condición Regular Aprobado";
    else condicionAcademica = "Alerta Académica (Riesgo)";

    return {
        estudianteId: estudiante.id,
        nombre: estudiante.nombre,
        carrera: estudiante.carrera,
        totalCursos: matriculas.length,
        creditosTotales: totalCreditos,
        creditosAprobados,
        promedioPonderado,
        condicionAcademica,
        desgloseCursos: desglose
    };
}

function analizarRendimientoGrupo({ cursoId } = {}) {
    if (cursoId != null && typeof cursoId !== "string") {
        throw { code: -32602, message: "Parámetro 'cursoId' debe ser texto." };
    }
    cursoId = cursoId ? cursoId.trim() : null;
    const estudiantes = academicoService.obtenerEstudiantes();
    const cursos = academicoService.obtenerCursos();
    const cursoInfo = cursoId ? cursos.find(c => c.id.toLowerCase() === cursoId.toLowerCase()) : null;
    if (cursoId && !cursoInfo) {
        throw { code: -32001, message: `Curso '${cursoId}' no encontrado en el sistema.` };
    }

    let todasMatriculas = [];
    estudiantes.forEach(e => {
        (e.matriculas || []).forEach(m => {
            todasMatriculas.push({
                ...m,
                estudianteNombre: e.nombre
            });
        });
    });

    if (cursoId) {
        todasMatriculas = todasMatriculas.filter(m => m.cursoId.toLowerCase() === cursoId.toLowerCase());
    }

    todasMatriculas = todasMatriculas.filter(m => m.estado !== "En Curso");
    const notas = todasMatriculas.map(m => {
        if (typeof m.notaFinal !== "number" || !Number.isFinite(m.notaFinal) || m.notaFinal < 0 || m.notaFinal > 100) {
            throw { code: -32002, message: `Nota inválida para el curso '${m.cursoId}'.` };
        }
        return m.notaFinal;
    });
    const total = notas.length;

    if (total === 0) {
        return {
            cursoFiltrado: cursoInfo ? `${cursoInfo.id} - ${cursoInfo.nombre}` : "Todos los cursos (General)",
            totalEvaluados: 0,
            mediaAritmetica: 0,
            desviacionEstandar: 0,
            notaMaxima: 0,
            notaMinima: 0,
            aprobados: 0,
            aplazados: 0,
            reprobados: 0,
            tasaAprobacionPct: 0
        };
    }

    const suma = notas.reduce((a, b) => a + b, 0);
    const mediaSinRedondear = suma / total;
    const media = Number(mediaSinRedondear.toFixed(2));
    const max = Math.max(...notas);
    const min = Math.min(...notas);

    const aprobados = todasMatriculas.filter(m => m.notaFinal >= 70).length;
    const aplazados = todasMatriculas.filter(m => m.notaFinal >= 60 && m.notaFinal < 70).length;
    const reprobados = todasMatriculas.filter(m => m.notaFinal < 60).length;

    const varianza = notas.reduce((acc, val) => acc + Math.pow(val - mediaSinRedondear, 2), 0) / total;
    const desviacionEstandar = Number(Math.sqrt(varianza).toFixed(2));

    return {
        cursoFiltrado: cursoInfo ? `${cursoInfo.id} - ${cursoInfo.nombre}` : "Todos los cursos (General)",
        totalEvaluados: total,
        mediaAritmetica: media,
        desviacionEstandar,
        notaMaxima: max,
        notaMinima: min,
        aprobados,
        aplazados,
        reprobados,
        tasaAprobacionPct: Number(((aprobados / total) * 100).toFixed(1)),
        cicloLectivo: "II Ciclo 2026 - Universidad Nacional"
    };
}

async function procesarMensajeRPC(solicitud) {
    const idValido = solicitud && (solicitud.id === undefined || solicitud.id === null ||
        typeof solicitud.id === "string" || (typeof solicitud.id === "number" && Number.isFinite(solicitud.id)));
    if (!solicitud || Array.isArray(solicitud) || solicitud.jsonrpc !== "2.0" ||
        typeof solicitud.method !== "string" || !solicitud.method || !idValido) {
        return {
            jsonrpc: "2.0",
            error: { code: -32600, message: "Petición RPC Inválida: Se requiere jsonrpc: '2.0' y method." },
            id: idValido && solicitud.id !== undefined ? solicitud.id : null
        };
    }

    const { method, params = {}, id = null } = solicitud;

    try {
        if (!params || typeof params !== "object" || Array.isArray(params)) {
            throw { code: -32602, message: "Los parámetros de estos métodos deben ser un objeto." };
        }
        let resultado;
        switch (method) {
            case "calcularPromedioPonderado":
                resultado = calcularPromedioPonderado(params);
                break;
            case "analizarRendimientoGrupo":
                resultado = analizarRendimientoGrupo(params);
                break;
            default:
                return {
                    jsonrpc: "2.0",
                    error: { code: -32601, message: `Método RPC '${method}' no soportado.` },
                    id
                };
        }

        return {
            jsonrpc: "2.0",
            result: resultado,
            id
        };
    } catch (err) {
        return {
            jsonrpc: "2.0",
            error: {
                code: err.code || -32000,
                message: err.message || "Error interno en ejecución del procedimiento remoto."
            },
            id
        };
    }
}

module.exports = {
    procesarMensajeRPC,
    calcularPromedioPonderado,
    analizarRendimientoGrupo
};
