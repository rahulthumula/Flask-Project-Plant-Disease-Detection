$(document).ready(function() {
  var imageInput = document.getElementById('image');
  var imagePreview = document.getElementById('image-preview');
  var predictionResult = document.getElementById('prediction-result');
  var imageName = document.querySelector('.image-name');

  imageInput.addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      imagePreview.innerHTML = '';

      var img = document.createElement('img');
      img.src = e.target.result;
      img.className = 'img-thumbnail';

      imagePreview.appendChild(img);
    };

    reader.onerror = function(e) {
      console.error('Error occurred while reading the image.');
    };

    if (file) {
      reader.readAsDataURL(file);
      imageName.textContent = 'Selected image: ' + file.name;
    }
  });

  $('#image-upload').on('submit', function(event) {
    event.preventDefault();

    var imageFile = imageInput.files[0];

    if (!imageFile) {
      console.error('No image file selected.');
      return;
    }

    var formData = new FormData();
    formData.append('image', imageFile);

    predictionResult.innerHTML = '<div class="spinner-border" role="status"></div>';

    $.ajax({
      url: '/predict',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        predictionResult.innerHTML = '<h3>' + response.prediction + '</h3>';
      },
      error: function(xhr, status, error) {
        predictionResult.innerHTML = '<h3>Error predicting the image.</h3>';
      }
    });
  });
});
