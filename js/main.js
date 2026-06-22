
document.addEventListener("DOMContentLoaded", () => {

// validacion de formulario y envio real a correo
const formulario = document.getElementById("formulario-contacto");

if (formulario) {
    // nota la palabra async aqui, porque vamos a usar fetch
    formulario.addEventListener("submit", async (evento) => {
        // evita que la pagina se recargue
        evento.preventDefault(); 

        // obtenemos los valores
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const duda = document.getElementById("duda").value;

        // validacion manual estricta
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

        // cambiamos el texto del boton para que el usuario sepa que esta cargando
        const botonSubmit = formulario.querySelector('button[type="submit"]');
        const textoOriginal = botonSubmit.innerText;
        botonSubmit.innerText = "ENVIANDO...";

        try {

            const respuesta = await fetch("https://formspree.io/f/mzdlbbzg", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nombre,
                    correo: correo,
                    mensaje: duda
                })
            });

            if (respuesta.ok) {
                alert(`¡Excelente ${nombre}! Tu mensaje ha sido enviado a la coordinación.`);
                formulario.reset();
            } else {
                alert("Hubo un problema al procesar tu solicitud. Intenta nuevamente.");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión. Revisa tu internet e inténtalo de nuevo.");
        } finally {
            // restauramos el boton
            botonSubmit.innerText = textoOriginal;
        }
    });
}
    // carga el primer semestre por defecto en el plan de estudios
    if (document.getElementById('contenedor-materias')) {
        cambiarSemestre(1); 
    }

    // inicializa el boton de la api
    iniciarBotonAPI();

    // inicializa los modales de areas de especializacion
    if (document.querySelector('.etiqueta-campo')) {
        iniciarModalesLaborales();
    }
});


/* funciones externas */

// diccionario con las materias por semestre
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

// funcion para cambiar las materias en la vista
window.cambiarSemestre = function(numeroSemestre) {
    let bolitas = document.querySelectorAll('.paso-tiempo');
    if(bolitas.length === 0) return;

    // actualiza visualmente el boton seleccionado
    bolitas.forEach(b => b.classList.remove('paso-activo'));
    bolitas[numeroSemestre - 1].classList.add('paso-activo');

    // limpia el html anterior
    let contenedor = document.getElementById('contenedor-materias');
    contenedor.innerHTML = ""; 

    // inyecta las nuevas materias
    let materiasDelSemestre = planDeEstudios[numeroSemestre];
    materiasDelSemestre.forEach(materia => {
        contenedor.innerHTML += `
            <div class="tarjeta" style="display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;">
                <h4 style="margin: 0; color: #333333; font-family: Arial, sans-serif; font-size: 15px;">${materia}</h4>
            </div>
        `;
    });

    // logica para mostrar u ocultar materias optativas solo en 8vo
    let seccionOptativas = document.getElementById('seccion-optativas');
    if (seccionOptativas) {
        seccionOptativas.style.display = (numeroSemestre === 8) ? "block" : "none";
    }
};

// consumo de api real de clima
function iniciarBotonAPI() {
    // creacion del boton en el dom
    const botonApi = document.createElement('button');
    
    // usamos innerHTML para poder inyectar la etiqueta del icono de FontAwesome
    botonApi.innerHTML = '<i class="fa-solid fa-cloud-sun" style="margin-right: 5px;"></i> Clima UNSIJ'; 
    
    botonApi.style.cssText = "position: fixed; bottom: 20px; right: 20px; background-color: #064e3b; color: white; border: none; padding: 12px 20px; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 2000; font-weight: bold; font-family: Arial, sans-serif; transition: all 0.3s ease;";
    
    botonApi.onmouseover = () => botonApi.style.transform = "scale(1.1)";
    botonApi.onmouseout = () => botonApi.style.transform = "scale(1)";

    document.body.appendChild(botonApi);

    // peticion async/await al hacer click
    botonApi.addEventListener('click', async () => {
        // cambiamos el icono mientras carga
        botonApi.innerHTML = '<i class="fa-solid fa-satellite-dish" style="margin-right: 5px;"></i> Consultando satelite...'; 

        try {
            // url de la api para ixtlan
            const urlApi = 'https://wttr.in/Ixtlan de Juarez,Oaxaca?format=j1';
            
            const respuesta = await fetch(urlApi);
            if (!respuesta.ok) throw new Error("Error en respuesta");
            
            const datos = await respuesta.json();

            // extraccion de datos
            const climaActual = datos.current_condition[0];
            const tempC = climaActual.temp_C; 
            const descripcion = climaActual.lang_es ? climaActual.lang_es[0].value : climaActual.weatherDesc[0].value;
            const humedad = climaActual.humidity;

            // reporte en alerta plana
            alert(`REPORTE DEL CLIMA EN LA UNSIJ\n\nEstado: ${descripcion.toUpperCase()}\nTemperatura: ${tempC}°C\nHumedad: ${humedad}%\n\nDatos consultados en tiempo real.`);
            
        } catch (error) {
            console.error(error);
            alert("Hubo un error al conectar con el servidor meteorologico. Intentalo mas tarde.");
        } finally {
            // restauramos el icono original cuando termina
            botonApi.innerHTML = '<i class="fa-solid fa-cloud-sun" style="margin-right: 5px;"></i> Clima UNSIJ'; 
        }
    });
}

