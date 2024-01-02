const medidassvg = { "vis-1 height": 1000, "vis-1 width": 1200, "vis-2 width": 1200, "vis-2 height": 1000 }

const SVG1 = d3.select("#vis-1").append("svg").attr("height", medidassvg["vis-1 height"]).attr("width", medidassvg["vis-1 width"])
const SVG2 = d3.select("#vis-2").append("svg").attr("height", medidassvg["vis-2 height"]).attr("width", medidassvg["vis-2 width"])
// Crearé un rectangulo con información de cada juego
SVG1.append("rect").attr("height", 600).attr("width", 300).attr("x", 800).attr("y", 200).attr("stroke", "red").style("opacity", 1)
const imagenjogo = SVG1.append("image").attr("width", 300).attr("height", 500).attr("href", "ukio.png").attr("x", 800).attr("y", 150).style("opacity", 0)
SVG1.append("text").text("Nombre: ").style("fill", "white").attr("x", 810).attr("y", 650)
const lename = SVG1.append("text").text("Nombre: ").style("fill", "white").attr("x", 900).attr("y", 650).style("opacity", 0)
SVG1.append("text").text("Año de lanzamiento: ").style("fill", "white").attr("x", 810).attr("y", 680)
const year = SVG1.append("text").text("Año de lanzamiento: ").style("fill", "white").attr("x", 960).attr("y", 680).style("opacity", 0)
SVG1.append("text").text("Consolas: ").style("fill", "white").attr("x", 810).attr("y", 710)
const cons = SVG1.append("text").text("consolas: ").style("fill", "white").attr("x", 890).attr("y", 710).style("opacity", 0)
SVG1.append("text").text("Opening: ").style("fill", "white").attr("x", 810).attr("y", 740)
const op = SVG1.append("text").text("Opening: ").style("fill", "white").attr("x", 870).attr("y", 740).style("opacity", 0)


function circlescales(lista) {
    let escala = d3.scaleLinear().domain([0, lista.length]).range([0, 2 * Math.PI])
    return escala
}

function locate(i, escala) {
    return `translate(${350 + 300 * Math.cos(escala(i))}, ${450 + 300 * Math.sin(escala(i))})`
}
let gclick = "uwu"



//La siguiente función destacará el juego donde el mouse está encima
function light(game) {
    const c1 = d3.select(`#c1${game}`)
    c1.style("fill", "#fffdd0")
    const c2 = d3.select(`#c2${game}`)
    c2.style("fill", "#fffdd0")
    const t = d3.select(`#tri${game}`)
    t.style("fill", "#fffdd0")

}



//Esta función oscurecerá los keyholes
function dark(game) {
    if (gclick != game) {
        const c1 = d3.select(`#c1${game}`)
        c1.style("fill", "black")
        const c2 = d3.select(`#c2${game}`)
        c2.style("fill", "black")
        const t = d3.select(`#tri${game}`)
        t.style("fill", "black")
    }
}

// funcion para volver a iluminar los links

function lightlink(game) {
    if (gclick == "uwu") {
        d3.selectAll(".link").transition("iluminar").duration(400).style("opacity", 1)
        d3.selectAll(".texname").style("fill", "white")
    }

}
//funcion para administrar las funciones que se gatillan al sacar el mouse
function adminleave(game) {

    dark(game)
    lightlink(game)

}

//Setear click; el glifo clickeado anteriormente se vuelve oscuro; si hay uno seleccionado


function suichi(game) {
    let c = d3.select(`#c1${gclick}`)
    c.style("fill", "black")
    let d = d3.select(`#c2${gclick}`)
    d.style("fill", "black")
    let tr = d3.select(`#tri${gclick}`)
    tr.style("fill", "black")
    if (gclick == game) {
        gclick = "uwu"
        return "a"

    }
    if (gclick != game) {
        gclick = game
        darklink(game)
    }

}

// Enviar info a textos
function texts(game) {

    year.text(game.release).style("opacity", 1)
    cons.text(game.plataformas).style("opacity", 1)
    op.text(game.opening).style("opacity", 1)
    lename.text(game.nombre).style("opacity", 1)

}

function sendimage(portada) {
    imagenjogo.transition("opacar").duration(200).style("opacity", 0)
    setTimeout(() => {
        imagenjogo.attr("href", portada)
    }, 220);

    // imagenjogo.transition("cambiar").delay(220).duration(0)
    imagenjogo.transition("reiluminar").delay(300).duration(200).style("opacity", 1)
}


//Función para seleccionar a todos los personajes del juego
function markcha(lista) {
    let largo = lista.length
    counter = 0
    d3.selectAll(".nodo").attr("fill", "#f4ca16")
    while (counter <= largo) {
        d3.select(`.${lista[counter]}`).attr("fill", "#AFEEEE")
        counter = counter + 1
    }
}

// funcion que ejecuta otras funciones al hacer click
function adminclick(game) {
    suichi(game.nombre)
    texts(game)
    sendimage(game.portada)
    markcha(game.personajes)

}

