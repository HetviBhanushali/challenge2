def compress_temperature(celsius: float) -> str:
    if celsius < 18: return "Low"
    if celsius < 26: return "Normal"
    return "High"

def compress_light(lux: float) -> str:
    if lux < 50: return "Dark"
    if lux < 300: return "Moderate"
    return "Bright"

def compress_air_quality(co2_ppm: float) -> str:
    return "Good" if co2_ppm < 1000 else "Poor"

def get_time_state() -> str:
    from datetime import datetime
    hour = datetime.now().hour
    return "Night" if hour < 6 or hour >= 22 else "Day"

def compress_sensor_data(raw: dict) -> dict:
    return {
        "room": raw.get("room", "Unknown"),
        "occupied": int(raw.get("motion", False)),
        "temp_state": compress_temperature(raw.get("temperature", 22)),
        "light_state": compress_light(raw.get("light_lux", 100)),
        "air_quality": compress_air_quality(raw.get("co2_ppm", 400)),
        "time": get_time_state()
    }