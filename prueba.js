document.addEventListener('DOMContentLoaded', function () {
    const verVehiculosBtn = document.getElementById('editarInformacion');

    if (verVehiculosBtn) {
        verVehiculosBtn.addEventListener('click', mostrarVehiculosParqueados);
    } else {
        console.error('Botón "verVehiculos" no encontrado');
    }
});

function mostrarVehiculosParqueados() {
    ocultarYLimpiarSecciones();

    let listaVehiculos = document.getElementById('listaVehiculos');

    fetch('https://66d54307f5859a7042656650.mockapi.io/api/p1/puestos/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(vehiculos => {
            if (vehiculos.length > 0) {
                const template = document.getElementById('tablaListaParqueadero');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    const cuerpoTabla = clone.querySelector('#cuerpoTabla');
                    const buscadorBtn = clone.querySelector('#buscado');
                    const buscadorInput = clone.querySelector('#buscador');

                    if (cuerpoTabla && buscadorBtn && buscadorInput) {
                        // Limpiar tabla previa
                        cuerpoTabla.innerHTML = '';

                        vehiculos.forEach(vehiculo => {
                            const row = document.createElement('tr');
                            row.innerHTML = 
                                `<td>${vehiculo.placa}</td>
                                <td>${vehiculo.tipo}</td>
                                <td>${new Date(vehiculo.entrada).toLocaleDateString()}</td>
                                <td>${new Date(vehiculo.entrada).toLocaleTimeString()}</td>
                                <td>${vehiculo.puesto}</td>
                                <td><button class="editar-btn" data-id="${vehiculo.id}">
                                    <ion-icon name="pencil-sharp"></ion-icon></button></td>`;
                            cuerpoTabla.appendChild(row);
                        });

                        // Asignar event listener al botón de búsqueda
                        buscadorBtn.addEventListener('click', function() {
                            buscarVehiculosPorPlaca(buscadorInput);
                        });

                        // Asignar event listener a los botones de editar
                        const editarBtns = clone.querySelectorAll('.editar-btn');
                        editarBtns.forEach(btn => {
                            btn.addEventListener('click', function() {
                                const id = btn.getAttribute('data-id');
                                cargarInformacionVehiculo(id);
                            });
                        });

                        listaVehiculos.innerHTML = ''; // Limpiar contenido previo
                        listaVehiculos.appendChild(clone);
                    } else {
                        console.error('No se encontraron los elementos necesarios en el template');
                    }
                } else {
                    console.error('No se encontró el template con el ID "tablaListaParqueadero"');
                }
            } else {
                listaVehiculos.innerHTML = '<p>No hay vehículos parqueados.</p>';
            }

            listaVehiculos.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar los vehículos:', error);
            listaVehiculos.innerHTML = '<p>Error al cargar los vehículos.</p>';
            listaVehiculos.style.display = 'block';
        });
}

function buscarVehiculosPorPlaca(buscadorInput) {
    ocultarYLimpiarSecciones();

    let listaVehiculos = document.getElementById('listaVehiculos');
    let placaBuscada = buscadorInput.value.trim().toUpperCase();

    fetch('https://66d54307f5859a7042656650.mockapi.io/api/p1/puestos/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(vehiculos => {
            const vehiculosFiltrados = vehiculos.filter(vehiculo => 
                vehiculo.placa.toUpperCase().includes(placaBuscada)
            );

            if (vehiculosFiltrados.length > 0) {
                const template = document.getElementById('tablaListaParqueadero');
                if (template) {
                    const clone = template.content.cloneNode(true);
                    const cuerpoTabla = clone.querySelector('#cuerpoTabla');

                    if (cuerpoTabla) {
                        // Limpiar tabla previa
                        cuerpoTabla.innerHTML = '';

                        vehiculosFiltrados.forEach(vehiculo => {
                            const row = document.createElement('tr');
                            row.innerHTML = 
                                `<td>${vehiculo.placa}</td>
                                <td>${vehiculo.tipo}</td>
                                <td>${new Date(vehiculo.entrada).toLocaleDateString()}</td>
                                <td>${new Date(vehiculo.entrada).toLocaleTimeString()}</td>
                                <td>${vehiculo.puesto}</td>
                                <td><button class="editar-btn" data-id="${vehiculo.puesto}">
                                    <ion-icon name="pencil-sharp"></ion-icon></button></td>`;
                            cuerpoTabla.appendChild(row);
                        });

                        listaVehiculos.innerHTML = ''; // Limpiar contenido previo
                        listaVehiculos.appendChild(clone);

                        // Asignar event listener a los botones de editar
                        const editarBtns = clone.querySelectorAll('.editar-btn');
                        editarBtns.forEach(btn => {
                            btn.addEventListener('click', function() {
                                const id = btn.getAttribute('data-id');
                                cargarInformacionVehiculo(id);
                            });
                        });
                    } else {
                        console.error('No se encontró el elemento #cuerpoTabla en el template');
                    }
                } else {
                    console.error('No se encontró el template con el ID "tablaListaParqueadero"');
                }
            } else {
                listaVehiculos.innerHTML = '<p>No se encontraron vehículos con esa placa.</p>';
            }

            listaVehiculos.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar los vehículos:', error);
            listaVehiculos.innerHTML = '<p>Error al cargar los vehículos.</p>';
            listaVehiculos.style.display = 'block';
        });
}

