
//variables to capture userChar and enemy DMG and HP values for global use and to update
var userCharDMG = 0;
var userCharHP = 0;
var enemyDMG = 0;
var enemyHP = 0;

//variables to capture player object when chosen for global use
var userChosen;
var enemyChosen;

//boolean variables to identify when dancers chosen and still in battle area
var userChar = false;
var enemy = false;

//variables to capture original HP and DMG values to use for reset
var originalUserDMG = 0;
var originalUserHP = 0;
var originalEnemyHP = 0;

//counter to count how many enemies chosen to use for reset
enemyLosses = 0;

//playerDiv used on click instead of player class to retain connection to click even after moving div 
//to new location during game
//userChosen and enemyChosen captures player chosen using player class
//moves image, DMG and HP of player clicked to userChar or enemy location
//gets DMG and HP values of player clicked and put in userCharDMG and userCharHP to be modified during game 
//and put in originalUserDMG and originalUserHP to retain original values for use during reset
//gives instructions to follow after clicking characters 
$(document).ready(function() {

	$(".playerDiv").on('click', function () {

		if (enemy == false) {

			if (userChar == false) {
				userChosen = $(this).find('.player');
				$("#userChar").html(userChosen);
				userChar = true;

				originalUserDMG = $(userChosen).find('.DMG').attr('value');
				originalUserHP = $(userChosen).find('.HP').attr('value');
				userCharDMG = $(userChosen).find('.DMG').attr('value');
				userCharHP = $(userChosen).find('.HP').attr('value');

				$("#message").html("Please choose an opponent.");
			} 
				else {
					enemyChosen = $(this).find('.player');
					$("#enemy").html(enemyChosen);
					enemy = true;

					enemyDMG = $(enemyChosen).find('.DMG').attr('value');
					enemyHP = $(enemyChosen).find('.HP').attr('value');
					originalEnemyHP = $(enemyChosen).find('.HP').attr('value');

					$("#message").html("Click the dance button to begin the battle.")
				}
		}

	});

});

//resets game, setting userChar and enemy to false so new characters can be chosen
//replaces userChosen and user HP and DMG values, used to reset after user wins or if reset before someone loses
//replaces latest enemyChosen and enemy HP and DMG values if reset before someone loses
//resets enemyLosses to 0 and gives instructions
$("#reset").on('click', function () {

	userChar = false;
	enemy = false;

	$(userChosen).find('.HP').html(originalUserHP);
	$(userChosen).find('.DMG').html(originalUserDMG);
	replacePlayer(userChosen);
	$(enemyChosen).find('.HP').html(originalEnemyHP);
	replacePlayer(enemyChosen);

	$("#player1").show();
	$("#player2").show();
	$("#player3").show();
	$("#player4").show();

	enemyLosses = 0;

	$("#message").html("Please choose a character.");

}); 

//replaces player to correct div location and hides character so can't be chosen  
//until reset when will show - this function will be used when player loses and during reset 
function replacePlayer(player) {
	switch($(player).attr('id')) {
		case 'player1':
			$("#player1Div").html(player);
			$("#player1").hide();
			break;
		case 'player2':
			$("#player2Div").html(player);
			$("#player2").hide();
			break;
		case 'player3':
			$("#player3Div").html(player);
			$("#player3").hide();
			break;
		case 'player4':
			$("#player4Div").html(player);
			$("#player4").hide();
			break;
	}
}

//variables used to animate Gifs
var state = "";
var animate = "";
var still = "";

//function to animate Gif if still and to still image if animated - to be used when click dance
function animateGif(playerImg) {

	if (enemy == true && userChar == true && userCharHP > 0) {
		state = $(playerImg).find("img").attr("data-state");
		animate = $(playerImg).find("img").attr("data-animate");
		still = $(playerImg).find("img").attr("data-still");

 		if(state == 'still') {
        	$(playerImg).find("img").attr("src", animate);
        	$(playerImg).find("img").attr("data-state",'animate');
    	}   

    	if (state == 'animate') {
       		$(playerImg).find("img").attr("src", still);
        	$(playerImg).find("img").attr("data-state",'still');
    	}
	}
}

//function to be used when click dance
//userCharDMG value increases each time click dance and displays the new value
//hp values decrease each time click dance based on dmg values and displays the new values
//specifies if (userCharHP > 0 && enemyHP > 0) to prevent calculations after user or enemy loses
//when user loses display instructions
//userChar not put at false when userCharHP <= 0 to prevent user from choosing another character before pressing reset
//when enemy loses, increase enemyLosses, return values to original DMG and HP values and display instructions,
//replace player (still hidden) and set userChar and enemy to false to allow new dancers to be chosen.
//specifies (enemy == true && userChar == true) to prevent HP, DMG, and enemyLosses from changing and last players from being
//hidden (due to replace function) if press dance before choosing a new enemy 
function play() {
	if (enemy == true && userChar == true) {

		if (userCharHP > 0 && enemyHP > 0) {
			userCharHP -= enemyDMG;
			enemyHP -= userCharDMG;
			userCharDMG = parseInt(userCharDMG) + parseInt(originalUserDMG);
		}

		$(userChosen).find('.DMG').html(userCharDMG);
		$(userChosen).find('.HP').html(userCharHP);
		$(enemyChosen).find('.HP').html(enemyHP);

		if (userCharHP <= 0) {
			$("#message").html("You lost. Please press reset to play again.");
		}
	
		if (enemyHP <= 0) {
  		
  			$(enemyChosen).find('.HP').html(originalEnemyHP);
  		
			enemyLosses ++;
	
 			if (enemyLosses == 3) {
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

//animates images when click dance for 1.6s, then stills them
//play function delayed for 1.8s so calculations and replacePlayer 
//occur after animateGif function complete
$("#dance").on('click', function () {

	if (enemy == true && userChar == true && userCharHP > 0) {

		animateGif(userChosen);
		animateGif(enemyChosen);

		setTimeout(animateGif, 1600, userChosen);
		setTimeout(animateGif, 1600, enemyChosen);

		setTimeout(play, 1800);

	}

});












