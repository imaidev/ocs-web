function _GetById(id){
    if(!id){return null; }
    if(document.getElementById){
        return eval('document.getElementById("' + id + '")');
    }else if(document.layers){
        return eval("document.layers['" + id +"']");
    }else{
        return eval('document.all.' + id);
    }
}

function _SearchContent(searchSubUrl, inChannel) {
    if(_GetById("_kw_").value.length === 0) {
        return;
    }

    var form,sch,swd,body = document.body || document.getElementsByTagName( "body" )[0] || document.documentElement;
    form = document.createElement("form");
    form.name = "_sform_";
    form.method = "post";
    form.action = searchSubUrl;
    form.target = "_blank";

    if(inChannel=="1") {
        sch = document.createElement("input");
        sch.name = "cid";
        sch.type = "hidden";
        sch.value = _GetById("_ssel_").value;
        form.appendChild(sch);
    }

    swd = document.createElement("input");
    swd.name = "wd";
    swd.type = "hidden";
    swd.value = _GetById("_kw_").value;
    form.appendChild(swd);

    body.insertBefore(form, body.firstChild);
    form.submit();
    body.removeChild(form);
    form = sch = swd = undefined;
}

function _SearchContent2(searchSubUrl) {
    if(_GetById("_kw2_").value.length === 0) {
        return;
    }

    var form,swd,swd2,body = document.body || document.getElementsByTagName( "body" )[0] || document.documentElement;
    form = document.createElement("form");
    form.name = "_sform2_";
    form.method = "post";
    form.action = searchSubUrl;
    form.target = "_blank";

    swd = document.createElement("input");
    swd.name = "wd";
    swd.type = "hidden";
    swd.value = _GetById("_kw_").value;
    form.appendChild(swd);

    swd2 = document.createElement("input");
    swd2.name = "wd2";
    swd2.type = "hidden";
    swd2.value = _GetById("_kw2_").value;
    form.appendChild(swd2);

    body.insertBefore(form, body.firstChild);
    form.submit();
    body.removeChild(form);
    form = swd = swd2 = undefined;
}
