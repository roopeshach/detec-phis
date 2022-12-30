# DetecPhis

## Phising Detection Chrome Extension Using Random Forest Algorithm

### Introduction

DetecPhis is a chrome extension that uses a random forest algorithm to detect phishing websites. It is a machine learning based approach to detect phishing websites. It uses a random forest algorithm to classify the websites as phishing or legitimate. The extension is built using the python backend and the random forest algorithm is implemented using the scikit-learn library.

### Installation

1. Clone the repository
2. Open the terminal and go to the repository folder
3. Run the following command to install the dependencies

```bash
python -m venv .env

#for windows 
.env\Scripts\activate

#for linux
source .env/bin/activate

pip install -r requirements.txt
```

4. Run the following command to start the backend server

```bash

python backend/dataset/preprocess.py


python backend/classifier/training.py


```

5. Run the following command to start the python web server for serving the classifier

```bash
cd static
python -m http.server 80
```

6. Open the chrome browser and go to chrome://extensions/
7. Enable the developer mode
8. Click on load unpacked and select the folder containing the extension (frontend folder)
9. The extension is now installed


### Usage

1. Open the chrome browser and go to chrome://extensions/
2. Click on the extension icon
3. The extension will now start running in the background
4. Open a new tab and type the url of the website you want to check
5. The extension will now check the website and display the result