function cargarInformacionVehiculo(id) {
    fetch(https://66d54307f5859a7042656650.mockapi.io/api/p1/puestos/${id})
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la red');
            }
            return response.json();
        })
        .then(vehiculo => {
            if (vehiculo) {
                // Mostrar la tarjeta de edición
                const tarjetaEdicion = document.getElementById('tarjetaEdicion');
                if (tarjetaEdicion) {
                    // Asignar los valores del vehículo a la tarjeta de edición
                    tarjetaEdicion.querySelector('#placa').value = vehiculo.placa;
                    tarjetaEdicion.querySelector('#tipo').value = vehiculo.tipo;
                    tarjetaEdicion.querySelector('#entrada').value = new Date(vehiculo.entrada).toISOString().slice(0, 16); // Formato para input de fecha y hora
                    tarjetaEdicion.querySelector('#puesto').value = vehiculo.puesto;

                    // Mostrar la tarjeta de edición
                    tarjetaEdicion.style.display = 'block'; // Asegurarse de que la tarjeta sea visible

                    // Esperar unos segundos y luego actualizar la tarjeta con la información del vehículo
                    setTimeout(() => {
                        actualizarTarjeta(id);
                    }, 2000); // Esperar 2 segundos
                } else {
                    console.error('No se encontró el elemento #tarjetaEdicion en el DOM');
                }
            } else {
                console.error('Vehículo no encontrado');
            }
        })
        .catch(error => {
            console.error('Error al cargar la información del vehículo:', error);
            document.getElementById('listaVehiculos').innerHTML = '<p>Error al cargar la información del vehículo.</p>';
            document.getElementById('listaVehiculos').style.display = 'block';
        });
}

