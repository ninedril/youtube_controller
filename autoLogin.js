function autoLogin() {
	var login_bt = document.evaluate("//button[./span[contains(text(), 'ログイン')]]", document, null, 9).singleNodeValue;
	if (login_bt) {
		login_bt.click();
		setTimeout(findPush, 1000)
	}
}

function findPush() {
	function loop() {
		var next_button = document.querySelector("input#next")
		var login_button = document.querySelector("input#signIn")
		//var mail_box = document.querySelector("input#Email")
		//var pass_box = document.querySelector("input#Passwd")
		if (next_button) {
			//mail_box.value = 'push.push.f5@gmail.com'
			next_button.click()
			setTimeout(loop, 100);
		}
		else if (login_button) {
			login_button.click()
		} else {
			setTimeout(loop, 100);
		}
	}
	loop();
}
