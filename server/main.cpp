#include <stdlib.h>
#include <iostream>
#include <string>
#include <sstream>
#include <time.h>
#include "websocket.h"
#include <queue>
#include <array>


using namespace std;
vector<string> list_of_userID;
int yellowscore = 0;
int greenscore = 0;
int canvas_w;  //450
int canvas_h;  //450
int cell_w = 10;
//bool gamestarted = false;
//bool quit = false;
string d1 = "right";
string d2 = "right";
vector<pair<int, int>> snake1;
vector<pair<int, int>> snake2;
struct food_t {
	int x;
	int y;
}food;
bool StartPaint = false;
//int receivetime = 0;
//int receivetime2 = 0;

struct MessageData {
	string message;
	int latency;
	int generate_time;
	int send_time;
};
queue<MessageData> result;

int default_latency = 0;  //for all clients
bool use_random_latency = true;  //change this bool to use latency list below
int sleeptime = 60;

array<int, 50> latency_list_init = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
									0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
									0, 0, 0, 0, 0, 0, 0, 0, 0, 200};
vector<int> latency_list(latency_list_init.begin(), latency_list_init.end());
int latency_index = 0;




void get_random_latency(){
	if (latency_index == 50)
		latency_index = 0;
	default_latency = latency_list[latency_index];
	latency_index++;
}


int currentDateTime() {
	int time;
	time = GetTickCount();
	//char currentTime[84] = "";
	//sprintf(currentTime,"%d/%d/%d  %d:%d:%d %d",st.wDay,st.wMonth,st.wYear, st.wHour, st.wMinute, st.wSecond , st.wMilliseconds);
	return time;
}


int calculate_time(int receivingtime, int sendingtime)
{
	//cout <<" receivingtime    " << receivingtime << endl;
	//cout <<" sendingtime    " << sendingtime << endl;
	return sendingtime - receivingtime;
}



void create_food(){
	srand(time(NULL));
	int foodx = rand() % ((canvas_w - cell_w) / cell_w);
	int foody = rand() % ((canvas_h - cell_w) / cell_w);
	//cout << "food:      " << ((canvas_w - cell_w) / cell_w) << " " << canvas_w << "  " << canvas_h << endl;
	food.x = foodx;
	food.y = foody;
}

void create_snake(){
	int length = 5;
	snake1.clear();
	snake2.clear();
	for (int i = length - 1; i >= 0; i--){
		snake1.push_back(make_pair(i, 0));
		snake2.push_back(make_pair(i, canvas_h / cell_w - 1));
	}
}

bool check_collision(int x, int y, vector<pair<int, int>> snake){
	for (int i = 0; i < snake.size(); i++){
		if (snake[i].first == x && snake[i].second == y){
			return true;
		}
	}
	return false;
}

void change_dir(string message){
	if (message == "1right" && d1 != "left") d1 = "right";
	else if (message == "1up" && d1 != "down") d1 = "up";
	else if (message == "1left" && d1 != "right") d1 = "left";
	else if (message == "1down" && d1 != "up") d1 = "down";
	else if (message == "2right" && d2 != "left") d2 = "right";
	else if (message == "2up" && d2 != "down") d2 = "up";
	else if (message == "2left" && d2 != "right") d2 = "left";
	else if (message == "2down" && d2 != "up") d2 = "down";
}

void food_pos(int xpos, int ypos){
	food.x = xpos;
	food.y = ypos;
}


