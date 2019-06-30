'use strict'

let cv = document.getElementById('cv')
let m1 = document.getElementById('m1')
let c1 = document.getElementById('cv1')

let ctx = cv.getContext('2d')
let canvasMode = 0
let mouseMode = 0
let pontos = []
let AABB = {x: 100000, y: 100000, w: 0, h: 0}
let circulo = {x: 100000, y: 100000, r: 0}
let mousePos = {x: 0, y: 0, w: 50, h: 50}
let mousePadding = 100
let halfPadding = mousePadding / 2

cv.addEventListener('click', click)
cv.addEventListener('mousemove', move)

/* AABB */

function drawAABB(color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.rect(AABB.x, AABB.y, AABB.w - AABB.x, AABB.h - AABB.y)
    ctx.fill()
}

function setAABB() {
    for (let ponto of pontos) {
        AABB.x = Math.min(AABB.x, ponto.x)
        AABB.y = Math.min(AABB.y, ponto.y)
        AABB.w = Math.max(AABB.w, ponto.x)
        AABB.h = Math.max(AABB.h, ponto.y)
    }
}

function testAABB2AABB() {
    return  (mousePos.x >= AABB.x || mousePos.x + mousePadding >= AABB.x) &&
            (mousePos.x + mousePadding <= AABB.w || mousePos.x <= AABB.w) &&
            (mousePos.y >= AABB.y || mousePos.y + mousePadding >= AABB.y) &&
            (mousePos.y + mousePadding <= AABB.h || mousePos.y <= AABB.h)
}

/* círculo */

function distance(width, height) {
    return Math.sqrt(width * width + height * height)
}

function drawCircle(color) {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(circulo.x, circulo.y, circulo.r, 0, 2 * Math.PI)
    ctx.fill()
}

function setCircle(){
    let x = AABB.w - AABB.x
    let y = AABB.h - AABB.y
    let r = distance(x, y) / 2

    circulo.x = AABB.x + ((AABB.w - AABB.x) / 2)
    circulo.y = AABB.y + ((AABB.h - AABB.y) / 2)
    circulo.r = r
}

function testAABB2Circle(){
    let mcx = mousePos.x + halfPadding
    let mcy = mousePos.y + halfPadding

    let p1 = distance(Math.abs(mcx - AABB.x), Math.abs(mcy - AABB.y))
    let p2 = distance(Math.abs(mcx - AABB.w), Math.abs(mcy - AABB.y))
    let p3 = distance(Math.abs(mcx - AABB.x), Math.abs(mcy - AABB.h))
    let p4 = distance(Math.abs(mcx - AABB.w), Math.abs(mcy - AABB.h))

    let aux = distanceToSquare()

    let minX = mcx - halfPadding + aux.x
    let maxX = mcx + halfPadding - aux.x
    let minY = mcy - halfPadding + aux.y
    let maxY = mcy + halfPadding - aux.y

    AABB.inset = {x: AABB.x + aux.x, y: AABB.y + aux.y, w: AABB.w - aux.x, h: AABB.h - aux.y}

    let a1 = maxX <= AABB.inset.x && maxY <= AABB.inset.y
    let a2 = minX >= AABB.inset.w && maxY <= AABB.inset.y
    let a3 = maxX <= AABB.inset.x && minY >= AABB.inset.h
    let a4 = minX >= AABB.inset.w && minY >= AABB.inset.h

    if (a1 || a2 || a3 || a4){
        return (p1 <= halfPadding) || (p2 <= halfPadding) || (p3 <= halfPadding) || (p4 <= halfPadding)
    }
    else{
        return testAABB2AABB()
    }
}

function testCircle2AABB() {
    let r = testAABB2AABB()
    let p1 = distance(Math.abs(mousePos.x - circulo.x), Math.abs(mousePos.y - circulo.y))
    let p2 = distance(Math.abs(mousePos.x + mousePadding - circulo.x), Math.abs(mousePos.y - circulo.y))
    let p3 = distance(Math.abs(mousePos.x - circulo.x), Math.abs(mousePos.y + mousePadding - circulo.y))
    let p4 = distance(Math.abs(mousePos.x + mousePadding - circulo.x), Math.abs(mousePos.y + mousePadding - circulo.y))

    return (r || ((p1 <= circulo.r) || (p2 <= circulo.r) || (p3 <= circulo.r) || (p4 <= circulo.r)))
}

function testCircle2Circle(){
    let d1 = distance(Math.abs(circulo.x - (mousePos.x + halfPadding)), Math.abs(circulo.y - (mousePos.y + halfPadding)))

    return d1 <= circulo.r + halfPadding
}


/* funções comuns */

function checked() {
    mouseMode = (m1.checked) ? 0 : 1
    canvasMode = (c1.checked) ? 0 : 1
}

function clear() {
    ctx.clearRect(0, 0, 500, 500)
}

function click(e){
    pontos.push({x: e.clientX, y: e.clientY})
    checked()
    if (canvasMode === 0) {
        setAABB()
        if (mouseMode === 1){
            setCircle()
        }
    }

    draw()
}

function distanceToSquare() {
    let p = { x: halfPadding, y: halfPadding }
    let a = Math.sqrt(p.x * p.x + p.y * p.y)
    let b
    let c

    a = a - halfPadding

    b = a * Math.sin(0.785398)

    c = Math.sqrt(a * a - b * b)

    return { x: b, y: c }
}

function draw() {
    clear()
    checked()
    setAABB()

    if (pontos.length > 1) {
        if (canvasMode === 0) {
            (testAABB2AABB()) ? drawAABB('blue') : drawAABB('red')
            if (mouseMode === 0) {
                drawMouse(0)
            }
            else {
                (testAABB2Circle()) ? drawAABB('blue') : drawAABB('red')
                drawMouse(1)
            }
        }
        else {
            (testAABB2AABB()) ? drawAABB('blue') : drawAABB('red')
            setCircle();
            if (mouseMode === 0) {
                (testCircle2AABB()) ? drawCircle('blue') : drawCircle('red')
                drawMouse(0)
            }
            else {
                (testCircle2Circle()) ? drawCircle('blue') : drawCircle('red')
                drawMouse(1)
            }
        }
    }

    for (let ponto of pontos) {
        ctx.beginPath()
        ctx.arc(ponto.x, ponto.y, 1, 0, 2 * Math.PI)
        ctx.stroke()
    }
}

function drawMouse(type) {
    ctx.beginPath()
    if (type === 0) ctx.rect(mousePos.x, mousePos.y, mousePadding, mousePadding)
    else ctx.arc(mousePos.x + halfPadding, mousePos.y + halfPadding, halfPadding, 0, 2 * Math.PI)
    ctx.stroke()
}

function move(e){
    setMouse(e)
    draw()
}

function setMouse(e){
    mousePos = {x: e.clientX - halfPadding, y: e.clientY - halfPadding}
}