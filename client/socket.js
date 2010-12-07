//////////////////////////////////////////
//
// WebSocket処理のクライアントJSファイル
//
//////////////////////////////////////////

//var socket = new io.Socket("192.168.1.39",{port:8080}); 
var socket = new io.Socket("localhost",{port:8080}); 

socket.connect();

//接続時
socket.on('connect', function(){
	      //nothing..
	  });

//データ受信ハンドラ　dataは受信データ
socket.on('message', function(data){
	      var postit = JSON.parse(data);
	      if(postit.status) {
		  $('#msg').prepend(postit.id + " is disconnect.<br>");
		  
	      } else {
		  
		  switch (postit.actionId) {
		  case "createDiv":
		      createDiv(postit.divId,postit.pointY,postit.pointX);
		      break;
		  case "changeMessage":
		      changeMessage(postit.divId,postit.message);
		      break;
		  case "editMessage":
		      editMessage(postit.divId,postit.color);
		      break;
		  case "deleteMessage":
		      deleteMessage(postit.divId);
		      break;
		  case "moveDiv":
		      changeMouse(postit.divId,postit.clientX,postit.clientY);
		      break;
		  }
	      }
	  });

//サーバーからの切断時に実行されるハンドラ
socket.on('disconnect', 
	  function(){
	      alert("disconnect from server");
	  });


//websocket通信用:div要素作成のためのJSONデータを作成して送る
function sendCreateDiv(divId,pointY,pointX){    
    socket.send(
	JSON.stringify(
	    {
		actionId:"createDiv",
		divId:divId,
		message:"",
		pointY:pointY,
		pointX:pointX
	    }));
}

//websocket通信用:textAreaのメッセージ更新のためのJSONデータを作成して送る
function sendChangeMessage(id,message){
    socket.send(
	JSON.stringify(
	    {
		actionId:"changeMessage",
		divId:id,
		message:message,
		pointY:"",
		pointX:""
	    }));
}

//websocket通信用:postit編集のためのJSONデータを作成して送る
function sendEditMessage(id,color){
    socket.send(
	JSON.stringify(
	    {
		actionId:"editMessage",
		divId:id,
		color:color
	    }));
}

//websocket通信用:postit削除のためのJSONデータを作成して送る
function sendDeleteMessage(id){
    socket.send(
	JSON.stringify(
	    {
		actionId:"deleteMessage",
		divId:id
	    }));
}

//websocket通信用:付箋を移動させたときのJSONデータを作成して送る
function sendMoveDiv(id,clientY,clientX){
    socket.send(
	JSON.stringify(
	    {
		actionId:"moveDiv",
		divId:id,
		message:"",
		clientY:clientY,
		clientX:clientX
	    }));
}

//websocket通信用:付箋を移動終了時のJSONデータを作成して送る
//このときにはDBを更新する.
function sendMovePointEnd(id,pointY,pointX,message){
    socket.send(
	JSON.stringify(
	    {
		actionId:"movePointEnd",
		divId:id,
		pointY:pointY,
		pointX:pointX
	    }));
}
