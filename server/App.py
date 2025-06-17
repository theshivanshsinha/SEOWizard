from flask import Flask, request, jsonify
from flask_cors import CORS
from Analyser import analyze_url

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    url = data.get("url")
    if not url:
        return jsonify({"error": "URL required"}), 400

    result = analyze_url(url)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
