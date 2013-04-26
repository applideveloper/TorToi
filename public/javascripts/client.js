// Generated by CoffeeScript 1.6.2
(function() {
  jQuery(function($) {
    "use strict";
    var createKotae, createToi, editTxt, removeKotae, removeToi, socket;

    socket = io.connect("http://" + location.host + "/");
    socket.on("createToiIni", function(toiData) {
      return toiData.forEach(function(data) {
        return createToi(data, 0);
      });
    });
    socket.on("createToi", function(toiData) {
      return toiData.forEach(function(data) {
        return createToi(data, 1);
      });
    });
    socket.on("createKotaeIni", function(kotaeData) {
      return kotaeData.forEach(function(data) {
        return createKotae(data, 0);
      });
    });
    socket.on("createKotae", function(kotaeData) {
      return kotaeData.forEach(function(data) {
        return createKotae(data, 1);
      });
    });
    socket.on("createTsunagari", function(tsunagariData) {
      return tsunagariData.forEach(function(data) {
        return createTsunagari(data);
      });
    });
    socket.on("update-toi", function(data) {
      return $("#" + data._id).find(".text").text(data.text);
    });
    socket.on("update-kotae", function(data) {
      return $("#" + data._id).find(".text").text(data.text);
    });
    socket.on("move", function(data) {
      return $("#" + data._id).animate(data.position);
    });
    socket.on("resize", function(data) {
      console.log(data.size);
      $("#" + data._id).animate(data.size);
      if ($("#" + data._id + ".kotaeFrame").height() !== 0) {
        return $("#" + data._id + ".kotaeFrame").css({
          height: data.size.height - $("#" + data._id + ".title").height() - 50
        });
      }
    });
    socket.on("removeToi", function(data) {
      return removeToi(data._id);
    });
    $("#headerImage").click(function() {
      var toiData;

      toiData = {
        text: "タイトル",
        position: {
          left: 10,
          top: 115
        },
        size: {
          width: 300,
          height: 230
        }
      };
      return socket.emit("createToi", toiData);
    });
    createToi = function(toiData, flag) {
      var dummy, element, id, old, text;

      id = toiData._id;
      old = $("#" + id);
      if (old.length !== 0) {
        return;
      }
      element = $("<div class=\"toi\"/>");
      element.attr("id", id);
      element.append($("<div class=\"settings\"/>").append("<a href=\"#\" class =\"answer\" >答える</a>").append("<a href=\"#\" class=\"remove-button\">☓</a>")).append($("<div/>").append($("<pre class=\"text\" \"title\"/>").append(toiData.text).append("</pre>")));
      element.append($("<div class=\"kotaeFrame\" id=\"" + id + "\"></div>"));
      element.css({
        width: toiData.size.width,
        height: toiData.size.height
      });
      $("#field").append(element);
      element = $("#" + id);
      element.hide().fadeIn();
      element.css({
        left: toiData.position.left,
        top: toiData.position.top
      });
      element.draggable({
        stop: function(e, ui) {
          var pos;

          pos = {
            left: ui.position.left,
            top: ui.position.top
          };
          if (pos.left < 0) {
            pos.left = 0;
          }
          if (pos.top < 0) {
            pos.top = 0;
          }
          if (pos.left < 203 && pos.top < 105) {
            pos.top = 105;
          }
          return socket.emit("move", {
            _id: id,
            position: pos
          });
        }
      });
      element.css({
        position: "absolute"
      });
      if (flag !== 0) {
        dummy = $("<span  class=\"toi\"/>");
        dummy.attr("id", "d" + id);
        dummy.append($("<pre class=\"dummy\"/>").append(toiData.text).append("</pre></span>"));
        $("#field").append(dummy);
        text = element.find(".text");
        editTxt(id, id, text, 0);
      }
      element.find(".answer").click(function() {
        var kotaeData, number;

        number = Math.floor(Math.random() * 10 + 1);
        if (0 < number && number < 6) {
          kotaeData = {
            text: "ちょ",
            toiId: id
          };
        } else if (5 < number && number < 10) {
          kotaeData = {
            text: "　　　　,.、,､,..,､､.,､,､､..,_　　　　　 　／i\n  　　　;'｀;、､:、. .:、:,　:,.: ::｀ﾞ:.:ﾞ:｀''':,'.´ -‐i\n  　　　'､;: ...: ,:. :.､.∩.. .:: _;.;;.∩‐'ﾞ ￣ ￣\n  　　　　｀\"ﾞ' ''`ﾞ //ﾞ｀´´　　 | |\n  　　　　　　　　//Λ＿Λ　 | |\n  　　　　　　　　| |（　´Д｀）// ＜うるせぇ、エビフライぶつけんぞ\n  　　　　　　　　＼　　　 　 |\n  　　　　　　　　　 |　　　／\n  　　　　　　　　　/ 　　/\n  　　　　 ＿＿　 |　　　|　　＿_\n  　　　　 ＼　 ￣￣￣￣￣　　 ＼\n  　　　　　||＼　　　　　　　　　　　 ＼\n  　　　　　||＼||￣￣￣￣￣￣￣||\n  　　　　　||　 ||￣￣￣￣￣￣￣||",
            toiId: id
          };
        } else {
          kotaeData = {
            text: "　　　　,.、,､,..,､､.,､,､､..,_　　　　　 　／i\n  　　　;'｀;、､:、. .:、:,　:,.: ::｀ﾞ:.:ﾞ:｀''':,'.´ -‐i\n  　　　'､;: ...: ,:. :.､.∩.. .:: _;.;;.∩‐'ﾞ ￣ ￣\n  　　　　｀\"ﾞ' ''`ﾞ //ﾞ｀´´　　 | |\n  　　　　　　　　//Λ＿Λ　 | |\n  　　　　　　　　| |（　´Д｀）// ＜Shut up, I'll hit you a Ebi furai.\n  　　　　　　　　＼　　　 　 |\n  　　　　　　　　　 |　　　／\n  　　　　　　　　　/ 　　/\n  　　　　 ＿＿　 |　　　|　　＿_\n  　　　　 ＼　 ￣￣￣￣￣　　 ＼\n  　　　　　||＼　　　　　　　　　　　 ＼\n  　　　　　||＼||￣￣￣￣￣￣￣||\n  　　　　　||　 ||￣￣￣￣￣￣￣||",
            toiId: id
          };
        }
        return socket.emit("createKotae", kotaeData);
      });
      return element.find(".remove-button").click(function() {
        socket.emit("removeToi", {
          _id: id
        });
        removeToi(id);
        return false;
      });
    };
    editTxt = function(toiId, id, text, flag) {
      var empty, txt;

      if (!text.hasClass("on")) {
        text.addClass("on");
        txt = text.text();
        text.html("<textarea type=\"text\" cols=\"40\" rows=\"10\">" + txt + "</textarea>");
        $("pre > textarea").focus().select();
        empty = /^(\s|　)+$/;
        $("pre > textarea").keypress(function(e) {
          var h, inputVal, siz, span, target, targetToi, wid;

          if (e.keyCode === 13) {
            if (e.shiftKey) {
              return $.noop();
            } else {
              inputVal = $(this).val();
              if (inputVal === "" || empty.test(inputVal)) {
                inputVal = this.defaultValue;
              }
              $(this).parent().removeClass("on").text(inputVal);
              $("span" + "#d" + id).text(inputVal);
              $(this).blur();
              if (flag === 0) {
                target = $("#" + toiId);
                span = $("span" + "#d" + id);
                h = span.height() + 50 - $("#" + toiId + ".kotaeFrame").height();
                siz = {
                  width: span.width(),
                  height: h,
                  "min-height": h
                };
                target.css(siz);
                span.remove();
                socket.emit("update-toi", {
                  _id: id,
                  text: inputVal
                });
                return socket.emit("resize", {
                  _id: id,
                  size: siz
                });
              } else {
                target = $("#" + id);
                targetToi = $("#" + toiId);
                span = $("span" + "#d" + id);
                if (targetToi.width() > span.width()) {
                  wid = targetToi.width();
                } else {
                  wid = span.width();
                }
                span.remove();
                siz = {
                  width: wid - 10,
                  height: $("pre", targetToi).height() + 75 + $(".kotaeFrame", targetToi).height()
                };
                targetToi.css(siz);
                socket.emit("update-kotae", {
                  _id: id,
                  text: inputVal
                });
                return socket.emit("resize", {
                  _id: toiId,
                  size: siz
                });
              }
            }
          }
        });
        return $("pre > textarea").blur(function() {
          var h, inputVal, siz, span, target, targetToi, wid;

          inputVal = $(this).val();
          if (inputVal === "" || empty.test(inputVal)) {
            inputVal = this.defaultValue;
          }
          $(this).parent().removeClass("on").text(inputVal);
          $("span" + "#d" + id).text(inputVal);
          if (flag === 0) {
            target = $("#" + toiId);
            span = $("span" + "#d" + id);
            h = span.height() + 50 - $("#" + toiId + ".kotaeFrame").height();
            siz = {
              width: span.width(),
              height: h,
              "min-height": h
            };
            target.css(siz);
            span.remove();
            socket.emit("update-toi", {
              _id: id,
              text: inputVal
            });
            return socket.emit("resize", {
              _id: id,
              size: siz
            });
          } else {
            target = $("#" + id);
            targetToi = $("#" + toiId);
            span = $("span" + "#d" + id);
            if (targetToi.width() > span.width()) {
              wid = targetToi.width();
            } else {
              wid = span.width();
            }
            span.remove();
            siz = {
              width: wid - 10,
              height: $("pre", targetToi).height() + 75 + $(".kotaeFrame", targetToi).height()
            };
            targetToi.css(siz);
            socket.emit("update-kotae", {
              _id: id,
              text: inputVal
            });
            return socket.emit("resize", {
              _id: toiId,
              size: siz
            });
          }
        });
      }
    };
    removeToi = function(id) {
      return $("#" + id).fadeOut("fast").queue(function() {
        return $(this).remove();
      });
    };
    socket.on("removeKotae", function(data) {
      return removeKotae(data._id);
    });
    createKotae = function(kotaeData, flag) {
      var dummy, element, id, old, text, toiId;

      id = kotaeData._id;
      old = $("#" + id);
      if (old.length !== 0) {
        return;
      }
      toiId = kotaeData.toi;
      element = $("<div class=\"kotae\"/>").attr("id", id).append($("<div class=\"settings\"/>").append("<a href=\"#\" class =\"answer\" >返信する</a>").append("<a href=\"#\" class=\"remove-button\">☓</a>")).append($("<div/>").append($("<pre class=\"text\"/>").append(kotaeData.text).append("</pre>")));
      element.hide().fadeIn();
      $(".kotaeFrame", "#" + kotaeData.toi).append(element);
      if (flag !== 0) {
        dummy = $("<span  class=\"kotae\"/>");
        dummy.attr("id", "d" + id);
        dummy.append($("<pre class=\"dummy\"/>").append(kotaeData.text).append("</pre></span>"));
        $("#field").append(dummy);
        text = element.find(".text");
        editTxt(toiId, id, text, 1);
      }
      return element.find(".remove-button").click(function() {
        socket.emit("removeKotae", {
          _id: id
        });
        removeKotae(id);
        return false;
      });
    };
    return removeKotae = function(id) {
      return $("#" + id).fadeOut("fast").queue(function() {
        return $(this).remove();
      });
    };
  });

}).call(this);
