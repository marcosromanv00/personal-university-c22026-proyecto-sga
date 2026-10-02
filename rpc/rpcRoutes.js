const express = require("express");
const router = express.Router();
const { procesarMensajeRPC } = require("../services/rpcService");

router.post("/", async (req, res) => {
    console.log("\n========================================");
    console.log("EJECUTANDO SOLICITUD RPC (Semana 3)");
    console.log("========================================");
    console.log("Solicitud recibida:", JSON.stringify(req.body, null, 2));

    const respuestaRPC = await procesarMensajeRPC(req.body);

    console.log("Respuesta generada:", JSON.stringify(respuestaRPC, null, 2));
    if (req.body && req.body.id === undefined && respuestaRPC.error?.code !== -32600) {
        return res.status(204).end();
    }
    res.json(respuestaRPC);
});

router.get("/metodos", (req, res) => {
    res.json({
        protocolo: "JSON-RPC 2.0",
        transporte: "HTTP POST",
        endpoint: "/api/rpc",
        metodos: [
            {
                nombre: "calcularPromedioPonderado",
                descripcion: "Calcula remotamente el promedio ponderado por créditos, créditos acumulados y condición de honor del estudiante.",
                parametros: {
                    estudianteId: "string (ej: '3-0529-0253')"
                },
                ejemplo: {
                    jsonrpc: "2.0",
                    method: "calcularPromedioPonderado",
                    params: { estudianteId: "3-0529-0253" },
                    id: 1
                }
            },
            {
                nombre: "analizarRendimientoGrupo",
                descripcion: "Calcula estadísticas de la cohorte académica: media, desviación estándar, notas extremas y tasa de aprobación.",
                parametros: {
                    cursoId: "string (opcional, ej: 'EIF-401')"
                },
                ejemplo: {
                    jsonrpc: "2.0",
                    method: "analizarRendimientoGrupo",
                    params: { cursoId: "EIF-401" },
                    id: 2
                }
            }
        ]
    });
});

module.exports = router;
