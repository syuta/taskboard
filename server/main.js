//////////////////////////////////////////
//
// エンドポイントJS.
//
//////////////////////////////////////////

var io = require('socket.io');
var logic = require('./boardLogic');



//////////////////////////////////////////
//
// グローバル変数
//
//////////////////////////////////////////

//ポート番号
var port_local = 8080;


///////////////////////////////////////////
// 
// サーバー起動.
// 
///////////////////////////////////////////

var server = require('./server').Server;
server.listen(process.env.PORT || port_local);
console.log("server is running.");


//////////////////////////////////////////
//
// WebSocket設定
//
//////////////////////////////////////////
var sio = io.listen(server);   
sio.on('connection', function(client) { 	

        // Message受信時のハンドラ
        client.on(
	    'message',
	    function(message){
		//メッセージに応じてDBへの処理を変える
		var actionId = JSON.parse(message).actionId;
		var divId = JSON.parse(message).divId;
		switch (actionId) {
		case 'createDiv':
		    logic.insert(divId,message);
		    break;
		case 'changeMessage':
		    logic.update(divId,message);
		    break;
		case 'movePointEnd':
		    logic.move(divId,message);	
		    break;
		case 'editMessage':
		    logic.edit(divId,message);
		    break;
		case 'deleteMessage':
		    logic.remove(divId);
		    break;
		}

		//client.send(message); 
                client.broadcast(message);
            });

        // クライアント切断時のハンドラ
        client.on('disconnect', function(){
                // クライアントがleaveしたことを接続ユーザーへ送信
                client.broadcast(JSON.stringify(
				     {status:"disconnect",
				      id:client.sessionId}));
        });


 }) ;

