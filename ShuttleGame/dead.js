var img = document.getElementById("gameover");
var score=localStorage.getItem("score");
function resizeimg () {
	img.height=window.innerHeight-4;
	img.width=window.innerWidth-4;
}
var scorewindow= document.getElementById("score")
scorewindow.innerHTML="UFO's captured: "+score+". Congratulations!";