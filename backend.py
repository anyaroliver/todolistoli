import os
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'reply': 'No message provided.'}), 400

    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "deepseek/deepseek-prover-v2:free",
                "messages": [
                    {"role": "user", "content": user_message}
                ]
            }
        )
        response.raise_for_status()
        data = response.json()
        reply = data['choices'][0]['message']['content'] if data.get('choices') else '[No response]'
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'reply': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True) 