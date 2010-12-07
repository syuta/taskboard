//マウス移動に必要な定数
var IS_MOUSE_DOWN = "IS_MOUSE_DOWN";
var MOUSE_X = "MOUSE_X";
var MOUSE_Y = "MOUSE_Y";
var POINT_X = "POINT_X";
var POINT_Y = "POINT_Y";

//付箋のサイズ
var POSTIT_WIDTH  = 105;
var POSTIT_HEIGHT = 75;

(function () {


/* -------------------------------------------------------------------
 * ページがロードされたときの処理
 * ----------------------------------------------------------------- */
$(window).bind("load", 
  function() {
      // ドラッグ要素を取り出す
      $('#srcarea').bind('dragstart',
          function(evt) {
	      var orgEvent = evt.originalEvent;
	      var elm = orgEvent.target;
	      orgEvent.dataTransfer.setData('Text', elm.id);
	      orgEvent.dataTransfer.effectAllowed = "copy";
	      orgEvent.stopPropagation();
	  });

      $('#srcarea').bind('dragend',
          function(evt) {
	      var orgEvent = evt.originalEvent;

	  });
      
      // ドロップ領域に各種イベントリスナーをセット
      $('#droparea').bind("dragenter", function(evt){
			      var orgEvent = evt.originalEvent;
			      orgEvent.preventDefault();
			  });
      
      $('#droparea').bind("dragover", function(evt) {
			      var orgEvent = evt.originalEvent;
			      orgEvent.preventDefault();
			  });
      
      $('#droparea').bind("drop", function(evt) {
			      var orgEvent = evt.originalEvent;
			      var id = orgEvent.dataTransfer.getData('Text');
			      var target = $('#' + id)[0];

			      var pointX = orgEvent.offsetX;
			      var pointY = orgEvent.offsetY;

			      if(target) {
				  //DIV要素作成
				  var divId = create_privateid(10);
				  createDiv(divId,pointY,pointX,"","");
				  sendCreateDiv(divId,pointY,pointX);
				  
			      }
			      orgEvent.preventDefault();
			      
			  });
      //初期データ取得
      $.ajax(
	  {
	      type: "GET",
	      url: "/init",
	      data: "",
	      success: function(data){
		  console.log("initialize.");
		  for(var record in data){
		      var postit = JSON.parse(data[record]);
		      console.log(postit);
		      createDiv(postit.divId,postit.pointY,postit.pointX,postit.message,postit.color);
		  }
	      }
	  });
      
  });
     
 })();

//div要素作成
function createDiv(divId,pointY,pointX,message,color){
    console.log("pointY=" + pointY);
    console.log("pointX=" + pointX);
    $(document.createElement("div"))
	.attr('id',divId)
	.css({
		 position:'absolute',
		 top:pointY,
		 left:pointX
	     })
        .addClass("postit")
        .addClass(color)
	.mousemove(
	    function(e){
		
		if (this[IS_MOUSE_DOWN] != true){
		    return;
		}
		
		//ドロップエリア情報取得
		var area = $('#droparea')[0];
		
		//現在のマウス座標取得
		var x = e.clientX;
		var y = e.clientY;
		var pointX =  Math.floor( this.offsetLeft + x - this[MOUSE_X]);
		var pointY =  Math.floor( this.offsetTop + y - this[MOUSE_Y]);
		//境界値取得
		var maxX =  area.offsetWidth - POSTIT_WIDTH;
		var maxY =  area.offsetHeight - POSTIT_HEIGHT;
		
		if(pointX > 0 && pointX < maxX) {
		    this.style.left = pointX + "px";
		    this[MOUSE_X] = x;
		    this[POINT_X] = pointX;
		} 
		if(pointY > 0 && pointY < maxY) {
		    this.style.top = pointY + "px";
		    this[MOUSE_Y] = y;
		    this[POINT_Y] = pointY;
		}
		
		//付箋の移動
		sendMoveDiv(divId,pointY,pointX);
		
	    })
	.mousedown(function(e){
		       this[IS_MOUSE_DOWN] = true;
		       this[MOUSE_X] = e.clientX;
		       this[MOUSE_Y] = e.clientY;
		   })
	.mouseup(function(e){
		     this[IS_MOUSE_DOWN] = false;
		     sendMovePointEnd(divId,this[POINT_Y],this[POINT_X],"");

		 })
	.mouseout(function(e){
		      this[IS_MOUSE_DOWN] = false;
		  })
	.appendTo("#droparea")
	.append(createTextArea(message))
	.append(createEditButton())
	.append(createDeleteButton());
    
}

//テキストエリア内容変更
function changeMessage(id,message){
    $('#' + id + '>textArea').val(message);
}

//付箋の編集
function editMessage(id,color)　{
    $('#' + id)
	.removeClass("green")
	.removeClass("blue")
	.removeClass("pink")
	.removeClass("white")
	.addClass(color);
}

//付箋の削除
function deleteMessage(id)　{
    $('#' + id).remove();
}

//付箋のドラッグ移動を追跡
function changeMouse(id,pointX,pointY)　{
    $('#' + id).css({left:pointX,top:pointY});
}



//付箋用途のテキストエリア作成
function createTextArea(message){
    return $(document.createElement("textArea"))
	.css({
		 width:POSTIT_WIDTH - 5,
		 height:POSTIT_HEIGHT - 5	  
	     })
        .val(message)
        .change(function(){
		    sendChangeMessage(this.parentElement.id,this.value);
		});
}
//付箋編集用ボタン作成
function createEditButton(){
    return $(document.createElement("input"))
	.attr({  type: "button",
		 value: "edit"}) 
        .click(dialogClick);

}

//付箋削除用ボタン作成
function createDeleteButton(){
    return $(document.createElement("input"))
	.attr({  type: "button",
		 value: "delete"}) 
        .click(function(){
		   sendDeleteMessage(this.parentElement.id);
		   deleteMessage(this.parentElement.id);
	       });
}

//n桁のランダムなIDを作成
function create_privateid( n ){
    var CODE_TABLE = "0123456789"
        + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        + "abcdefghijklmnopqrstuvwxyz";
    var r = "";
    for (var i = 0, k = CODE_TABLE.length; i < n; i++)
        r += CODE_TABLE.charAt(Math.floor(k * Math.random()));
    return r;
}


//編集ボタンがおされたときのdialogの作成
function dialogClick() {
    
    $("#dialog")
	.dialog({
		    autoOpen: false,
		    title: "change postit",
		    minWidth: 300,
		    minHeight:200,
		    position:"center",
		    modal:true, 
		    buttons: {
			"Yes": function(event) {
			    var color = $("#dialog>input[@type='radio']:checked").val();
			    var divId = $("#dialog").dialog("option","divId");
			    sendEditMessage(divId,color);
			    editMessage(divId,color);
			    $(this).dialog("close");
			},				       
			"No": function() { $(this).dialog("close"); }
		    }
		});
    
    $("#dialog").dialog("option","divId",this.parentElement.id);
    $("#dialog").dialog("open");
};
