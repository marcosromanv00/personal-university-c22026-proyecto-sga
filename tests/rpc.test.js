// Verificación del módulo académico; no modifica los archivos de datos.
const assert = require("node:assert/strict");
const express = require("express");
const academico = require("../services/academicoService");
const rpc = require("../services/rpcService");

async function verificar() {
    const app = express();
    app.use(express.json());
    app.use("/api/rpc", require("../rpc/rpcRoutes"));
    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    const url = `http://127.0.0.1:${server.address().port}/api/rpc`;
    async function llamar(method, params, id = 101) {
        const respuesta = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", method, params, id })
        });
        assert.equal(respuesta.status, 200);
        const datos = await respuesta.json();
        assert.equal(datos.id, id);
        return datos;
    }
    try {
        const promedio = await llamar("calcularPromedioPonderado", { estudianteId: "4-0231-0814" });
        assert.equal(promedio.result.promedioPonderado, 92.51);
        assert.equal(promedio.result.creditosTotales, 7);
        const grupo = await llamar("analizarRendimientoGrupo", { cursoId: "EIF-401" }, 102);
        assert.equal(grupo.result.totalEvaluados, 6);
        assert.equal(grupo.result.mediaAritmetica, 87.93);
        assert.equal(grupo.result.tasaAprobacionPct, 83.3);
        const vacio = await llamar("analizarRendimientoGrupo", { cursoId: "MAT-020" });
        assert.equal(vacio.result.totalEvaluados, 0);
        assert.equal(vacio.result.desviacionEstandar, 0);
        for (const [method, params, code] of [
            ["calcularPromedioPonderado", null, -32602],
            ["calcularPromedioPonderado", { estudianteId: 123 }, -32602],
            ["calcularPromedioPonderado", { estudianteId: "NO-EXISTE" }, -32001],
            ["analizarRendimientoGrupo", { cursoId: "NO-EXISTE" }, -32001],
            ["analizarRendimientoGrupo", { cursoId: 123 }, -32602],
            ["metodoInexistente", {}, -32601]
        ]) {
            assert.equal((await llamar(method, params)).error.code, code);
        }
        const invalida = await rpc.procesarMensajeRPC({ jsonrpc: "1.0", method: "analizarRendimientoGrupo" });
        assert.equal(invalida.error.code, -32600);
        assert.equal(invalida.id, null);
        const notificacion = await fetch(url, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jsonrpc: "2.0", method: "analizarRendimientoGrupo", params: {} })
        });
        assert.equal(notificacion.status, 204);

        // Datos aislados en memoria: una matrícula pendiente no equivale a reprobación.
        const obtenerOriginal = academico.obtenerEstudiantePorId;
        try {
            academico.obtenerEstudiantePorId = () => ({
                id: "PRUEBA", nombre: "Prueba", matriculas: [
                    { cursoId: "A", creditos: 4, notaFinal: 80, estado: "Aprobado" },
                    { cursoId: "B", creditos: 3, notaFinal: 0, estado: "En Curso" },
                    { cursoId: "C", creditos: 0, notaFinal: 100, estado: "Aprobado" }
                ]
            });
            const resultado = rpc.calcularPromedioPonderado({ estudianteId: "PRUEBA" });
            assert.equal(resultado.promedioPonderado, 80);
            assert.equal(resultado.creditosTotales, 4);
            assert.equal(resultado.totalCursos, 2);
            academico.obtenerEstudiantePorId = () => ({ id: "PRUEBA", matriculas: [] });
            assert.equal(rpc.calcularPromedioPonderado({ estudianteId: "PRUEBA" }).condicionAcademica,
                "Sin Calificaciones Registradas");
        } finally {
            academico.obtenerEstudiantePorId = obtenerOriginal;
        }
        console.log("OK: cálculos académicos, curso vacío, parámetros, errores y transporte HTTP RPC.");
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
}

verificar().catch(error => { console.error(error); process.exitCode = 1; });
