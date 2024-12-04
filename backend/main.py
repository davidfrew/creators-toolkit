from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import replicate
import os
from dotenv import load_dotenv
import base64
from io import BytesIO
from PIL import Image

load_dotenv()

app = FastAPI(title="Creator's Swiss Army Knife API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Welcome to Creator's Swiss Army Knife API"}

@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    try:
        # Read and validate the image
        contents = await file.read()
        img = Image.open(BytesIO(contents))
        
        # Convert image to base64
        buffered = BytesIO()
        img.save(buffered, format=img.format)
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        # Call Replicate API to remove background
        output = replicate.run(
            "ilkerc/rembg:7f5cc6e347e4f9f836500a667c8ef3ad44b3e0cab3ad63c767e2756ac15b8cbf",
            input={"image": img_str}
        )
        
        return JSONResponse(content={"url": output})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-palette")
async def generate_palette(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(BytesIO(contents))
        
        # Extract dominant colors (simplified version)
        # In production, use a more sophisticated color extraction algorithm
        colors = img.getcolors(img.size[0] * img.size[1])
        if colors:
            colors.sort(reverse=True)
            palette = [f"#{:02x}{:02x}{:02x}" for _, (r, g, b) in colors[:5]]
            return {"palette": palette}
        return {"palette": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
