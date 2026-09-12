from pydantic import BaseModel


class EmergencyDetectionRequest(BaseModel):
    user_id: int

    speed_before: float
    speed_after: float

    acceleration: float

    latitude: float
    longitude: float