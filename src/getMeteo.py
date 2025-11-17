import requests, json
from dataclasses import dataclass

GEOCODE_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search?"
FORECAST_BASE_URL = "https://api.open-meteo.com/v1/forecast"
TOP_30_CITIES = ["Paris", "Nice", "Lyon", "Bordeaux", "Marseille", "Strasbourg", "Lille", "Aix-en-Provence", "Avignon", "Toulouse", "Nantes", "Montpellier", "Cannes", "Saint-Tropez", "Biarritz", "La Rochelle", "Rennes", "Dijon", "Reims", "Rouen", "Tours", "Nancy", "Annecy", "Nimes", "Arles", "Grenoble", "Amiens", "Metz", "Carcassonne", "Versailles"]
TEST_CITY = ['Marignane']

@dataclass
class DailyForecast:
    date : str
    weather_code: int
    temperature: float

@dataclass
class CityData:
    name : str
    lat : float
    long : float
    temperature_moyenne : float
    forecast: list

@dataclass
class Semaine:
    semaine: int
    daily: list

def getCityData(cities):
    datas = []
    for city in cities:
        params = {
            "name": city,
            "count": 1,
            "language": "fr",
            "format": "json"
        }

        data_dict = get_json(GEOCODE_BASE_URL, params)

        if "results" in data_dict and len(data_dict["results"]) > 0:
            cd = CityData(
                name=city,
                lat=data_dict["results"][0]["latitude"],
                long=data_dict["results"][0]["longitude"],
                temperature_moyenne=0,
                forecast=[]
            )
            datas.append(cd)
        else:
            print(f"Ville {city} non trouvée.")
            continue

    return datas

def get_forecasts():
    datas = getCityData(TOP_30_CITIES)
    
    forecasts = []
    for d in datas:
        params = {
            "latitude": d.lat,
            "longitude": d.long,
            "daily": "weathercode,temperature_2m_max",
            "timezone": "Europe/London",
            "forecast_days": 14
        }

        temp_moy = 0

        data_dict = get_json(FORECAST_BASE_URL, params)

        if "daily" in data_dict and "time" in data_dict["daily"] and "temperature_2m_max" in data_dict["daily"]:
            days = data_dict["daily"]["time"]
            weather_codes = data_dict["daily"]["weathercode"]
            temp = data_dict["daily"]["temperature_2m_max"]

            weeks = []
            current_week = None

            for i in range(len(days)):
                day = DailyForecast(
                    date=days[i],
                    weather_code=weather_codes[i],
                    temperature=temp[i]
                )
                temp_moy += temp[i]

                week_number = i // 7 + 1
                if current_week is None or current_week.semaine != week_number:
                    current_week = Semaine(semaine=week_number, daily=[])
                    weeks.append(current_week)

                current_week.daily.append(day)

            d.forecast = weeks
            d.temperature_moyenne = round(temp_moy / len(days), 1)
            forecasts.append(d)
    
    return forecasts

def get_json(url, params):
    response = requests.get(url, params=params)
    response.raise_for_status()

    return json.loads(response.text)

def obj_dict(obj):
    if hasattr(obj, "__dict__"):
        return obj.__dict__
    else:
        return str(obj)

if __name__ == "__main__":
    weather_data = get_forecasts()

    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(weather_data, f, default=obj_dict, indent=4)