function iniciarModalesLaborales() {
    //todas las descripciones
    const descripciones = {
        "Científico de Datos": "Analiza grandes volúmenes de datos usando estadística y programación para extraer información clave que ayude en la toma de decisiones estratégicas de una empresa.",
        "Ingeniero de ML": "Diseña, entrena y despliega modelos de Machine Learning (Aprendizaje Automático) para que los sistemas puedan aprender y mejorar sin ser programados explícitamente.",
        "Arquitecto de IA": "Define la estructura general de los sistemas de inteligencia artificial, decidiendo qué tecnologías, servidores y algoritmos usar para resolver un problema a gran escala.",
        "Especialista en NLP": "Desarrolla algoritmos que permiten a las computadoras entender, interpretar y generar lenguaje humano (como lo hace ChatGPT o Siri).",

        "Arquitecto de Software": "Es el 'maestro de obra' del código. Toma decisiones de alto nivel sobre el diseño del sistema, las bases de datos y los estándares técnicos a seguir por los programadores.",
        "DevOps Lead": "Une el desarrollo (Dev) con las operaciones (Ops). Automatiza la entrega de código, gestiona servidores en la nube y asegura que las actualizaciones no rompan el sistema.",
        "Fullstack Expert": "Un desarrollador versátil que domina tanto la parte visual de una aplicación (Frontend) como la lógica oculta del servidor y las bases de datos (Backend).",
        "QA Automation": "Escribe código cuyo único propósito es probar automáticamente el software de otros desarrolladores para encontrar errores (bugs) antes de que lleguen al usuario final.",

        "Analista SOC": "Monitorea constantemente las redes y sistemas de una empresa desde un Centro de Operaciones de Seguridad para detectar y detener ciberataques en tiempo real.",
        "Pentester": "Un 'hacker ético' contratado legalmente para intentar vulnerar los sistemas de una empresa y así encontrar sus fallos de seguridad antes de que lo haga un criminal.",
        "Auditor Forense": "Investiga los ciberataques después de que ocurren. Rastrea la huella digital para descubrir cómo entraron los atacantes y qué información exacta fue comprometida.",
        "Consultor CISO": "Asesora a las empresas sobre políticas de seguridad, cumplimiento de leyes de protección de datos y estrategias a nivel gerencial para proteger su información.",

        "Ingeniero de Robótica": "Diseña, construye y programa robots físicos, integrando sensores, motores y código avanzado para que puedan interactuar con el mundo real de forma autónoma.",
        "Especialista en IoT": "Conecta dispositivos cotidianos (desde sensores agrícolas hasta maquinaria industrial) a internet para recolectar datos masivos y controlarlos a distancia.",
        "Control de Automatización": "Diseña y programa sistemas para que las fábricas y procesos industriales funcionen de manera automática, eficiente y con mínima intervención humana.",
        "Desarrollador ROS": "Crea software utilizando el Robot Operating System (ROS), el estándar mundial para programar el 'cerebro' y la navegación de robots complejos."
    };

  
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-contenido">
            <button class="modal-cerrar" title="Cerrar"><i class="fa-solid fa-xmark"></i></button>
            <h3 id="modal-titulo" style="color: #064e3b; margin-top: 0; font-family: Arial, sans-serif; display: flex; align-items: center; gap: 10px;"></h3>
            <p id="modal-desc" style="color: #4b5563; line-height: 1.6; margin-bottom: 0;"></p>
        </div>
    `;
    document.body.appendChild(modal);

    const etiquetas = document.querySelectorAll('.etiqueta-campo');
    const btnCerrar = modal.querySelector('.modal-cerrar');
    const titulo = modal.querySelector('#modal-titulo');
    const desc = modal.querySelector('#modal-desc');

    // 4. agregamos el evento clic a cada etiqueta
    etiquetas.forEach(etiqueta => {
        etiqueta.addEventListener('click', () => {
            const cargo = etiqueta.innerText.trim();
            
            // inyectamos el titulo y la descripcion correspondiente
            titulo.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${cargo}`;
            desc.innerText = descripciones[cargo] || "Descripción detallada no disponible por el momento.";
            
            // mostramos el modal
            modal.classList.add('activo');
        });
    });

    // 5. logica para cerrar el modal
    btnCerrar.addEventListener('click', () => modal.classList.remove('activo'));
    
    // permite cerrar dando clic afuera de la cajita blanca
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('activo');
    });
}