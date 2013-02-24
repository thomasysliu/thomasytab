/*
var qcode_frm = document.getElementById('iframe1') ;
if ( qcode_frm != null ){
	var font_tag = document.getElementsByTagName('font');
	var found = false;
	for (var i in font_tag) {
		if ( font_tag[i].innerHTML == null ){
				continue;
		}
		if( font_tag[i].innerHTML.search('驗證碼')!=-1 ){
			font_tag[i].innerHTML ="";
			found =true;
		}
	}
	if(found){
		document.forms[0].elements['qCode'].style.visibility='hidden';
		document.forms[0].onsubmit='';
		chrome.extension.sendRequest({cmd:"clear", url: "cos.adm.nctu.edu.tw" });
		document.getElementById('iframe1').style.display='none';
	}
}

*/
// JavaScript Document


if( document.body.innerHTML != null){
var regex = new RegExp('ipr');
if (regex.test(document.body.innerHTML)) {
    document.getElementById("submit").click();
}
var regex = new RegExp('pchome');
if (regex.test(document.body.innerHTML)) {
    document.getElementsByName("frmSetPreceptor")[0].submit();
}

//var regex = /驗證碼/;
//if(regex.test(document.body.innerHTML )){
//document.body.innerHTML += '<a onclick="return chrome.extension.sendRequest({cmd:\'clear\', url: \'cos.adm.nctu.edu.tw\' });" class="refresh-link"><div class="refresh">一直不能登入？</div></a>';
//}


var regex = new RegExp('Proxy');
if (regex.test(document.body.innerHTML) || document.URL == "http://cos.adm.nctu.edu.tw/" || document.URL == "http://cos.adm.nctu.edu.tw/index.asp" || document.URL == "https://cos.adm.nctu.edu.tw/" || document.URL == "https://cos.adm.nctu.edu.tw/index.asp") {

    //document.body.innerHTML += '<a href="http://thomasy.tw/" class="refresh-link"><div class="refresh">一直不能登入？</div></a>';


    var a = document.createElement('a');
    var div = document.createElement('div');
    div.className = 'refresh';
    div.innerHTML = '一直不能登入？';
    a.className = 'refresh-link';
    a.appendChild(div);
    a.onclick = function () {
        chrome.extension.sendRequest({
            cmd: 'clear',
            url: 'cos.adm.nctu.edu.tw'
        });
        window.location = "http://cos.adm.nctu.edu.tw";
        //window.onload = function() {  
        //document.body.innerHTML +="<div class='notify'><div class='msg-out'><div class='msg'>已經嘗試解決這個問題，您可以立即<a href='http://cos.adm.nctu.edu.tw/'>重新登入</a>。</div>	</div></div>";
        //}
        //document.body.innerHTML +="<div class='notify'><div class='msg-out'><div class='msg'>已經嘗試解決這個問題，請再試一次。</div>	</div></div>";
        return false;
    };

    document.body.appendChild(a);


}








var regex = new RegExp('Proxy');
if (regex.test(document.body.innerHTML)) {

    //document.body.innerHTML += '<a href="http://thomasy.tw/" class="refresh-link"><div class="refresh">一直不能登入？</div></a>';
    //document.body.innerHTML +="<div class='notify'><div class='msg-out'><div class='msg'>哎呀真糟糕,系統發生錯誤，您可以嘗試<a href='http://cos.adm.nctu.edu.tw/'>重新登入</a>。</div>	</div></div>";
    var a2 = document.createElement('a');
    var a3 = document.createElement('a');
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    var div3 = document.createElement('msg');
    div1.className = 'notify';
    div2.className = 'msg-out';
    div3.className = 'msg';

    div3.innerHTML = '哎呀真糟糕,系統發生錯誤，您可以嘗試 ';
    a2.innerHTML = "重新登入";
    a2.href = 'http://cos.adm.nctu.edu.tw/';
    a3.innerHTML = "重新載入此頁";
    a3.href = '#';
    a2.onclick = function () {
        chrome.extension.sendRequest({
            cmd: 'clear',
            url: 'cos.adm.nctu.edu.tw'
        });
        window.location = "http://cos.adm.nctu.edu.tw";
        //window.onload = function() {  
        //}
        //document.body.innerHTML +="<div class='notify'><div class='msg-out'><div class='msg'>已經嘗試解決這個問題，請再試一次。</div>	</div></div>";
        return false;
    };

    a3.onclick = function () {
        window.location.reload();
        //window.onload = function() {  
        //}
        //document.body.innerHTML +="<div class='notify'><div class='msg-out'><div class='msg'>已經嘗試解決這個問題，請再試一次。</div>	</div></div>";
        return false;
    };

    div3.appendChild(a2);
    div3.innerHTML += ' 或 ';
    div3.appendChild(a3);

    div2.appendChild(div3);
    div1.appendChild(div2);
    document.body.appendChild(div1);

}




}
/////////////////////////////////////

var img = document.getElementById('img');


function getCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}


function grayscale(pixels, args) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        // CIE luminance for the RGB
        // The human eye is bad at seeing red and blue, so we de-emphasize them.
        var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
}

function getPixels(img) {
    //console.log( "img.width = " + img.width  + "  img.height = " +  img.height );
    var c = getCanvas(img.width, img.height);
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, c.width, c.height);
}

function filterImage(filter, image, var_args) {
    var args = [getPixels(image)];
    for (var i = 2; i < arguments.length; i++) {
        args.push(arguments[i]);
    }
    return filter.apply(null, args);
}


function runFilter(id, filter, arg1, arg2, arg3) {
    var c = document.getElementById(id);
    if (c != null) {
        var idata = filterImage(filter, img, arg1, arg2, arg3);
        c.width = idata.width;
        c.height = idata.height;
        var ctx = c.getContext('2d');
        ctx.putImageData(idata, 0, 0);
        c.style.display = 'inline';
    }
}

function threshold(pixels, threshold) {
    var d = pixels.data;
    for (var i = 0; i < d.length; i += 4) {
        var r = d[i];
        var g = d[i + 1];
        var b = d[i + 2];
        var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
        d[i] = d[i + 1] = d[i + 2] = v
    }
    return pixels;
}
/*
        
      grayscale = function() {
        runFilter('canvas', Filters.grayscale);
      };
 
      threshold = function() {
        runFilter('canvas', Filters.threshold, 0.1);
      };*/

function cos_filter() {
    runFilter('canvas', threshold, 0.1);

}


/////////////////////////////////////


//document.body.appendChild(a);
if (document.URL == "http://cos.adm.nctu.edu.tw/getSafeCode.asp" || document.URL == "https://cos.adm.nctu.edu.tw/getSafeCode.asp") {

    var css = '' + '<style type="text/css">' + 'body{ background-color: #F0F0F0 !important; }' + '</style>';
    //iframe.open();



    document.body.innerHTML += (css);
    var canvas = '<center><canvas id="canvas" ></canvas></center>';
    //var canvas = document.createElement("canvas");
    document.body.innerHTML += (canvas);
    //iframe.close();
    //Get safecode
    //var ctx = canvas.getContext('2d');
    //ctx.drawImage(document.getElementById('img'),0,0);
    //console.log(canvas.toDataURL());

    cos_filter();




}





/////////////////////////////////////
