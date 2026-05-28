from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Inventory Management API Running"}