from fastapi import FastAPI
import google.generativeai as genai
import os
from pydantic import BaseModel

class ParseRequest(BaseModel):
    command: str

# Initialize FastAPI app
app = FastAPI()

# Configure Gemini API key from environment variable
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Initialize the Gemini model
model = genai.GenerativeModel('gemini-1.5-flash')

# Define the command parsing function
def parse_command(command: str) -> str:
    response = model.generate_content(command)
    return response.text

# Define the API endpoint
@app.post("/parse")
def parse_command_endpoint(command: ParseRequest):
    user_command = command.command
    print(f"Received command: {user_command}")
    result = parse_command(user_command)
    print(f"Command: {user_command} Generated response: {result}")
    return {"result": result}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
