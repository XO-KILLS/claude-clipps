import os
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid
import asyncio
import subprocess
import json
from dotenv import load_dotenv

# Gemini SDK
import google.generativeai as genai

load_dotenv()

app = FastAPI()

# Configuration
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')
STORAGE_PATH = os.getenv("STORAGE_PATH", "./storage")
FFMPEG_PATH = os.getenv("FFMPEG_PATH", "ffmpeg")

# Ensure storage exists
os.makedirs(STORAGE_PATH, exist_ok=True)

# Mock DB (Replace with Postgres in next phase)
projects = {}
clips = {}

class ProjectRequest(BaseModel):
    url: Optional[str] = None
    file_path: Optional[str] = None

class Clip(BaseModel):
    id: str
    start_time: float
    end_time: float
    virality_score: int
    transcript: str
    output_path: Optional[str] = None

# --- AI Helpers ---

async def transcribe_video(file_path: str):
    """
    Uses Faster-Whisper to transcribe video.
    (Simulation of the local process)
    """
    print(f"Transcribing {file_path}...")
    # In a real impl:
    # model = whisper.load_model("base")
    # segments, _ = model.transcribe(file_path)
    # return list(segments)
    await asyncio.sleep(3)
    return [
        {"start": 0.0, "end": 10.0, "text": "Welcome to the masterclass on AI growth."},
        {"start": 10.0, "end": 30.0, "text": "The biggest mistake people make is ignoring their data."},
        {"start": 30.0, "end": 60.0, "text": "You need to focus on high-leverage activities only."},
    ]

async def analyze_with_gemini(transcript: List[dict]):
    """
    Sends transcript to Gemini to find viral hooks.
    """
    transcript_text = "\n".join([f"[{s['start']}-{s['end']}] {s['text']}" for s in transcript])
    prompt = f"""
    Analyze the following video transcript and identify the 3 most viral clips.
    For each clip, provide:
    1. Start time (seconds)
    2. End time (seconds)
    3. Virality score (0-100)
    4. A concise reason why it's viral.

    Return ONLY a JSON list:
    [
      {{"start": 0.0, "end": 10.0, "score": 95, "reason": "Strong hook"}},
      ...
    ]

    Transcript:
    {transcript_text}
    """
    response = model.generate_content(prompt)
    # Clean the response to ensure it's valid JSON
    text = response.text.replace('```json', '').replace('```', '').strip()
    return json.loads(text)

async def process_video_clip(project_id: str, clip_data: dict, original_path: str):
    """
    FFmpeg: Cut, Crop to 9:16, Burn Captions.
    """
    clip_id = str(uuid.uuid4())
    output_path = os.path.join(STORAGE_PATH, f"{clip_id}.mp4")

    # FFmpeg Command:
    # -t: duration, -ss: start
    # crop: 9:16 ratio center crop
    duration = clip_data['end'] - clip_data['start']
    cmd = [
        FFMPEG_PATH, "-y",
        "-ss", str(clip_data['start']),
        "-i", original_path,
        "-t", str(duration),
        "-vf", "crop=ih*9/16:ih", # Center crop to 9:16
        "-c:v", "libx264", "-preset", "fast",
        output_path
    ]

    # In real implementation, run the subprocess
    # subprocess.run(cmd, check=True)
    await asyncio.sleep(2) # Simulate render
    return output_path

# --- API Endpoints ---

@app.post("/api/projects")
async def create_project(req: ProjectRequest, background_tasks: BackgroundTasks):
    project_id = str(uuid.uuid4())
    # Mock file path for simulation
    source_path = os.path.join(STORAGE_PATH, f"raw_{project_id}.mp4")

    projects[project_id] = {"status": "processing", "url": req.url, "path": source_path}

    async def pipeline():
        try:
            # 1. Transcribe
            transcript = await transcribe_video(source_path)

            # 2. Analyze Hooks
            hooks = await analyze_with_gemini(transcript)

            # 3. Process Clips
            project_clips = []
            for hook in hooks:
                out_path = await process_video_clip(project_id, hook, source_path)
                project_clips.append({
                    "id": str(uuid.uuid4()),
                    "start_time": hook['start'],
                    "end_time": hook['end'],
                    "virality_score": hook['score'],
                    "transcript": "AI analyzed segment...",
                    "output_path": out_path
                })

            clips[project_id] = project_clips
            projects[project_id]["status"] = "completed"
        except Exception as e:
            print(f"Pipeline Error: {e}")
            projects[project_id]["status"] = "failed"

    background_tasks.add_task(pipeline)
    return {"id": project_id}

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    if project_id not in projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return projects[project_id]

@app.get("/api/projects/{project_id}/clips")
async def get_clips(project_id: str):
    return clips.get(project_id, [])
