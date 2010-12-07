//////////////////////////////////////////
//
// ロジックを記述するJS.
//
//////////////////////////////////////////

/**
 * postitテーブル用DAO.
 * 一度だけ初期化する.
 */
var postitDao = require('dirty')('db/postit.db');


/**
 * DBから初期データを取得.
 */
exports.findAll = function initData(){

    console.log('findAll');

    var array = [];    
    postitDao.forEach(
	function(key, val) {
	    console.log('key=' + key);
	    console.log('val=' + val);
	    array.push(val);
	}
    );

    return JSON.stringify(array);
};


/**
 * postidデータを登録する.
 * @param divId  
 * @param message 
 */
exports.insert = function(divId,message) {
    console.log("insert postit");
    postitDao.set(divId, message);
};

/**
 * postidデータを更新する.
 * @param divId  
 * @param message 
 */
exports.update = function(divId,message){
    console.log("update");
    var postit = JSON.parse(postitDao.get(divId));
    postit.message = JSON.parse(message).message;
    postitDao.set(divId, JSON.stringify(postit));
};

/**
 * postidデータの座標情報を更新する.
 * @param divId  
 * @param message 
 */
exports.move = function(divId,message){
    console.log("movePoint");
    var mpostit = JSON.parse(postitDao.get(divId));
    
    var pointY = JSON.parse(message).pointY;
    var pointX = JSON.parse(message).pointX;
    if(pointY !== undefined) {
	mpostit.pointY = pointY;	
    }
    if(pointX !== undefined) {
	mpostit.pointX = pointX;	
    }
    console.log("mpostit.pointY=" + mpostit.pointY);
    console.log("mpostit.pointX=" + mpostit.pointX);
    postitDao.set(divId, JSON.stringify(mpostit));
};

/**
 * postidデータを編集する.
 * @param divId  
 */
exports.edit =function(divId,message){
    console.log("edit");
    var mpostit = JSON.parse(postitDao.get(divId));
    mpostit.color = JSON.parse(message).color;
    console.log(mpostit);
    postitDao.set(divId, JSON.stringify(mpostit));
};


/**
 * postidデータを削除する.
 * @param divId  
 */
exports.remove =function(divId){
    
    console.log("remove");
    postitDao.rm(divId, 
	   function(){
	       console.log(divId + "is deleted.");
	   });
};