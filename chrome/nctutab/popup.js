if (localStorage["whitelist_domain"] == null) {
    whitelist_domain = new Array();
} else {
    var whitelist_domain = JSON.parse(localStorage["whitelist_domain"]);
}


if (localStorage["whitelist_url"] == null) {
    whitelist_url = new Array();
} else {
    var whitelist_url = JSON.parse(localStorage["whitelist_url"]);
}


function is_in_whitelist_url(domain) {
    for (i = 0; i < whitelist_url.length; i++) {
        //console.log(whitelist_url[i]);
        if (domain == whitelist_url[i]) {
            //console.log("is_in_whitelist2 = true");
            return true;
        }

    }
    //console.log("is_in_whitelist2 = false");
    return false;
}

function is_in_whitelist_domain(domain) {
    for (i = 0; i < whitelist_domain.length; i++) {
        //console.log(whitelist_domain[i]);
        if (domain == whitelist_domain[i]) {
            //console.log("is_in_whitelist2 = true");
            return true;
        }

    }
    //console.log("is_in_whitelist2 = false");
    return false;
}

function add_whitelist_url(domain) {
    whitelist_url.push(domain);
    localStorage["whitelist_url"] = JSON.stringify(whitelist_url);
    //console.log("Add "+domain+" to whitelist");
}

function remove_whitelist_url(domain) {
    whitelist_url.splice(whitelist_url.indexOf(domain), 1);
    localStorage["whitelist_url"] = JSON.stringify(whitelist_url);
    //console.log("Remove "+domain+" from whitelist");
}

function add_whitelist_domain(domain) {
    whitelist_domain.push(domain);
    localStorage["whitelist_domain"] = JSON.stringify(whitelist_domain);
    //console.log("Add "+domain+" to whitelist_domain");
}

function remove_whitelist_domain(domain) {
    whitelist_domain.splice(whitelist_domain.indexOf(domain), 1);
    localStorage["whitelist_domain"] = JSON.stringify(whitelist_domain);
    //console.log("Remove "+domain+" from whitelist_domain");
}

function set_white_url(checked) {
    //console.log("set_white_url " + checked);
    if (checked) {
        //add
        add_whitelist_url(tablink);

    } else {
        //remove
        remove_whitelist_url(tablink);

    }
    chrome.tabs.executeScript(null, {
        code: "window.location.reload();"
    });
}

function set_white_domain(checked) {
    //console.log("set_white_domain " + checked);
    if (checked) {
        //add
        add_whitelist_domain(tablink.match(new RegExp(':\/\/(.[^/]+)'))[1]);
    } else {
        //remove
        remove_whitelist_domain(tablink.match(new RegExp(':\/\/(.[^/]+)'))[1]);

    }
    chrome.tabs.executeScript(null, {
        code: "window.location.reload();"
    });
}

function hide_tab() {
    //console.log('hide_tab2');
    chrome.tabs.executeScript(null, {
        code: "if( document.getElementById('nctuTab')!=null ){ document.getElementById('nctuTab').style.display = 'none'; } "
    });
    chrome.tabs.insertCSS(null, {
        code: "html{margin-top: 0 !important;}"
    });

}

var tablink;
chrome.tabs.getSelected(null, function (tab) {
    tablink = tab.url;
    document.getElementById('url').checked = is_in_whitelist_url(tablink);
    document.getElementById('domain').checked = is_in_whitelist_domain(tablink.match(new RegExp(':\/\/(.[^/]+)'))[1]);

});
