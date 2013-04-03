document.nctutab = {
    nav_bar: null,
    img: null,
    nctutab_popup: null,
    nctutab_ifr: null,
    x: null,
    y: null,
    init: function () {
        // check perf
        self.postMessage({
            action: "check_tab",
            url: document.URL
        });
        if (document.URL.search(/http(s)?:\/\/cos.adm.nctu.edu.tw\//) == 0) {
            this.inject_cos();
        } else if (document.URL.search(/http(s)?:\/\/e3.nctu.edu.tw\//) == 0 || document.URL.search(/http(s)?:\/\/dcpc.nctu.edu.tw\//) == 0) {
            this.inject_e3();
        } else if (document.URL.search(/http(s)?:\/\/portal.nctu.edu.tw/) == 0) {
            this.inject_portal();
        } else if (document.URL.search(/http(s)?:\/\/regist.nctu.edu.tw/) == 0) {
            this.inject_regist();
        } else if (document.URL.search(/http(s)?:\/\/timetable.nctu.edu.tw/) == 0) {
            document.nctutab.inject_timetable();
            document.querySelector('#flang').onchange = function() {
            	document.nctutab.inject_timetable();
            }
        }
    },
    inject_timetable: function () {
        document.querySelector('#crstime_search').onclick = function() {
            document.nctutab.cos_name_highlight();
        }
    
    },
    inject_cos: function () {
        this.cos_name_highlight();
        this.cos_autosubmit();
        this.captcha_cos();
        // front page , have proxy 
        var regex = new RegExp('Proxy');
        if (regex.test(document.body.innerHTML) || document.URL == "http://cos.adm.nctu.edu.tw/" || document.URL == "https://cos.adm.nctu.edu.tw/") {
            this.cannotlogin();
        }
        if (document.URL == "https://cos.adm.nctu.edu.tw/TeachPoll/question.asp" || document.URL == "https://cos.adm.nctu.edu.tw/en/TeachPoll/question.asp") {
            this.cos_fillquestion();
        }
        if (regex.test(document.body.innerHTML)) {
            this.cos_errorpage();
        }
    },
    inject_portal: function () {
        if (document.URL == "http://portal.nctu.edu.tw/portal/login.php" || document.URL == "https://portal.nctu.edu.tw/portal/login.php") {
            this.captcha_portal();
            this.cannotlogin();
        }
    },
    inject_regist: function () {
        if (document.URL == "http://regist.nctu.edu.tw/" || document.URL == "https://regist.nctu.edu.tw/" || document.URL == "http://regist.nctu.edu.tw/login_users.aspx" || document.URL == "http://regist.nctu.edu.tw/login_friend.aspx" || document.URL == "http://regist.nctu.edu.tw/login_tutor.aspx" || document.URL == "https://regist.nctu.edu.tw/login_users.aspx" || document.URL == "https://regist.nctu.edu.tw/login_friend.aspx" || document.URL == "https://regist.nctu.edu.tw/login_tutor.aspx") {
            this.cannotlogin();
            this.captcha_regist();
        }
        // Remove IE alert
        var ie_info = document.getElementById('Label2');
        if (ie_info != null) {
            ie_info.style.display = 'none';
        }
    },
    inject_nctutab: function () {
        if (window.frameElement === null) { // not inner frame
            document.body.style.marginTop = '32px';
            // I'm in the topmost window
            // Add buttons and things to the page.
            var res = new Array({
                name: '首頁',
                url: 'http://www.nctu.edu.tw/',
                exp: /http(s):\/\/www.nctu.edu.tw\//i,
            }, {
                name: 'NCTU Talk',
                url: 'http://news.thomasy.tw/group/tw.bbs.campus.nctu',
                exp: /http(s)?:\/\/news.thomasy.tw\/group\/tw.bbs.campus.nctu/i,
            }, {
                name: 'E3教學平台',
                url: 'http://dcpc.nctu.edu.tw/',
                exp: /http(s)?:\/\/(dcpc|e3).nctu.edu.tw\//i,
            }, {
                name: '圖書館',
                url: 'http://www.lib.nctu.edu.tw/',
                exp: /http(s)?:\/\/www.lib.nctu.edu.tw\//i,
            }, {
                name: '單一入口',
                url: 'http://portal.nctu.edu.tw/',
                exp: /http(s)?:\/\/portal.nctu.edu.tw(:8080)?\//i,
            }, {
                name: 'D2信箱',
                url: 'http://d2.nctu.edu.tw/',
                exp: /http(s)?:\/\/d2.nctu.edu.tw\//i,
            }, {
                name: '選課系統',
                url: 'https://cos.adm.nctu.edu.tw/',
                exp: /http(s)?:\/\/cos.adm.nctu.edu.tw\//i,
            }, {
                name: '註冊系統',
                url: 'https://regist.nctu.edu.tw/',
                exp: /http(s)?:\/\/regist.nctu.edu.tw\//i,
            }, {
                name: '意見回饋',
                url: 'http://thomasy.tw/forum/nctutab/',
                exp: /http:\/\/thomasy.tw\/forum\/nctutab/i,
            });
            if (document.getElementById('nctuTab') == null) {
                var ul = document.createElement('ul');
                ul.className = 'nctuTab';
                ul.id = 'nctuTab';
                /*ul.onclick = function () {
                    if ((window.innerWidth < 500 || screen.width < 500) && this.className == 'nctuTab') {
                        this.className = 'nctuTab-open';
                    }
                    return false;
                };*/
                for (var i = 0; i < res.length; i++) {
                    var li = document.createElement('li');
                    var a = document.createElement('a');
                    a.setAttribute("href", res[i].url);
                    a.appendChild(document.createTextNode(res[i].name));
                    if (document.URL.search(res[i].exp) == 0) {
                        li.className = "active";
                    }
                    li.appendChild(a);
                    ul.appendChild(li);
                }
                document.body.appendChild(ul);
            }
        }
    },
    inject_e3: function () {
        var regex = new RegExp('準備讀取文件');
        var regex2 = new RegExp('ready to read the document');
        var ifrm = document.getElementsByName('frmMain')[0];
        if (typeof (ifrm) !== 'undefined' && ifrm != null) {
            if (regex.test(ifrm.contentDocument.body.innerHTML) || regex2.test(ifrm.contentDocument.body.innerHTML)) {
                var target = ifrm.contentDocument.getElementById('ctl00_ContentPlaceHolder1_linkUrl').href;
                self.postMessage({
                    url: target,
                    action: "download"
                });
            }
        }
        if (document.URL == "http://e3.nctu.edu.tw/NCTU_EASY_E3P/LMS2/stu_materials_document_list.aspx") {
            self.postMessage({
                action: "set_main_window"
            });
        }
        var pool_img = document.getElementById('ctl00_btnPool');
        if (pool_img != null) {
            pool_img.style.display = 'none';
        }
    },
    cannotlogin: function () {
        // Cannot login ?
        var a = document.createElement('a');
        var div = document.createElement('div');
        div.className = 'refresh';
        var cannot_text = document.createTextNode('一直不能登入？');
        div.appendChild(cannot_text);
        a.className = 'refresh-link';
        a.appendChild(div);
        a.onclick = function () {
            document.location.reload();
            return false;
        };
        document.body.appendChild(a);
    },
    cos_errorpage: function () {
        // Error page
        var a2 = document.createElement('a');
        var a3 = document.createElement('a');
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var div3 = document.createElement('msg');
        var try_msg = document.createTextNode('哎呀真糟糕,系統發生錯誤，您可以嘗試 ');
        var or_msg = document.createTextNode(' 或 ');
        var relogin_msg = document.createTextNode('重新登入');
        var reload_msg = document.createTextNode('重新載入此頁');
        div1.className = 'notify';
        div2.className = 'msg-out';
        div3.className = 'msg';
        div3.appendChild(try_msg);
        a2.appendChild(relogin_msg);
        a2.href = 'http://cos.adm.nctu.edu.tw/';
        a3.appendChild(reload_msg);
        a3.href = '#';
        a2.onclick = function () {
            document.location.reload();
            return false;
        };
        a3.onclick = function () {
            window.location.reload();
            return false;
        };
        div3.appendChild(a2);
        div3.appendChild(or_msg);
        div3.appendChild(a3);
        div2.appendChild(div3);
        div1.appendChild(div2);
        document.body.appendChild(div1);
    },
    cos_fillquestion: function () {
        //console.log("cos_fillquestion");
        var grade2 = document.createElement('a');
        var grade3 = document.createElement('a');
        var grade4 = document.createElement('a');
        var grade5 = document.createElement('a');
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var div3 = document.createElement('msg');
        var try_msg = document.createTextNode('問卷填寫完成 或是您需要 ');
        var or_msg = document.createTextNode(' 、 ');
        var or_msg2 = document.createTextNode(' 、 ');
        var or_msg3 = document.createTextNode(' 或 ');
        var grade2_msg = document.createTextNode('都滿意');
        var grade3_msg = document.createTextNode('都普通');
        var grade4_msg = document.createTextNode('都不滿意');
        var grade5_msg = document.createTextNode('都非常不滿意');
        div1.className = 'notify';
        div2.className = 'msg-out';
        div3.className = 'msg';
        div3.appendChild(try_msg);
        grade2.appendChild(grade2_msg);
        grade2.href = '#';
        grade3.appendChild(grade3_msg);
        grade3.href = '#';
        grade4.appendChild(grade4_msg);
        grade4.href = '#';
        grade5.appendChild(grade5_msg);
        grade5.href = '#';
        grade2.onclick = function () {
            for (var x = 1; x <= 2; x++) {
                for (var y = 1; y <= 2; y++) {
                    for (var z = 1; z < 20; z++) {
                        var ename = "q" + x + "q" + y + "q" + z;
                        obj = document.getElementsByName(ename);
                        if (obj == null) {
                            continue;
                        }
                        if (!obj.length) break;
                        obj.item(1).checked = true;
                    }
                }
            }
            window.scroll(0, 10000);
            return false;
        };
        grade3.onclick = function () {
            for (var x = 1; x <= 2; x++) {
                for (var y = 1; y <= 2; y++) {
                    for (var z = 1; z < 20; z++) {
                        var ename = "q" + x + "q" + y + "q" + z;
                        obj = document.getElementsByName(ename);
                        if (obj == null) {
                            continue;
                        }
                        if (!obj.length) break;
                        obj.item(2).checked = true;
                    }
                }
            }
            window.scroll(0, 10000);
            return false;
        };
        grade4.onclick = function () {
            for (var x = 1; x <= 2; x++) {
                for (var y = 1; y <= 2; y++) {
                    for (var z = 1; z < 20; z++) {
                        var ename = "q" + x + "q" + y + "q" + z;
                        obj = document.getElementsByName(ename);
                        if (obj == null) {
                            continue;
                        }
                        if (!obj.length) break;
                        if (obj.item(3) != null) obj.item(3).checked = true;
                        else obj.item(2).checked = true;
                    }
                }
            }
            window.scroll(0, 10000);
            return false;
        };
        grade5.onclick = function () {
            for (var x = 1; x <= 2; x++) {
                for (var y = 1; y <= 2; y++) {
                    for (var z = 1; z < 20; z++) {
                        var ename = "q" + x + "q" + y + "q" + z;
                        obj = document.getElementsByName(ename);
                        if (obj == null) {
                            continue;
                        }
                        if (!obj.length) break;
                        if (obj.item(4) != null) obj.item(4).checked = true;
                        else obj.item(2).checked = true;
                    }
                }
            }
            window.scroll(0, 10000);
            return false;
        };
        div3.appendChild(grade2);
        div3.appendChild(or_msg);
        div3.appendChild(grade3);
        div3.appendChild(or_msg2);
        div3.appendChild(grade4);
        div3.appendChild(or_msg3);
        div3.appendChild(grade5);
        div2.appendChild(div3);
        div1.appendChild(div2);
        document.body.appendChild(div1);
        for (var x = 1; x <= 2; x++) {
            for (var y = 1; y <= 2; y++) {
                for (var z = 1; z < 20; z++) {
                    var ename = "q" + x + "q" + y + "q" + z;
                    obj = document.getElementsByName(ename);
                    if (obj == null) {
                        continue;
                    }
                    if (!obj.length) break;
                    obj.item(0).checked = true;
                }
            }
        }
        // Scroll to bottom
        window.scroll(0, 10000);
    },
    cos_name_highlight: function () {
        var all_table = document.getElementsByTagName('table');
        if (all_table.length > 0) {
            this.nctutab_popup = document.createElement('div');
            var nctutab_align = document.createElement('div');
            nctutab_align.className = 'nctutab-close-right-align';
            var close_btn = document.createElement('a');
            close_btn.className = 'nctutab-close-button';
            close_btn.href = "#close";
            close_btn.onclick = function () {
                document.nctutab.nctutab_popup.style.display = "none";
                document.nctutab.nctutab_popup.person = "";
                return false;
            };
            nctutab_align.appendChild(close_btn);
            this.nctutab_popup.appendChild(nctutab_align);
            this.nctutab_popup.className = 'nctutabPopup';
            this.nctutab_popup.style.display = "none";
            this.nctutab_popup.onmouseup = function () {
                document.nctutab.clicked = false;
                document.nctutab.nctutab_popup.style.top = document.nctutab.y + 'px';
                document.nctutab.nctutab_popup.style.left = document.nctutab.x + 'px';
                document.nctutab.nctutab_popup.style.cursor = 'auto';
            };
            this.nctutab_popup.onmousedown = function (event) {
                var parse_pos = new RegExp("([0-9]*)px", "i");
                document.nctutab.clicked = true;
                if (event.offsetX || event.offsetY) {
                    document.nctutab.clickX = event.offsetX;
                    document.nctutab.clickY = event.offsetY;
                } else {
                    document.nctutab.clickX = event.pageX;
                    document.nctutab.clickY = event.pageY;
                }
                var itemX = document.nctutab.nctutab_popup.style.left;
                var itemY = document.nctutab.nctutab_popup.style.top;
                var arX = parse_pos.exec(itemX);
                var arY = parse_pos.exec(itemY);
                document.nctutab.Xoffset = document.nctutab.clickX - arX[1];
                document.nctutab.Yoffset = document.nctutab.clickY - arY[1];
                document.nctutab.nctutab_popup.style.cursor = 'move';
            };
            this.nctutab_popup.onmousemove = function (event) {
                if (document.nctutab.clicked == true) {
                    if (event.offsetX || event.offsetY) {
                        document.nctutab.x = event.offsetX - document.nctutab.Xoffset;
                        document.nctutab.y = event.offsetY - document.nctutab.Yoffset;
                    } else {
                        document.nctutab.x = event.pageX - document.nctutab.Xoffset;
                        document.nctutab.y = event.pageY - document.nctutab.Yoffset;
                    }
                    document.nctutab.nctutab_popup.style.top = document.nctutab.y + 'px';
                    document.nctutab.nctutab_popup.style.left = document.nctutab.x + 'px';
                }
            };
            this.nctutab_ifr = document.createElement("iframe");
            this.nctutab_ifr.scrolling = "no";
            this.nctutab_ifr.style.overflow = "hidden";
            this.nctutab_ifr.setAttribute("width", "500");
            this.nctutab_ifr.setAttribute("height", "400");
            this.nctutab_ifr.setAttribute("frameborder", "0");
            this.nctutab_ifr.setAttribute("scrolling", "0");
            this.nctutab_ifr.setAttribute("marginheight", "0");
            this.nctutab_ifr.setAttribute("marginwidth", "0");
            this.nctutab_ifr.setAttribute("class", "nctutabsIFR");
            this.nctutab_popup.appendChild(this.nctutab_ifr);
            this.nctutab_popup.style.position = "absolute";
            document.body.appendChild(this.nctutab_popup);
        }
        for (var i = 0; i < all_table.length; i++) {
            var start = 1;
            var name_loc = -1;
            var cur_loc = 0;
            var first_row = all_table[i].rows[0];
            if (first_row != null) {
                // Each cell
                for (var j = 0; j < first_row.cells.length; j++) {
                    var childs = first_row.cells[j].childNodes;
                    //search text in child nodes
                    for (var k = 0; k < childs.length; k++) {
                        if (childs[k].data != null) {
                            if (childs[k].data == "開課教師" || childs[k].data == "Lecturers") {
                                name_loc = cur_loc;
                                //console.log("found @ " + cur_loc);
                            }
                        } else {
                            //childs
                            var grand_child = childs[k].childNodes;
                            for (var m = 0; m < grand_child.length; m++) {
                                if (grand_child[m].data == "開課教師" || grand_child[m].data == "Lecturers") {
                                    name_loc = cur_loc;
                                    //console.log("found @ " + cur_loc);
                                }
                            }
                        }
                    }
                    cur_loc += first_row.cells[j].colSpan;
                }
            }
            if (name_loc == -1) {
                start = 2;
                cur_loc = 0;
                var first_row = all_table[i].rows[1];
                //console.log("HERE");
                if (first_row != null) {
                    // Each cell
                    for (var j = 0; j < first_row.cells.length; j++) {
                        var childs = first_row.cells[j].childNodes;
                        //search text in child nodes
                        for (var k = 0; k < childs.length; k++) {
                            if (childs[k].data != null) {
                                if (childs[k].data == "開課教師" || childs[k].data == "Lecturers") {
                                    name_loc = cur_loc;
                                    //console.log("found @ " + cur_loc);
                                }
                            } else {
                                //childs
                                var grand_child = childs[k].childNodes;
                                for (var m = 0; m < grand_child.length; m++) {
                                    if (grand_child[m].data == "開課教師" || grand_child[m].data == "Lecturers") {
                                        name_loc = cur_loc;
                                        //console.log("found @ " + cur_loc);
                                    }
                                }
                            }
                        }
                        cur_loc += first_row.cells[j].colSpan;
                    }
                }
            }
            if (name_loc != -1) {
                // Add mark for each
                var row_of_table = all_table[i].rows;
                for (var n = start; n < row_of_table.length; n++) {
                    if (row_of_table[n].cells[name_loc] != null) {
                        this.cos_highlight_recursive(row_of_table[n].cells[name_loc]);
                        //console.log(row_of_table[n].cells[name_loc] );
                    }
                }
                name_loc = -1;
            }
        }
    },
    cos_highlight_recursive: function (nodes) {
        if (nodes.data != null) {
            if (nodes.data.length >= 4) {
                var person = nodes.data;
                var person_span = document.createElement('span');
                person_span.className = 'nctutabName';
                var person_match = person;
                //console.log( person_match );
                if (/(\S+)\s+等\d+人/i.test(person)) {
                    var person_match_obj = person.match(/(\S+)\s+等\d+人/i);
                    person_match = person_match_obj[1];
                }
                if (/\S*/i.test(person_match)) {
                    // Remove non-space chars
                    //var person_match_obj = person_match.match(/(\S*)/i);
                    var person_match_obj = person_match.match(/\s*(\S*)\s*/i);
                    //console.log(person_match_obj);
                    person_match = person_match_obj[1];
                }
                //console.log( person_match );
                person_span.person = person_match;
                var person_text = document.createTextNode(person);
                person_span.appendChild(person_text);
                person_span.onmouseover = function (e) {
                    if (document.nctutab.nctutab_popup.person === this.person) {
                        if (document.nctutab.nctutab_popup.display === "none") {
                            document.nctutab.nctutab_popup.style.display = "";
                        }
                        return false;
                    }
                    document.nctutab.nctutab_popup.style.display = "";
                    var base_URL = (("https:" == document.location.protocol) ? "https://news.thomasy.tw/api/user/" : "http://news.thomasy.tw/api/user/");
                    var tempX = e.pageX;
                    var tempY = e.pageY;
                    document.nctutab.setPopupPerson(this.person);
                    document.nctutab.nctutab_popup.style.top = Math.max(tempY - 500, 0) + "px";
                    document.nctutab.nctutab_popup.style.left = Math.max(tempX - 400, 0) + "px";
                    document.nctutab.nctutab_ifr.setAttribute("src", base_URL + encodeURIComponent(this.person));
                    document.nctutab.nctutab_popup.style.display = "";
                    return false;
                }
                nodes.parentNode.insertBefore(person_span, nodes);
                nodes.parentNode.removeChild(nodes);
                return;
            }
        }
        for (var i = 0; i < nodes.childNodes.length; i++) {
            // Loop children
            this.cos_highlight_recursive(nodes.childNodes[i]);
        }
    },
    setPopupPerson: function (person) {
        this.nctutab_popup.person = person;
    },
    captcha_portal: function () {
        var img = document.getElementById('captcha');
        var canvas = document.createElement("canvas");
        var seccode = document.getElementById('seccode');
        canvas.id = "canvas";
        canvas.sytle = "z-index: 9999;";
        if (seccode != null) {
            seccode.parentNode.appendChild(canvas);
            if (img != null) {
                document.nctutab.img = img;
                document.nctutab.runFilter('canvas', document.nctutab.threshold_with_bgremove, 75);
                img.onload = function () {
                    if (document.nctutab.img != null) {
                        document.nctutab.runFilter('canvas', document.nctutab.threshold_with_bgremove, 75);
                    }
                }
            }
        }
    },
    captcha_cos: function () {
        var img = document.getElementById('img');
        // Safe Code
        if (document.URL.search(/http(s)?:\/\/cos.adm.nctu.edu.tw\/getSafeCode.asp/i) == 0) {
            document.body.style.backgroundColor = "#F0F0F0";
            var center_div = document.createElement("div");
            center_div.align = "center";
            var canvas = document.createElement("canvas");
            canvas.id = "canvas";
            canvas.sytle = "z-index: 9999;";
            center_div.appendChild(canvas);
            document.body.appendChild(center_div);
            if (img != null) {
                document.nctutab.img = img;
                document.nctutab.runFilter('canvas', document.nctutab.threshold, 0.1);
            }
        }
    },
    captcha_regist: function () {
        var captcha = document.getElementById('ImgCheck');
        if (captcha != null) {
            var img = document.getElementById('ImgCheck');
            var canvas = document.createElement("canvas");
            canvas.id = "canvas";
            canvas.sytle = "z-index: 9999;";
            captcha.parentNode.appendChild(canvas);
            document.nctutab.img = img;
            document.nctutab.runFilter('canvas', document.nctutab.threshold, 35);
            captcha.onload = function () {
                if (document.nctutab.img != null) {
                    document.nctutab.runFilter('canvas', document.nctutab.threshold, 35);
                }
            }
        }
    },
    cos_autosubmit: function () {
        // IPR
        var regex = new RegExp('ipr');
        if (regex.test(document.body.innerHTML)) {
            if (document.getElementById("submit") != null) document.getElementById("submit").click();
        }
        // Pattern for mail account
        var regex = new RegExp('pchome');
        if (regex.test(document.body.innerHTML)) {
            if (document.getElementsByName("frmSetPreceptor")[0] != null) document.getElementsByName("frmSetPreceptor")[0].submit();
        }
        var regex = new RegExp('Please provide a working email account');
        if (regex.test(document.body.innerHTML)) {
            if (document.getElementsByName("frmSetPreceptor")[0] != null) document.getElementsByName("frmSetPreceptor")[0].submit();
        }
    },
    getCanvas: function (w, h) {
        var c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
    },
    getPixels: function (img) {
        //console.log( "img.width = " + img.width  + "  img.height = " +  img.height );
        var c = document.nctutab.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, c.width, c.height);
    },
    filterImage: function (filter, image, var_args) {
        var args = [document.nctutab.getPixels(image)];
        for (var i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        return filter.apply(null, args);
    },
    runFilter: function (id, filter, arg1, arg2, arg3) {
        var c = document.getElementById(id);
        if (c != null) {
            var idata = document.nctutab.filterImage(filter, document.nctutab.img, arg1, arg2, arg3);
            c.width = idata.width;
            c.height = idata.height;
            var ctx = c.getContext('2d');
            ctx.putImageData(idata, 0, 0);
            c.style.display = 'inline';
        }
    },
    threshold: function (pixels, threshold) {
        var d = pixels.data;
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
            d[i] = d[i + 1] = d[i + 2] = v;
        }
        return pixels;
    },
    threshold_with_bgremove: function (pixels, threshold) {
        var d = pixels.data;
        var count_r = Array();
        var count_g = Array();
        var count_b = Array();
        var mode_r, mode_g, mode_b;
        // Init count array
        for (var i = 0; i < 256; i++) {
            count_r[i] = 0;
            count_g[i] = 0;
            count_b[i] = 0;
        }
        // Get bg color
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            count_r[r]++;
            count_g[g]++;
            count_b[b]++;
        }
        // Get mode
        mode_r = document.nctutab.max(count_r).index;
        mode_g = document.nctutab.max(count_g).index;
        mode_b = document.nctutab.max(count_b).index;
        // Remove it
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            var index = (Math.abs(r - mode_r) < 3) + (Math.abs(g - mode_g) < 3) + (Math.abs(b - mode_b) < 3);
            //var index = 0;
            if (index > 1) {
                d[i] = 255;
                d[i + 1] = 255;
                d[i + 2] = 255;
            }
        }
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
            d[i] = d[i + 1] = d[i + 2] = v;
        }
        return pixels;
    },
    median: function (values) {
        values.sort(function (a, b) {
            return a - b;
        });
        var half = Math.floor(values.length / 2);
        if (values.length % 2) return values[half];
        else return (values[half - 1] + values[half]) / 2.0;
    },
    max: function (values) {
        if (values.length == 0) return {
            'index': -1
        };
        var maxIndex = 0;
        for (var i = 1; i < values.length; i++) {
            if (values[i] > values[maxIndex]) {
                maxIndex = i;
            }
        }
        //console.log( "values.length = " + values.length + " index = " + maxIndex +" value = "+values[maxIndex]);
        return {
            'index': maxIndex,
            'value': values[maxIndex]
        };
    },
    removebg: function (pixels) {
        var d = pixels.data;
        var count_r = Array();
        var count_g = Array();
        var count_b = Array();
        var mode_r, mode_g, mode_b;
        // Init count array
        for (var i = 0; i < 256; i++) {
            count_r[i] = 0;
            count_g[i] = 0;
            count_b[i] = 0;
        }
        // Get bg color
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            //var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
            //count[ b << 16 + g << 8 + r ]++;
            count_r[r]++;
            count_g[g]++;
            count_b[b]++;
            //console.log( "index = " + ( b << 16 + g << 8 + r ));
            //d[i] = d[i + 1] = d[i + 2] = v
        }
        // Get mean
        //var list1 = [3, 8, 9, 1, 5, 7, 9, 21];
        mode_r = document.nctutab.max(count_r).index;
        mode_g = document.nctutab.max(count_g).index;
        mode_b = document.nctutab.max(count_b).index;
        // Mode = 3 * median - 2 * mean
        // Remove it
        for (var i = 0; i < d.length; i += 4) {
            var r = d[i];
            var g = d[i + 1];
            var b = d[i + 2];
            //(Math.abs( r - median_r ) < 3) &&  (Math.abs( g - median_g ) < 3)  && ( Math.abs( b - median_b ) < 3 )
            var index = (Math.abs(r - mode_r) < 3) + (Math.abs(g - mode_g) < 3) + (Math.abs(b - mode_b) < 3);
            //var index = 0;
            if (index > 1) {
                d[i] = 255;
                d[i + 1] = 255;
                d[i + 2] = 255;
            }
            //var v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
            //d[i] = d[i + 1] = d[i + 2] = v
        }
        return pixels;
    }
};
self.on('message', function (data) {
    if (data.action == "show_nctutab") {
        document.nctutab.inject_nctutab();
    } else if (data.action == "close_tab") {
        window.close();
    }
});
document.nctutab.init();
