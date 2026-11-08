// =====================================================
// Calculadora Web - Lógica en JavaScript
// Autor: Damian Guano - UTM
// =====================================================

// ----- 1. Referencias a los elementos del DOM -----
const pantallaAnterior = document.getElementById("operacion-anterior");
const pantallaActual = document.getElementById("operacion-actual");
const botones = document.querySelectorAll(".btn");

// ----- 2. Estado de la calculadora -----
let actual = "0";        // número que se está escribiendo
let anterior = "";       // primer número de la operación
let operador = null;     // operador elegido (+, -, ×, ÷)
let reiniciar = false;   // true después de pulsar "=" para empezar un número nuevo

// ----- 3. Funciones principales -----

// Agrega un dígito o el punto decimal al número actual
function agregarNumero(numero) {
  if (reiniciar) {
    actual = "0";
    reiniciar = false;
  }
  // Evita poner dos puntos decimales
  if (numero === "." && actual.includes(".")) return;
  // Reemplaza el 0 inicial (salvo que se escriba un decimal)
  if (actual === "0" && numero !== ".") {
    actual = numero;
  } else {
    actual += numero;
  }
}

// Guarda el operador y prepara la entrada del segundo número
function elegirOperador(op) {
  if (actual === "Error") return;
  // Si ya hay una operación pendiente, la resuelve primero (encadenar: 2 + 3 + 4)
  if (operador !== null && !reiniciar) {
    calcular();
  }
  operador = op;
  anterior = actual;
  reiniciar = true;
}

// Realiza el cálculo según el operador
function calcular() {
  if (operador === null) return;

  const a = parseFloat(anterior);
  const b = parseFloat(actual);
  let resultado;

  switch (operador) {
    case "+": resultado = a + b; break;
    case "-": resultado = a - b; break;
    case "×": resultado = a * b; break;
    case "÷":
      if (b === 0) {           // División para cero
        actual = "Error";
        operador = null;
        anterior = "";
        reiniciar = true;
        return;
      }
      resultado = a / b;
      break;
  }

  // Redondea para evitar errores de coma flotante (0.1 + 0.2 = 0.30000000000000004)
  actual = String(parseFloat(resultado.toFixed(10)));
  operador = null;
  anterior = "";
  reiniciar = true;
}

// Borra todo
function limpiar() {
  actual = "0";
  anterior = "";
  operador = null;
  reiniciar = false;
}

// Borra el último dígito
function borrar() {
  if (reiniciar || actual === "Error") {
    limpiar();
    return;
  }
  actual = actual.length > 1 ? actual.slice(0, -1) : "0";
}

// Convierte el número actual en porcentaje
function porcentaje() {
  if (actual === "Error") return;
  actual = String(parseFloat(actual) / 100);
}

// Actualiza lo que se ve en la pantalla
function actualizarPantalla() {
  pantallaActual.textContent = actual;
  pantallaAnterior.textContent = operador ? `${anterior} ${operador}` : "";
}

// ----- 4. Eventos de clic en los botones -----
botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    const { numero, operador: op, accion } = boton.dataset;

    if (numero !== undefined) agregarNumero(numero);
    else if (op !== undefined) elegirOperador(op);
    else if (accion === "igual") calcular();
    else if (accion === "limpiar") limpiar();
    else if (accion === "borrar") borrar();
    else if (accion === "porcentaje") porcentaje();

    actualizarPantalla();
  });
});

// ----- 5. Soporte para teclado físico -----
document.addEventListener("keydown", (e) => {
  const tecla = e.key;

  if (/[0-9.]/.test(tecla)) agregarNumero(tecla);
  else if (tecla === "+") elegirOperador("+");
  else if (tecla === "-") elegirOperador("-");
  else if (tecla === "*") elegirOperador("×");
  else if (tecla === "/") { e.preventDefault(); elegirOperador("÷"); }
  else if (tecla === "Enter" || tecla === "=") { e.preventDefault(); calcular(); }
  else if (tecla === "Backspace") borrar();
  else if (tecla === "Escape") limpiar();
  else if (tecla === "%") porcentaje();
  else return;

  actualizarPantalla();
});
