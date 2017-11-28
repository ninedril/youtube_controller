/*********************************************************************
Youtubeを制御するためのクラス
*********************************************************************/
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
        var next_synonyms = ['next', '次', 'succeeding'];
        var button_tag_names = ['button', 'a'];
        var nodes_nextBts = null;
    
        nodes_nextBt = selectVisible(getNodesByWords(next_synonyms, button_tag_names))[0];
    
        return nodes_nextBt;
    }
}

/*********************************************************************
配列を操作する関数
*********************************************************************/
function combine(array) {
    //array = 配列の配列
    //例：combine([['a', 'b', 'c'], ['e', 'f', 'g']]) = ['ae', 'af', ...'cg'](9)

    var a1 = array.shift();
    var a2 = array.shift();

    var result = [];
    for(var e1 of a1) {
        for(var e2 of a2) {
            result.push(e1 + e2);
        }
    }

    if(array.length > 0) {
        for(var e of array) {
            result = combine([result, e]);
        }
    }
    return result;
}

function arrayUnique(array) {
    var result = [];
    result = array.filter((e, i, a) => a.indexOf(e) === i);
    return result;
}

/*********************************************************************
XPath文字列を生成する関数
*********************************************************************/
function makeXPathOfTagNames(tag_names) {
    //must be Array and at least 1 element
    if(! Array.isArray(tag_names)) return '';
    if(tag_names.length == 0) return '';
    
    //main process
    var result = tag_names.map(e => 'self::' + e).join(' or ');
    result = '[' + result + ']';
    return result;
}

function makeXPathsOfContain(words) {
    //must be Array and at least 1 element
    if(! Array.isArray(words)) return [];
    if(words.length == 0) return [];

    //main
    var result = [];
    result = words.map(e => '[descendant::text()[contains(., "' + e + '")]]');
    Array.prototype.push.apply(result, words.map(e => '[attribute::*[contains(., "' + e + '")]]'));
    return result;
}

/*********************************************************************
DOM操作（ノード取得）に関する関数
*********************************************************************/
function getNodesByXpath(exp, root_node = document) {
    var nodes = [];
    var r = document.evaluate(exp, root_node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
    for(var i=0; i<r.snapshotLength; i++) nodes.push(r.snapshotItem(i));
    return nodes;
}

function getNodesByXpaths(exps, root_node = document) {
    var nodes = [];
    for(e of exps) Array.prototype.push.apply(nodes, getNodesByXpath(e));
    return nodes;
}

function getNodesByWords(words, tag_names=[]) {
     /************************************
    検索方針
    (1)文字列配列words内にあるテキスト、もしくは属性をもつtag_namesタグを収集(Nodes)
    (2)Nodesを、表示されているもののみでフィルター
    ************************************/
    result_nodes = [];
    var xpath_tag_names = makeXPathOfTagNames(tag_names);
    var xpaths_words = makeXPathsOfContain(words);

    if(xpath_tag_names) {
        var xpaths_nodes = combine([
            ['/html/body/descendant::*'], [xpath_tag_names], xpaths_words
        ]);
    } else {
        var xpaths_nodes = combine([
            ['/html/body/descendant::*'], xpaths_words
        ]);
    }
    result_nodes = arrayUnique(getNodesByXpaths(xpaths_nodes));

    return result_nodes;
}

/*********************************************************************
ノードをフィルターする関数
*********************************************************************/
function selectVisible(nodes) {
    nodes = nodes.filter((e) => e.clientWidth > 0);
    return nodes;
}