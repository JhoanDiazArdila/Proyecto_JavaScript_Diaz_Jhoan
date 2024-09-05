const cantidadParqueaderos = 25
const boton_Registro_Entrada= document.querySelector("#registro_entrada");
const boton_Registro_Salida= document.querySelector("#registro_salida");
const boton_Registro_Modificar= document.querySelector("#registro_modificar");
const boton_Ver_Ocupacion= document.querySelector("#registro_ocupacion");
const boton_Ver_Total= document.querySelector("#ver_registro");

const cobroMoto = "5000";
const cobroCarro = "15000";
const cobroCamioneta = "20000";
const cobroMicroBus = "30000";
const cobroBus = "40000";

const botonesHeader = document.querySelectorAll(".navegacion");
const formularioEntrada = document.querySelector("#entrada_formulario");







function mostrar_Formulario_Entrada(){
    formularioEntrada.classList.remove("contenedor-ocupacion");
    formularioEntrada.classList.add("contenedor-formulario");
    const seccion_entrada = document.createElement("section");
    seccion_entrada.classList.add("formulario");
    seccion_entrada.innerHTML= `
        <p class="Titulo-contactame">Registrar Vehiculo</p>
        <form id="registroVehiculo">
            <div class="titulos-form">
                <label for="placa">Placa:</label><br>
            </div>
            <div>
                <input type="text" id="placa" name="placa" placeholder=" Ej: HAX777" pattern="[A-Z]{3}[0-9]{3}" title="Formato: ABC123" required><br>
            </div>
            <div class="titulos-form">
                <label>Tipo de Vehículo:</label>
            </div>
            <div id="tipoVehiculo-form">
                <input type="radio" id="moto" name="tipoVehiculo" value="Moto" required>
                <label for="moto">Moto</label><br>
                <input type="radio" id="carro" name="tipoVehiculo" value="Carro" required>
                <label for="carro">Carro</label><br>
                <input type="radio" id="camioneta" name="tipoVehiculo" value="Camioneta" required>
                <label for="camioneta">Camioneta</label><br>
                <input type="radio" id="microbus" name="tipoVehiculo" value="Micro-Bus" required>
                <label for="microbus">Micro Bus</label><br>
                <input type="radio" id="bus" name="tipoVehiculo" value="Bus" required>
                <label for="bus">Bus</label><br><br>
            </div>
            
            <input type="submit" value="Registrar">
        </form>
    `;
    formularioEntrada.append(seccion_entrada);

    // Evento submit del formulario
    document.getElementById('registroVehiculo').addEventListener('submit', function(event) {
        event.preventDefault();

        var nuevoVehiculo = {
            placa: document.getElementById('placa').value,
            tipo: document.querySelector('input[name="tipoVehiculo"]:checked').value,
            entradaMostrar: actualizarHoraActual(), // Se registra la hora actual
            entrada: Registro_Hora(),
            salida: null
        };

        // Obtener los datos actuales de la API para realizar las verificaciones
        fetch('https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/registro/')
            .then(response => response.json())
            .then(vehiculos=> {
                // console.log(vehiculos);
                registrarVehiculo(nuevoVehiculo, vehiculos);
                document.getElementById('registroVehiculo').reset(); 
                alert("Vehículo registrado exitosamente");
                // location.reload(); // Recargar la página
            })
            .catch(error => {
                console.log('Error al obtener los datos: ' + error);
            });
    });
}

//Esta funcion captura la hora en un momento especifico para mostrar al usuario
function actualizarHoraActual(){
    const ahora = new Date();
    const year = ahora.getFullYear();
    const month = (ahora.getMonth()+1).toString().padStart(2, "0");
    const day = ahora.getDate().toString().padStart(2, "0");
    const horas = ahora.getHours().toString().padStart(2,"0");
    const minutos = ahora.getMinutes().toString().padStart(2,"0");
    const horaActual = `${year}-${month}-${day}/${horas}:${minutos}`;
    return horaActual;
}
    //Esta funcion captura la hora en un momento especifico Para Calculo de pago
function Registro_Hora(){
    let Hora_Actual = new Date()
    return Hora_Actual
}


// ------------------------Funciones Registrar Entrada -----

