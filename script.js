document.addEventListener("DOMContentLoaded", onHtmlLoaded);
function onHtmlLoaded(){
		var startPage = document.getElementById("startPage");
		var startButton = document.getElementById("start");
		  if (performance.navigation.type == 1) {
		    startPage.style.display = "none";
		  } else {
		    start.addEventListener("click", function(){
			startPage.style.display = "none";
		});
		  }
		var cookies = getCookiesAsObject();
		if (storageAvailable("localStorage")){
			var maxScore = localStorage.getItem("maxScore");
		} else {
			var maxScore = cookies.maxScore;
		}
		var record = document.getElementById("record");
		record.innerHTML = maxScore;


		main = document.getElementById("main");
		var svgns = "http://www.w3.org/2000/svg";
		var lives = document.getElementById("lives");
		var tries = document.getElementById("tries");
		var box = document.getElementById("box");
		var score = document.getElementById("score");
		var level = document.getElementById("level");
		var g;
		lives.innerHTML = "5";
		score.innerHTML = "0";
		var changeScore = 0;
		var w = 50;
		var h = 50;
		var angle = 45;
		var MyTarget = {};
		MyTarget.lives = 5;
		MyTarget.score = 0;
		MyTarget.difficulty = 2;
		MyTarget.difficultyCalc = 2;
		MyTarget.level = 1;
		level.innerHTML = MyTarget.level;
		build();
		function build(){
				while (MyTarget.difficultyCalc <= MyTarget.difficulty){
					changeScore = changeScore + MyTarget.difficultyCalc * MyTarget.difficultyCalc * 60;
					MyTarget.difficultyCalc++;
				}
				if (MyTarget.score >= changeScore){
					MyTarget.difficulty++;
				}
			lives.innerHTML = MyTarget.lives;
			if (MyTarget.lives == 0){

				if (MyTarget.score > maxScore){
					maxScore = MyTarget.score;
				}
				if (storageAvailable("localStorage")){
					localStorage.setItem("maxScore", maxScore);
				} else {
					document.cookie = "maxScore=" + maxScore;
				}
				// alert("You lose!");
				var youCan = document.getElementById("youCan");
				var startAgainButton = document.getElementById("startAgain");
				youCan.style.display = "flex";
				startAgainButton.addEventListener("click", function(){
					window.location.reload();
				});
					
			}
			for (var i = 0; i < 60; i++){
				g = main.getElementById(i);
				while (g.children.length != 1){
					g.removeChild(g.lastChild);
				}	
			}
			MyTarget.distance = [];
			var distances = [];
			for (var i = 0; i<60; i++){
				var g = main.getElementById(i);
				var rect = g.getElementsByTagName("rect");
				var x = parseInt(rect[0].attributes[0].value);
				var y = parseInt(rect[0].attributes[1].value);
				var arr = [x, y, x+w, y, x+w, y+h, x, y+h];
				var arr1 = [];
				var a = Math.floor(Math.random() * MyTarget.difficulty)*6;
				MyTarget.distance[i]=a;
				distances[i]=a;
				for (var j = 0; j < 8; j=j+2){
					var c = Math.sin(angle * Math.PI / 180)*a;
					var b = Math.cos(angle * Math.PI / 180)*a;
					arr1[j] = arr[j] - c;
					arr1[j+1] = arr[j+1] - b;
				}
				var rect = document.createElementNS(svgns, "rect");
				rect.setAttributeNS(null, "x", arr1[0]);
				rect.setAttributeNS(null, "y", arr1[1]);
				rect.setAttributeNS(null, "width", 50);
				rect.setAttributeNS(null, "height", 50);
				rect.setAttributeNS(null, "class", "up");
				rect.setAttributeNS(null, "fill", "url(#gradUp)");


				var polygon1 = document.createElementNS(svgns, "polygon");
				var polygonPoints1 = arr1[2] + "," + arr1[3] + " " + arr[2] + "," + arr[3] + " " + arr[4] +
				"," + arr[5] + " " + arr1[4] + "," + arr1[5];
				polygon1.setAttributeNS(null, "points", polygonPoints1);
				polygon1.setAttributeNS(null, "fill", "url(#gradRight)");
				var polygon2 = document.createElementNS(svgns, "polygon");
				var polygonPoints2 = arr1[4] + "," + arr1[5] + " " + arr[4] + "," + arr[5] + " " + arr[6] +
				"," + arr[7] + " " + arr1[6] + "," + arr1[7];
				polygon2.setAttributeNS(null, "points", polygonPoints2);
				polygon2.setAttributeNS(null, "fill", "url(#gradBottom)");
				g.appendChild(polygon1);
				g.appendChild(polygon2);
				
				g.appendChild(rect);
			}

			MyTarget.removedBoxes = 0;

			var index = 0;
			distances.sort(function(a, b){return b-a});
			var unique = [distances[0]];
			var ind = 0;
			for (var i = 0; i < distances.length; i++){
				if (distances[i] !== unique[ind]){
					ind++;
					unique[ind] = distances[i];
				}
			}
			MyTarget.numbers = [];
			for (var i = 0; i < unique.length; i++){
				MyTarget.numbers[i] = {max: unique[i], maxNr: 0};
				for (var j = 0; j < distances.length; j++) {
					if (MyTarget.numbers[i].max == distances[j]){
						MyTarget.numbers[i].maxNr++;
					}
				}
			}
			MyTarget.tries = 5;
			tries.innerHTML = MyTarget.tries;
			MyTarget.maxInd = 0;
			box.innerHTML = MyTarget.numbers[MyTarget.maxInd].maxNr;
		}
		main.addEventListener("click", erase);

		function erase(e){
			if (e.target.id !== "main"){
			var gId = e.target.parentNode.id;
			g = main.getElementById(gId);
				while (g.children.length != 1){
					g.removeChild(g.lastChild);
				}
				if (MyTarget.distance[gId] == MyTarget.numbers[MyTarget.maxInd].max){
					MyTarget.score = MyTarget.score + MyTarget.difficulty;
					score.innerHTML = MyTarget.score;
					MyTarget.numbers[MyTarget.maxInd].maxNr--;
						
					box.innerHTML = MyTarget.numbers[MyTarget.maxInd].maxNr;
					if (MyTarget.numbers[MyTarget.maxInd].maxNr == 0){
						MyTarget.maxInd++;
						if (MyTarget.maxInd < MyTarget.numbers.length){
						box.innerHTML = MyTarget.numbers[MyTarget.maxInd].maxNr;
					}
					}
				} else {
					MyTarget.tries--;
					tries.innerHTML = MyTarget.tries;
					for(var i = 0; i < MyTarget.numbers.length; i++){
						if (MyTarget.distance[gId] == MyTarget.numbers[i].max){
							MyTarget.numbers[i].maxNr--;
						}
					}
				}
				if (MyTarget.tries == 0){
					MyTarget.lives--;
					build();
				}
				MyTarget.removedBoxes++;
				if (MyTarget.removedBoxes == 60){
					MyTarget.level++;
					level.innerHTML = MyTarget.level;
					build();
				}
			}
		}
}
function getCookiesAsObject() {
    var cookiesString = document.cookie;
    
    var cookiesArray = cookiesString.split("; ");
    
    var cookies = {};
    cookiesArray.forEach(function(c) {
        var cookie = c.split("=");
        var key = cookie[0]; 
        var value = cookie[1];
        cookies[key] = value;
    });

    return cookies;
}
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}