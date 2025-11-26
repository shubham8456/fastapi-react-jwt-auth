from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()       # Load environment variables from backend/.env before importing app modules

from .api.routes import auth, users
from .db.init_db import init_db

app = FastAPI()

hosts_string = os.getenv('ALLOWED_HOSTS', 'http://localhost:3000')
allowed_hosts_list = [host.strip() for host in hosts_string.split(',')]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_hosts_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(users.router)


@app.on_event("startup")
def on_startup():
    init_db()