//funcion para disminuir opacidad de los links que no vienen del glifo seleccionado
function darklink(game) {
    if (gclick == game || gclick == "uwu") {
        d3.selectAll(".link").transition("oscurecer").duration(300).style("opacity", 0)
        d3.selectAll(`.s${game}`).transition("reiluminar").duration(200).delay(300).style("opacity", 1)
    }
}


//funcion para mostrar si un juego es compilado o no y mostrar los juegos que estan compilados dentro de el
function showcomp(name) {
    if (name == "KingdomHeartsI5II5" || name == "KingdomHeartsII8") {
        d3.selectAll(`.compKingdomHeartsI5II5`).style("fill", "white")
        d3.selectAll(`.compKingdomHeartsII8`).style("fill", "white")
        d3.selectAll(`.comp${name}`).style("fill", "#ffcc00")
    }
    else {
        d3.selectAll(".texname").style("fill", "white")
    }
}

// funcion para administrar el hover en un glifo
function adminhover(game) {
    showcomp(game)
    light(game)
    darklink(game)
    d3.selectAll(".ordcro").style("opacity", 0)
    d3.selectAll(".ordrel").style("opacity", 0)


}

//Está función retornará un color dependiendo del orden que simboliza el link
function colorear(c) {
    if (c == "crono") {
        return "#A6F7F5 "
    }
    if (c == "juga") {
        return "#6060F3"
    }
    if (c == "date") {
        return "#F9629F"
    }
}


//Esta función solo iluminará los links cronológicos
function admincrono() {
    d3.selectAll(".ordrel").transition("begone").duration(300).style("opacity", 0)
    d3.selectAll(".link").transition("dark").duration(300).style("opacity", 0)
    d3.selectAll(".typecrono").transition("light").duration(200).delay(300).style("opacity", 1)
    d3.selectAll(".ordcro").transition("mostrar").duration(200).delay(300).style("opacity", 1)
}

d3.select("#ordcro").on("click", (evento) => admincrono())

function adminrel() {
    d3.selectAll(".ordcro").transition("begone").duration(300).style("opacity", 0)
    d3.selectAll(".link").transition("dark").duration(300).style("opacity", 0)
    d3.selectAll(".typedate").transition("light").duration(200).delay(300).style("opacity", 1)
    d3.selectAll(".ordrel").transition("mostrar").duration(200).delay(300).style("opacity", 1)

}
d3.select("#ordrel").on("click", (evento) => adminrel())

function crearvis1() {
    d3.json("juegos.json").then(games => {
        let legames = games.juegos
        let lelinks = games.links

        const fuerza = d3.forceLink(lelinks).id((legames) => legames.nombre).strength(2)
        const simulation = d3.forceSimulation(legames).force("link", fuerza).force("colision", d3.forceCollide(5))

        const escalaOG = circlescales(legames)

        //función para determinar las posiciones de source/target luego de ser movidas

        function findi(name) {
            counter = 0
            while (counter <= 15) {
                if (name == (legames[counter]).nombre) {
                    return counter
                    break
                }
                counter += 1
            }
        }
        function moveline(name) {
            i = findi(name)

            return [350 + 300 * Math.cos(escalaOG(i)), 450 + 300 * Math.sin(escalaOG(i))]
        }


        const lineas = SVG1
            .append("g")
            .attr("stroke-opacity", 1)
            .selectAll("line")
            .data(lelinks)
            .join("line")
            .attr("stroke", (d) => colorear(d.type))
            .attr("stroke-width", 2)
            .attr("class", "link")
            .attr("class", ((d) => `s${d.source.nombre} t${d.target.nombre} link type${d.type}`))

        simulation.on("tick", () => {
            lineas.attr("x1", (d) => moveline(((d.source).nombre))[0])
                .attr("y1", (d) => moveline(((d.source).nombre))[1])
                .attr("x2", (d) => moveline((d.target).nombre)[0])
                .attr("y2", (d) => moveline((d.target).nombre)[1])
        })
        let juegardos = SVG1.selectAll(".jogos").data(legames, d => d.nombre).join(enter => {
            const keyhole = enter.append("g").attr("id", (d, i) => d.nombre)
            keyhole.attr("class", "keyhole")
            const tri = d3.symbol().type(d3.symbolTriangle).size(800)

            const triang = keyhole.append("path")
                .attr("d", tri)
                .attr("fill", "black")
                .attr("transform", "translate(10, 40)")
                .attr("stroke", "#fff44f")
                .attr("stroke-width", "2px")
                .attr("id", (d, i) => `tri${d.nombre}`)
                .attr("class", "tri")

            const circ1 = keyhole.append("circle").attr("r", 20).attr("cx", 10).attr("cy", 10).attr("fill", "black").attr("stroke", "#fff44f").attr("stroke-width", "2px").attr("id", (d, i) => `c1${d.nombre}`).attr("class", "c")
            const circ2 = keyhole.append("circle").attr("r", 9).attr("cx", 10).attr("cy", 10).attr("fill", "black").attr("transform", "translate(0, 15)").attr("id", (d, i) => `c2${d.nombre}`).attr("class", "c")
            keyhole.append("text").text((d, i) => d.nombre).attr("x", -30).attr("y", -20).style("fill", "white").attr("class", (d) => `comp${d.compilado} texname`)
            keyhole.append("text").text((d, i) => d.lore_position).attr("x", 0).attr("y", -40).style("fill", "#fffafa").style("opacity", 0).attr("class", "ordcro")
            keyhole.append("text").text((d, i) => d.release).attr("x", 0).attr("y", -40).style("fill", "#fffafa").style("opacity", 0).attr("class", "ordrel")
            keyhole.attr("transform", (_, i) => locate(i, escalaOG))
            keyhole.on("mouseenter", (evento, d) => adminhover(d.nombre))
                .on("mouseleave", (evento, d) => adminleave(d.nombre))
                .on("click", (evento, d) => adminclick(d))


        })






    })
}

