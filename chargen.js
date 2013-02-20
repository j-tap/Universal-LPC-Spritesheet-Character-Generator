function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}

$(document).ready(function() {

    $("input[type=radio]").each(function(index) {
        $(this).click(redraw);
    });
    
    $("#chooser>ul>li>ul>li>ul>li").click(function(event) {
        event.stopPropagation();
    });
    
    $("#chooser>ul>li>ul>li").click(function(event) {
        var $ul = $(this).children("ul");
        $ul.toggle('slow');
        event.stopPropagation();
    });
    
    $("#chooser>ul>li").click(function() {
        var $ul = $(this).children("ul");
        $ul.toggle('slow');
    });
    
    $("#collapse").click(function() {
        $("#chooser>ul ul").hide('slow');
    });
    
    $("#saveAsPNG").click(function() {
        Canvas2Image.saveAsPNG(document.getElementsByTagName('canvas')[0]);
    });        
    
    var canvas = $("canvas").get(0);
    var ctx = canvas.getContext("2d");
    var oversize = $("input[type=radio]").filter(function() {
        return $(this).data("oversize");
    }).length > 0;
    
    if (oversize) {
        canvas.width = 1536;
        canvas.height = 1344 + 768;
    } else {
        canvas.width = 832;
        canvas.height = 1344;
    }

    function redraw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        oversize = $("input[type=radio]:checked").filter(function() {
            return $(this).data("oversize");
        }).length > 0;        
        if (oversize) {
            canvas.width = 1536;
            canvas.height = 1344 + 768;
            oversize = true;
        } else {
            canvas.width = 832;
            canvas.height = 1344;
            oversize = false;
        }
            
        $("input[type=radio]:checked").filter(function() {
            return !$(this).data("oversize");
        }).each(function(index) {
            var isMale = $("#sex-male").prop("checked");
            var isFemale = $("#sex-female").prop("checked");
            if ($(this).data("file")) {
                var img = getImage($(this).data("file"));
                if ($(this).data("behind")) {
                    ctx.globalCompositeOperation = "destination-over";
                    ctx.drawImage(img, 0, 0);
                    ctx.globalCompositeOperation = "source-over";
                } else
                    ctx.drawImage(img, 0, 0);
            }
            if ($(this).data("file_hat") && $("#hat_chain").prop("checked")) {
                var img = getImage($(this).data("file_hat"));
                ctx.drawImage(img, 0, 0);
            }
            if ($(this).data("file_no_hat") && !$("#hat_chain").prop("checked")) {
                var img = getImage($(this).data("file_no_hat"));
                ctx.drawImage(img, 0, 0);
            }
            if (isMale && $(this).data("file_male")) {
                var img = getImage($(this).data("file_male"));
                ctx.drawImage(img, 0, 0);
            }
            if (isFemale && $(this).data("file_female")) {
                var img = getImage($(this).data("file_female"));
                ctx.drawImage(img, 0, 0);
            }
            var id = $(this).attr("id");
            var hsm_prefix = "hair-plain-";
            var hsf_prefix = "hair-ponytail2-";
            if (startsWith(id, hsm_prefix) ||
                startsWith(id, hsf_prefix)) {
                $("input[type=radio]:checked").filter(function() {
                    return $(this).attr("id").substr(0, 5) == "body-";
                }).each(function() {
                    if (isMale && $(this).data("hs_male")) {
                        var img = getImage($(this).data("hs_male"))
                        ctx.drawImage(img, 0, 0);
                    }
                    if (isFemale && $(this).data("hs_female")) {
                        var img = getImage($(this).data("hs_female"))
                        ctx.drawImage(img, 0, 0);
                    }
                });
            }
        });
        
        if (oversize) {
            $("input[type=radio]:checked").filter(function() {
                return $(this).data("oversize");
            }).each(function(index) {
                var type = $(this).data("oversize");
                if (type == 1) {
                    for (var i = 0; i < 8; ++i)
                        for (var j = 0; j < 4; ++j) {
                            var imgData = ctx.getImageData(64 * i, 264 + 64 * j, 64, 64);
                            ctx.putImageData(imgData, 64 + 192 * i, 1416 + 192 * j);
                        }
                    if ($(this).data("file")) {
                        var img = getImage($(this).data("file"));
                        ctx.drawImage(img, 0, 1344);
                    }
                } else if (type == 2) {
                    for (var i = 0; i < 6; ++i)
                        for (var j = 0; j < 4; ++j) {
                            var imgData = ctx.getImageData(64 * i, 776 + 64 * j, 64, 64);
                            ctx.putImageData(imgData, 64 + 192 * i, 1416 + 192 * j);
                        }
                    if ($("#sex-male").prop("checked") && $(this).data("file_male")) {
                        var img = getImage($(this).data("file_male"));
                        ctx.drawImage(img, 0, 1344);
                    }
                    if ($("#sex-female").prop("checked") && $(this).data("file_female")) {
                        var img = getImage($(this).data("file_female"));
                        ctx.drawImage(img, 0, 1344);
                    }
                }
            });
        }
        
        $("input[type=radio]").each(function(index) {
            if ($(this).data("required")) {
                var requirement = $(this).data("required").replace("=", "-");
                if ($("#" + requirement).prop("checked"))
                    $(this).prop("disabled", false);
                else {
                    $(this).prop("disabled", true);
                    if ($(this).prop("checked"))
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            if ($(this).data("prohibited")) {
                var requirement = $(this).data("prohibited").replace("=", "-");
                if ($("#" + requirement).prop("checked")) {
                    $(this).prop("disabled", true);
                    if ($(this).prop("checked"))
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else
                    $(this).prop("disabled", false);
            }
        });
    }
    
    var images = {};
    
    function getImage(imgRef) {
        if (images[imgRef])
            return images[imgRef];
        else {
            var img = new Image();
            img.src = "Universal-LPC-spritesheet/" + imgRef;
            img.onload = redraw;
            images[imgRef] = img;
            return img;
        }
    }
    
    redraw();
});