/* ==========================================
   SCRIPT PRINCIPAL - IDSSI UNSIJ
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ---------------------------------------------------------
    // 1. VALIDACIÓN DE FORMULARIO Y EVENTO "SUBMIT"
    // ---------------------------------------------------------
    const formulario = document.querySelector("form");
    
    if (formulario) {
        formulario.addEventListener("submit", (evento) => {
            evento.preventDefault(); // Evita que la página se recargue de golpe

            // Obtenemos los valores de los inputs
            const nombre = formulario.querySelector('input[type="text"]').value;
            const correo = formulario.querySelector('input[type="email"]').value;
            const duda = formulario.querySelector('textarea').value;

            // Validación manual estricta usando JavaScript
            if (nombre.trim().length < 3) {
                alert("Error: Por favor, ingresa un nombre válido (mínimo 3 letras).");
                return;
            }
            if (!correo.includes("@") || !correo.includes(".")) {
                alert("Error: Por favor, ingresa un correo electrónico válido.");
                return;
            }
            if (duda.trim().length < 10) {
                alert("Error: Tu duda es muy corta, por favor explícala con más detalle.");
                return;
            }

            // Si pasa las validaciones exitosamente
            alert(`¡Excelente ${nombre}! Tu mensaje ha sido enviado a la coordinación de la carrera.`);
            formulario.reset();
        });
    }

    // ---------------------------------------------------------
    // 2. INICIALIZAR LA MÁQUINA DEL TIEMPO (Plan de Estudios)
    // ---------------------------------------------------------
    if (document.getElementById('contenedor-materias')) {
        cambiarSemestre(1); // Carga el primer semestre por defecto
    }

    // ---------------------------------------------------------
    // 3. INICIALIZAR EL BOTÓN DE LA API (Puntos Extra)
    // ---------------------------------------------------------
    iniciarBotonAPI();
});


// =========================================================
// FUNCIONES EXTERNAS
// =========================================================

// ---------------------------------------------------------
// MANIPULACIÓN DEL DOM: MÁQUINA DEL TIEMPO DE MATERIAS
// ---------------------------------------------------------
const planDeEstudios = {
    1: ["Programación Estructurada", "Lógica Matemática", "Cálculo I", "Física I", "Metodología de la Investigación", "Administración", "Historia del Pensamiento Filosófico"],
    2: ["Estructura de Datos", "Fundamentos de Electrónica", "Interacción Humano Computadora", "Matemáticas Discretas", "Cálculo II", "Álgebra Lineal", "Teoría General de Sistemas"],
    3: ["Paradigmas de Programación I", "Electrónica Digital", "Base de Datos I", "Teoría de Autómatas", "Ecuaciones Diferenciales", "Probabilidad y Estadística", "Contabilidad y Finanzas"],
    4: ["Paradigmas de Programación II", "Programación de Sistemas", "Diseño Web", "Arquitectura de Computadoras", "Base de Datos II", "Métodos Numéricos", "Gestión y Desarrollo Social"],
    5: ["Programación de Dispositivos Móviles", "Fundamentos de Sistemas Operativos", "Tecnologías Web I", "Redes I", "Ingeniería de Software I", "Fundamentos de IA", "Emprendimiento e Innovación"],
    6: ["Bases de Datos Avanzadas", "Sistemas Operativos de Red", "Tecnologías Web II", "Redes II", "Ingeniería de Software II", "Ciencia de Datos", "Liderazgo y Desarrollo Personal"],
    7: ["Calidad de Software", "Sistemas Distribuidos", "Redes Neuronales", "Algoritmos de Optimización", "Investigación de Operaciones", "Derecho y Legislación en Informática", "Liderazgo y Equipos de Alto Desempeño"],
    8: ["Proyectos de Tecnologías de la Información", "Ciberseguridad", "Modelos predictivos", "Seminario de tesis", "Optativa I", "Optativa II"],
    9: ["Estancia profesional", "Seminario de Titulación"]
};

window.cambiarSemestre = function(numeroSemestre) {
    let bolitas = document.querySelectorAll('.paso-tiempo');
    if(bolitas.length === 0) return;

    // Actualizamos visualmente el botón seleccionado
    bolitas.forEach(b => b.classList.remove('paso-activo'));
    bolitas[numeroSemestre - 1].classList.add('paso-activo');

    let contenedor = document.getElementById('contenedor-materias');
    contenedor.innerHTML = ""; // Limpiamos el HTML anterior

    // Inyectamos las nuevas materias
    let materiasDelSemestre = planDeEstudios[numeroSemestre];
    materiasDelSemestre.forEach(materia => {
        contenedor.innerHTML += `
            <div class="tarjeta" style="display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;">
                <h4 style="margin: 0; color: #333333; font-family: Arial, sans-serif; font-size: 15px;">${materia}</h4>
            </div>
        `;
    });

    // Lógica para mostrar/ocultar materias optativas (Solo en 8vo)
    let seccionOptativas = document.getElementById('seccion-optativas');
    if (seccionOptativas) {
        seccionOptativas.style.display = (numeroSemestre === 8) ? "block" : "none";
    }
};

// ---------------------------------------------------------
// PUNTOS EXTRA: CONSUMO DE API REAL (CLIMA EN IXTLÁN)
// ---------------------------------------------------------
function iniciarBotonAPI() {
    // 1. Creación dinámica del botón
    const botonApi = document.createElement('button');
    botonApi.innerText = "🌦️ Clima UNSIJ"; 
    
    botonApi.style.cssText = "position: fixed; bottom: 20px; right: 20px; background-color: #064e3b; color: white; border: none; padding: 12px 20px; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 2000; font-weight: bold; font-family: Arial, sans-serif; transition: all 0.3s ease;";
    
    botonApi.onmouseover = () => botonApi.style.transform = "scale(1.1)";
    botonApi.onmouseout = () => botonApi.style.transform = "scale(1)";

    document.body.appendChild(botonApi);

    // 2. Evento Click y Petición Async/Await
    botonApi.addEventListener('click', async () => {
        botonApi.innerText = "⏳ Consultando satélite..."; 

        try {
            // URL de la API del clima para Ixtlán de Juárez
            const urlApi = 'https://wttr.in/Ixtlan de Juarez,Oaxaca?format=j1';
            
            const respuesta = await fetch(urlApi);
            if (!respuesta.ok) throw new Error("Error en respuesta");
            
            const datos = await respuesta.json();

            // Extraemos los datos útiles
            const climaActual = datos.current_condition[0];
            const tempC = climaActual.temp_C; 
            const descripcion = climaActual.lang_es ? climaActual.lang_es[0].value : climaActual.weatherDesc[0].value;
            const humedad = climaActual.humidity;

            // Lógica sencilla para el emoji
            let emojiTemp = "😐";
            if (tempC < 15) emojiTemp = "🥶";
            if (tempC >= 15 && tempC < 25) emojiTemp = "😊";
            if (tempC >= 25) emojiTemp = "😓";

            // Resultado final
            alert(`🌦️ REPORTE DEL CLIMA EN LA UNSIJ 🏫\n\nEstado: ${descripcion.toUpperCase()}\nTemperatura: ${tempC}°C ${emojiTemp}\nHumedad: ${humedad}%\n\n¡Datos consultados en tiempo real!`);
            
        } catch (error) {
            console.error(error);
            alert("❌ Hubo un error al conectar con el satélite meteorológico. Inténtalo más tarde.");
        } finally {
            botonApi.innerText = "🌦️ Clima UNSIJ"; 
        }
    });
}