// Función para verificar si la placa ya existe en los vehículos registrados
function verificarPlacaExistente(vehiculos, placa) {
    return vehiculos.some(vehiculo => vehiculo.placa === placa);
}
// Función para encontrar y asignar el primer puesto disponible
function verificarYAsignarPuesto(vehiculos) {
    // Crear un array de puestos ocupados
    const puestosOcupados = vehiculos.map(vehiculo => parseInt(vehiculo.puesto));
    
    // Encontrar el primer puesto disponible
    for (let i = 1; i <= cantidadParqueaderos; i++) {
        if (!puestosOcupados.includes(i)) {
            return i; // Retorna el primer puesto disponible
        }
    }
    return null; // Si no hay puestos disponibles
}
// Función para registrar el nuevo vehículo
function registrarVehiculo(nuevoVehiculo, vehiculos) {
    // Verificar si la placa ya existe
    if (verificarPlacaExistente(vehiculos, nuevoVehiculo.placa)) {
        alert('Error: La placa ya está registrada.');
        return;
    }
    // Asignar un puesto disponible
    const puestoAsignado = verificarYAsignarPuesto(vehiculos);
    
    if (puestoAsignado === null) {
        alert('No hay disponibilidad de puestos.');
        return;
    }
    // Agregar el puesto asignado y disponibilidad
    nuevoVehiculo.puesto = puestoAsignado;
    nuevoVehiculo.disponible = false;

    // Hacer la solicitud POST a la API
    fetch('https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/registro/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoVehiculo)
    })
    .then(response => response.json())
    .then(data => {
        var tiquet=`\n
            Placa: ${data.placa}\n
            Tipo: ${data.tipo}\n
            Puesto: ${data.puesto}\n
            Entrada: ${data.entradaMostrar}\n
            Un lugar seguro, a disfrutar... <3
            `;
        alert('Registro exitoso: ' + tiquet);
    })
    .catch(error => {
        alert('Error en el registro: ' + error);
        console.log('Error en el registro: ' + error);
    });
}


// ---------------------------- Formulario Salida


function mostrar_Formulario_Salida(){
    formularioEntrada.classList.remove("contenedor-ocupacion");
    formularioEntrada.classList.add("contenedor-formulario");
    const seccion_salida= document.createElement("section");
    seccion_salida.classList.add("formulario");
    seccion_salida.innerHTML= `
        <p class="Titulo-contactame">Registrar Salida</p>
        <form id="registroSalida">
            <div class="titulos-form">
                <label for="placa">Placa:</label><br>
            </div>
            <div>
                <input type="text" id="placa" name="placa" placeholder=" Ej: HAX777" pattern="[A-Z]{3}[0-9]{3}" title="Formato: ABC123">
            </div>
            <article class="separador"> 
                Opcion Adicional            
            </article>
            <div class="titulos-form">
                <label for="puesto">Puesto:</label><br>
            </div>
            <div>
                <input type="text" id="puesto" name="puesto" placeholder="99 o 2"><br>
            </div>
            <input type="submit" value="Registrar">
        </form>
    `;
    formularioEntrada.append(seccion_salida);

    // Evento submit del formulario
    document.getElementById('registroSalida').addEventListener('submit', function(event) {
        event.preventDefault();
        var nuevoVehiculo={};

        if (document.getElementById('puesto').value === "" && document.getElementById('placa').value === ""){
            alert("No registro ningun valor para busqueda");
            return;
        }else if (document.getElementById('puesto').value === ""){
            nuevoVehiculo = {
                placa: document.getElementById('placa').value,
                salida: Registro_Hora(),
                salidaMostrar: actualizarHoraActual(),
            };
        }else if (document.getElementById('placa').value === ""){
            nuevoVehiculo = {
                puesto: document.getElementById('puesto').value,
                salida: Registro_Hora(),
                salidaMostrar: actualizarHoraActual(),
            };
        }else{
            nuevoVehiculo = {
                placa: document.getElementById('placa').value,
                puesto: document.getElementById('puesto').value,
                salida: Registro_Hora(),
                salidaMostrar: actualizarHoraActual(),
            };
        }
        
        console.log(nuevoVehiculo);

        // Obtener los datos actuales de la API para realizar las verificaciones
        fetch('https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/registro/')
            .then(response => response.json())
            .then(vehiculosSalida =>{
                console.log(vehiculosSalida);
                registrarSalida_vehiculo(nuevoVehiculo, vehiculosSalida);
                document.getElementById('registroSalida').reset(); 
                alert("Vehículo registrado exitosamente");
                // location.reload(); // Recargar la página
            })
            .catch(error => {
                alert('Error al obtener los datos: ' + error);
                console.log('Error al obtener los datos: ' + error);
            });
    });
}

