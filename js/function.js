function VideoManager() {
    //Properties
    this.video = document.getElementsByTagName('video')[0];
    this.title;

    //Methods
	this.play = function() { 
		this.video.paused ? this.video.play() : this.video.pause();
    }
    this.timer = function(wait_min) {
        setTimeout(this.play.bind(this), wait_min*60*1000);
    }
    this.replay = function() {
        this.video.currentTime = 0;
        this.video.play();
    }
    this.getTitle = function() {
        //動画タイトルを含むタグのXPath表現の配列
        var exps = [
            '/html/body/descendant::*[self::h1 or self::h2 or self::h3][contains(@*, "title")][text()]'
        ];
        var title = null;

        for (var exp of exps) {
            var r = document.evaluate(exp, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE);
            if(r.snapshotLength == 1) {
                title = r.snapshotItem(0).textContent;
                break;
            }
        }
        this.title = title;
        return title;
    }
}
