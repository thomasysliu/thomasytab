var ss = require("simple-storage");
var data = require("self").data;
var pageMod = require("page-mod");
var cos_reg_portal_pageMod = require("page-mod");
try{
var tabs = require("tabs");
var prefs = require("simple-prefs");
var windows = require("windows").browserWindows;
//var pb = require("private-browsing");
}catch(err){
	// May not avilable for mobile
}
var main_window = null;
// Load CSS & JS
cos_reg_portal_pageMod.PageMod({
  include: 
  ["https://regist.nctu.edu.tw/*","http://regist.nctu.edu.tw/*","https://cos.adm.nctu.edu.tw/*","http://cos.adm.nctu.edu.tw/*","http://portal.nctu.edu.tw/*","https://portal.nctu.edu.tw/*"],
  contentStyleFile: data.url("cos.css")
})
pageMod.PageMod({
    include: ["*"],
    contentScriptWhen: 'end',
    contentScriptFile: data.url("nctutab.js"),
    contentStyleFile: data.url("nctutab.css"),
    onAttach: function onAttach(worker) {
        worker.on('message', function (data) {
            //console.log(data.action);
            // Init storage
            if (ss.storage.whitelist_url == null) {
                ss.storage.whitelist_url = {};
            }
            if (ss.storage.whitelist_domain == null) {
                //console.log("whitelist_domain is null ");
                ss.storage.whitelist_domain = {};
            }
            if (data.action == "set_main_window") {
                main_window = windows.activeWindow;
            } else if (data.action == "download") {
                this.postMessage({
                    action: "close_tab"
                });
                if (main_window != null) {
                    main_window.tabs.open({
                        url: data.url,
                        inBackground: true
                    });
                } else {
                    tabs.open({
                        url: data.url,
                        inBackground: true
                    });
                }
            } else if (data.action == "check_tab") {
                var url_re = /http(s)?:\/\//i;
                var domain_re = /http(s)?:\/\/[^\/]*/i;
                if (data.url.search(url_re) == -1) {
                    // invalid URL
                    return;
                }
                var domain = data.url.match(domain_re)[0];
                //console.log("domain = "+ domain );
                // Check url white list first
                if (ss.storage.whitelist_url[data.url] != null) {
                    if (ss.storage.whitelist_url[data.url] == false) {
                        this.postMessage({
                            action: "show_nctutab"
                        });
                    }
                    return;
                }
                // Check domain white list
                if (ss.storage.whitelist_domain[domain] != null) {
                    if (ss.storage.whitelist_domain[domain] == false && ss.storage.whitelist_url[data.url] != true) {
                        this.postMessage({
                            action: "show_nctutab"
                        });
                    }
                    return;
                }
                // Use global settings
                if(prefs != null){
                if (prefs.prefs["nctutab_all_domain"]) {
                    this.postMessage({
                        action: "show_nctutab"
                    });
                    return;
                } else {
                    if (data.url.search(/http(s)?:\/\/[^\/]*\.nctu\.edu\.tw/i) == 0) {
                        this.postMessage({
                            action: "show_nctutab"
                        });
                        return;
                    }
                }
				}else{
                    if (data.url.search(/http(s)?:\/\/[^\/]*\.nctu\.edu\.tw/i) == 0) {
                        this.postMessage({
                            action: "show_nctutab"
                        });
                        return;
                    }
					
				}
				
            } else if (data.action == "toggle_tab_req") {
                this.postMessage({
                    action: "toggle_tab"
                });
                return;
            }
        });
    }
});
// Add URL icon
try{
var panel = require("panel").Panel({
    contentURL: data.url("popup.html"),
    width: 195,
    height: 125,
    contentScriptFile: data.url("popup.js"),
    contentScriptWhen: 'end',
    onMessage: function (message) {
        if (message.action === "get_perf") {
            var url_re = /http(s)?:\/\//i;
            var domain_re = /http(s)?:\/\/[^\/]*/i;
            if (message.url.search(url_re) === 0) {
                //console.log("valid url");
                var domain = message.url.match(domain_re)[0];
                if (ss.storage.whitelist_url == null) {
                    ss.storage.whitelist_url = {};
                }
                if (ss.storage.whitelist_domain == null) {
                    //console.log("whitelist_domain is null ");
                    ss.storage.whitelist_domain = {};
                }
                url_white = ss.storage.whitelist_url[message.url];
                domain_white = ss.storage.whitelist_domain[domain];
                //console.log( ss.storage.whitelist_url[message.url] );
                if (url_white == null) {
                    // Set to default value
                    if (message.url.search(/http(s)?:\/\/[^\/]*\.nctu\.edu\.tw/i) == 0) {
                        url_white = false;
                    } else {
                        url_white = true;
                    }
                }
                if (domain_white == null) {
                    // Set to default value
                    if (message.url.search(/http(s)?:\/\/[^\/]*\.nctu\.edu\.tw/i) == 0) {
                        domain_white = false;
                    } else {
                        domain_white = true;
                    }
                }
                this.postMessage({
                    'action': 'set_perf',
                    'url': message.url,
                    'domain': domain,
                    'url_white': url_white,
                    'domain_white': domain_white,
                    'valid': true,
                    'is_pb': require("private-browsing").isPrivate(tabs.activeTab) 
                });
            } else {
                //console.log("invalid url");
                this.postMessage({
                    'action': 'set_perf',
                    'valid': false,
                    'is_pb': require("private-browsing").isPrivate(tabs.activeTab) 
                });
            }
        } else if (message.action == "set_white_domain") {
            //console.log(message.target);
            //console.log("message.target");
            ss.storage.whitelist_domain[message.target] = message.value;
            tabs.activeTab.reload();
        } else if (message.action == "set_white_url") {
            //console.log(message.target);
            //console.log("message.target");
            ss.storage.whitelist_url[message.target] = message.value;
            tabs.activeTab.reload();
        } else if (message.action == "hide_show_nctutab") {
            tabs.activeTab.attach({
                contentScript: ["var nctutab_obj = document.getElementById('nctuTab');", "if( nctutab_obj != null){", "if( nctutab_obj.style.display == 'none' ){", "nctutab_obj.style.display = '';", "document.body.style.marginTop = '32px';", "}else{", "nctutab_obj.style.display = 'none';", "document.body.style.marginTop = '0px';", "}", "}"]
            });
        }
    }
});

var url_icon = {
    curr_icon: null,
    onTrack: function (window) {
        var doc = window.document;
        var appcontent = window.document.getElementById("appcontent"); // browser  
        if (appcontent) {
            appcontent.addEventListener("DOMContentLoaded", url_icon.onPageLoad, true);
            //console.log("Get it");
        }
        if (doc.documentElement.getAttribute("windowtype") !== "navigator:browser") {
            doc = null;
            return;
        }
        // Modify the window!    
        if (doc.getElementById("urlbar") !== null && doc.getElementById("nctutab-icon") == null) {
            var urlbar = doc.getElementById("urlbar");
            var urlbarIcons = doc.getElementById("urlbar-icons");
            var nctutab_icon = doc.createElement('a');
            nctutab_icon.id = "nctutab-icon";
            nctutab_icon.class = "urlbar-icon";
            nctutab_icon.style.display = "none";
            //nctutab_icon.hidden = true;
            //nctutab_icon.style.display = "inline-block";
            nctutab_icon.style.width = "16px";
            nctutab_icon.style.height = "16px";
            nctutab_icon.style.background = "url(" + data.url("config-16.png") + ")";
            nctutab_icon.onclick = function () {
                panel.postMessage({
                    'action': 'open',
                    'url': tabs.activeTab.url
                });
                panel.show(this);
            }
            urlbarIcons.appendChild(nctutab_icon);
            curr_icon = nctutab_icon;
        }
        doc = null;
    },
    onUntrack: function (window) {
        // Clean up
        var doc = window.document;
        if (doc.documentElement.getAttribute("windowtype") !== "navigator:browser") {
            doc = null;
            return;
        }
        // Modify the window!   
        if (doc.getElementById("nctutab-icon") !== null) {
            var nctutab_icon = doc.getElementById("nctutab-icon");
            nctutab_icon.parentNode.removeChild(nctutab_icon);
        }
        doc = null;
    },
    onPageLoad: function (tab) {
        if (tabs.activeTab.url.search(/http(s)?:\/\//i) == 0 && require("private-browsing").isPrivate(tabs) == false) {
            curr_icon.style.display = "";
        } else {
            curr_icon.style.display = "none";
        }
    }
};
tabs.on('activate', url_icon.onPageLoad);
var winUtils = require("window-utils");
var tracker = new winUtils.WindowTracker(url_icon);
}catch(err){
		// For mobile
	}


exports.onUnload = function (reason) {
    data = null;
    winUtils = null;
    tracker = null;
    url_icon = null;
    panel = null;
    reason = null;
    pageMod = null;
    windows = null;
    main_window = null;
    tabs = null;
    perfs = null;
    recovery = null;
    ss = null;
    myPref = null;
    pb = null;
};
