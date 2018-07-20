var socket = io();
var wWidth = $(window).innerWidth();
var wHeight = $(window).innerHeight(); 
var moveId;
var hold = false;
var move;
var origPositionTop 
var origPositionLeft;
var angle
socket.on('connect',function(){
    socket.emit('giveInitPos',{
        x:(window.innerWidth / 2) - 25,
        y:(window.innerHeight / 2) - 25
    })
})


socket.on('giveId',function(data){
    console.log(data)
})

console.log(origPositionLeft,origPositionTop)
$(".controls").on("touchstart touchmove",function(e){
    // alert("clicking")
    e.preventDefault();
    clearInterval(move)
    var thismovement = $(this)
    hold=true;
    var xVelocity=0,yVelocity=0;
    var centerX = $(this).offset().left + 100;
    var centerY = $(this).offset().top + 100;
    var mouseX = e.originalEvent.touches[0].pageX;
    var mouseY = e.originalEvent.touches[0].pageY;
    // console.log(mouseX,mouseY)
    $(this).find("a").css("transition","0s")
    $(this).find("a").offset({
        top:mouseY - 30,
        left:mouseX - 30
    })
    angle = findAngle(centerX,centerY,mouseX,mouseY);

    xVelocity = Math.cos(angle);
    yVelocity = Math.sin(angle);
    // console.log(angle)
    move = setInterval(function(){
        if(hold == true){
            socket.emit("move",{
                id:moveId,
                x:xVelocity,
                y:yVelocity
            })
        }
    },1)
    
})
$(document).on("touchend touchleave","body",function(){
    hold=false;
    clearInterval(move)
    $(this).find(".controls a").css({
        "transition":"0.3s"
    })
    $(this).find(".controls a").offset({
        top:origPositionTop,
        left:origPositionLeft
    })
})
$(".idInput a").click(function(){
    moveId = Number($(".idInput input").val());
    console.log(moveId)
    $(".idInput").hide();
    $(".controls").show();
    origPositionTop = $(".controls a").offset().top;
    origPositionLeft = $(".controls a").offset().left;
})

function remote(){
    $(".idInput").show();
    $("canvas").remove();

}
function web(){

    $("canvas").show();
    $("canvas").attr("width",wWidth).attr("height",wHeight)
    var ctx = document.getElementById('canvas').getContext("2d")

    socket.on('updatePosition',function(data){
        ctx.fillStyle = "rgba(255,255,255,0.01)"
        ctx.fillRect(0,0,$(window).innerWidth(),$(window).innerHeight());
        ctx.fillStyle = "#00a2ff"
        ctx.fillRect(data.x,data.y,50,50);
    })
}
function findAngle(x1,y1,x2,y2){
    var x= x2 - x1;
    var y = y2 - y1;
    var angleRad = Math.atan2(y,x);
    return angleRad

}