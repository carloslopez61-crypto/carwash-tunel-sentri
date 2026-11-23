
/* =====================================================
   CHATBOT AUTOMÁTICO - CAR WASH
   No necesita API ni servicios de pago.
===================================================== */

(function () {
    "use strict";

    let catalogoChat = [];

    const estilos = `
        #cw-chat-button {
            position: fixed;
            bottom: 25px;
            right: 25px;
            width: 65px;
            height: 65px;
            border: none;
            border-radius: 50%;
            background: #E31B23;
            color: white;
            font-size: 29px;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 6px 25px rgba(227,27,35,.4);
            transition: transform .2s, background .2s;
        }

        #cw-chat-button:hover {
            background: #B51219;
            transform: scale(1.08);
        }

        #cw-chat-window {
            position: fixed;
            right: 25px;
            bottom: 105px;
            width: 370px;
            height: 520px;
            max-height: calc(100dvh - 125px);
            background: #ffffff;
            border-radius: 17px;
            box-shadow: 0 12px 45px rgba(0,0,0,.3);
            z-index: 9999;
            display: none;
            flex-direction: column;
            overflow: hidden;
            font-family: Inter, Arial, sans-serif;
        }

        #cw-chat-window.cw-visible {
            display: flex;
        }

        .cw-chat-header {
            padding: 18px;
            background: #061A3A;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 4px solid #E31B23;
        }

        .cw-chat-header-info {
            display: flex;
            align-items: center;
            gap: 11px;
        }

        .cw-chat-avatar {
            display: grid;
            place-items: center;
            background: #0B3D91;
            width: 43px;
            height: 43px;
            border-radius: 12px;
            font-size: 23px;
        }

        .cw-chat-header strong {
            display: block;
            font-size: 15px;
        }

        .cw-chat-status {
            display: block;
            font-size: 11px;
            color: #b4cae9;
            margin-top: 4px;
        }

        .cw-chat-close {
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 25px;
            padding: 2px 7px;
        }

        #cw-chat-messages {
            flex: 1;
            overflow-y: auto;
            background: #F4F6FA;
            padding: 18px 14px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .cw-message {
            max-width: 88%;
            padding: 12px 14px;
            border-radius: 13px;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-line;
            overflow-wrap: anywhere;
        }

        .cw-bot {
            background: #ffffff;
            color: #18243A;
            align-self: flex-start;
            border: 1px solid #e6e9ef;
            border-bottom-left-radius: 3px;
        }

        .cw-user {
            background: #0B3D91;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 3px;
        }

        .cw-chat-quick {
            background: #F4F6FA;
            padding: 10px 12px;
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            border-top: 1px solid #e5e7eb;
        }

        .cw-quick-button {
            background: white;
            color: #0B3D91;
            border: 1px solid #c8d6ed;
            border-radius: 18px;
            padding: 7px 10px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
        }

        .cw-quick-button:hover {
            background: #0B3D91;
            color: white;
        }

        #cw-chat-form {
            display: flex;
            padding: 12px;
            gap: 8px;
            background: white;
            border-top: 1px solid #e5e7eb;
        }

        #cw-chat-input {
            flex: 1;
            min-width: 0;
            padding: 11px 13px;
            border: 1px solid #d8dce5;
            border-radius: 22px;
            color: #111827;
            background: white;
            outline: none;
            font-size: 12px;
        }

        #cw-chat-input:focus {
            border-color: #0B3D91;
        }

        #cw-chat-send {
            background: #E31B23;
            color: white;
            border: none;
            border-radius: 50%;
            width: 39px;
            height: 39px;
            cursor: pointer;
            font-size: 19px;
            flex-shrink: 0;
        }

        .cw-chat-order {
            background: #E31B23;
            color: white;
            padding: 11px;
            text-align: center;
            font-size: 12px;
            font-weight: 700;
            text-decoration: none;
        }

        .cw-chat-order:hover {
            background: #B51219;
        }

        @media (max-width: 480px) {
            #cw-chat-window {
                right: 10px;
                left: 10px;
                bottom: 88px;
                width: auto;
                height: min(520px, calc(100dvh - 105px));
            }

            #cw-chat-button {
                right: 17px;
                bottom: 17px;
                width: 58px;
                height: 58px;
            }
        }
    `;

    function crearInterfaz() {
        const style = document.createElement("style");
        style.textContent = estilos;
        document.head.appendChild(style);

        const contenedor = document.createElement("div");

        contenedor.innerHTML = `
            <button
                id="cw-chat-button"
                type="button"
                aria-label="Abrir asistente Car Wash"
                aria-expanded="false"
                aria-controls="cw-chat-window"
            >💬</button>

            <section
                id="cw-chat-window"
                aria-label="Asistente virtual Car Wash"
            >
                <div class="cw-chat-header">
                    <div class="cw-chat-header-info">
                        <div class="cw-chat-avatar">🚗</div>
                        <div>
                            <strong>Asistente Car Wash</strong>
                            <span class="cw-chat-status">
                                ● Respuestas automáticas
                            </span>
                        </div>
                    </div>

                    <button
                        class="cw-chat-close"
                        id="cw-chat-close"
                        type="button"
                        aria-label="Cerrar chatbot"
                    >×</button>
                </div>

                <div
                    id="cw-chat-messages"
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions"
                ></div>

                <div class="cw-chat-quick">
                    <button class="cw-quick-button" data-chat="precios" type="button">
                        💰 Precios
                    </button>

                    <button class="cw-quick-button" data-chat="servicios" type="button">
                        🚗 Servicios
                    </button>

                    <button class="cw-quick-button" data-chat="moto" type="button">
                        🏍️ Moto
                    </button>

                    <button class="cw-quick-button" data-chat="orden" type="button">
                        🛒 Ordenar
                    </button>
                </div>

                <form id="cw-chat-form">
                    <input
                        id="cw-chat-input"
                        type="text"
                        placeholder="Escribe tu pregunta..."
                        maxlength="300"
                        autocomplete="off"
                        aria-label="Tu pregunta"
                        required
                    >

                    <button
                        id="cw-chat-send"
                        type="submit"
                        aria-label="Enviar mensaje"
                    >➤</button>
                </form>

                <a class="cw-chat-order" href="#orden" id="cw-chat-order">
                    REALIZAR UNA ORDEN →
                </a>
            </section>
        `;

        while (contenedor.firstChild) {
            document.body.appendChild(contenedor.firstChild);
        }
    }

    function agregarMensaje(texto, tipo = "bot") {
        const mensajes = document.getElementById("cw-chat-messages");
        const burbuja = document.createElement("div");

        burbuja.className = "cw-message " +
            (tipo === "user" ? "cw-user" : "cw-bot");

        // textContent evita ejecutar HTML enviado por el usuario.
        burbuja.textContent = texto;

        mensajes.appendChild(burbuja);
        mensajes.scrollTop = mensajes.scrollHeight;
    }

    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function dinero(precio) {
        return "$" + Number(precio).toLocaleString("es-MX") + " MXN";
    }

    function listaPrecios(productos) {
        if (!productos.length) {
            return "No tengo disponibles esos precios en este momento.";
        }

        return productos.map(item =>
            "• " + item.nombre + ": " + dinero(item.precio)
        ).join("\n");
    }

    function paquete(nombre) {
        return catalogoChat.filter(item =>
            normalizar(item.paquete) === normalizar(nombre)
        );
    }

    function respuestaPrecio(texto) {
        if (!catalogoChat.length) {
            return "No pude consultar el catálogo de precios. Puedes revisarlo en la sección Precios de la página.";
        }

        const esSupreme = texto.includes("supreme") ||
            texto.includes("completo") ||
            texto.includes("interior");

        const esExpress = texto.includes("express") ||
            texto.includes("exterior");

        const esMoto = texto.includes("moto") ||
            texto.includes("motocicleta");

        const esPanel = texto.includes("panel");

        const esExtra = texto.includes("extra grande") ||
            texto.includes("pickup") ||
            texto.includes("pick up") ||
            texto.includes("cuatro puertas") ||
            texto.includes("4 puertas");

        const esGrande = texto.includes("grande");
        const esChico = texto.includes("chico") ||
            texto.includes("pequeno");

        let productos = catalogoChat;

        if (esMoto) {
            productos = productos.filter(p => normalizar(p.paquete) === "moto");
        } else {
            if (esSupreme && !esExpress) {
                productos = productos.filter(p => normalizar(p.paquete) === "supreme");
            }

            if (esExpress && !esSupreme) {
                productos = productos.filter(p => normalizar(p.paquete) === "express");
            }

            if (esPanel) {
                productos = productos.filter(p => normalizar(p.tipo) === "panel");
            } else if (esExtra) {
                productos = productos.filter(p => normalizar(p.tipo) === "extra grande");
            } else if (esGrande) {
                productos = productos.filter(p => normalizar(p.tipo) === "grande");
            } else if (esChico) {
                productos = productos.filter(p => normalizar(p.tipo) === "chico");
            }
        }

        return "Estos son los precios disponibles:\n\n" +
            listaPrecios(productos) +
            "\n\nPuedes seleccionar el servicio en la sección Realizar orden.";
    }

    function obtenerRespuesta(mensaje) {
        const texto = normalizar(mensaje);

        if (/\b(hola|buenas|hey|saludos)\b/.test(texto)) {
            return "¡Hola! 👋 Bienvenido a Car Wash.\n\nPuedo ayudarte con nuestros servicios, precios y el proceso para realizar una orden.\n\n¿Qué te gustaría saber?";
        }

        if (/\b(gracias|muchas gracias)\b/.test(texto)) {
            return "¡Con gusto! 😊 Gracias por consultar nuestro asistente Car Wash.";
        }

        if (/\b(ordenar|orden|pedido|comprar|reservar|agendar|contratar)\b/.test(texto) ||
            texto.includes("como puedo pedir")) {
            return "🛒 Para realizar una orden:\n\n1. Ve a la sección Realizar orden.\n2. Ingresa tu nombre, apellido y correo.\n3. Selecciona el servicio y la cantidad.\n4. Agrégalo a tu carrito.\n5. Revisa el total y presiona Realizar orden.\n\nRecibirás un folio de confirmación cuando tu orden se registre correctamente.";
        }

        if (texto.includes("diferencia") ||
            texto.includes("que incluye") ||
            texto.includes("que es supreme") ||
            texto.includes("que es express")) {
            return "🚗 Tenemos dos modalidades principales:\n\n◆ Supreme: lavado completo, que incluye limpieza interior y exterior.\n\n◇ Express: lavado exterior, para quienes buscan una opción más sencilla.\n\nTambién contamos con opciones para vehículos Panel y motocicletas.\n\nLos precios varían según el tamaño del vehículo.";
        }

        if (texto.includes("recomiend") ||
            texto.includes("cual me conviene") ||
            texto.includes("que servicio elijo")) {
            return "Mi recomendación depende de lo que necesites:\n\n◆ Supreme: si quieres limpieza interior y exterior.\n◇ Express: si únicamente necesitas lavar el exterior.\n\nDime qué vehículo tienes y puedo mostrarte los precios disponibles.";
        }

        if (texto.includes("horario") ||
            texto.includes("hora abren") ||
            texto.includes("hora cierran")) {
            return "Puedes consultar los horarios publicados en la sección Contacto de nuestra página. Te recomendamos confirmarlos directamente con el negocio antes de acudir.";
        }

        if (texto.includes("ubicacion") ||
            texto.includes("direccion") ||
            texto.includes("donde estan")) {
            return "Puedes consultar la información de ubicación disponible en la sección Contacto de nuestra página.";
        }

        if (texto.includes("pagar") ||
            texto.includes("pago") ||
            texto.includes("tarjeta") ||
            texto.includes("efectivo")) {
            return "Puedes registrar una orden desde esta página. Para confirmar los métodos de pago disponibles, consulta directamente con el establecimiento.";
        }

        if (texto.includes("precio") ||
            texto.includes("cuanto") ||
            texto.includes("cuesta") ||
            texto.includes("costo") ||
            texto.includes("tarifa") ||
            texto.includes("supreme") ||
            texto.includes("express") ||
            texto.includes("panel") ||
            texto.includes("moto") ||
            texto.includes("pickup") ||
            texto.includes("pick up") ||
            texto.includes("chico") ||
            texto.includes("grande") ||
            texto.includes("lavado completo") ||
            texto.includes("lavado exterior")) {
            return respuestaPrecio(texto);
        }

        if (texto.includes("servicios") ||
            texto.includes("paquetes") ||
            texto.includes("tipos de lavado") ||
            texto.includes("que ofrecen")) {
            return "🚗 Nuestros principales servicios son:\n\n◆ Supreme: lavado completo.\n◇ Express: lavado exterior.\n▣ Panel: opciones para vehículos tipo panel.\n🏍️ Moto: servicio para motocicletas.\n\nTambién puedes consultar las opciones por tamaño en la sección Precios.";
        }

        if (texto.includes("correo") ||
            texto.includes("comprobante") ||
            texto.includes("folio")) {
            return "Al registrar correctamente una orden se genera un folio. Nuestro sistema también puede enviar un comprobante al correo que ingreses, si el servicio de correo está disponible.\n\nRevisa también la carpeta de correo no deseado.";
        }

        return "No encontré una respuesta exacta a tu pregunta. 😊\n\nPuedo ayudarte a consultar precios, comparar Supreme y Express, conocer los servicios o realizar una orden.\n\nPrueba escribir: «¿Cuánto cuesta Supreme Grande?»";
    }

    async function cargarCatalogoChat() {
        try {
            const respuesta = await fetch("catalogo.json", {
                cache: "no-store"
            });

            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el catálogo");
            }

            const datos = await respuesta.json();

            if (!Array.isArray(datos)) {
                throw new Error("Formato del catálogo incorrecto");
            }

            catalogoChat = datos.filter(item =>
                item &&
                typeof item.nombre === "string" &&
                typeof item.paquete === "string" &&
                typeof item.tipo === "string" &&
                Number.isFinite(Number(item.precio))
            );
        } catch (error) {
            console.error("Chatbot: error al cargar catálogo", error);
        }
    }

    function iniciarChatbot() {
        if (document.getElementById("cw-chat-window")) {
            return;
        }

        crearInterfaz();
        cargarCatalogoChat();

        const ventana = document.getElementById("cw-chat-window");
        const boton = document.getElementById("cw-chat-button");
        const cerrar = document.getElementById("cw-chat-close");
        const formularioChat = document.getElementById("cw-chat-form");
        const input = document.getElementById("cw-chat-input");

        function abrirCerrarChat() {
            const abierto = ventana.classList.toggle("cw-visible");
            boton.setAttribute("aria-expanded", String(abierto));

            if (abierto) {
                input.focus();
            } else {
                boton.focus();
            }
        }

        boton.addEventListener("click", abrirCerrarChat);
        cerrar.addEventListener("click", abrirCerrarChat);

        formularioChat.addEventListener("submit", function (event) {
            event.preventDefault();

            const mensaje = input.value.trim();

            if (!mensaje) return;

            agregarMensaje(mensaje, "user");
            input.value = "";

            agregarMensaje(obtenerRespuesta(mensaje));
        });

        document.querySelectorAll(".cw-quick-button").forEach(botonRapido => {
            botonRapido.addEventListener("click", function () {
                const opcion = this.dataset.chat;

                const preguntas = {
                    precios: "¿Cuáles son los precios?",
                    servicios: "¿Qué servicios ofrecen?",
                    moto: "¿Cuánto cuesta el lavado de moto?",
                    orden: "¿Cómo puedo realizar una orden?"
                };

                const pregunta = preguntas[opcion];

                agregarMensaje(pregunta, "user");
                agregarMensaje(obtenerRespuesta(pregunta));
            });
        });

        document.getElementById("cw-chat-order").addEventListener(
            "click",
            function () {
                ventana.classList.remove("cw-visible");
                boton.setAttribute("aria-expanded", "false");
            }
        );

        agregarMensaje(
            "¡Hola! 👋 Bienvenido a Car Wash.\n\n" +
            "Soy tu asistente virtual. Puedo ayudarte con " +
            "nuestros servicios, precios y órdenes.\n\n" +
            "¿En qué puedo ayudarte?"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarChatbot);
    } else {
        iniciarChatbot();
    }
})();