// ------------------Funciones Registrar Salida -----

function Diferencia_Entrada_Salida(Tentrada , Tsalida){
    let Entrada = new Date(Tentrada)
    let Salida = new Date(Tsalida)
    const diferencia = Salida - Entrada
    const diferenciaMinutos = Math.floor(diferencia / (1000 * 60));
    console.log(diferenciaMinutos)
    return diferenciaMinutos
}

function ValorPagar(entrada,salida,tipo){
    var tiempoAcobrar= Diferencia_Entrada_Salida(entrada, salida);
    var verificarTipo= tipo;
    console.log(tipo);
    var pagar;

    switch(verificarTipo){
        case "Moto":
            pagar= cobroMoto * (tiempoAcobrar / 60);
            break;
        case "Carro":
            pagar= cobroCarro * (tiempoAcobrar / 60);
            break;
        case "Camioneta":
            pagar= cobroCamioneta * (tiempoAcobrar / 60);
            break;
        case "Micro-Bus":
            pagar= cobroMicroBus * (tiempoAcobrar / 60);
            break;
        case "Bus":
            pagar= cobroBus * (tiempoAcobrar / 60);
            break;
        default:
            pagar = 0; // Valor por defecto si no coincide ningún tipo
            console.log('Tipo de vehículo no reconocido.');
    }
    var pagarEnCOP = pagar.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    console.log(pagarEnCOP);
    return pagarEnCOP;
}

function verificarPlacaExistenteSalida(vehiculosSalida, placa) {
    return vehiculosSalida.some(vehiculo => vehiculo.placa === placa);
}
function verificarpuestoExistenteSalida(vehiculosSalida,puesto){
    return vehiculosSalida.some(vehiculo => vehiculo.puesto === puesto);
}

const URL= "https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/Visitas/"
async function obtenerClientes(url){
    try{
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const clientes = await response.json();
        return clientes
    } catch(error){
        console.log("Error al obtener catalogo: ",error);
    }
}
function tiquetes(vehiculo_Encontrado,nuevoVehiculo){
    var tiquet=`\n
        Placa: ${vehiculo_Encontrado.placa}\n
        Tipo: ${vehiculo_Encontrado.tipo}\n
        Puesto: ${vehiculo_Encontrado.puesto}\n
        Entrada: ${vehiculo_Encontrado.entradaMostrar}\n
        Salida: ${nuevoVehiculo.salidaMostrar}\n
        Pago: ${nuevoVehiculo.pago}\n
        Un lugar seguro, a disfrutar... <3
        `;
    alert('Registro exitoso: ' + tiquet);
}

