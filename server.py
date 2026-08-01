from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import sys

app = Flask(__name__)
CORS(app)
JENKINS_URL = "http://13.203.124.160:8080"
JENKINS_USER = os.getenv("JENKINS_USER")
JENKINS_API_TOKEN = os.getenv("JENKINS_API_TOKEN")
JENKINS_TRIGGER_TOKEN = os.getenv("JENKINS_TRIGGER_TOKEN")

JOB_NAME = "DevOps-Quest-Feedback-Mail"


@app.route("/feedback", methods=["POST"])
def feedback():

    data = request.get_json()
    

    name = data.get("name")
    score = data.get("score")
    rating = data.get("rating")
    comments = data.get("comments")
    suggestions = data.get("suggestions")

    print("===== NEW FEEDBACK =====")
    print("Name:", name)
    print("Score:", score)
    print("Rating:", rating)
    print("Comments:", comments)
    print("Suggestions:", suggestions)
    print("========================")

    jenkins_url = (
        f"{JENKINS_URL}/job/{JOB_NAME}/buildWithParameters?token={JENKINS_TRIGGER_TOKEN}"
    )

    parameters = {
        "token": JENKINS_TRIGGER_TOKEN,
        "NAME": name,
        "SCORE": score,
        "RATING": rating,
        "COMMENTS": comments,
        "SUGGESTIONS": suggestions
    }
    print("Request JSON:", data)
    print("Jenkins URL:", jenkins_url)
    print("Parameters:", parameters)

    try:
        # Get Jenkins Crumb
        crumb_url = f"{JENKINS_URL}/crumbIssuer/api/json"
        
        session = requests.Session()
 
        crumb_response = session.get(
            crumb_url,
            auth=(JENKINS_USER, JENKINS_API_TOKEN)
        )
        
        crumb_data = crumb_response.json()
        
        headers = {
            crumb_data["crumbRequestField"]: crumb_data["crumb"]
        }
        
        print("CRUMB DATA:", crumb_data)
        print("HEADERS:", headers)
        
        response = session.post(
            jenkins_url,
            data=parameters,
            auth=(JENKINS_USER, JENKINS_API_TOKEN),
            headers=headers,
            timeout=10,
            allow_redirects=False
        )

        print("Jenkins response:", response.status_code)
        print("Jenkins response body:", response.text)

        if response.status_code in [200, 201, 202]:
            return jsonify({
                "status": "success",
                "message": "Feedback received and Jenkins triggered"
            }), 200

        return jsonify({
            "status": "error",
            "message": "Feedback received but Jenkins trigger failed",
            "jenkins_status": response.status_code
        }), 500

    except Exception as e:
        import traceback
    
        print("=" * 80)
        traceback.print_exc()
        print("=" * 80)
    
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
