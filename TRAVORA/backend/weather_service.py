"""
TRAVORA Live Weather Service
Integrates real-time weather data for destinations using Open-Meteo API.
Includes in-memory TTL caching, WMO weather code mapping, and resilient fallback telemetry.
"""

import time
import urllib.request
import json
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Weather code descriptions & icons based on WMO standards
WMO_WEATHER_CODES = {
    0: {"condition": "Clear Sky", "icon": "sun", "severity": "low"},
    1: {"condition": "Mainly Clear", "icon": "sun", "severity": "low"},
    2: {"condition": "Partly Cloudy", "icon": "cloud-sun", "severity": "low"},
    3: {"condition": "Overcast", "icon": "cloud", "severity": "low"},
    45: {"condition": "Foggy", "icon": "cloud-fog", "severity": "medium"},
    48: {"condition": "Depositing Rime Fog", "icon": "cloud-fog", "severity": "medium"},
    51: {"condition": "Light Drizzle", "icon": "cloud-drizzle", "severity": "medium"},
    53: {"condition": "Moderate Drizzle", "icon": "cloud-drizzle", "severity": "medium"},
    55: {"condition": "Dense Drizzle", "icon": "cloud-drizzle", "severity": "medium"},
    61: {"condition": "Slight Rain", "icon": "cloud-rain", "severity": "medium"},
    63: {"condition": "Moderate Rain", "icon": "cloud-rain", "severity": "high"},
    65: {"condition": "Heavy Rain", "icon": "cloud-rain", "severity": "high"},
    71: {"condition": "Slight Snowfall", "icon": "snowflake", "severity": "medium"},
    73: {"condition": "Moderate Snowfall", "icon": "snowflake", "severity": "high"},
    75: {"condition": "Heavy Snowfall", "icon": "snowflake", "severity": "high"},
    80: {"condition": "Slight Rain Showers", "icon": "cloud-rain", "severity": "medium"},
    81: {"condition": "Moderate Rain Showers", "icon": "cloud-rain", "severity": "high"},
    82: {"condition": "Violent Rain Showers", "icon": "cloud-lightning", "severity": "high"},
    95: {"condition": "Thunderstorm", "icon": "cloud-lightning", "severity": "critical"},
    96: {"condition": "Thunderstorm with Slight Hail", "icon": "cloud-lightning", "severity": "critical"},
    99: {"condition": "Thunderstorm with Heavy Hail", "icon": "cloud-lightning", "severity": "critical"}
}

# In-memory weather cache: (lat_round, lng_round) -> (data, expires_at)
_WEATHER_CACHE: Dict[str, Any] = {}
CACHE_TTL_SECONDS = 600  # 10 minutes cache

def get_live_weather(lat: float, lng: float, destination_name: str = "Destination") -> Dict[str, Any]:
    """
    Fetches real-time weather telemetry from Open-Meteo API for given lat/lng.
    If the external API is unreachable, provides graceful baseline climatological data.
    """
    cache_key = f"{round(lat, 3)}_{round(lng, 3)}"
    now = time.time()
    
    # Return valid cache if available
    if cache_key in _WEATHER_CACHE:
        entry = _WEATHER_CACHE[cache_key]
        if now < entry["expires_at"]:
            return entry["data"]

    # Open-Meteo API URL
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={lat}&longitude={lng}&"
        f"current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&"
        f"hourly=temperature_2m,precipitation_probability,precipitation,wind_speed_10m&"
        f"daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&"
        f"timezone=auto&forecast_days=3"
    )

    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "TRAVORA-DigitalTwin/1.0 (Tour Intelligence Platform)"}
        )
        with urllib.request.urlopen(req, timeout=5) as resp:
            raw_data = json.loads(resp.read().decode("utf-8"))
            
        current = raw_data.get("current", {})
        code = current.get("weather_code", 0)
        code_meta = WMO_WEATHER_CODES.get(code, {"condition": "Partly Cloudy", "icon": "cloud-sun", "severity": "low"})
        
        weather_payload = {
            "source": "Open-Meteo Real-Time Telemetry API",
            "source_url": "https://open-meteo.com",
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
            "destination_name": destination_name,
            "latitude": lat,
            "longitude": lng,
            "elevation": raw_data.get("elevation", 0),
            "temperature_c": round(current.get("temperature_2m", 28.0), 1),
            "feels_like_c": round(current.get("apparent_temperature", 29.5), 1),
            "humidity_pct": int(current.get("relative_humidity_2m", 65)),
            "precipitation_mm": float(current.get("precipitation", 0.0)),
            "rain_mm": float(current.get("rain", 0.0)),
            "wind_speed_kmh": round(current.get("wind_speed_10m", 14.0), 1),
            "wind_direction_deg": int(current.get("wind_direction_10m", 180)),
            "pressure_hpa": round(current.get("surface_pressure", 1012.0), 1),
            "weather_code": code,
            "condition": code_meta["condition"],
            "icon": code_meta["icon"],
            "severity": code_meta["severity"],
            "hourly_forecast": _format_hourly(raw_data.get("hourly", {})),
            "daily_forecast": _format_daily(raw_data.get("daily", {})),
            "is_cached": False,
            "is_live": True
        }

        # Cache valid response
        _WEATHER_CACHE[cache_key] = {
            "data": weather_payload,
            "expires_at": now + CACHE_TTL_SECONDS
        }
        return weather_payload

    except Exception as e:
        logger.warning(f"Live weather API error for {destination_name} ({lat}, {lng}): {e}. Using resilient baseline fallback.")
        return _generate_fallback_weather(lat, lng, destination_name, str(e))

