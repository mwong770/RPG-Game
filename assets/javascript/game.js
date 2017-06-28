
// variables to capture userChar and enemy DMG and HP values for global use and to update
var userCharDMG = 0;
var userCharHP = 0;
var enemyDMG = 0;
var enemyHP = 0;

// variables to capture player object when chosen for global use
var userChosen;
var enemyChosen;

// boolean variables to identify when dancers chosen and still in battle area
var userChar = false;
var enemy = false;

// variables to capture original HP and DMG values to use for reset
var originalUserDMG = 0;
var originalUserHP = 0;
var originalEnemyHP = 0;

// counter to count how many enemies have been chosen to use for rearranging position of remaining opponents
var enemyChosenCount = 0;

// counter to count how many enemies have lost to use for reset
var enemyLosses = 0;

// variables used to animate Gifs
var state = "still";
var animate = "";
var still = "";

// replaces player to correct div location and hides character so can't be chosen  
function replacePlayer(player) {
	switch($(player).attr("id")) {
		case "player1":
			$("#player1Div").html(player);
			$("#player1").hide();
			break;
		case "player2":
			$("#player2Div").html(player);
			$("#player2").hide();
			break;
		case "player3":
			$("#player3Div").html(player);
			$("#player3").hide();
			break;
		case "player4":
			$("#player4Div").html(player);
			$("#player4").hide();
			break;
	}
}

// animates gifs
function animateGif(playerImg) {

	if (enemy === true && userChar === true && userCharHP > 0) {

		state = $(playerImg).find("img").attr("data-state");
		animate = $(playerImg).find("img").attr("data-animate");
		still = $(playerImg).find("img").attr("data-still");

 		if(state == "still") {
        	$(playerImg).find("img").attr("src", animate);
        	$(playerImg).find("img").attr("data-state", "animate");
    	}   									

    		else if (state == "animate") {
       			$(playerImg).find("img").attr("src", still);
        		$(playerImg).find("img").attr("data-state", "still");
    		}

    	state = $(playerImg).find("img").attr("data-state");
	}											
}

// when user loses, displays instructions
// when enemy loses, increases enemyLosses, returns values to original DMG and HP values and displays instructions,
function game() {

	if (enemy === true && userChar === true) {

		if (userCharHP > 0 && enemyHP > 0) {
			userCharHP -= enemyDMG;
			enemyHP -= userCharDMG;
			userCharDMG = parseInt(userCharDMG) + parseInt(originalUserDMG);
		}

		$(userChosen).find(".DMG").html(userCharDMG);
		$(userChosen).find(".HP").html(userCharHP);
		$(enemyChosen).find(".HP").html(enemyHP);

		if (userCharHP <= 0 && enemyHP <= 0) {
			$("#message").html("You both lost. Please press reset to play again");
		}

		if (userCharHP <= 0 && enemyHP > 0) {
			$("#message").html("You lost. Please press reset to play again.");
		}
	
		if (userCharHP > 0 && enemyHP <= 0) {
  		
  			$(enemyChosen).find(".HP").html(originalEnemyHP);
  		
			enemyLosses ++;
	
 			if (enemyLosses === 3) {
				$("#message").html("Congratulations. You defeated all opponents. Press reset to play again.");
 			}
		 		else {
					$("#message").html("You won! Choose another opponent.");
				} 		

  			replacePlayer(enemyChosen);
	
			enemy = false;

		} 
	} 
}  

// resets game, setting userChar and enemy to false so new characters can be chosen
// replaces userChosen and user HP and DMG values, used to reset after user wins or if reset before someone loses
// replaces latest enemyChosen and enemy HP and DMG values if reset before someone loses
$("#reset").on("click", function() {

	userChar = false;
	enemy = false;
	enemyChosenCount = 0;
	
	$(".playerDiv").removeClass("col-xs-12 col-sm-12 col-md-12 col-lg-12");
	$(".playerDiv").removeClass("col-xs-6 col-sm-6 col-md-6 col-lg-6");
	$(".playerDiv").addClass("col-xs-3 col-sm-3 col-md-3 col-lg-3");
	$("#remainingOpponents").html("");

	$(userChosen).find(".HP").html(originalUserHP);
	$(userChosen).find(".DMG").html(originalUserDMG);
	replacePlayer(userChosen);
	$(enemyChosen).find(".HP").html(originalEnemyHP);
	replacePlayer(enemyChosen);
	$(".playerDiv").show();
	$("#player1").show();
	$("#player2").show();
	$("#player3").show();
	$("#player4").show();

	enemyLosses = 0;

	$("#message").html("Please choose a character.");

}); 

// animates images and plays music when click dance for 1.6s, then stills image and stops music
$("#dance").on("click", function () {

	if (enemy === true && userChar === true && userCharHP > 0  && state === "still") {

		animateGif(userChosen);
		animateGif(enemyChosen);
		
		var music = document.getElementById("audio");
        music.loop = true; 
        music.play(); 
		
        function stopMusic() {
    		music.pause();
		}

		setTimeout(animateGif, 1600, userChosen);
		setTimeout(animateGif, 1600, enemyChosen);
		setTimeout(stopMusic, 1600);
		setTimeout(game, 1600);

	} 

}); 

// moves image, DMG and HP of player clicked to userChar or enemy location
// gets DMG and HP values of player clicked and puts in userCharDMG and userCharHP to be modified during game 
// puts in originalUserDMG and originalUserHP to retain original values for use during reset
$(document).ready(function() {

	$(".playerDiv").on("click", function () {
		
		$(this).hide();
		
		if (enemy === false) {
			
			if (userChar === false) {
				userChosen = $(this).find(".player").attr("id");
				$("#userChar").html(userChosen);
				userChar = true;

				originalUserDMG = $(userChosen).find(".DMG").attr("value");
				originalUserHP = $(userChosen).find(".HP").attr("value");
				userCharDMG = $(userChosen).find(".DMG").attr("value");
				userCharHP = $(userChosen).find(".HP").attr("value");

				$("#message").html("Please choose an opponent.");
			} 
				else {
					enemyChosen = $(this).find(".player");
					$("#enemy").html(enemyChosen);
					enemy = true;
					enemyChosenCount++;

					if (enemyChosenCount === 1) {
						$(".playerDiv").removeClass("col-xs-3 col-sm-3 col-md-3 col-lg-3");
						$(".playerDiv").addClass("col-xs-6 col-sm-6 col-md-6 col-lg-6");
						$("#remainingOpponents").append("Remaining Opponents");
					} 	else if (enemyChosenCount === 2) {
							$(".playerDiv").removeClass("col-xs-6 col-sm-6 col-md-6 col-lg-6");
							$(".playerDiv").addClass("col-xs-12 col-sm-12 col-md-12 col-lg-12");
						}

					enemyDMG = $(enemyChosen).find(".DMG").attr("value");
					enemyHP = $(enemyChosen).find(".HP").attr("value");
					originalEnemyHP = $(enemyChosen).find(".HP").attr("value");

					$("#message").html("Click the dance button to begin the battle.")
				}
		} 

	}); 

});











