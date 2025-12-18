import requests
import logging
from langchain.tools import tool
from config import OPENWEATHER_API_KEY

logging.basicConfig(level=logging.INFO)

@tool
def get_weather(city) -> str:
    """
    Get current weather for a city using geocoding.
    Handles string or dict input safely.
    India-first resolution.
    """

    
    if isinstance(city, dict):
        city = city.get("city", "")

    city = city.strip()
    logging.info(f"Weather tool called for city: {city}")

    
    geo_url_india = (
        "https://api.openweathermap.org/geo/1.0/direct"
        f"?q={city},IN&limit=1&appid={OPENWEATHER_API_KEY}"
    )
    geo_res = requests.get(geo_url_india, timeout=10).json()

    
    if not geo_res:
        geo_url_global = (
            "https://api.openweathermap.org/geo/1.0/direct"
            f"?q={city}&limit=1&appid={OPENWEATHER_API_KEY}"
        )
        geo_res = requests.get(geo_url_global, timeout=10).json()

    logging.info(f"Geocoding response: {geo_res}")

    if not geo_res:
        return f"FINAL: Weather data is currently unavailable for {city}."

    lat = geo_res[0]["lat"]
    lon = geo_res[0]["lon"]
    resolved_name = geo_res[0].get("name", city)
    country = geo_res[0].get("country", "")

    
    weather_url = (
        "https://api.openweathermap.org/data/2.5/weather"
        f"?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
    )
    weather_res = requests.get(weather_url, timeout=10).json()

    if weather_res.get("cod") != 200:
        return f"FINAL: Weather data is currently unavailable for {city}."

    temp = weather_res["main"]["temp"]
    desc = weather_res["weather"][0]["description"]

    return f"The temperature in {resolved_name}, {country} is {temp}°C with {desc}."
