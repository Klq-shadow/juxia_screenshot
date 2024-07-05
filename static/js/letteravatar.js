$(function () {
  var initials = $(".panel-user-info-top")
    .map(function () {
      return $(this).text().match(/\b\w/g).join("").toUpperCase();
    })
    .get();
  console.log(initials);
  var imgElements = document.querySelectorAll('img[avatar=""]');
  for (var i = 0; i < initials.length; i++) {
    if (i < imgElements.length) {
      imgElements[i].setAttribute("avatar", initials[i]);
    }
  }
});

(function (w, d) {
  function LetterAvatar(name, size, color) {
    name = name || "";
    size = size || 60;
    var colours = [
        "#1abc9c",
        "#2ecc71",
        "#3498db",
        "#9b59b6",
        "#34495e",
        "#16a085",
        "#27ae60",
        "#2980b9",
        "#8e44ad",
        "#2c3e50",
        "#f1c40f",
        "#e67e22",
        "#e74c3c",
        "#00bcd4",
        "#95a5a6",
        "#f39c12",
        "#d35400",
        "#c0392b",
        "#bdc3c7",
        "#7f8c8d",
      ],
      nameSplit = String(name).split(" "),
      initials,
      charIndex,
      colourIndex,
      canvas,
      context,
      dataURI;
    if (nameSplit.length == 1) {
      initials = nameSplit[0] ? nameSplit[0].charAt(0) : "?";
    } else {
      initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
    }
    if (w.devicePixelRatio) {
      size = size * w.devicePixelRatio;
    }

    charIndex = (initials == "?" ? 72 : initials.charCodeAt(0)) - 64;
    colourIndex = charIndex % 20;
    canvas = d.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    context = canvas.getContext("2d");

    context.fillStyle = color ? color : colours[colourIndex - 1];
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = Math.round(canvas.width / 2) + "px 'Microsoft Yahei'";
    context.textAlign = "center";
    context.fillStyle = "#FFF";
    context.fillText(initials, size / 2, size / 1.5);
    dataURI = canvas.toDataURL();
    canvas = null;
    return dataURI;
  }
  LetterAvatar.transform = function () {
    Array.prototype.forEach.call(
      d.querySelectorAll("img[avatar]"),
      function (img, name, color) {
        name = img.getAttribute("avatar");
        color = img.getAttribute("color");
        img.src = LetterAvatar(name, img.getAttribute("width"), color);
        img.removeAttribute("avatar");
        img.setAttribute("alt", name);
      }
    );
  };
  if (typeof define === "function" && define.amd) {
    define(function () {
      return LetterAvatar;
    });
  } else if (typeof exports !== "undefined") {
    if (typeof module != "undefined" && module.exports) {
      exports = module.exports = LetterAvatar;
    }
    exports.LetterAvatar = LetterAvatar;
  } else {
    window.LetterAvatar = LetterAvatar;
    d.addEventListener("DOMContentLoaded", function (event) {
      LetterAvatar.transform();
    });
  }
})(window, document);
