'use strict'

let cv = document.getElementById('cv')
let ctx = cv.getContext('2d')
let pontos = []
let AABB = {x: 100000, y: 100000, w: 0, h: 0}

cv.addEventListener('click', click)
cv.addEventListener('mousemove', move)

function click(e){
    pontos.push({x: e.clientX, y: e.clientY})
    draw()
    if (pontos.length > 1) setAABB()
}

function move(e){
    clear()
    draw()

    ctx.beginPath()
    ctx.rect(e.clientX - 25, e.clientY - 25, 50, 50)
    ctx.stroke()
}

function clear(){
    ctx.clearRect(0, 0, 500, 500)
}

function draw(){
    for (let ponto of pontos){
        ctx.beginPath()
        ctx.arc(ponto.x, ponto.y, 1, 0, 2 * Math.PI)
        ctx.stroke()
    }
    if (pontos.length > 1) drawAABB()
}

function drawAABB(){
    ctx.beginPath()
    ctx.rect(AABB.x, AABB.y, AABB.w - AABB.x, AABB.h - AABB.y)
    ctx.stroke()
}

function setAABB(){
    for (let ponto of pontos){
        AABB.x = Math.min(AABB.x, ponto.x)
        AABB.y = Math.min(AABB.y, ponto.y)
        AABB.w = Math.max(AABB.w, ponto.x)
        AABB.h = Math.max(AABB.h, ponto.y)
    }
}