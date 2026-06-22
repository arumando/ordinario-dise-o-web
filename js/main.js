/* ==========================================
   SCRIPT PRINCIPAL - IDSSI UNSIJ
========================================== */

// 1. VALIDACIÓN Y ENVÍO DE FORMULARIOS (Para Inicio y Áreas)
function enviarFormulario(evento) {
    // Evita que la página se recargue de golpe al darle clic a "Enviar"
    evento.preventDefault();
    
    // Muestra el mensaje al usuario
    alert('¡Excelente! Tu mensaje ha sido enviado a la coordinación de la carrera. Nos pondremos en contacto contigo pronto.');
    
    // Limpia las cajas de texto del formulario automáticamente
    evento.target.reset();
}

// 2. MÁQUINA DEL TIEMPO (Para la página de Plan de Estudios)
// Guardamos todo el temario en un "Objeto" o Diccionario
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

function cambiarSemestre(numeroSemestre) {
    // Seleccionamos todos los círculos de la línea de tiempo
    let bolitas = document.querySelectorAll('.paso-tiempo');
    
    // Si no existen las bolitas, significa que no estamos en la página del plan de estudios y detenemos la función
    if(bolitas.length === 0) return;

    // A) Quitamos el color activo a todos y se lo ponemos solo al que el usuario cliqueó
    bolitas.forEach(bolita => bolita.classList.remove('paso-activo')); 
    bolitas[numeroSemestre - 1].classList.add('paso-activo'); 

    // B) Limpiamos el contenedor donde aparecen las tarjetas
    let contenedor = document.getElementById('contenedor-materias');
    contenedor.innerHTML = ""; 

    // C) Pintamos las materias del semestre seleccionado usando el diccionario
    let materiasDelSemestre = planDeEstudios[numeroSemestre];
    materiasDelSemestre.forEach(materia => {
        contenedor.innerHTML += `
            <div class="tarjeta" style="display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;">
                <h4 style="margin: 0; color: var(--texto); font-family: Arial, sans-serif; font-size: 15px;">${materia}</h4>
            </div>
        `;
    });

    // D) Mostrar u ocultar las optativas (Condicional para el 8vo Semestre)
    let seccionOptativas = document.getElementById('seccion-optativas');
    if (seccionOptativas) {
        if (numeroSemestre === 8) {
            seccionOptativas.style.display = "block"; // Lo muestra
        } else {
            seccionOptativas.style.display = "none";  // Lo esconde
        }
    }
}

// 3. EVENTO DE INICIALIZACIÓN
// Esperamos a que la página cargue por completo para pintar el Semestre 1 por defecto
document.addEventListener("DOMContentLoaded", function() {
    if (document.getElementById('contenedor-materias')) {
        cambiarSemestre(1);
    }
});