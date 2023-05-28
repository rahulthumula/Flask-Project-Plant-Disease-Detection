from flask import Flask, render_template, request, jsonify
from PIL import Image
import numpy as np
import joblib
from keras.models import load_model

app = Flask(__name__)
app.config['DEBUG'] = True

# Load the model from the h5 file
model = load_model('Model_AlexNet.h5')

# Load the label transformer from the pickle file
label_transform = joblib.load('label_transform (1).pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the uploaded image file
    image_file = request.files['image']

    # Open and preprocess the image using PIL
    img = Image.open(image_file)
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    preprocessed_image = np.expand_dims(img_array, axis=0)

    # Perform the prediction using the loaded model
    prediction = model.predict(preprocessed_image)

    # Transform the predicted labels using the label transformer
    predicted_label = label_transform.inverse_transform(prediction)[0]

    # Return the prediction result as a JSON response
    response = {'prediction': str(predicted_label)}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