function actualizarTarjeta(id) {
    fetch(https://66d54307f5859a7042656650.mockapi.io/api/p1/puestos/${id})
        .then(response => response.json())
        .then(data => {
            console.log("Datos de la tarjeta obtenidos:", data);

            const placaElement = document.querySelector('#d_placa');
            const tipoElement = document.querySelector('#d_tipo');
            const fechaEntradaElement = document.querySelector('#d_fecha_e');
            const fechaSalidaElement = document.querySelector('#d_fecha_s');
            const imagenElement = document.querySelector('.img_tarjeta');

            if (placaElement && tipoElement && fechaEntradaElement && fechaSalidaElement && imagenElement) {
                placaElement.textContent = data.placa;
                tipoElement.textContent = data.tipo;
                fechaEntradaElement.textContent = new Date(data.entrada).toLocaleDateString();
                fechaSalidaElement.textContent = data.salida ? new Date(data.salida).toLocaleDateString() : 'No disponible';

                // Cambiar la imagen según el tipo de vehículo
                if (data.tipo === 'Moto') {
                    imagenElement.src = './imagenes/tarjetas/moto.png';
                } else if (data.tipo === 'Carro') {
                    imagenElement.src = './imagenes/tarjetas/carro.png';
                } else {
                    imagenElement.src = './imagenes/tarjetas/vans.png'; // Valor por defecto si no es ni moto ni carro
                }

                // Precios por tipo de vehículo
                const precioMoto = 20000;
                const precioCarro = 30000;
                const precioVans = 40000;

                // Función para calcular la diferencia en días entre dos fechas
                function calcularDiferenciaDias(fechaInicio, fechaFin) {
                    const fechaInicioObj = new Date(fechaInicio);
                    const fechaFinObj = new Date(fechaFin);
                    const diferenciaMs = fechaFinObj - fechaInicioObj;
                    return Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
                }

                // Calcular la diferencia en días
                const dias = calcularDiferenciaDias(data.entrada, data.salida);

                // Determinar el precio basado en el tipo de vehículo
                let precioPorDia;
                switch (data.tipo) {
                    case 'Moto':
                        precioPorDia = precioMoto;
                        break;
                    case 'Carro':
                        precioPorDia = precioCarro;
                        break;
                    case 'Vans':
                        precioPorDia = precioVans;
                        break;
                    default:
                        throw new Error("Tipo de vehículo no reconocido.");
                }

                // Calcular el costo total
                const costoTotal = dias * precioPorDia;

                // Mostrar los datos en la tarjeta
                const botonPago = document.querySelector('#boton_pago');
                botonPago.innerHTML = `Número de días: ${dias}<br>
                    Precio por día: ${precioPorDia}<br>
                    Valor a pagar: ${costoTotal}`;
                
                botonPago.addEventListener('click', function (event) {
                    event.preventDefault();
                    // Aquí puedes llamar a la función para manejar el pago o registrar el historial
                    // Por ejemplo, actualizacionHistorial(data, costoTotal, dias);
                });

            } else {
                console.error('Uno o más elementos del template no existen.');
            }
        })
        .catch(error => {
            console.error('Error al actualizar la tarjeta:', error);
        });
}








/OCULTAR Y LIPIAR/
function ocultarYLimpiarSecciones() {
    document.getElementById('formularioContainer').style.display = 'none';
    document.getElementById('formularioContainer').innerHTML = '';

    document.getElementById('listaVehiculos').style.display = 'none';
    document.getElementById('listaVehiculos').innerHTML = '';

    document.getElementById('editarVehiculo').style.display = 'none';
    document.getElementById('editarVehiculo').innerHTML = '';

    document.getElementById('registrarSalidaVehículo').style.display = 'none';
    document.getElementById('registrarSalidaVehículo').innerHTML = '';

    document.getElementById('listaHistorialVehiculos').style.display = 'none';
    document.getElementById('listaHistorialVehiculos').innerHTML = '';
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

    if(!nuevoVehiculo.puesto){
        var pagarEnCOP=0;
        var vehiculoPlaca= undefined;
        var vehiculoPuesto =undefined;
        var vehiculo_Encontrado= undefined;

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


}




        
        var pagarEnCOP=ValorPagar(vehiculoPlaca.entrada,nuevoVehiculo.salida,vehiculoPlaca.tipo);
        alert("El valor a pagar es: " + pagarEnCOP);
        nuevoVehiculo.pago = pagarEnCOP;
        var tiquet=`\n
            Placa: ${vehiculoPlaca.placa}\n
            Tipo: ${vehiculoPlaca.tipo}\n
            Puesto: ${vehiculoPlaca.puesto}\n
            Entrada: ${vehiculoPlaca.entradaMostrar}\n
            Salida: ${nuevoVehiculo.salidaMostrar}\n
            Pago: ${nuevoVehiculo.pago}\n
            Un lugar seguro, a disfrutar... <3
            `;
        alert('Registro exitoso: ' + tiquet);

        var guardado=0;
        var placa=vehiculoPlaca.placa;
        if (!clientes.some(cliente=> cliente.hasOwnProperty(placa))){
            console.log("No hay");
            var guardado=1;
            var placaCliente = {
                [placa]:[{
                    "Entrada": vehiculoPlaca.entradaMostrar,
                    "Salida": nuevoVehiculo.salidaMostrar,
                    "Pago": nuevoVehiculo.pago,
                    "Puesto": vehiculoPlaca.puesto,
                    "Tipo": vehiculoPlaca.tipo,
                }]
            };
        }else{
            console.log("SI hay");
            var guardado=2;
            var placaCliente=clientes.find(cliente=>cliente.hasOwnProperty(placa));
            var autoGuardar = {
                "Entrada": vehiculoPlaca.entradaMostrar,
                "Salida": nuevoVehiculo.salidaMostrar,
                "Pago": nuevoVehiculo.pago,
                "Puesto": vehiculoPlaca.puesto,
                "Tipo": vehiculoPlaca.tipo,
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
        // console.log(placaCliente);
        // console.log(autoGuardar);

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
    }else{
        alert('Error: La placa NO está registrada.');
        return;
    };
} else{
    if (verificarpuestoExistenteSalida(vehiculosSalida, nuevoVehiculo.puesto)){
        var vehiculoPuesto = vehiculosSalida.find(vehiculo=>vehiculo.puesto===nuevoVehiculo.puesto);

        console.log(vehiculoPuesto);

        var pagar=ValorPagar(vehiculoPuesto.entrada,nuevoVehiculo.salida,vehiculoPuesto.tipo);
        alert("El valor a pagar es: " + pagar);
        nuevoVehiculo.pago=`${pagar}`;
        var tiquet=`\n
            Placa: ${vehiculoPuesto.placa}\n
            Tipo: ${vehiculoPuesto.tipo}\n
            Puesto: ${vehiculoPuesto.puesto}\n
            Entrada: ${vehiculoPuesto.entradaMostrar}\n
            Salida: ${nuevoVehiculo.salidaMostrar}\n
            Pago: ${nuevoVehiculo.pago}\n
            Un lugar seguro, a disfrutar... <3
            `;
        alert('Registro exitoso: ' + tiquet);
        console.log(tiquet);
        var guardado=0;


    }else{
        alert('Error: El vehículo NO se encuentra en la posición seleccionada.');
        return;
    };






















