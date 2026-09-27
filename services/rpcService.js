// ============================================================================
// SERVICIO RPC (Semana 3) - Protocolo JSON-RPC 2.0
// Procedimientos remotos para cálculo de estadísticas y promedios ponderados
// ============================================================================

const academicoService = require("./academicoService");

function calcularPromedioPonderado({ estudianteId }) {
    if (!estudianteId) {
        throw { code: -32602, message: "Parámetro 'estudianteId' inválido o ausente." };
    }

    const estudiante = academicoService.obtenerEstudiantePorId(estudianteId);
    if (!estudiante) {
        throw { code: -32001, message: `Estudiante con ID '${estudianteId}' no encontrado en el sistema.` };
    }

    const matriculas = estudiante.matriculas || [];
    if (matriculas.length === 0) {
        return {
            estudianteId: estudiante.id,
            nombre: estudiante.nombre,
            carrera: estudiante.carrera,
            totalCursos: 0,
            creditosTotales: 0,
            creditosAprobados: 0,
            promedioPonderado: 0,
            condicionAcademica: "Sin Cursos Matriculados",
            desgloseCursos: []
        };
    }

    let sumaPonderada = 0;
    let totalCreditos = 0;
    let creditosAprobados = 0;

    const desglose = matriculas.map(m => {
        const creditos = m.creditos || 3;
        const nota = m.notaFinal || 0;
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
    const estudiantes = academicoService.obtenerEstudiantes();
    const cursos = academicoService.obtenerCursos();

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

    const notas = todasMatriculas.map(m => m.notaFinal || 0);
    const total = notas.length;

    if (total === 0) {
        return {
            cursoFiltrado: cursoId || "Todos los cursos",
            totalEvaluados: 0,
            mediaAritmetica: 0,
            notaMaxima: 0,
            notaMinima: 0,
            aprobados: 0,
            aplazados: 0,
            reprobados: 0,
            tasaAprobacionPct: 0
        };
    }

    const suma = notas.reduce((a, b) => a + b, 0);
    const media = Number((suma / total).toFixed(2));
    const max = Math.max(...notas);
    const min = Math.min(...notas);

    const aprobados = todasMatriculas.filter(m => m.notaFinal >= 70).length;
    const aplazados = todasMatriculas.filter(m => m.notaFinal >= 60 && m.notaFinal < 70).length;
    const reprobados = todasMatriculas.filter(m => m.notaFinal < 60).length;

    // Cálculo de desviación estándar
    const varianza = notas.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / total;
    const desviacionEstandar = Number(Math.sqrt(varianza).toFixed(2));

    const cursoInfo = cursoId ? cursos.find(c => c.id.toLowerCase() === cursoId.toLowerCase()) : null;

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
    if (!solicitud || solicitud.jsonrpc !== "2.0" || !solicitud.method) {
        return {
            jsonrpc: "2.0",
            error: { code: -32600, message: "Petición RPC Inválida: Se requiere jsonrpc: '2.0' y method." },
            id: solicitud ? solicitud.id : null
        };
    }

    const { method, params = {}, id = 1 } = solicitud;

    try {
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
