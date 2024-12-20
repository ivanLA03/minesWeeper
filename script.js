const tableroHTML = document.querySelector('table')

let filas = 20
let columnas = 20
let lado = 30

let enJuego = true
let juegoIniciado = false

let minas = filas * columnas * 0.1
let marcas = 0

let tablero = []

nuevoJuego()

function nuevoJuego(){
    tableroHTML.classList.remove('perdedor', 'ganador');
    tableroHTML.classList.add('iniciado');
      document.querySelector('.mr').src = 'img/mr-incredible-feliz.jpg'
    reiniciarVariables()
    generarTableroHTML()
    agregarEventos()
    generarTableroJuego()
    actualizarTablero()
}

function generarTableroJuego(){
    vaciarTablero()
    ponerMinas()
    contadoresMinas()
}

function generarTableroHTML(){
    let html = ''
    for (let f = 0; f < filas; f++){
        html += '<tr>'
        for(let c = 0; c < columnas; c++){
            html += `<td class="casilla-${c}-${f}" style="width: ${lado}px; height:${lado}px">`
            html += '</td>'
        }
        html += '</tr>'
    }
    let tableroHTML = document.querySelector('.tablero')
    tableroHTML.innerHTML = html
    tableroHTML.style.width = columnas * lado + 'px'
    tableroHTML.style.height = filas * lado + 'px'
}

function reiniciarVariables(){
    marcas = 0
    enJuego = true
    juegoIniciado = false
}

function vaciarTablero(){
    tablero = Array(columnas).fill().map(() => [])
}

function ponerMinas(){
    for(let i = 0; i < minas; i++){
        let c
        let f
        do {
            c = Math.floor(Math.random() * columnas)
            f = Math.floor(Math.random() * filas)
        } while (tablero[c][f])
        tablero[c][f] = {valor: -1}
    }
}

function contadoresMinas(){
    for (let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            if(!tablero[c][f]){
                let contador = 0
                for(let i = -1; i<=1; i++){
                    for(let j = -1; j <= 1; j++){
                        if(i == 0 && j==8){
                            continue
                        }
                        try{
                            if(tablero[c + i][f + j].valor == -1){
                                contador++
                            }
                        }catch(e){}
                    }
                }
                tablero[c][f] = {valor: contador}
            }   
        }
    }
}

function agregarEventos(){
    for (let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            let casilla = document.querySelector(`.casilla-${c}-${f}`)
            casilla.addEventListener('mouseup', e => {
                clickTimeout = setTimeout(() => {
                    click(casilla, c, f, e);
                }, 150);
            })
            casilla.addEventListener('dblclick', () => {
                clearTimeout(clickTimeout);
                if (!enJuego || estaDescubierta(c,f)) return
                tablero[c][f].estado = tablero[c][f].estado === 'marcado' ? undefined : 'marcado'
                casilla.classList.toggle('marcado')
                marcas += tablero[c][f].estado === 'marcado' ? 1 : -1
            })
        }
    }
}

function actualizarTablero(){
    for (let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            let casilla = document.querySelector(`.casilla-${c}-${f}`)
            if(estaDescubierta(c, f)){
                casilla.classList.add('descubierto')
                switch(tablero[c][f].valor){
                    case -1:
                        casilla.classList.add('bomba')
                        break
                    case 0:
                        break
                    default:
                        casilla.innerHTML = tablero[c][f].valor
                        break
                }
            }
            if(tablero[c][f].estado == 'marcado'){
                casilla.classList.add('marcado')
                let img = document.createElement('img');
                casilla.innerHTML = ""
                img.src = 'img/bandera.png';
                img.width = 25;
                img.height = 25;
                casilla.appendChild(img)
            }
            if(tablero[c][f].estado == undefined){
                casilla.innerHTML = ""
            }
        }
    }
    verificarPerdedor()
    verificarGanador()
    actualizarMinas()
}

function click(casilla, c, f, e) {
    if (!enJuego || estaDescubierta(c,f)) return

    if (e.button === 0 && !estaMarcada(c, f)) {
        while (!juegoIniciado && tablero[c][f].valor === -1) generarTableroJuego()

        tablero[c][f].estado = 'descubierto'
        juegoIniciado = true
        if (tablero[c][f].valor === 0) abrirArea(c, f)
    } else if (e.button === 2) {
        tablero[c][f].estado = tablero[c][f].estado === 'marcado' ? undefined : 'marcado'
        casilla.classList.toggle('marcado')
        marcas += tablero[c][f].estado === 'marcado' ? 1 : -1
    }

    actualizarTablero();
}

function verificarPerdedor(){
    for(let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            if(tablero[c][f].valor == -1){
                if(estaDescubierta(c,f)){
                    enJuego = false
                }
            }
        }
    }
    if(enJuego){
        return
    }
    for(let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            if(tablero[c][f].valor == -1){
                let casilla = document.querySelector(`.casilla-${c}-${f}`)
                let img = document.createElement('img');
                casilla.innerHTML = ''
                img.src = 'img/mina.png';
                img.width = 25;
                img.height = 25;
                casilla.appendChild(img)
            }
        }
    }
    tableroHTML.classList.remove('iniciado');
    tableroHTML.classList.add('perdedor');
    document.querySelector('.mr').src = 'img/mr-incredible-cursed.jpg'
}

function verificarGanador(){
    for(let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            if(!estaDescubierta(c, f)){
                if(tablero[c][f].valor == -1){
                    continue
                }else{
                    return
                }
            }
        }
    }
    enJuego = false
    tableroHTML.classList.remove('iniciado');
    tableroHTML.classList.add('ganador');
    document.querySelector('.mr').src = 'img/mr-incredible-lentes.jpg'
}

function abrirArea(c, f) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;

            const casilla = tablero[c + i]?.[f + j];
            if (casilla && casilla.estado !== 'descubierto' && casilla.estado !== 'marcado') {
                casilla.estado = 'descubierto';
                if (casilla.valor === 0) abrirArea(c + i, f + j);
            }
        }
    }
}

function esCasillaValida(c, f) {
    return tablero[c]?.[f]
}

function estaDescubierta(c, f) {
    return esCasillaValida(c, f) && tablero[c][f].estado === 'descubierto'
}

function estaMarcada(c, f) {
    return esCasillaValida(c, f) && tablero[c][f].estado === 'marcado'
}

function actualizarMinas(){
    let panel = document.querySelector(".minas")
    panel.innerHTML = minas - marcas
}