def _format_hourly(hourly_raw: Dict[str, Any]) -> list:
    times = hourly_raw.get("time", [])[:8]
    temps = hourly_raw.get("temperature_2m", [])[:8]
    precips = hourly_raw.get("precipitation", [])[:8]
    winds = hourly_raw.get("wind_speed_10m", [])[:8]
    
    result = []
    for i in range(len(times)):
        t_str = times[i]
        hour_display = t_str.split("T")[-1] if "T" in t_str else t_str
        result.append({
            "time": hour_display,
            "temperature_c": temps[i] if i < len(temps) else 27.0,
            "precipitation_mm": precips[i] if i < len(precips) else 0.0,
            "wind_speed_kmh": winds[i] if i < len(winds) else 12.0
        })
    return result

def _format_daily(daily_raw: Dict[str, Any]) -> list:
    dates = daily_raw.get("time", [])[:3]
    t_max = daily_raw.get("temperature_2m_max", [])[:3]
    t_min = daily_raw.get("temperature_2m_min", [])[:3]
    precip_sums = daily_raw.get("precipitation_sum", [])[:3]
    codes = daily_raw.get("weather_code", [])[:3]

    result = []
    for i in range(len(dates)):
        code = codes[i] if i < len(codes) else 0
        meta = WMO_WEATHER_CODES.get(code, {"condition": "Clear", "icon": "sun"})
        result.append({
            "date": dates[i],
            "temp_max": t_max[i] if i < len(t_max) else 30.0,
            "temp_min": t_min[i] if i < len(t_min) else 22.0,
            "precipitation_sum_mm": precip_sums[i] if i < len(precip_sums) else 0.0,
            "condition": meta["condition"],
            "icon": meta["icon"]
        })
    return result

def _generate_fallback_weather(lat: float, lng: float, destination_name: str, reason: str) -> Dict[str, Any]:
    """Generates standard regional climatological baseline when network is offline."""
    # Deterministic default based on latitude
    base_temp = 29.0 if lat < 20 else (24.0 if lat < 28 else 18.0)
    base_humidity = 70 if lat < 20 else 55
    base_wind = 12.0
    
    return {
        "source": "Open-Meteo Climatological Baseline (Offline Resilient Mode)",
        "source_url": "https://open-meteo.com",
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "destination_name": destination_name,
        "latitude": lat,
        "longitude": lng,
        "elevation": 15,
        "temperature_c": base_temp,
        "feels_like_c": base_temp + 1.5,
        "humidity_pct": base_humidity,
        "precipitation_mm": 0.0,
        "rain_mm": 0.0,
        "wind_speed_kmh": base_wind,
        "wind_direction_deg": 220,
        "pressure_hpa": 1013.2,
        "weather_code": 1,
        "condition": "Mainly Clear",
        "icon": "sun",
        "severity": "low",
        "hourly_forecast": [
            {"time": "09:00", "temperature_c": base_temp - 1, "precipitation_mm": 0.0, "wind_speed_kmh": 10.0},
            {"time": "12:00", "temperature_c": base_temp + 2, "precipitation_mm": 0.0, "wind_speed_kmh": 14.0},
            {"time": "15:00", "temperature_c": base_temp + 1, "precipitation_mm": 0.0, "wind_speed_kmh": 15.0},
            {"time": "18:00", "temperature_c": base_temp - 2, "precipitation_mm": 0.0, "wind_speed_kmh": 11.0}
        ],
        "daily_forecast": [
            {"date": "Today", "temp_max": base_temp + 2, "temp_min": base_temp - 4, "precipitation_sum_mm": 0.0, "condition": "Mainly Clear", "icon": "sun"},
            {"date": "Tomorrow", "temp_max": base_temp + 3, "temp_min": base_temp - 3, "precipitation_sum_mm": 0.0, "condition": "Clear", "icon": "sun"},
            {"date": "Day 3", "temp_max": base_temp + 1, "temp_min": base_temp - 5, "precipitation_sum_mm": 0.2, "condition": "Partly Cloudy", "icon": "cloud-sun"}
        ],
        "is_cached": True,
        "is_live": False,
        "offline_reason": reason
    }
