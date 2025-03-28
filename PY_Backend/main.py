import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import re

# from flask_cors import CORS

app = FastAPI()

# Enable CORS for all origins (Modify `allow_origins` if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

genai.configure(api_key="AIzaSyBqweFt0c6AkuS8JX9yIZlcvTlBOrpNXUg")


class CodeRequest(BaseModel):
    code: str
    mode: str
    language: str

def generate_prompt(mode, language, code):
    return f"""Analyze and refactor the following {language} code based on {mode} mode. 
    Even if it seems efficient, improve it further for better readability, optimization, and performance. 
    Do not assume the code is already efficient.
    
    Code:
    {code}
    
    Provide only the improved code output."""


def clean_code_output(refactored_code):
    """Removes markdown formatting (triple backticks) from AI response."""
    match = re.search(r"```(?:\w+)?\n(.*?)\n```", refactored_code, re.DOTALL)
    return match.group(1) if match else refactored_code




@app.post("/refactor/")
async def refactor_code(data: CodeRequest):
    try:
        prompt = f"""Analyze and refactor the following {data.language} code based on {data.mode} mode. 
    Even if it seems efficient, improve it further for better readability, optimization, and performance. 
    Do not assume the code is already efficient.
    
    Code:
    {data.code}
    
    Provide only the improved code output."""
        response = genai.GenerativeModel("gemini-1.5-flash").generate_content(prompt)
        refactored_code = response.text

        score_prompt = f"Evaluate the quality of this {data.language} code on a scale of 0-100 based on readability, efficiency, and best practices. Provide only the numeric score:\n{refactored_code}"
        score_response = genai.GenerativeModel("gemini-1.5-flash").generate_content(score_prompt)
        score = score_response.text.strip()


        explanationPrompt=f"""have two versions of a code snippet:
                            Raw Code {data.code}
                            Refactored Code {refactored_code}
                            Compare them and explain:
                            What optimizations were made?
                            How does the new version improve performance, readability, or maintainability?
                            What best practices or patterns were applied?
                            Are there any trade-offs in the refactored version?"""
        
        explanationResponse=genai.GenerativeModel("gemini-1.5-flash").generate_content(explanationPrompt)
        explanation=explanationResponse.text.strip()

        return {"refactoredCode": clean_code_output(refactored_code), "qualityScore": score,"orignalCode":data.code,"explanation":explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
