artist_title = '';

function main(){
	//alert("[muadd_cs.js] main() has started");
	if(!/^https{0,1}:\/\/www.youtube.com\/watch\?/.test(document.location.href)){
		//alert("[muadd_cs.js] Not youtube.com/watch");
		setTimeout(main, 10000);
		return;
	}
	var title_node = document.evaluate("//h1[contains(@*, 'title')]", document, null, 9).singleNodeValue;
	if(!title_node){
		setTimeout(main, 2000);
		return;		
	}
	var new_at = title_node.textContent.trim();
	if(artist_title == new_at || !new_at){
		setTimeout(main, 10000);
		return;
	}
	artist_title = new_at;
	//alert("[muadd_cs.js] Artist-title is " + artist_title);
	
	var inserted_HTML = '<button id="muadd_bt" class="muadd_button" type="button">'
		+ '<span id="before_text">MUADD</span>'
		+ '<span id="after_text">Add to list..</span></button>'
		+ '<form id="muadd_form" action="http://localhost:7000" method="post">'
		+ '<input id="muadd_inp" type="hidden" name="title" value=""></form>'

	title_node.parentNode.innerHTML = title_node.parentNode.innerHTML + inserted_HTML;
	var muadd_form = document.querySelector("#muadd_form");
	var muadd_inp = document.querySelector("#muadd_inp");
	var muadd_bt = document.querySelector("#muadd_bt");
	muadd_bt.addEventListener("click", function(){submit_title(muadd_form, muadd_inp, artist_title);}, false);
	$("#muadd_bt").click(function(){$("#muadd_bt").fadeOut(350, "linear");});
	setTimeout(main, 10000);
}

function submit_title(form, input, at) {
	if(at){
		input.value = at;
		form.submit();
	}
}

function manPlaylist(){
	//DnBプレイリストheno追加・削除を行う　DOMの差し替えタイミングまで
	//Loopして待機する
	function loop() {
		dnb_bt = document.querySelector("#yt-uix-videoactionmenu-menu li[data-item-name='DnB']")
		if (dnb_bt) {
			dnb_bt.click()
		} else {
			setTimeout(loop, 300);
		}
	}
	//まだログインしていない場合
	login_bt = document.evaluate("//button[./span[contains(text(), 'ログイン')]]", document, null, 9).singleNodeValue;
	if (login_bt) {
		login_bt.click();
	}
	//「追加」ボタンを探して押し、Menuの表示を待機
	add_bt = document.querySelector("button[title*='追加']");
	add_bt.style.opacity = 0.5;
	add_bt.click();
	loop();
}
//and CSS
#yt-uix-videoactionmenu-menu {
	display: none;
}
//alert("[muadd_cs.js] Hello.");
main();
