'use strict'

let cv = document.getElementById('cv')
let ctx = cv.getContext('2d')
let mode = 0
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

function setCirculo(){
    let x = AABB.w - AABB.x
    let y = AABB.h - AABB.y
    let h = Math.sqrt(x * x + y * y) / 2


    ctx.beginPath()
    ctx.arc(AABB.x + ((AABB.w - AABB.x) / 2), AABB.y + ((AABB.h - AABB.y) / 2), h, 0, 2 * Math.PI)
    ctx.stroke()
}

/* funções comuns */

function click(e){
    pontos.push({x: e.clientX, y: e.clientY})
    if (mode === 0) setAABB()
    draw()
}

function move(e){
    setMouse(e)
    draw()
}

function drawMouse(){
    ctx.beginPath()
    ctx.rect(mousePos.x, mousePos.y, mousePadding, mousePadding)
    ctx.stroke()
}

function clear(){
    ctx.clearRect(0, 0, 500, 500)
}

function draw(){
    clear()

    if (mode === 0){
        if (pontos.length > 1) (testAABB2AABB()) ? drawAABB('blue') : drawAABB('red')
        if (pontos.length > 1) setCirculo()
        drawMouse()
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