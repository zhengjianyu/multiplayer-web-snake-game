var SnakeGame = function(player_num)
{
	//Canvas stuff
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var Sendtime = 0;
	var latency = 0;
	var latency_array = [];
	var aver_latency_in_10 = 0;
	
	//Lets save the cell width in a variable for easy control
	var cw = 10;
	var PLAYER_NO = player_num;
	
	
	var d1 = "right";
	var d2 = "right";
	
	var start_predict = true;
	var roll_back = false;
	var lag_threshold = 65;
	var predict_list = [];
	
	var last_message = "";
	var new_message = "";
	var message_in_render = "";
	var predicted = "";
	var predict_count = 0;
	//var food;
	//var score1;
	//var score2;
	var start_log = false;
	var game_over = false;
	//Lets create the snake now
	//var snake_array_1; //an array of cells to make up the snake
	//var snake_array_2;
	
	this.init = function()
	{
		//d1 = "right"; //default direction
		//d2 = "right";
		//this.create_snake();
		//this.create_food(); //Now we can see the food particle
		//finally lets display the score
		//score1 = 0;
		//score2 = 0;
		//Lets move the snake now using a timer which will trigger the paint function
		//every 60ms
		//if(typeof game_loop != "undefined") clearInterval(game_loop);
		var self = this;
		game_loop = setInterval(function(){self.get_latency()},1000);
		//game_loop = setInterval(paint, 60);
		if (start_predict == true){
			check_latency = setInterval(function(){self.prediction()},lag_threshold);
		}
		self.paint();
	};
	//init();
	var menuenabled = true;
	

	document.getElementById("btn").onclick = function(){
		send("#startgame");
	}
	
	this.gameover = function(){
		game_over = true;
	};
	
	//this.create_snake = function()
	//{
	//	var length = 5; //Length of the snake
	//	snake_array_1 = []; //Empty array to start with
	//	snake_array_2 = [];
	//	for(var i = length-1; i>=0; i--)
	//	{
	//		//This will create a horizontal snake starting from the top left
	//		snake_array_1.push({x: i, y:0});
	//		snake_array_2.push({x: i, y:h/cw-1});
	//	}
	//};
	
	//Lets create the food now
	//this.create_food = function()
	//{
	//	send("*newfood");
		//This will create a cell with x/y between 0-44
		//Because there are 45(450/10) positions accross the rows and columns
	//};
	
	//this.food_pos = function(xpos, ypos)
	//{
	//	food = {x:xpos, y:ypos};
	//};
	
	this.canvasdata = function()
	{
		var W = w.toString();
		var H = h.toString();
		//var CW = cw.toString();
		send("^"+ W + "," + H);
	};
	
	//Lets paint the snake now
	this.paint = function()
	{
		send("*paint");
	};
	
	
	
	this.get_latency = function()
	{
		//if (Sendtime == 0){
		Sendtime = Date.now();
		//}
		//else{
			//var curtime = Date.now();
			//log(y);
			//var Client_time = curtime - Sendtime;
			//var latency = (Client_time - parseInt(y))/2;
			//log (process_time);
			//var latency = Math.round(Math.random()*300) + 500;
			
			//time = Date.now();
		//}
		//time = Date.now();
		send("#" + PLAYER_NO + "checker");
	};
	
	
	this.prediction = function()       //keep updating new message and last message
	{
		if (game_over == false){
			if (start_log){
				log("last_message:     " + last_message);
				log("new_message:     " + new_message);
			}
			if (message_in_render != "" && last_message == "" && new_message == ""){      //check whether two messages are different 
				last_message = message_in_render;                                          //to tell whether it lags.
			}
			else if (message_in_render != "" && last_message != "" && new_message == ""){
				new_message = message_in_render;
			}
			else if (message_in_render != "" && last_message != "" && new_message != ""){
				last_message = new_message;
				new_message = message_in_render;
			}
			
			if (last_message != "" && new_message != ""){ 
				if (last_message == new_message){            //LAG, predict where the snake will be in a few moves
					if (start_log){
						log("here!!!!!!!");
						start_log = false;
					}
					
					var food_score = "";
					var snakePos = "";
					if (predicted == ""){ 
						food_score = new_message.split("*")[1];
						snakePos = new_message.split("*")[0];
					}
					else{
						food_score = predicted.split("*")[1];
						snakePos = predicted.split("*")[0];
					}
					var snakeStr1 = snakePos.split("!")[0];
					var snakeStr2 = snakePos.split("!")[1];
					var snakeArray1 = new Array();
					var snakeArray2 = new Array();
					snake_array_1 = []; 
					snake_array_2 = [];
					var predict_snakePos = "";
					var predicted_message = "";
					//var d1x = 0;
					//var d1y = 0;
					//var d2x = 0;
					//var d2y = 0;
					
					//if (d1 == "right"){
					//	d1x = 1;
					//	d1y = 0;
					//}
					//if (d1 == "left"){
					//	d1x = -1;
					//	d1y = 0;
					//}
					//if (d1 == "up"){
					//	d1x = 0;
					//	d1y = -1;
					//}
					//if (d1 == "down"){
					//	d1x = 0;
					//	d1y = 1;
					//}
					//if (d2 == "right"){
					//	d2x = 1;
					//	d2y = 0;
					//}
					//if (d2 == "left"){
					//	d2x = -1;
					//	d2y = 0;
					//}
					//if (d2 == "up"){
					//	d2x = 0;
					//	d2y = -1;
					//}
					//if (d2 == "down"){
					//	d2x = 0;
					//	d2y = 1;
					//}
					
					snakeArray1 = snakeStr1.split("^");
					snakeArray2 = snakeStr2.split("^");
					for (i=0; i < snakeArray1.length; i++){
						snake_array_1.push({x: parseInt(snakeArray1[i].split(",")[0]), y:parseInt(snakeArray1[i].split(",")[1])});
					}
					for (i=0; i < snakeArray2.length; i++){
						snake_array_2.push({x: parseInt(snakeArray2[i].split(",")[0]), y:parseInt(snakeArray2[i].split(",")[1])});
					}
						
					var nx = snake_array_1[0].x;
					var ny = snake_array_1[0].y;
					var mx = snake_array_2[0].x;
					var my = snake_array_2[0].y;
					
					if(d1 == "right") nx++;
					else if(d1 == "left") nx--;
					else if(d1 == "up") ny--;
					else if(d1 == "down") ny++;
					
					if(d2 == "right") mx++;
					else if(d2 == "left") mx--;
					else if(d2 == "up") my--;
					else if(d2 == "down") my++;
					
					var tail1 = snake_array_1.pop(); 
					tail1.x = nx; tail1.y = ny;
					snake_array_1.unshift(tail1);
					
					var tail2 = snake_array_2.pop();
					tail2.x = mx; tail2.y = my;
					snake_array_2.unshift(tail2); 
					
					for(var i = 0; i < snake_array_1.length; i++)        //convert int back to string
					{
						var x_snake_piece = snake_array_1[i].x;
						var x_string = x_snake_piece.toString();
						var y_snake_piece = snake_array_1[i].y;
						var y_string = y_snake_piece.toString();
						var one_piece = x_string + "," + y_string + "^";
						predict_snakePos += one_piece;
					}
					predict_snakePos = predict_snakePos.substring(0, predict_snakePos.length - 1) + "!";
					for(var i = 0; i < snake_array_2.length; i++) 
					{
						var x_snake_piece = snake_array_2[i].x;
						var x_string = x_snake_piece.toString();
						var y_snake_piece = snake_array_2[i].y;
						var y_string = y_snake_piece.toString();
						var one_piece = x_string + "," + y_string + "^";
						predict_snakePos += one_piece;
					}
					predict_snakePos = predict_snakePos.substring(0, predict_snakePos.length - 1) + "*";
					
					predicted_message = predict_snakePos + food_score;
					//log(predicted_message);
					predicted = predicted_message;
					this.draw(predicted_message);
					predict_count++;
				}
				else{
					predicted = "";
					//predict_count = 0;
				}
			}
		}
	};
		
		
	this.cal_time = function(receive_time)
	{
		var curtime = Date.now();
		var Client_time = curtime - Sendtime;
		//log("Client_time:   " + Client_time);
		//log("receive_time:    " + receive_time);
		latency = (Client_time - receive_time);
		//log(latency);
		if (latency_array.length > 10){
			var total_latency = 0;
			for (var i = 1; i < latency_array.length; i++){
				total_latency += latency_array[i];
			}
			//log(total_latency);
			aver_latency_in_10 = total_latency/10;
			latency_array.shift();
			latency_array.push(latency);
		}
		else{
			latency_array.push(latency);
		}

	};
	
	
	this.draw = function(message)
	{
		//log(d1);
		//log(d2);
		//log(message);
		if (roll_back == false){
			if (predict_count > 1){
				predict_count--;	
			}
			else{
				message_in_render = message;                     //update message in render to tell lag
				start_predict = false;
				snake_array_1 = []; //Empty array to start with
				snake_array_2 = [];
				//To avoid the snake trail we need to paint the BG on every frame
				//Lets paint the canvas now
				var scoreString = message.split("$")[1];
				var score1 = parseInt(scoreString.split(",")[0]);
				var score2 = parseInt(scoreString.split(",")[1]);
				
				var foodString = message.split("$")[0];
				var foodPos = foodString.split("*")[1];
				var foodx = parseInt(foodPos.split(",")[0]);
				var foody = parseInt(foodPos.split(",")[1]);
				
				var snakePos = foodString.split("*")[0];
				if (snakePos == "5,0^4,0^3,0^2,0^1,0!5,44^4,44^3,44^2,44^1,44"){  //restart game and reset direction
					d1 = "right";
					d2 = "right";
				}
				
				var snakeStr1 = snakePos.split("!")[0];
				var snakeStr2 = snakePos.split("!")[1];
				
				var snakeArray1 = new Array();
				var snakeArray2 = new Array();
				
				snakeArray1 = snakeStr1.split("^");
				snakeArray2 = snakeStr2.split("^");
				for (i=0; i < snakeArray1.length; i++){
					snake_array_1.push({x: parseInt(snakeArray1[i].split(",")[0]), y:parseInt(snakeArray1[i].split(",")[1])});
				}
				for (i=0; i < snakeArray2.length; i++){
					snake_array_2.push({x: parseInt(snakeArray2[i].split(",")[0]), y:parseInt(snakeArray2[i].split(",")[1])});
				}
				
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, w, h);
				ctx.strokeStyle = "black";
				ctx.strokeRect(0, 0, w, h);
				
				//The movement code for the snake to come here.
				//The logic is simple
				//Pop out the tail cell and place it infront of the head cell
				//var nx = snake_array_1[0].x;
				//var ny = snake_array_1[0].y;
				//var mx = snake_array_2[0].x;
				//var my = snake_array_2[0].y;
				//These were the position of the head cell.
				//We will increment it to get the new head position
				//Lets add proper direction based movement now
				
				//if(d1 == "right") nx++;
				//else if(d1 == "left") nx--;
				//else if(d1 == "up") ny--;
				//else if(d1 == "down") ny++;
				
				//if(d2 == "right") mx++;
				//else if(d2 == "left") mx--;
				//else if(d2 == "up") my--;
				//else if(d2 == "down") my++;
				//Lets add the game over clauses now
				//This will restart the game if the snake hits the wall
				//Lets add the code for body collision
				//Now if the head of the snake bumps into its body, the game will restart
				//if(nx == -1 || mx == -1 || nx == w/cw || mx == w/cw || ny == -1 || my == -1 || ny == h/cw || my == h/cw || this.check_collision(nx, ny, snake_array_1) || this.check_collision(mx, my, snake_array_2) || this.check_collision(nx, ny, snake_array_2) || this.check_collision(mx, my, snake_array_1))
				//{
					//restart game
				//	send("#startgame");
					//Lets organize the code a bit now.
				//	return;
				//}
				
				//Lets write the code to make the snake eat the food
				//The logic is simple
				//If the new head position matches with that of the food,
				//Create a new head instead of moving the tail
				//if(nx == food.x && ny == food.y)
				//{
				//	var tail = {x: nx, y: ny};
				//	send("$Yellow");
					//Create new food
				//	this.create_food();
				//}
				//else
				//{
				//	var tail = snake_array_1.pop(); //pops out the last cell
				//	tail.x = nx; tail.y = ny;
				//}
				//The snake can now eat the food.
				
				//snake_array_1.unshift(tail); //puts back the tail as the first cell
				
				//if(mx == food.x && my == food.y)
				//{
				//	var tail = {x: mx, y: my};
				//	send("$Green");
					//Create new food
				//	this.create_food();
				//}
				//else
				//{
				//	var tail = snake_array_2.pop(); //pops out the last cell
				//	tail.x = mx; tail.y = my;
				//}
				//The snake can now eat the food.
				
				//snake_array_2.unshift(tail); //puts back the tail as the first cell
				
				for(var i = 0; i < snake_array_1.length; i++)
				{
					var c = snake_array_1[i];
					//Lets paint 10px wide cells
					this.paint_cell_1(c.x, c.y);
				}
				
				for(var i = 0; i < snake_array_2.length; i++)
				{
					var c = snake_array_2[i];
					//Lets paint 10px wide cells
					this.paint_cell_2(c.x, c.y);
				}
				
				//Lets paint the food
				this.paint_food(foodx, foody);
				//Lets paint the score
				if (latency_array.length < 10 || aver_latency_in_10 == 0){
					var score_text = "Yellow Score: " + score1 + "     Green Score: " + score2 + "     Latency: " + latency + "     Average: estimating";
				}
				else{
					var score_text = "Yellow Score: " + score1 + "     Green Score: " + score2 + "     Latency: " + latency + "     Average: "+ aver_latency_in_10;
				}
				ctx.fillText(score_text, 5, h-5);
			}
		}
		else{
			message_in_render = message;                     //update message in render to tell lag
			start_predict = false;
			snake_array_1 = []; //Empty array to start with
			snake_array_2 = [];
			//To avoid the snake trail we need to paint the BG on every frame
			//Lets paint the canvas now
			var scoreString = message.split("$")[1];
			var score1 = parseInt(scoreString.split(",")[0]);
			var score2 = parseInt(scoreString.split(",")[1]);
			
			var foodString = message.split("$")[0];
			var foodPos = foodString.split("*")[1];
			var foodx = parseInt(foodPos.split(",")[0]);
			var foody = parseInt(foodPos.split(",")[1]);
			
			var snakePos = foodString.split("*")[0];
			if (snakePos == "5,0^4,0^3,0^2,0^1,0!5,44^4,44^3,44^2,44^1,44"){  //restart game and reset direction
				d1 = "right";
				d2 = "right";
			}
			
			var snakeStr1 = snakePos.split("!")[0];
			var snakeStr2 = snakePos.split("!")[1];
			
			var snakeArray1 = new Array();
			var snakeArray2 = new Array();
			
			snakeArray1 = snakeStr1.split("^");
			snakeArray2 = snakeStr2.split("^");
			for (i=0; i < snakeArray1.length; i++){
				snake_array_1.push({x: parseInt(snakeArray1[i].split(",")[0]), y:parseInt(snakeArray1[i].split(",")[1])});
			}
			for (i=0; i < snakeArray2.length; i++){
				snake_array_2.push({x: parseInt(snakeArray2[i].split(",")[0]), y:parseInt(snakeArray2[i].split(",")[1])});
			}
			
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, w, h);
			ctx.strokeStyle = "black";
			ctx.strokeRect(0, 0, w, h);
			
			for(var i = 0; i < snake_array_1.length; i++)
			{
				var c = snake_array_1[i];
				this.paint_cell_1(c.x, c.y);
			}
			
			for(var i = 0; i < snake_array_2.length; i++)
			{
				var c = snake_array_2[i];
				this.paint_cell_2(c.x, c.y);
			}
			
			this.paint_food(foodx, foody);
			if (latency_array.length < 10 || aver_latency_in_10 == 0){
				var score_text = "Yellow Score: " + score1 + "     Green Score: " + score2 + "     Latency: " + latency + "     Average: estimating";
			}
			else{
				var score_text = "Yellow Score: " + score1 + "     Green Score: " + score2 + "     Latency: " + latency + "     Average: "+ aver_latency_in_10;
			}
			ctx.fillText(score_text, 5, h-5);
		}
	};
	
	//Lets first create a generic function to paint cells
	this.paint_cell_1 = function(x, y)
	{
		ctx.fillStyle = "yellow";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	};
	
	this.paint_cell_2 = function(x, y)
	{
		ctx.fillStyle = "green";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	};
	
	this.paint_food = function(x, y)
	{
		ctx.fillStyle = "blue";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "black";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	};
	
	//this.check_collision = function(x, y, array)
	//{
		//This function will check if the provided x/y coordinates exist
		//in an array of cells or not
	//	for(var i = 0; i < array.length; i++)
	//	{
	//		if(array[i].x == x && array[i].y == y)
	//		 return true;
	//	}
	//	return false;
	//};
	
	//this.change_dir = function(message)
	//{
	//	if(message == "1right") d1 = "right";
	//	else if(message == "1up") d1 = "up";
	//	else if(message == "1left") d1 = "left";
	//	else if(message == "1down") d1 = "down";
	//	else if(message == "2right") d2 = "right";
	//	else if(message == "2up") d2 = "up";
	//	else if(message == "2left") d2 = "left";
	//	else if(message == "2down") d2 = "down";
	//};
	
	//this.change_score = function(message)
	//{
	//	if (message == "Yellow")
	//		score1++;
	//	else if (message == "Green")
	//		score2++;
	//};
	
	//Lets add the keyboard controls now
		$(document).keydown(function(e){
		var key = e.which;
		if (PLAYER_NO == "1"){
		//We will add another clause to prevent reverse gear
			if(key == "65"){      									//make snake direction parameter in client 
				d1 = "left";                                        //judge whether direction is useful before 
				send(PLAYER_NO + "left");                           //sending to server                                       
			}                                                       //in order to reduce data packets. 
			else if(key == "87"){
				d1 = "up";
				send(PLAYER_NO + "up");
			}
			else if(key == "68"){
				d1 = "right";
				send(PLAYER_NO + "right");
			}
			else if(key == "83"){
				d1 = "down";
				send(PLAYER_NO + "down");
			}
		}
		else if (PLAYER_NO == "2"){
			if(key == "65"){ 
				d2 = "left";
				send(PLAYER_NO + "left");
			}
			else if(key == "87"){
				d2 = "up";
				send(PLAYER_NO + "up");
			}
			else if(key == "68"){
				d2 = "right";
				send(PLAYER_NO + "right");
			}
			else if(key == "83"){
				d2 = "down";
				send(PLAYER_NO + "down");
			}
		}
		//LURD 37-40
	})	
};


			//if(key == "65" && d1 != "right" && d1 != "left"){      //make snake direction parameter in client 
			//	d1 = "left";                                        //judge whether direction is useful before 
			//	send(PLAYER_NO + "left");                           //sending to server                                       
			//}                                                       //in order to reduce data packets. 
			//else if(key == "87" && d1 != "down" && d1 != "up"){
			//	d1 = "up";
			//	send(PLAYER_NO + "up");
			//}
			//else if(key == "68" && d1 != "left" && d1 != "right"){
			//	d1 = "right";
			//	send(PLAYER_NO + "right");
			//}
			//else if(key == "83" && d1 != "up" && d1 != "down"){
			//	d1 = "down";
			//	send(PLAYER_NO + "down");
			//}