SVG2.append("rect").attr("height", 400).attr("width", 300).attr("x", 850).attr("y", 100).attr("stroke", "red").style("opacity", 1)
const chaname = SVG2.append("text").attr("fill", "white").text("Mueve el mouse sobre una estrella").attr("x", 850).attr("y", 130)
const chapic = SVG2.append("image").attr("width", 300).attr("height", 500).attr("x", 850).attr("y", 140).style("opacity", 1)


let hovered = "uwu"
//Esta función coloreará cada link depedendiendo del tipo de link
function colrel(type) {
    if (type == "weak") { return "white" }
    if (type == "strong") { return "red" }
    if (type == "medium") { return "orange" }
}

//funcion para cambiar el valor del personaje hovereado
function suichi2(name) {
    if (hovered == name) {
        d3.selectAll(`.nodo`).attr("fill", "#f4ca16")
        hovered = "uwu"
    }
    else {
        d3.select(`.${hovered}`).attr("fill", "#f4ca16")
        hovered = name
        darklink2(name)
    }
}

//funcion para enviar imagen
function sendpic(pic) {
    chapic.transition("oscurecer").duration(200).style("opacity", 0)
    setTimeout(() => {
        chapic.attr("href", pic)
    }, 220);

    chapic.transition("laito").delay(300).duration(200).style("opacity", 1)
}


//funcion para administrar acciones al hacer click
function adminclick2(per) {
    darklink2(per.name)
    d3.select(`.${per.name}`).attr("fill", "red")
    suichi2(per.name)
}


//funcion para oscurecer las lineas que no tengan de source o target el personaje
function darklink2(name) {
    if (hovered == "uwu" || hovered == name) {
        d3.selectAll(".link2").transition("dark").duration(200).style("opacity", 0)
        d3.selectAll(`.s${name}`).transition("light1").delay(200).duration(200).style("opacity", 1)
        d3.selectAll(`.t${name}`).transition("light2").delay(200).duration(200).style("opacity", 1)
    }
}


//funcion para enviar el nombre
function sendname(name) {
    chaname.transition("oscurecer").duration(200).style("opacity", 0)
    chaname.transition("cambiar nombre").delay(200).duration(100).text(name)
    chaname.transition("iluminar").delay(300).duration(200).style("opacity", 1)
}
// función para administrar lo que ocurre al hacer hover
function adminhover2(per) {
    darklink2(per.name)
    sendpic(per.foto)
    sendname(per.name)
}


function lightlink2(name) {
    if (hovered == "uwu") {
        d3.selectAll(".link2").transition("reiluminar").duration(400).style("opacity", 1)
    }
}
//Funcion para administrar lo que ocurre al salir
function adminleave2(name) {
    lightlink2(name)

}


function crearvis2(per, links) {

    const fuerzalinks = d3.forceLink(links).id((d) => d.name).strength(enlace => {
        if (enlace.fuerza == "strong") {
            return 3
        }
        if (enlace.fuerza == "medium") {
            return 1.5
        }
        if (enlace.fuerza == "weak") {
            return 0.5
        }
    })
    const simulation2 = d3.forceSimulation(per).force("linkisu", fuerzalinks).force("colision", d3.forceCollide(75)).force("centro", d3.forceCenter(400, 500))

    const links2 = SVG2
        .append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", (d) => colrel(d.fuerza))
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", 2)
        .attr("class", (d) => `link2 s${d.source.name} t${d.target.name}`)


    const nodes = SVG2
        .append("g")
        .attr("stroke", "#E0FFFF")
        .attr("stroke-width", "2px")
        .selectAll("circle")
        .data(per)
        .join("circle")
        .attr("fill", "#f4ca16")
        .attr("r", 10)
        .on("mouseenter", (evento, d) => adminhover2(d))
        .on("mouseleave", (evento, d) => adminleave2(d.name))
        .on("click", (evento, d) => adminclick2(d))
        .attr("class", (d) => `${d.name} nodo`)
        ;

    simulation2.on("tick", () => {

        nodes
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y);
        links2
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y)


    });
}



crearvis1()
d3.json("personajes+links.json").then(data => {
    crearvis2(data.personajes, data.enlaces)
})