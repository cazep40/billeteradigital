/*
1 Captura de elementos del DOM - crear variable
*/

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

    //console.log(billetera)

    limpiarValores();
    contarMovimientos();
    calcularIngresos();
    calcularEgresos();
    calcularBalance();
   



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