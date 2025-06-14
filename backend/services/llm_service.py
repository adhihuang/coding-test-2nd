import requests , os 
from config import settings

class LLMClient:
    def __init__(self):
        self.api_key = settings.openai_api_key 
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={self.api_key}"

    def ask_with_context(self, query: str, context: str) -> str:
        prompt = f"""
            You are an corporate intelligent assistant. Your task is answer user needs based on given context document
            Context: {context}

            Question: {query}
            Answer:

            Important: Do not use your knowledge to answer, if you don't know just say don't know
        """

        data = {
            "contents": [
                {"parts": [{"text": prompt}]}
            ]
        }

        headers = {"Content-Type": "application/json"}
        response = requests.post(self.url, json=data, headers=headers)
        result = response.json()
        
        return result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
