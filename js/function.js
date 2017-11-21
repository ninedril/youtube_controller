function VideoManager() {
    //Properties
    this.video = null;
    this.title = '';
    this.next_bts = [];

    //Init
    this.video = document.getElementsByTagName('video')[0];
    this.video.onended = function() {
        this.playNext();
    }

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
    this.getNextBt = function() {
        var next_bts = [];

        //1st: xpath selection (select candidates)
        var xpath_exps = [
            '/html/body/descendant::*[self::button or self::a][contains(@*, "next")]'
        ];
        for(var exp of xpath_exps) next_bts.push(getNodesByXpath(exp));
        
        //1st check
        if(next_bts.length == 1) return this.next_bts = next_bts;
        if(next_bts.length == 0) return null;

        //2nd: visible selection (whether its visible or not)    
        next_bts = next_bts.filter(function(element){
            return (element.clientWidth > 0);
        });

        //2nd check
        if(next_bts.length == 1) return this.next_bts = next_bts;
        if(next_bts.length == 0) return null;
    }
}

function countDuplication(array) {
    var counts = {};
    for(var i=0; i<array.length; i++) {

    }
}

function getNodesByXpath(exp, root_node = document) {
    var nodes = [];
    var r = document.evaluate(exp, root_node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
    for(var i=0; i<r.snapshotLength; i++) nodes.push(r.snapshotItem(i));
    return nodes;
}

function synonymDict() {
    this.next = [
        'next', '次', 'succeeding'
    ];
    this.previous = [
        'previous', '前', 'prev'
    ];
}

function findNextBt() {
    var next_synonyms = ['next', '次', 'succeeding'];
    var button_tag_names = ['button', 'a'];

    var xpath_exps = [
        '/html/body/descendant::*' + tag_name_exp + tag_attr_exp
    ];
}

function getCombination(hash) {
  var total = 1;
  for(var key in hash) {
      total = total*hash[key].length
  }

  for(var k=0; k<total; k++) {
      for(var l=0; )
  }
}