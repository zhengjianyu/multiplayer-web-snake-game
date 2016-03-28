# multiplayer-web-snake-game
A two player web game based on TCP/IP protocol

To start server, one machine should run main.cpp and specify the server port number (1000-9999 recommended).

  Example input:
  
    Please set server port: 1234
    
    Available IP:
    
      0: 127.0.0.1
      
      1: 192.168.0.9
      

After server is set, run snake.html to open the game html page.

Input the server IP/port (i.e. 192.168.0.9 and 1234) and a user name to connect.

After two player is connected, click on "start game" to play.


Read About_code.doc to test those latency mitigations (including prediction and roll back).
