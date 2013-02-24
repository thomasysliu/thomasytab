self.on('message', function (data) {
    if (data.action == "open") {
        self.postMessage({
            'action': 'get_perf',
            'url': data.url
        });
    } else if (data.action == "set_perf") {
        if (data.valid == false) {
            document.getElementById('config').style.display = 'none';
            document.getElementById('noconfig').style.display = '';
        } else {
            if (data.is_pb == true) {
                document.getElementById('non_pb').style.display = 'none';
                document.getElementById('pb').style.display = '';
            } else {
                document.getElementById('non_pb').style.display = '';
                document.getElementById('pb').style.display = 'none';
            }
            document.getElementById('noconfig').style.display = 'none';
            document.getElementById('config').style.display = '';
            document.getElementById('nctutab_domain').value = data.domain;
            document.getElementById('nctutab_url').value = data.url;
            var set_white_domain = document.getElementById('set_white_domain');
            if (set_white_domain != null) {
                set_white_domain.checked = data.domain_white;
            }
            var set_white_url = document.getElementById('set_white_url');
            if (set_white_url != null) {
                set_white_url.checked = data.url_white;
            }
        }
    }
});
document.getElementById("set_white_domain").onclick = function () {
    var set_white_domain = document.getElementById('set_white_domain');
    var set_white_url = document.getElementById('set_white_url');
    self.postMessage({
        'action': 'set_white_domain',
        'target': document.getElementById('nctutab_domain').value,
        'value': this.checked
    });
}
document.getElementById("set_white_url").onclick = function () {
    var set_white_domain = document.getElementById('set_white_domain');
    var set_white_url = document.getElementById('set_white_url');
    self.postMessage({
        'action': 'set_white_url',
        'target': document.getElementById('nctutab_url').value,
        'value': this.checked
    });
}
document.getElementById("hide_show_nctutab").onclick = function () {
    self.postMessage({
        'action': 'hide_show_nctutab'
    });
}
