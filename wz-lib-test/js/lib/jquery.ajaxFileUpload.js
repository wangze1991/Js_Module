/**
 * Created by lydia on 2017/4/24.
 */
jQuery.extend({
    createUploadIframe: function (id, uri) {
        //create iframe
        var frameId = 'jUploadFrame' + id,
            src = '';
        if (typeof uri == 'boolean') {
            src = 'javascript:false';
        }
        else if (typeof uri == 'string') {
            src = uri;
        }
        /*        if (window.ActiveXObject) {
         var io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
         if (typeof uri == 'boolean') {
         io.src = 'javascript:false';
         }
         else if (typeof uri == 'string') {
         io.src = uri;
         }
         }
         else {
         var io = document.createElement('iframe');
         io.id = frameId;
         io.name = frameId;
         }
         io.style.position = 'absolute';
         io.style.top = '-1000px';
         io.style.left = '-1000px';*/

        var $io = $('<iframe id="' + frameId + '" name="' + frameId + '"></iframe>').css({
            position: 'absolute',
            top: '-1000px',
            left: '-1000px'
        });
        if (src) {
            $io.attr('src', src);
        }
        $('body').append($io);
        //document.body.appendChild(io);
        return $io;
    },
    createUploadForm: function (id, fileElementId) {
        //create form
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        var oldElement = $(fileElementId);
        var newElement = $(oldElement).clone();
        //这里是将原先的file文件放到form中
        $(oldElement).attr('id', fileId);
        $(oldElement).before(newElement);
        $(oldElement).appendTo(form);
        //默认上传的文件name是file
        //$(newElement).attr({'id': fileId, 'name': 'file'}).appendTo(form);
        //set attributes
        $(form).css('position', 'absolute');
        $(form).css('top', '-1200px');
        $(form).css('left', '-1200px');
        $(form).appendTo('body');
        return form;
    },
    addOtherRequestsToForm: function (form, data) {
        // add extra parameter
        var originalElement = $('<input type="hidden" name="" value="">');
        for (var key in data) {
            var name = key,
                value = data[key],
                cloneElement = originalElement.clone();
            cloneElement.attr({'name': name, 'value': value});
            $(cloneElement).appendTo(form);
        }
        return form;
    },
    ajaxFileUpload: function (s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
        s = jQuery.extend({secureuri: false}, jQuery.ajaxSettings, s);
        var id = new Date().getTime();
        var form = jQuery.createUploadForm(id, s.fileElementId);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        if (s.data) {
            form = jQuery.addOtherRequestsToForm(form, s.data);
        }
        jQuery.createUploadIframe(id, s.secureuri);

        // Watch for a new set of requests
        if (s.global && !jQuery.active++) {
            jQuery.event.trigger("ajaxStart");
        }
        var requestDone = false;
        // Create the request object
        var xml = {};
        if (s.global)
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function (isTimeout) {
            var io = document.getElementById(frameId);
            try {
                // xml.responseText = io.contentWindow.document.getElementById('file-callback').value;
                // xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;
                //这里先注释掉，ie9获取不到innerHTML,所以最好使用是input放一个value,因为有可能有些chrome插件会插入文本
                //https://github.com/flowjs/fusty-flow.js/issues/3
                //$.iFrame.contentWindow.document.documentElement.childNodes[0].data
                if (io.contentWindow) {
                    xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                    xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;

                } else if (io.contentDocument) {
                    xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                    xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                }
            } catch (e) {
                jQuery.handleFileError(s, xml, null, e);
            }
            if (xml || isTimeout == "timeout") {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if (status != "error") {
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData(xml, s.dataType);
                        // If a local callback was specified, fire it and pass it the data
                        if (s.success)
                            s.success(data, status);

                        // Fire the global callback
                        if (s.global)
                            jQuery.event.trigger("ajaxSuccess", [xml, s]);
                    } else
                        jQuery.handleFileError(s, xml, status);
                } catch (e) {
                    status = "error";
                    jQuery.handleFileError(s, xml, status, e);
                }

                // The request was completed
                if (s.global)
                    jQuery.event.trigger("ajaxComplete", [xml, s]);

                // Handle the global AJAX counter
                if (s.global && !--jQuery.active)
                    jQuery.event.trigger("ajaxStop");

                // Process result
                if (s.complete)
                    s.complete(xml, status);

                jQuery(io).unbind();

                setTimeout(function () {
                    try {
                        $(io).remove();
                        $(form).remove();

                    } catch (e) {
                        jQuery.handleFileError(s, xml, null, e);
                    }

                }, 100)

                xml = null;

            }
        };
        // Timeout checker
        if (s.timeout > 0) {
            setTimeout(function () {
                // Check to see if the request is still happening
                if (!requestDone) uploadCallback("timeout");
            }, s.timeout);
        }
        try {
            // var io = $('#' + frameId);
            //var form = $('#' + formId);
            //var form = document.getElementById(formId);
            form.attr('action', s.url);
            form.attr('method', 'POST');
            form.attr('target', frameId);
            // if (form.encoding) {
            //     form.encoding = 'multipart/form-data';
            // }
            // else {
            //     form.enctype = 'multipart/form-data';
            // }
            form.submit();

        } catch (e) {
            jQuery.handleFileError(s, xml, null, e);
        }


        if (window.attachEvent) {
            document.getElementById(frameId).attachEvent('onload', uploadCallback);
        }
        else {
            document.getElementById(frameId).addEventListener('load', uploadCallback, false);
        }
        return {
            abort: function () {
            }
        };

    },
    uploadHttpData: function (r, type) {
        var data = false;
        if (type === 'xml') {
            data = r.responseXML;
        }
        else if (type === 'text') {
            data = r.responseText;
        }
        // If the type is "script", eval it in global context
        else if (type == "script") {
            jQuery.globalEval(data);
        }
        // Get the JavaScript object, if JSON is usede
        else if (type == "json") {
            // If you add mimetype in your response,
            // you have to delete the '<pre></pre>' tag.
            // The pre tag in Chrome has attribute, so have to use regex to remove
            data = r.responseText;
            var rx = new RegExp("<pre.*?>(.*?)</pre>", "i");
            var am = rx.exec(data);
            //this is the desired data extracted
            data = $.parseJSON(((((am) ? am[1] : "") || data)));
        }
        // evaluate scripts within html
        else if (type == "html")
            jQuery("<div>").html(data).evalScripts();
        //alert($('param', data).each(function(){alert($(this).attr('value'));}));
        return data;
    },
    handleFileError: function (s, xhr, status, e) {
        // If a local callback was specified, fire it
        if (s.error) {
            s.error.call(s.context || s, xhr, status, e);
        }
        // Fire the global callback
        if (s.global) {
            (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
        }
    }
})