string Game(){
	int nx = snake1[0].first;
	int ny = snake1[0].second;
	int mx = snake2[0].first;
	int my = snake2[0].second;

	if (d1 == "right") nx++; 
	else if (d1 == "left") nx--;
	else if (d1 == "up") ny--;
	else if (d1 == "down") ny++;

	if (d2 == "right") mx++;
	else if (d2 == "left") mx--;
	else if (d2 == "up") my--;
	else if (d2 == "down") my++;

	if(nx == -1 || mx == -1 || nx == canvas_w/cell_w || mx == canvas_w/cell_w || ny == -1 || my == -1 || ny == canvas_h/cell_w || my == canvas_h/cell_w ||
		check_collision(nx, ny, snake1) || check_collision(mx, my, snake2) || check_collision(nx, ny, snake2) || check_collision(mx, my, snake1))
	{
		yellowscore = 0;
		greenscore = 0;
		d1 = "right";
		d2 = "right";
		create_snake();
		create_food();
		//return ("*|" + to_string(yellowscore) + "," + to_string(greenscore));
		return ("&|5,0^4,0^3,0^2,0^1,0!5,44^4,44^3,44^2,44^1,44*"+ to_string(food.x) + "," + to_string(food.y) + "$0,0");
	}

	pair<int, int> tail = make_pair(nx, ny);
	pair<int, int> tail2 = make_pair(mx, my);

	if (nx == food.x && ny == food.y){
		//pair<int, int> tail = 
		yellowscore++;
		create_food();
	}
	else{
		//pair<int, int> tail = snake1[snake1.size()-1];
		//pair<int, int> tail = make_pair(nx, ny);
		snake1.pop_back();
		//tail.first = nx;
		//tail.second = ny;
	}
	snake1.insert(snake1.begin(), tail);

	if (mx == food.x && my == food.y){
		//pair<int, int> tail2 = 
		greenscore++;
		create_food();
	}
	else{
		//pair<int, int> tail2 = snake2[snake2.size() - 1];
		//pair<int, int> tail2 = make_pair(mx, my);
		snake2.pop_back();
		//tail2.first = mx;
		//tail2.second = my;
	}
	snake2.insert(snake2.begin(), tail2);

	//Sending back strings:
	string snakeString1 = "";
	string snakeString2 = "";
	string foodString = "";
	string scoreString = "";
	for (int i = 0; i < snake1.size(); i++){
		snakeString1 += (to_string(snake1[i].first) + "," + to_string(snake1[i].second) + "^");
	}
	for (int i = 0; i < snake2.size(); i++){
		snakeString2 += (to_string(snake2[i].first) + "," + to_string(snake2[i].second) + "^");
	}
	foodString += to_string(food.x) + "," + to_string(food.y);
	scoreString += to_string(yellowscore) + "," + to_string(greenscore);
	return ("&|" + snakeString1.substr(0, snakeString1.length()-1) + "!" + snakeString2.substr(0, snakeString2.length()-1) + "*" + foodString + "$" + scoreString);
}



void split(const string& s, char delim,vector<string>& v) {
    auto i = 0;
    auto pos = s.find(delim);
    while (pos != string::npos) {
      v.push_back(s.substr(i, pos-i));
      i = ++pos;
      pos = s.find(delim, pos);

      if (pos == string::npos)
         v.push_back(s.substr(i, s.length()));
    }
}




webSocket server;

/* called when a client connects */
void openHandler(int clientID){
    ostringstream os;
    os << "Stranger " << clientID << " has joined.";

    vector<int> clientIDs = server.getClientIDs();
    for (int i = 0; i < clientIDs.size(); i++){
        if (clientIDs[i] != clientID)
            server.wsSend(clientIDs[i], os.str());
    }
    server.wsSend(clientID, "Welcome!");
}

/* called when a client disconnects */
void closeHandler(int clientID){
    ostringstream os;
    os << "Stranger " << clientID << " has leaved.";
    vector<int> clientIDs = server.getClientIDs();
    for (int i = 0; i < clientIDs.size(); i++){
		server.wsClose(clientIDs[i]);
		if (clientIDs[i] == clientID){
			//clientIDs.erase(clientIDs.begin()+ i);
			list_of_userID.erase(list_of_userID.begin()+i);
        }
    }
}

