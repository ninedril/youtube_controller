function VideoManager() {
	this.video = document.getElementsByTagName('video')[0];
	this.play = function() { 
		this.video.paused ? this.video.play() : this.video.pause();
    }
    this.timer = function(wait_min) {
        setTimeout(this.play.bind(this), wait_min*60*1000);
    }
}
