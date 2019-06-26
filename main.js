'use strict'

let cv = document.getElementById('cv')
let ctx = cv.getContext('2d')
let canvasMode = 0
let mouseMode = 1
let pontos = []
let AABB = {x: 100000, y: 100000, w: 0, h: 0}
let circulo = {x: 100000, y: 100000, r: 0}
let mousePos = {x: 0, y: 0, w: 50, h: 50}
let mousePadding = 50

cv.addEventListener('click', click)
cv.addEventListener('mousemove', move)

/* AABB */

function setAABB() {
    for (let ponto of pontos) {
        AABB.x = Math.min(AABB.x, ponto.x)
        AABB.y = Math.min(AABB.y, ponto.y)
        AABB.w = Math.max(AABB.w, ponto.x)
        AABB.h = Math.max(AABB.h, ponto.y)
    }
}

function drawAABB(color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.rect(AABB.x, AABB.y, AABB.w - AABB.x, AABB.h - AABB.y)
    ctx.fill()
}

function testAABB2AABB() {
    return  (mousePos.x >= AABB.x || mousePos.x + mousePadding >= AABB.x) &&
            (mousePos.x + mousePadding <= AABB.w || mousePos.x <= AABB.w) &&
            (mousePos.y >= AABB.y || mousePos.y + mousePadding >= AABB.y) &&
            (mousePos.y + mousePadding <= AABB.h || mousePos.y <= AABB.h)
}

/* círculo */

function setCircle(){
    let x = AABB.w - AABB.x
    let y = AABB.h - AABB.y
    let r = distance(x, y) / 2

    circulo.x = AABB.x + ((AABB.w - AABB.x) / 2)
    circulo.y = AABB.y + ((AABB.h - AABB.y) / 2)
    circulo.r = r
}

function testCircle2AABB(){
    let r = testAABB2AABB()
    let p1 = distance(Math.abs(mousePos.x - circulo.x), Math.abs(mousePos.y - circulo.y))
    let p2 = distance(Math.abs(mousePos.x + mousePadding - circulo.x), Math.abs(mousePos.y - circulo.y))
    let p3 = distance(Math.abs(mousePos.x - circulo.x), Math.abs(mousePos.y + mousePadding - circulo.y))
    let p4 = distance(Math.abs(mousePos.x + mousePadding - circulo.x), Math.abs(mousePos.y + mousePadding - circulo.y))
    
    return (r || ((p1 <= circulo.r) || (p2 <= circulo.r) || (p3 <= circulo.r) || (p4 <= circulo.r)))
}

function testCircle2Circle(){
    let d1 = distance(Math.abs(circulo.x - (mousePos.x + mousePadding / 2)), Math.abs(circulo.y - (mousePos.y + mousePadding / 2)))

    return d1 <= circulo.r + mousePadding / 2
}

function distance(width, height){
    return Math.sqrt(width * width + height * height)
}

function drawCircle(color){
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(circulo.x, circulo.y, circulo.r, 0, 2 * Math.PI)
    ctx.fill()
}

/* OBB */



/* funções comuns */

function click(e){
    pontos.push({x: e.clientX, y: e.clientY})
    if (canvasMode === 0) {
        setAABB()
        if (mouseMode === 1){
            setCircle()
        }
    }

    draw()
}

function move(e){
    setMouse(e)
    draw()
}

function drawMouse(type){
    ctx.beginPath()
    if (type === 'quadrado') ctx.rect(mousePos.x, mousePos.y, mousePadding, mousePadding)
    else ctx.arc(mousePos.x + mousePadding / 2, mousePos.y + mousePadding / 2, mousePadding / 2, 0, 2 * Math.PI) 
    ctx.stroke()
}

function clear(){
    ctx.clearRect(0, 0, 500, 500)
}

function draw(){
    clear()

    if (canvasMode === 0){
        if (pontos.length > 1){ 
            (testAABB2AABB()) ? drawAABB('blue') : drawAABB('red')
            if (mouseMode === 1){
                setCircle();
                (testCircle2Circle()) ? drawCircle('blue') : drawCircle('red')
                drawMouse('circulo')
            }
            else{
                drawMouse('quadrado')
            }
        }
    } 
    for (let ponto of pontos){
        ctx.beginPath()
        ctx.arc(ponto.x, ponto.y, 1, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

function setMouse(e){
    mousePos = {x: e.clientX - (mousePadding / 2), y: e.clientY - (mousePadding / 2)}
}