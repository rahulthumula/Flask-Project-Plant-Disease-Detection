$(document).ready(function() {
  // Get the image file input element
  var imageInput = document.getElementById('image');
  var imagePreview = document.getElementById('image-preview');
  var predictionResult = document.getElementById('prediction-result');

  // Handle image preview when a file is selected
  imageInput.addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      // Clear previous image preview
      imagePreview.innerHTML = '';

      // Create an image element and set its source to the selected file
      var img = document.createElement('img');
      img.src = e.target.result;
      img.classList.add('img-thumbnail');

      // Append the new image preview
      imagePreview.appendChild(img);
    };

    reader.readAsDataURL(file);
  });

  // Handle form submission and prediction result display
  $('#image-upload').on('submit', function(event) {
    event.preventDefault();

    // Get the selected image file
    var imageFile = imageInput.files[0];

    // Prepare the form data to submit
    var formData = new FormData();
    formData.append('image', imageFile);

    // Display a loading spinner while waiting for the prediction result
    predictionResult.innerHTML = '<div class="spinner-border" role="status"></div>';

    // Send the form data via AJAX to the prediction endpoint
    $.ajax({
      url: '/predict',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        // Display the prediction result
        predictionResult.innerHTML = '<h3>' + response.prediction + '</h3>';
      },
      error: function(xhr, status, error) {
        // Display an error message if prediction fails
        predictionResult.innerHTML = '<h3>Error predicting the image.</h3>';
      }
    });
  });
});
