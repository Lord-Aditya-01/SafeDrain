# 0c0bc34517df8987cecb2a3511016f1f
import pandas as pd
import requests

API_KEY = "0c0bc34517df8987cecb2a3511016f1f"

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"


def normalize_columns(df):
    df.columns = (
        df.columns.str.strip()
        .str.lower()
        .str.replace(" ", "_")
        .str.replace("/", "_")
        .str.replace("(", "")
        .str.replace(")", "")
    )
    return df


def extract_gps_from_excel(file_path):

    df = pd.read_excel(file_path, sheet_name="Site_info")

    df = normalize_columns(df)

    gps = str(df["gps_coordinates"].iloc[0]).strip()

    parts = gps.split(",")

    if len(parts) != 2:
        raise Exception(f"Invalid GPS format: {gps}")

    lat = float(parts[0])
    lon = float(parts[1])

    return lat, lon


def fetch_weather_from_api(lat, lon):

    params = {"lat": lat, "lon": lon, "appid": API_KEY, "units": "metric"}

    response = requests.get(BASE_URL, params=params)

    if response.status_code != 200:
        raise Exception("Weather API request failed")

    data = response.json()

    weather = {}

    weather["temperature_c"] = data["main"]["temp"]
    weather["humidity_percent"] = data["main"]["humidity"]

    rain = data.get("rain", {})

    weather["current_rainfall_mm"] = rain.get("1h", 0)

    weather["rainfall_last_24h_mm"] = weather["current_rainfall_mm"] * 3
    weather["rainfall_last_72h_mm"] = weather["current_rainfall_mm"] * 5

    return weather


def get_weather_data(file_path):

    lat, lon = extract_gps_from_excel(file_path)

    weather = fetch_weather_from_api(lat, lon)

    return weather
