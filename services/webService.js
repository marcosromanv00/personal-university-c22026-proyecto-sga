// ============================================================================
// SERVICIOS WEB (Semana 4) - Consumo de Servicio Web GraphQL Externo
// Homologación de estudiantes internacionales y convenios de intercambio UNA
// ============================================================================

const COUNTRIES_GRAPHQL_API = "https://countries.trevorblades.com/";

// Caché de contingencia para tolerancia a fallos en pruebas locales sin conexión
const CACHE_PAISES_FALLBACK = [
    { code: "CR", name: "Costa Rica", emoji: "🇨🇷", capital: "San José", currency: "CRC" },
    { code: "DE", name: "Germany", emoji: "🇩🇪", capital: "Berlin", currency: "EUR" },
    { code: "US", name: "United States", emoji: "🇺🇸", capital: "Washington, D.C.", currency: "USD" },
    { code: "ES", name: "Spain", emoji: "🇪🇸", capital: "Madrid", currency: "EUR" },
    { code: "MX", name: "Mexico", emoji: "🇲🇽", capital: "Mexico City", currency: "MXN" },
    { code: "CO", name: "Colombia", emoji: "🇨🇴", capital: "Bogotá", currency: "COP" },
    { code: "PA", name: "Panama", emoji: "🇵🇦", capital: "Panama City", currency: "PAB,USD" },
    { code: "CL", name: "Chile", emoji: "🇨🇱", capital: "Santiago", currency: "CLP" },
    { code: "BR", name: "Brazil", emoji: "🇧🇷", capital: "Brasília", currency: "BRL" },
    { code: "CA", name: "Canada", emoji: "🇨🇦", capital: "Ottawa", currency: "CAD" }
];

async function consultarConveniosInternacionales(codigoPais = null) {
    const query = `
        query ObtenerPaisesConvenio {
            countries {
                code
                name
                emoji
                capital
                currency
            }
        }
    `;

    console.log("\n========================================");
    console.log("CONSULTANDO SERVICIO WEB GRAPHQL (Semana 4)");
    console.log("Endpoint:", COUNTRIES_GRAPHQL_API);
    console.log("========================================");

    try {
        const respuesta = await fetch(COUNTRIES_GRAPHQL_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query }),
            // Timeout de seguridad de 5 segundos
            signal: AbortSignal.timeout(5000)
        });

        if (!respuesta.ok) {
            throw new Error(`Servicio Web respondió con HTTP ${respuesta.status}`);
        }

        const resultado = await respuesta.json();

        if (resultado.errors) {
            console.error("Errores en respuesta GraphQL:", resultado.errors);
            throw new Error("Error en la consulta del esquema GraphQL de países");
        }

        const paises = resultado.data.countries;

        if (codigoPais) {
            const filtrado = paises.find(p => p.code.toUpperCase() === codigoPais.toUpperCase());
            return {
                origen: "Servicio Web GraphQL Remoto (En Línea)",
                endpoint: COUNTRIES_GRAPHQL_API,
                datos: filtrado || null
            };
        }

        return {
            origen: "Servicio Web GraphQL Remoto (En Línea)",
            endpoint: COUNTRIES_GRAPHQL_API,
            totalPaises: paises.length,
            datos: paises.slice(0, 20) // Retornamos los primeros 20 para agilidad
        };
    } catch (error) {
        console.warn("Aviso: Fallback a caché local por contingencia de red:", error.message);

        if (codigoPais) {
            const fallbackFiltrado = CACHE_PAISES_FALLBACK.find(
                p => p.code.toUpperCase() === codigoPais.toUpperCase()
            );
            return {
                origen: "Caché Local de Contingencia (Offline Fallback)",
                endpoint: COUNTRIES_GRAPHQL_API,
                aviso: "Consulta resuelta desde caché por latencia o falta de internet en la máquina.",
                datos: fallbackFiltrado || null
            };
        }

        return {
            origen: "Caché Local de Contingencia (Offline Fallback)",
            endpoint: COUNTRIES_GRAPHQL_API,
            aviso: "Consulta resuelta desde caché por latencia o falta de internet en la máquina.",
            totalPaises: CACHE_PAISES_FALLBACK.length,
            datos: CACHE_PAISES_FALLBACK
        };
    }
}

async function homologarEstudianteForaneo(estudiante) {
    const infoPais = await consultarConveniosInternacionales(estudiante.codigoPais || "CR");
    const datosPais = infoPais.datos;

    const tarifaRegularUSD = 120;
    const recargoIntercambio = estudiante.pais !== "Costa Rica" ? 1.15 : 1.0;
    const arancelCalculado = Number((tarifaRegularUSD * recargoIntercambio).toFixed(2));

    return {
        servicioWebUtilizado: "GraphQL Countries & Exchange Service",
        protocolo: "GraphQL sobre HTTP POST",
        estudiante: {
            id: estudiante.id,
            nombre: estudiante.nombre,
            pais: estudiante.pais,
            codigoPais: estudiante.codigoPais
        },
        homologacion: {
            paisOficial: datosPais ? `${datosPais.name} ${datosPais.emoji}` : estudiante.pais,
            capital: datosPais ? datosPais.capital : "Desconocida",
            monedaOficial: datosPais ? datosPais.currency : "USD",
            aplicaConvenioMovilidad: estudiante.pais !== "Costa Rica",
            arancelCicloUSD: arancelCalculado,
            estadoValidacion: "Convalidación Académica Autorizada"
        },
        trazaTecnica: {
            fuente: infoPais.origen,
            endpoint: infoPais.endpoint
        }
    };
}

module.exports = {
    consultarConveniosInternacionales,
    homologarEstudianteForaneo
};
