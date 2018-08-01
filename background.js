function sendAll(command){
	chrome.tabs.query({url: "https://www.youtube.com/watch?*"}, function(tabs) {
		for(var i in tabs){
			chrome.tabs.sendMessage(tabs[i].id, command);
		}
	})
}

/////////////////////////////////////////////---Main---///////////////////////////////////////////////////

//Youtubeの動画ページを開いているタブリスト
played_tabid = [];

chrome.commands.onCommand.addListener(function(command) {
	if(played_tabid.length != 0){
		console.log("[background.js] Command {" + command + "} send to Tab:" + played_tabid[0]);
		chrome.tabs.sendMessage(played_tabid[0], command);
		return;
	}
});

chrome.runtime.onMessage.addListener(function(status, sender){
	console.log("[background.js] Caught message: " + status + " Sender Tab: " + sender.tab.id);
	var tabid = sender.tab.id;
	if(status == "PLAYED" || status == "LOADED"){
		//他のYoutubeを再生しているタブを再生停止にする
		chrome.tabs.query({url: "https://www.youtube.com/watch?*"}, function(tabs) {
			for(var i in tabs){
				if(tabs[i].id != tabid){
					chrome.tabs.sendMessage(tabs[i].id, "PAUSE");
				}
			}
		})
		//再生開始したタブをリスト先頭に追加する
		played_tabid.some(function(e, i){if(e == tabid){played_tabid.splice(i, 1)}});
		played_tabid.unshift(tabid);
		console.log("[background.js] played_tabid: " + played_tabid);
	}
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	var new_url = changeInfo.url;
	if(!new_url){
		return;
	}
	var re = /^https{0,1}:\/\/www.youtube.com\/watch\?/;
	//タブリストのうち、URLがYoutube以外へと遷移したタブを消去
	if(!re.test(new_url) && played_tabid.indexOf(tabId) >= 0){
		played_tabid.some(function(e, i){if(e == tabId){played_tabid.splice(i, 1)}});
		console.log('[background.js] Changed tab: ' + tabId + "  New url: " + new_url);
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
	//タブリストのうち、閉じられたタブを消去
	if(played_tabid.indexOf(tabId) >= 0){
		played_tabid.some(function(e, i){if(e == tabId){played_tabid.splice(i, 1)}});
		console.log('[background.js] Removed tab: ' + tabId);
	}
});