/* called when a client sends a message to the server */
void messageHandler(int clientID, string message){
    //ostringstream os;
    //os << "Stranger " << clientID << " says: " << message;
	//if (message[0] == '#'){
	//	os << message.substr(1,message.length());
	//}
	int receivetime = currentDateTime();
	//get_random_latency();
	//cout << message << endl;
	if (message == "#1checker"){
		MessageData message_data = {message, default_latency, receivetime, 0};
		result.push(message_data);
	}
	else if (message == "#2checker"){
		MessageData message_data = {message, default_latency, receivetime, 0};
		result.push(message_data);
	}
	else{
		//srand(time(NULL));
		//int Latency = rand() % ;
		MessageData message_data = {message, default_latency, receivetime, 0};
		result.push(message_data);
	}

}

void sendMessage()
{
	vector<int> clientIDs = server.getClientIDs();

	while (!result.empty()){
		ostringstream os;
		int currentTime = currentDateTime();
		//while (result.size() != 0){
		MessageData message_data = result.front();
		//cout << "!!!!!!!!!!!!!!!!          " << currentTime - message_data.generate_time << endl;
		//这里有问题，我暂时减去了延迟。但这么做之后计算的延迟是准确的，算是fix了。改成40sleeptime的时候基本准确。
		if (message_data.send_time == 0){
			message_data.send_time = currentTime - default_latency;
		}
		int pop_time = message_data.generate_time + message_data.latency;
		string message = message_data.message;
		//cout << "1               " << message << endl;
		if (currentTime < pop_time){
			break;
		}
		//cout << "2               " << message << endl;
		if (message[0] == '^'){
			string canvas_data = message.substr(1);
			vector<string> canvas;
			split(canvas_data, ',', canvas);
			canvas_w = atoi(canvas[0].c_str());
			canvas_h = atoi(canvas[1].c_str());
			//cout << "canvas!!!!!!!:      " << canvas_w << " " << canvas_h << " " << cell_w << endl;
		}
		else if (message[0] == '#'){
			if (message == "#opengame"){
				if (list_of_userID.size() > 1)
					os << "#|2";
				else
					os << "#|1";
			}
			else if (message == "#checkgame"){
				if (list_of_userID.size() > 1)
					os << "#|GAMEREADY";
			}
			else if (message == "#startgame"){
				yellowscore = 0;
				greenscore = 0;
				d1 = "right";
				d2 = "right";
				create_snake();
				create_food();
				os << "#|RUNGAME";
				//string newgame = Game();
				//os << newgame;
				//string newgame = Game();
				//cout << newgame << endl;
				//os << newgame;
			}
			else if (message == "#showname"){
				if (list_of_userID.size() > 1)
					os << "%|----Player List----\n" << "Player 1: " + list_of_userID[0] + "\nPlayer 2: " + list_of_userID[1] + "\n";
				else
					os << "%|----Player List----\n" << "Player 1: " + list_of_userID[0];
			}
			else if (message == "#1checker"){
				vector<int> clientIDs = server.getClientIDs();
				
				//Sleep(message_data.latency);
				//int send_time = currentDateTime();
				int TimeDifference = calculate_time(message_data.generate_time, message_data.send_time);
				//cout << "1:        " << TimeDifference << endl;
				//if (os.str() != "")
				os << "+|" << TimeDifference;
				server.wsSend(clientIDs[0], os.str());
				//return;
			}
			else if (message == "#2checker"){
				vector<int> clientIDs = server.getClientIDs();
				//Sleep(message_data.latency);
				//int send_time = currentDateTime();
				//cout << "client 2    " << receivetime << endl;
				int TimeDifference = calculate_time(message_data.generate_time, message_data.send_time);

				//cout <<"2:        " << TimeDifference << endl;
				//if (os.str() != "")
				os << "+|" << TimeDifference;
				server.wsSend(clientIDs[1], os.str());
				//return;
			}
		}
		else if (message[0] == '*'){
			if (message == "*paint"){
				//string newgame = Game();
				//cout << newgame << endl;
				//os << newgame;
				StartPaint = true;
			}
			//else
			//	os << message;
		}
		else if (message[0] == '@'){
			string userID = message.substr(1,message.length());
			vector<int> clientIDs = server.getClientIDs();
			if (clientIDs.size() > 2){
				os << "@|Already existed two players: Cannot connect to the server.";
				server.wsSend(clientIDs[2], os.str());
				server.wsClose(clientIDs[clientIDs.size()-1]);
			}
			else if (clientIDs.size() > 1){
				os << "@|Player " + userID + " join the game.\nPlease click the \"start game\" button to start.\n--------------------------------";
				list_of_userID.push_back(userID);
			}
			else{
				os << "@|Player " + userID + " join the game.\nPlease wait for another player joining the game.\n--------------------------------";
				list_of_userID.push_back(userID);
			}
		}
		else if (message[0] == '1'){
			if (message == "1right")
				change_dir(message);
			else if (message == "1left")
				change_dir(message);
			else if (message == "1up")
				change_dir(message);
			else if (message == "1down")
				change_dir(message);
		}
		else if (message[0] == '2'){
			if (message == "2right")
				change_dir(message);
			else if (message == "2left")
				change_dir(message);
			else if (message == "2up")
				change_dir(message);
			else if (message == "2down")
				change_dir(message);
		}
		else if (message[0] == '&'){
			//Sleep(message_data.latency);
			os << message;
		}
		//if (message[0] == '*'){
		//	if (message == "*newfood"){
		//		srand (time(NULL));
		//		int foodx = rand() % ((canvas_w - cell_w) / cell_w);
		//		int foody = rand() % ((canvas_h - cell_w) / cell_w);
		//		os << "*|"+ to_string(foodx) + "," + to_string(foody);
		//	}
		//}
		//if (message[0] == '$'){
		//	if (message == "$Yellow"){
		//		yellowscore++;
		//		os << "$|Yellow";
		//	}
		//	if (message == "$Green"){
		//		greenscore++;
		//		os << "$|Green";
		//	}
		//}
		vector<int> clientIDs = server.getClientIDs();

		//cout << "sending message:    " <<  message << endl;
		if (message != "#1checker" && message != "#2checker"){
			for (int i = 0; i < clientIDs.size(); i++){
				//if (clientIDs[i] != clientID)
				//cout << os.str() << endl;
				server.wsSend(clientIDs[i], os.str());
			}
		}
		result.pop();
	}
	
		
	//}
}

