// ==========================================================================
// UTILIDADES COMPARTIDAS - SGA DISTRIBUIDO
// ==========================================================================

function mostrarToast(mensaje, tipo = "info") {
    let toast = document.getElementById("toastBox");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toastBox";
        toast.className = "toast-box";
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    if (tipo === "error") {
        toast.style.borderColor = "var(--accent-rose)";
        toast.style.color = "#fda4af";
    } else if (tipo === "success") {
        toast.style.borderColor = "var(--accent-emerald)";
        toast.style.color = "#86efac";
    } else {
        toast.style.borderColor = "var(--border-subtle)";
        toast.style.color = "var(--text-primary)";
    }
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 4000);
}

function actualizarInspector({ metodo, url, requestBody = null, status, responseBody, tiempoMs }) {
    const metaEl = document.getElementById("inspectorMeta");
    const bodyEl = document.getElementById("inspectorBody");
    if (!metaEl || !bodyEl) return;

    metaEl.textContent = `${metodo} ${url} | HTTP ${status} | ${tiempoMs}ms`;

    const log = {
        solicitud: {
            metodo,
            url,
            cuerpo: requestBody || "(Sin cuerpo / GET)"
        },
        respuesta: {
            codigoHttp: status,
            tiempoRespuesta: `${tiempoMs} ms`,
            payload: responseBody
        }
    };

    bodyEl.textContent = JSON.stringify(log, null, 2);
}

function volverArriba() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
