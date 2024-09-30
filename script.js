const tableroHTML = document.querySelector('table')

let filas = 20
let columnas = 20
let lado = 30

let enJuego = true
let juegoIniciado = false

let minas = filas * columnas * 0.01
let marcas = 0

let tablero = []

nuevoJuego()

function nuevoJuego(){
    generarTablero()
    agregarEventos()
    generarTableroJuego()
    actualizarTablero()
}

function generarTablero(){
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

function generarTableroJuego(){
    vaciarTablero()
    ponerMinas()
    contadoresMinas()
}

function vaciarTablero(){
    tablero = []
    for(let c = 0; c < columnas; c++){
        tablero.push([])
    }
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
            casilla.addEventListener('dblclick', e => {
                click(casilla, c, f, e)
            })
            casilla.addEventListener('mouseup', e => {
                click(casilla, c, f, e)
            })
        }
    }
}

function actualizarTablero(){
    for (let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            let casilla = document.querySelector(`.casilla-${c}-${f}`)
            if(tablero[c][f].estado === 'descubierto'){
                casilla.classList.add('descubierto')
                switch(tablero[c][f].valor){
                    case -1:
                        casilla.innerHTML = 'B'
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
                casilla.innerHTML = "f"
            }
            if(tablero[c][f].estado == undefined){
                casilla.innerHTML = ""
            }
        }
    }
    verificarPerdedor()
    verificarGanador()
}

function click(casilla, c, f, e){
    if(!enJuego){
        return
    }
    if(tablero[c][f].estado == 'descubierto'){
        return
    }
    switch(e.button){
        case 0:
            if(tablero[c][f].estado == 'marcado'){
                break
            }

            while(!juegoIniciado && tablero[c][f].valor == -1){
                generarTableroJuego()
            }

            tablero[c][f].estado = 'descubierto'
            juegoIniciado = true
            if(tablero[c][f].valor == 0){
                abrirArea(c, f)
            }
            break
        case 2:
            if(tablero[c][f].estado == 'marcado'){
                tablero[c][f].estado = undefined
                casilla.classList.remove('marcado')
                marcas--
            } else {
                tablero[c][f].estado = 'marcado'
                marcas++
            }
            break
        default:
            break
    }
    actualizarTablero()
}

function verificarPerdedor(){
    for(let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            if(tablero[c][f].valor == -1){
                if(tablero[c][f].estado == 'descubierto'){
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
                casilla.innerHTML = 'B'
            }
        }
    }
}

function verificarGanador(){
    for(let f = 0; f < filas; f++){
        for(let c = 0; c < columnas; c++){
            if(tablero[c][f].estado != 'descubierto'){
                if(tablero[c][f].valor == -1){
                    continue
                }else{
                    return
                }
            }
        }
    }
    enJuego = false
    tableroHTML.className = "ganador"
}

function abrirArea(c, f){
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            if(i == 0 && j == 0){
                continue
            }
            try {
                if(tablero[c + i][f + j].estado != 'descubierto'){
                    if (tablero[c + i][f + j].estado != 'marcado'){
                        tablero[c + i][f + j].estado = 'descubierto'
                        if(tablero[c + i][f + j].valor == 0){
                            abrirArea(c + i, f + j)
                        }
                    }
                }
            } catch (e) { }
        }
    }
}