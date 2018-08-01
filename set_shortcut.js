vid = null;
next_bt = null;
prev_bt = null;
prev_url = '';
next_url = '';

function change_song(command) {
	if(command == 'PREVIOUS' && prev_bt) {
		if(getComputedStyle(prev_bt).display == 'none'){
			if(vid.currentTime <= 30){
				window.history.back();
			} else {
				vid.currentTime = 0;
				vid.play();
			}
		} else {
			prev_bt.click();
		}
	}
	else if(command == 'NEXT' && next_bt) {
		next_bt.click();
	}
	else if(command == 'PLAY/PAUSE'){
		if(vid.paused){
			vid.play();
		} else {
			vid.pause();
		}
	}
	else if(command == 'PAUSE'){
		vid.pause();
	}
	else if(command == 'LIST'){
		manPlaylist();	
	}
}

function main() {
	console.log("set_shortcut.js: started main()");
	vid = document.getElementsByTagName('video')[0];
	if (!vid) {
		setTimeout(main, 300);
		console.log("set_shortcut.js: Not Found Video");
	} else {
		console.log("set_shortcut.js: Found Video");
		next_bt = document.evaluate("//a[contains(@*, 'next')][contains(@*, 'button')]", document, null, 9).singleNodeValue;
		prev_bt = document.evaluate("//a[contains(@*, 'prev')][contains(@*, 'button')]", document, null, 9).singleNodeValue;
		//Update url information.
		//Setting Video Attribute.
		vid.addEventListener("ended", function(){change_song("NEXT");})
		vid.addEventListener("play", function(){chrome.runtime.sendMessage("PLAYED");});
		if (/^https{0,1}:\/\/www.youtube.com\/watch\?/.test(document.location.href)) {
			chrome.runtime.sendMessage("PLAYED");
		}
		chrome.runtime.onMessage.addListener(change_song);
		console.log("set_shortcut.js: main() is finishing...");
	}
}

function manPlaylist(){
	//DnBプレイリストに追加・削除を行う　DOMの差し替えタイミングまで
	//Loopして待機する
	function loop() {
		dnb_bt = document.querySelector("#yt-uix-videoactionmenu-menu li[data-item-name='DnB']");
		if (dnb_bt) {
			dnb_bt.click();
		} else {
			setTimeout(loop, 500);
		}
	}
	//まだログインしていない場合
	login_bt = document.evaluate("//button[./span[contains(text(), 'ログイン')]]", document, null, 9).singleNodeValue;
	if (login_bt) {
		login_bt.click();
	}
	//「追加」ボタンを探して押し、Menuの表示を待機
	add_bt = document.querySelector("button[title*='追加']");
	if (add_bt) {
		add_bt.style.opacity = 0.5;
		add_bt.click();
		setTimeout(loop, 1500)
	}
}


//console.log("set_shortcut.js: Invoked");
main();
