function saludar() {
    alert("¡Bienvenido al nuevo portal de Smart Systems!");
}

function verDetalles(nombreMateria) {
    alert("Has seleccionado la materia: " + nombreMateria + ".\nAquí mostraremos los créditos y el temario próximamente.");
}

function validarFormulario(evento) {
    evento.preventDefault();
    
    let nombre = document.getElementById('nombre').value;
    
    if (nombre !== "") {
        alert("¡Excelente " + nombre + "! Tus datos han sido enviados correctamente.");
        document.getElementById('nombre').value = "";
        document.getElementById('correo').value = "";
    }
}