window.addEventListener("load", function() {
    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault();
        let textToGenerate = document.getElementById("text_qrcode").value;
        let colorLine = document.getElementById("color_line").value.substr(1);
        let colorBg = document.getElementById("color_bg").value.substr(1);
        let margin = document.getElementById("customRange").value;

        generateQRCode(textToGenerate, colorLine, colorBg, margin);
    });
});
  function generateQRCode(text, colorLine, colorBg, margin) {
    var url = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(text) + "&size=512x512&color=" + colorLine + "&bgcolor=" + colorBg + "&margin=" + margin;

    var qrcodeDiv = document.getElementById("qrcode");
    qrcodeDiv.innerHTML = '';

    var img = document.createElement('img');
    img.src = url;

    qrcodeDiv.appendChild(img);
    img.style.width = "100%";

    document.getElementById("imagePlaceholder").style.display = "none";
    qrcodeDiv.style.display = "block";

    var downloadLink = document.getElementById("downloadLink");
    downloadLink.onclick = function() {
      var link = document.createElement("a");
      link.href = img.src;
      link.download = 'qr-code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  }
