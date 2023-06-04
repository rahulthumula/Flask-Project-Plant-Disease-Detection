from flask import Flask, render_template, request, jsonify
from PIL import Image
import numpy as np
import joblib
from keras.models import load_model

app = Flask(__name__)
app.config['DEBUG'] = True

# Load the model and label transformer from pickle files
model = load_model('Model_AlexNet.h5')
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

    # Transform the predicted labels back to their original form
    predicted_label = label_transform.inverse_transform(prediction)[0]

    # Render a template with the prediction result
    return render_template('result.html', prediction=predicted_label)

if __name__ == '__main__':
    app.run(debug=True)