async function registrarSalida_vehiculo(nuevoVehiculo, vehiculosSalida){
// ----------------- Buscar informacion clientes validaciones
    let clientes = await obtenerClientes(URL)
    console.log(clientes);
// ----------------- Validaciones
    var pagarEnCOP=0;
    var vehiculoPlaca= undefined;
    var vehiculoPuesto =undefined;
    var vehiculo_Encontrado= undefined;
    if(!nuevoVehiculo.puesto){
        if (verificarPlacaExistenteSalida(vehiculosSalida, nuevoVehiculo.placa)) {
            vehiculoPlaca= vehiculosSalida.find(vehiculo=>vehiculo.placa===nuevoVehiculo.placa);
            console.log(vehiculoPlaca);
            vehiculo_Encontrado=vehiculoPlaca;
        }else{
            alert('Error: La placa NO está registrada.');
            return;
        };
    }else{
        if (verificarpuestoExistenteSalida(vehiculosSalida, nuevoVehiculo.puesto)){
            vehiculoPuesto = vehiculosSalida.find(vehiculo=>vehiculo.puesto===nuevoVehiculo.puesto);
            console.log(vehiculoPuesto);
            vehiculo_Encontrado=vehiculoPuesto;
        }else{
            alert('Error: El vehículo NO se encuentra en la posición seleccionada.');
            return;
        };
    }
    pagarEnCOP=ValorPagar(vehiculo_Encontrado.entrada,nuevoVehiculo.salida,vehiculo_Encontrado.tipo);
    alert("El valor a pagar es: " + pagarEnCOP);
    nuevoVehiculo.pago = pagarEnCOP;
    tiquetes(vehiculo_Encontrado,nuevoVehiculo);
    var guardado=0;
    var placa=vehiculo_Encontrado.placa;
    if (!clientes.some(cliente=> cliente.hasOwnProperty(placa))){
        console.log("No hay");
        guardado=1;
        var placaCliente = {
            [placa]:[{
                "Entrada": vehiculo_Encontrado.entradaMostrar,
                "Salida": nuevoVehiculo.salidaMostrar,
                "Pago": nuevoVehiculo.pago,
                "Puesto": vehiculo_Encontrado.puesto,
                "Tipo": vehiculo_Encontrado.tipo,
            }]
        };
    }else{
        console.log("SI hay");
        guardado=2;
        var placaCliente=clientes.find(cliente=>cliente.hasOwnProperty(placa));
        var autoGuardar = {
            "Entrada": vehiculo_Encontrado.entradaMostrar,
            "Salida": nuevoVehiculo.salidaMostrar,
            "Pago": nuevoVehiculo.pago,
            "Puesto": vehiculo_Encontrado.puesto,
            "Tipo": vehiculo_Encontrado.tipo,
        };
        placaCliente[placa].push(autoGuardar);
        console.log(placaCliente);
    }
    console.log("for")
    var clienteID = null;
    for (var i = 0; i < clientes.length; i++) {
        if (clientes[i][placa]) {
            clienteID = clientes[i].cliente;
            break;
        }
    }
    console.log(clienteID);
    if (guardado===1){
        fetch('https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/Visitas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(placaCliente)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log('Error en el registro: ' + error);
        });
    }else if(guardado===2){
        fetch('https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/Visitas/'+clienteID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(placaCliente)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log('Error en el registro: ' + error);
        });
    }
    var eliminar=vehiculo_Encontrado.puesto

    fetch('https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/registro/'+eliminar, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(alert("Vehiculo marcado en salida y espacio disponible"))
    .catch(error => {
        console.log('Error en el registro: ' + error);
    });
}


// ---------------Modificar datos en Casa

const url1= "https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/registro/"
async function obtenerVehiculoenCasa(url){
    try{
        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const clientes = await response.json();
        return clientes
    } catch(error){
        console.log("Error al obtener catalogo: ",error);
    }
}
function infoModificar(nuevaPlaca, nuevoTipo, encontradoModificar) {
    if (nuevaPlaca !== "" && nuevoTipo !== "") {
        encontradoModificar.placa = nuevaPlaca;
        encontradoModificar.tipo = nuevoTipo;
    } else if (nuevaPlaca !== "") {
        encontradoModificar.placa = nuevaPlaca;
    } else if (nuevoTipo !== "") {
        encontradoModificar.tipo = nuevoTipo;
    }
    return encontradoModificar;
}

