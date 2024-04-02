window.addEventListener("load", function() {
  // Обработчик для формы генерации QR-кода
  document.querySelector("form").addEventListener("submit", function(event) {
      event.preventDefault();
      let textToGenerate = document.getElementById("text_qrcode").value;
      let colorLine = document.getElementById("color_line").value.substr(1);
      let colorBg = document.getElementById("color_bg").value.substr(1);
      let margin = document.getElementById("customRange").value;

      generateQRCode(textToGenerate, colorLine, colorBg, margin);
  });

  // Обработчик для формы сканирования QR-кода
  document.querySelector("#profile-tab-pane form").addEventListener("submit", function(event) {
      event.preventDefault();
      let file = document.getElementById("formFile").files[0];
      
      if (!file) {
          alert('Выберите файл');
          return;
      }

      let reader = new FileReader();
      reader.onload = function(event) {
          let imageData = event.target.result;
          scanQRCode(imageData);
      };
      reader.readAsDataURL(file);
  });

  // Функция для сканирования QR-кода изображения
  function scanQRCode(imageData) {
      let image = new Image();
      image.onload = function() {
          let canvas = document.createElement('canvas');
          let context = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          let code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
              // Если QR-код найден, отобразите его содержимое на странице
              displayScannedResult(code.data);
          } else {
              alert('QR-код не найден');
          }
      };
      image.src = imageData;
  }

  // Функция для отображения результата сканирования QR-кода
  function displayScannedResult(result) {
      let scannedCard = document.querySelector("#profile-tab-pane .card");
      let scannedCardBody = scannedCard.querySelector('.card-body');
      let scannedLink = scannedCardBody.querySelector('a');
      let scannedText = scannedCardBody.querySelector('.placeholder-glow');

      scannedText.innerHTML = result;

      // Проверяем, является ли результат ссылкой (начинается с "http://" или "https://")
      if (isValidURL(result)) {
          scannedLink.style.display = 'block';
          scannedLink.href = result;
          scannedLink.textContent = 'Перейти';
          scannedCard.style.display = 'block';
          scannedLink.classList.remove('disabled', 'placeholder');
      } else {
          scannedText.innerHTML = result;
          scannedCard.style.display = 'block';
          scannedLink.style.display = 'none';
      }
  }

  // Функция для проверки, является ли строка URL
  function isValidURL(string) {
      return /^https?:\/\//i.test(string);
  }

  // Функция для генерации QR-кода
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
});
