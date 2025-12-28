/*
0 Importaciones de librerias externas 
1 Captura de elementos del DOM - crear variable
*/

//const Swal = require('sweetalert2')

let selectTipo = document.querySelector("#tipo");
let inptDescripcion = document.querySelector("#descripcion");
let inptMonto = document.querySelector("#monto");
let btnGuardar = document.querySelector("#guardar");
let totalMovimientos = document.querySelector("#totalMovimientos");
let totalIngresos = document.querySelector("#totalIngresos");
let numeroIngresos = document.querySelector("#numIngresos");
let totalEgresos = document.querySelector("#totalEgresos");
let numeroEgresos = document.querySelector("#numEgresos");
let balanceActual = document.querySelector("#balanceActual");

/* Captura de la tabla de movimientos*/

let tbMovimientos = document.querySelector("#tablaMovimientos");

const billetera = [];   //Porque es un array? porque vamos a guardar varios onjetos dentro
//inicia vacio, porque no hay movimientos aun

/*
2. Creacion de eventos
*/

btnGuardar.addEventListener("click", function (event) {
    event.preventDefault();  //Evita que se recargue la pagina

    let tipo = selectTipo.value;
    let descripcion = inptDescripcion.value;
    let monto = Number(inptMonto.value);

    /* Validaciones
    son usados para verificar el tipo de la informacion que va a 
    ser almacenada
    */

    if (descripcion.length <= 3) {
        alert("La descripcion debe tener más de 3 caracteres");
        return;
    }

    if (monto <= 0 || isNaN(monto)) {
        alert("El monto debe ser un número positivo y un número válido");
        return;
    }

    let operacion = {
        tipo,
        descripcion,
        monto
    };

    billetera.push(operacion);

    console.log(billetera)

    limpiarValores();
    contarMovimientos();
    calcularIngresos();
    calcularEgresos();
    calcularBalance();

    renderizarTabla(); //lleva como parametro implicito la tabla billetera





})


function limpiarValores() {
    // Limpiar inputs
    inptDescripcion.value = "";
    inptMonto.value = "";
}

function contarMovimientos() {
    totalMovimientos.textContent = billetera.length;

}

function calcularIngresos() {
    /*Calcular el total de ingresos*/
    let ingresos = billetera.filter((elemnt) => elemnt.tipo == "Ingreso");

    let ingresosCalc = ingresos.reduce((acc, elmt) => acc + elmt.monto, 0);
    totalIngresos.textContent = "S/ " + formatoNumero(ingresosCalc);
    numeroIngresos.textContent = ingresos.length + " registros"
    return ingresosCalc;

}

function calcularEgresos() {
    /*Calcular el total de egresos*/
    let egresos = billetera.filter((elemnt) => elemnt.tipo == "Gasto");

    let gastosCalc = egresos.reduce((acc, elmt) => acc + elmt.monto, 0);
    totalEgresos.textContent = "S/ " + formatoNumero(gastosCalc);
    numeroEgresos.textContent = egresos.length + " registros"
    return gastosCalc;

}

function calcularBalance() {
    let ingresos = calcularIngresos();
    let egresos = calcularEgresos();

    let balance = ingresos - egresos;
    balanceActual.textContent = "S/ " + formatoNumero(balance);

    return balance;
}

function formatoNumero(valor) {
    return new Intl.NumberFormat("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(valor);
}





function renderizarTabla() {

    /*
Renderizado de las filas dentro del tbody
*/

    /*
    Crear o insertar un elemento desde JS
    innerHtml => Permite insertar un elemento HTML dentro de otro

   */

    tbMovimientos.innerHTML = "";

    
//REcorrer o manipular el array que contiene toda nuestra información

    billetera.forEach((elmt, index) => {

        // Color y signo según tipo
        let colorMonto = elmt.tipo === "Ingreso" ? "text-emerald-400" : "text-red-400";
        let signo = elmt.tipo === "Ingreso" ? "+" : "-";

        tbMovimientos.innerHTML += `
        <tr class="border-b border-slate-700/50 hover:bg-slate-700/30">
            <td class="py-3 px-4">
                <span class="${elmt.tipo === "Ingreso"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-red-500/20 text-red-400"} 
                    text-xs px-2 py-1 rounded">
                    ${elmt.tipo}
                </span>
            </td>

            <td class="py-3 px-4 text-slate-200">
                ${elmt.descripcion}
            </td>

            <td class="py-3 px-4 font-medium ${colorMonto}">
                ${signo} S/ ${formatoNumero(elmt.monto)}
            </td>

            <td class="py-3 px-4 space-x-2">
                <button 
                    class="text-indigo-400 hover:text-indigo-300"
                    onclick="editarMovimiento(${index})">
                    Editar
                </button>

                <button 
                    class="text-red-400 hover:text-red-300"
                    onclick="eliminarMovimiento(${index})">
                    Eliminar
                </button>
            </td>
        </tr>`;
    });
}


function eliminarMovimiento(index) {

    Swal.fire({
        title: "¿Estas seguro de eliminar este elemento?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminarlo!"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Eliminado!",
                text: "Tu registro ha sido eliminado.",
                icon: "success"
            });

            billetera.splice(index, 1);
            contarMovimientos();
            calcularIngresos();
            calcularEgresos();
            calcularBalance();
            renderizarTabla();

        }
    });

}

function editarMovimiento(index) {
    const movimiento = billetera[index];

    Swal.fire({
        title: "Editar movimiento",
        html: `
            <div class="text-left space-y-3">
                <label class="block text-sm">Tipo</label>
                <select id="editTipo" class="swal2-input">
                    <option value="Ingreso" ${movimiento.tipo === "Ingreso" ? "selected" : ""}>Ingreso</option>
                    <option value="Gasto" ${movimiento.tipo === "Gasto" ? "selected" : ""}>Gasto</option>
                </select>

                <label class="block text-sm">Descripción</label>
                <input 
                    id="editDescripcion" 
                    class="swal2-input" 
                    value="${movimiento.descripcion}">

                <label class="block text-sm">Monto</label>
                <input 
                    id="editMonto" 
                    type="number" 
                    step="0.01"
                    class="swal2-input" 
                    value="${movimiento.monto}">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#4f46e5",
        preConfirm: () => {
            const tipo = document.getElementById("editTipo").value;
            const descripcion = document.getElementById("editDescripcion").value.trim();
            const monto = Number(document.getElementById("editMonto").value);

            if (descripcion.length <= 3) {
                Swal.showValidationMessage("La descripción debe tener más de 3 caracteres");
                return false;
            }

            if (monto <= 0 || isNaN(monto)) {
                Swal.showValidationMessage("El monto debe ser un número válido y mayor a 0");
                return false;
            }

            return { tipo, descripcion, monto };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Actualizar el objeto en el array
            billetera[index] = result.value;

            // Recalcular todo
            contarMovimientos();
            calcularIngresos();
            calcularEgresos();
            calcularBalance();
            renderizarTabla();

            Swal.fire({
                icon: "success",
                title: "Actualizado",
                text: "El movimiento fue actualizado correctamente",
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}