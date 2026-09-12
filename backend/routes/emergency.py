from fastapi import APIRouter
from models.emergency import EmergencyDetectionRequest

router = APIRouter(
    prefix="/api/emergency",
    tags=["Emergency"]
)


@router.post("/detect")
def detect_emergency(data: EmergencyDetectionRequest):

    speed_drop = data.speed_before - data.speed_after

    possible_accident = (
        data.speed_before > 40
        and speed_drop > 30
        and data.acceleration > 6
    )

    if possible_accident:
        status = "possible_accident"
        message = "Possible accident detected. User confirmation required."
    else:
        status = "normal"
        message = "No strong accident indication detected."

    return {
        "user_id": data.user_id,
        "status": status,
        "message": message,
        "location": {
            "latitude": data.latitude,
            "longitude": data.longitude
        },
        "speed_drop": speed_drop
    }


@router.post("/confirm")
def confirm_emergency(user_id: int):
    return {
        "user_id": user_id,
        "status": "confirmed",
        "message": "Emergency confirmed. Starting emergency response."
    }


@router.post("/cancel")
def cancel_emergency(user_id: int):
    return {
        "user_id": user_id,
        "status": "cancelled",
        "message": "Emergency cancelled by user."
    }