/* called once per select() loop */
void periodicHandler(){
	//current_time = currentDateTime();

    static time_t next = time(NULL) + 0;
    time_t current = time(NULL);
    if (current >= next){
        //ostringstream os;
        string timestring = ctime(&current);
        timestring = timestring.substr(0, timestring.size() - 1);
        //os << timestring;
		
		if (StartPaint){
			if (use_random_latency)
				get_random_latency();
			string newgame = Game();
			//cout << newgame << endl;
			int curtime = currentDateTime();
			MessageData message = {newgame, default_latency, curtime, 0};
			result.push(message);
			Sleep(sleeptime);
			//os << newgame;
		}
		//Sleep(500);
		sendMessage();

        //vector<int> clientIDs = server.getClientIDs();
        //for (int i = 0; i < clientIDs.size(); i++)
        //    server.wsSend(clientIDs[i], os.str());

        next = time(NULL) + 0;
    }
}

int main(int argc, char *argv[]){

    int port;
	
    cout << "Please set server port: ";
    cin >> port;


    /* set event handler */
    server.setOpenHandler(openHandler);
    server.setCloseHandler(closeHandler);
    server.setMessageHandler(messageHandler);

    server.setPeriodicHandler(periodicHandler);

	//sendMessage();

    /* start the chatroom server, listen to ip '127.0.0.1' and port '8000' */
    server.startServer(port);

    return 1;
}