async function tablaModificarDatos(){
    formularioEntrada.classList.remove("contenedor-ocupacion");
    formularioEntrada.classList.add("contenedor-formulario");
    let parqueados = await obtenerVehiculoenCasa(url1)
    const seccion_salida= document.createElement("section");
    seccion_salida.classList.add("formulario");
    seccion_salida.innerHTML= `
        <p class="Titulo-contactame">Modificar Datos</p>
        <form id="tablaModificar">
            <div class="titulos-form">
                <label for="placa">Buscar por Placa:</label><br>
            </div>
            <div>
                <input type="text" id="placa" name="placa" placeholder=" Ej: HAX777" pattern="[A-Z]{3}[0-9]{3}" title="Formato: ABC123">
            </div>
            <article class="separador"> 
                Opcion Adicional            
            </article>
            <div class="titulos-form">
                <label for="puesto">Buscar por Puesto:</label>
            </div>
            <div>
                <input type="text" id="puesto" name="puesto" placeholder="99 o 2"><br>
            </div>
            <div class="titulos-form">
                <label for="Nuevaplaca">Nueva Placa:</label><br>
            </div>
            <div>
                <input type="text" id="Nuevaplaca" name="placa" placeholder=" Ej: HAX777" pattern="[A-Z]{3}[0-9]{3}" title="Formato: ABC123">
            </div>
            <div class="titulos-form">
                <label>Cambio de Tipo de Vehículo:</label>
            </div>
            <div id="tipoVehiculo-form">
                <input type="radio" id="moto" name="tipoVehiculo" value="Moto">
                <label for="moto">Moto</label><br>
                <input type="radio" id="carro" name="tipoVehiculo" value="Carro">
                <label for="carro">Carro</label><br>
                <input type="radio" id="camioneta" name="tipoVehiculo" value="Camioneta" >
                <label for="camioneta">Camioneta</label><br>
                <input type="radio" id="microbus" name="tipoVehiculo" value="Micro-Bus" >
                <label for="microbus">Micro Bus</label><br>
                <input type="radio" id="bus" name="tipoVehiculo" value="Bus" >
                <label for="bus">Bus</label><br><br>
            </div>
            <input type="submit" value="Registrar">
        </form>
    `;
    formularioEntrada.append(seccion_salida);

    // Evento submit del formulario
    document.getElementById('tablaModificar').addEventListener('submit', function(event) {
        event.preventDefault();

        var modificar={}
        var placaGuardada=document.getElementById('placa').value;
        var puestoGuardado=document.getElementById('puesto').value;
        var nuevaPlaca=document.getElementById("Nuevaplaca").value; 
        var nuevoTipo=document.querySelector('input[name="tipoVehiculo"]:checked').value;
        var encontradoModificar= undefined;

        if (puestoGuardado === "" && placaGuardada === ""){
            alert("No registro ningun valor para busqueda");
            return;
        }else if (puestoGuardado === ""){
            if(verificarPlacaExistente(parqueados, placaGuardada)){
                console.log("Encontro PLACA");
                if(!verificarPlacaExistente(parqueados, nuevaPlaca)){
                    encontradoModificar = parqueados.find(vehiculo=>vehiculo.placa === placaGuardada);
                    modificar = infoModificar (nuevaPlaca,nuevoTipo,encontradoModificar);
                }else{
                    alert("La placa ya existe");
                }
            }else{
                alert("La placa no existe");
            }
        }else if (placaGuardada === ""){
            if(verificarpuestoExistenteSalida(parqueados,puestoGuardado)){
                console.log("Encontro PUESTO");
                encontradoModificar = parqueados.find(vehiculo=>vehiculo.puesto === puestoGuardado);
                modificar=infoModificar (nuevaPlaca,nuevoTipo,encontradoModificar);
            }else{
                alert("El puesto no existe");
            }
        }
        console.log(modificar);
        var modificarPorID= encontradoModificar.puesto;
        console.log(modificarPorID)

// ----------------------------------------HACER cambio en el Api

        fetch('https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/registro/'+modificarPorID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modificar)
        })
        .then(response => response.json())
        .then(data => {
            alert('Actualización exitosa:', data),
            document.getElementById('tablaModificar').reset(); 
            alert("Vehículo registrado exitosamente");
            // location.reload(); // Recargar la página
        })
        .catch(error => {
            console.log('Error en el registro: ' + error);
        });
    });
}

// ------------------------- Ver Ocupacion

function ocupacion (){
    for(let i = 1; i<=cantidadParqueaderos ; i++){
        fetch(url1 + i)
            .then((response) => {
                if (!response.ok) {
                    // Si la respuesta no es correcta, lanzamos un error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => mostrarOcupacion (data))
            .catch(error => {
                console.error(`Error fetching data for person ${i}:`, error);
            });
    }
}

async function mostrarOcupacion (data){
    // let parqueados = await obtenerVehiculoenCasa(url1)
    formularioEntrada.classList.remove("contenedor-formulario");
    formularioEntrada.classList.add("contenedor-ocupacion");
    const div = document.createElement("div");
    div.classList.add("busqueda-todos");
    div.id="listabusqueda";
    div.innerHTML = `
        <div class="tarjeta">
            <div class="busqueda-imagen">
                <img src="./imagenes/enCasa.png" alt="Personajes" class="Logos" />
            </div>
            <div class="tarjeta-info">
                <div class="nombre-contenedor">
                    <p class="busqueda-nombre">Placa:<br>${data.placa}</p>
                </div>
                <div class="contenedor-primer-dato">
                    <p class="primer-dato">Tipo:<br>${data.tipo}</p>
                </div>
                <div class="contenedor-segundo-dato">
                    <p class="segundo-dato">Puesto:<br>${data.puesto}</p>
                </div>
                <div class="contenedor-primer-dato">
                    <p class="primer-dato">Entrada :<br>${data.entradaMostrar}</p>
                </div>
            </div>
        </div>
        `;
        formularioEntrada.append(div);
}


// ------------------------- Ver Historial

const url2= "https://66d4a1a25b34bcb9ab3f1a5d.mockapi.io/api/v1/Visitas/"
async function obtenerHistorialporID(clientes){
    for(let i = 1; i<=clientes.length ; i++){
        fetch(url2 + i)
            .then((response) => {
                if (!response.ok) {
                    // Si la respuesta no es correcta, lanzamos un error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            // .then(cliente => mostrarHistorial_x_Cliente (cliente))
            .catch(error => {
                console.error(`Error fetching data for person ${i}:`, error);
            });
    }
}



async function mostrarTablaHistorial (){
    formularioEntrada.classList.remove("contenedor-ocupacion");
    formularioEntrada.classList.add("contenedor-formulario");
    // let historial = await obtenerHistorial(url2)

    const article = document.createElement("article");
    article.classList.add("tabla-contenedor1");
    article.id="tabla-historial-clientes"
    article.innerHTML=`
            <div class="tabla-encabezado">
                <table class="tablaEditar">
                    <thead class="tablaEditarCabeza">
                        <tr>
                            <th>Placa</th>
                            <th>Tipo</th>
                            <th>Fecha de Entrada</th>
                            <th>Fecha de Salida</th>
                            <th>Puesto</th>
                            <th>Pago</th>
                        </tr>
                    </thead>
                    <tbody class="tablaEditarBody"></tbody>
                </table>
            </div>
        `;
        formularioEntrada.append(article);

        mostrarHistorial_x_Cliente ();
}

async function mostrarHistorial_x_Cliente (){

    let clientes = await obtenerClientes(URL);
    console.log(clientes);

    const tbody = document.querySelector(".tablaEditarBody")

    clientes.forEach(cliente => {
        var placas = Object.keys(cliente).filter(key => key !== 'cliente');
        console.log(cliente);
        console.log(placas);
        placas.forEach(placa=>{
            cliente[placa].forEach(visita=>{
                const fila = document.createElement("tr");
                fila.innerHTML=`
                    <td>${placa}</td>
                    <td>${visita.Tipo}</td>
                    <td>${visita.Entrada}</td>
                    <td>${visita.Salida}</td>
                    <td>${visita.Puesto}</td>
                    <td>${visita.Pago}</td>
                `;

                if (tbody) {
                    tbody.appendChild(fila); 
                } else {
                    console.error("El tbody para la tabla no fue encontrado.");
                }
                console.log("complete 1 cliente");
            });
        });
    });
    console.log("Llegue al final");
}


function mostrarInicio(){
    formularioEntrada.classList.remove("contenedor-ocupacion");
    formularioEntrada.classList.add("contenedor-formulario");
    const imagen = document.createElement("img");
    imagen.id="fondo-entrada"
    imagen.src = "imagenes/fondo-entrada.png";
    formularioEntrada.append(imagen);
    const imagen2 = document.createElement("img");
    imagen2.id="nombre-parkeo"
    imagen2.src = "imagenes/Nombre-parkeo.png";
    formularioEntrada.append(imagen2);
}










botonesHeader.forEach(boton=> boton.addEventListener("click",(event)=>{
    const botonId = event.currentTarget.id;
    formularioEntrada.classList.remove("contenedor-ocupacion");
    formularioEntrada.classList.add("contenedor-formulario");
    formularioEntrada.innerHTML="";
    // descripcion.innerHTML="";

    switch(botonId){
        case "registro_entrada":
            mostrar_Formulario_Entrada();
            break;
        case "registro_salida":
            mostrar_Formulario_Salida();
            break;
        case "registro_modificar":
            tablaModificarDatos();
            break;
        case "registro_ocupacion":
            ocupacion ();
            break;
        case "ver_registro":
            mostrarTablaHistorial ();
            break;
        case "otra-imagen":
            mostrarInicio();
            break;
    }
}));






            // <div class="tabla-datos">
            //     <table>
            //         <tbody>
            //             <tr>
            //                 <td>ABC123</td>
            //                 <td>Carro</td>
            //                 <td>01/09/2024</td>
            //                 <td>08:00 AM</td>
            //                 <td>10</td>
            //             </tr>
            //             <tr>
            //                 <td>DEF456</td>
            //                 <td>Moto</td>
            //                 <td>01/09/2024</td>
            //                 <td>08:30 AM</td>
            //                 <td>22</td>
            //             </tr>
            //         </tbody>
            //     </table>
            // </div>
        






