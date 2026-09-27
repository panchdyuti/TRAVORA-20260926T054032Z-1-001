"""
TRAVORA Digital Twin & Weather Impact Simulation Engine

Architecture:
- In-memory isolated simulation state representing the destination travel ecosystem.
- Reads real catalog entities (Destinations, Hotels, Activities, Transports, Vendors, Districts).
- Never modifies real bookings, users, or operational database records.
- Probabilistic multi-tier weather impact propagation:
    Direct Weather Impact (Outdoor Activities/Attractions)
         │
         ▼
    Secondary Impacts (Traveler Indoor Migration & Transport Delays)
         │
         ▼
    Higher-Order Impacts (Hospitality Lounge/Dining Surges & Revenue Shift)
- What-If Scenario simulation comparing against baseline state.
"""

from typing import Dict, Any, List, Optional
import copy
import random
from sqlalchemy.orm import Session

from backend.models import Destination, Hotel, Activity, Transport, Vendor, District
from backend.weather_service import get_live_weather
from backend.ai_service.nugen_service import nugen_service

# Classify outdoor vs indoor entities based on keywords
OUTDOOR_KEYWORDS = [
    "beach", "water sports", "scuba", "diving", "snorkeling", "trek", "safari",
    "paragliding", "rafting", "kayak", "boat", "cruise", "fort", "viewpoint",
    "outdoor", "surfing", "parasailing", "cycle", "shikara", "hill", "garden",
    "waterfall", "wildlife", "dune", "camping"
]

INDOOR_KEYWORDS = [
    "museum", "palace", "temple", "church", "cathedral", "monastery",
    "art gallery", "spa", "ayurveda", "mall", "bazaar", "indoor", "heritage hall",
    "dining", "restaurant", "cafe", "lounge", "theatre"
]

def is_activity_outdoor(name: str, category: str, description: str = "") -> bool:
    """Classifies an attraction or activity as predominantly outdoor or indoor."""
    text = f"{name} {category} {description}".lower()
    for kw in OUTDOOR_KEYWORDS:
        if kw in text:
            return True
    for kw in INDOOR_KEYWORDS:
        if kw in text:
            return False
    # Default categorizations
    cat_lower = (category or "").lower()
    if cat_lower in ["adventure", "beach", "nature", "sightseeing"]:
        return True
    return False

def build_destination_digital_twin_state(
    destination_id: int,
    db: Session,
    override_weather: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Extracts the destination's active ecosystem from database into an isolated
    in-memory Digital Twin state, then runs the multi-tier impact engine.
    """
    dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if not dest:
        # Fallback to first destination
        dest = db.query(Destination).first()
        if not dest:
            raise ValueError("No destination found in database.")

    # 1. Fetch live baseline weather
    if override_weather:
        weather_state = override_weather
    else:
        weather_state = get_live_weather(dest.lat, dest.lng, dest.name)

    # 2. Extract database entities (strictly read-only)
    hotels = db.query(Hotel).filter(Hotel.destination_id == dest.id).all()
    activities = db.query(Activity).filter(Activity.destination_id == dest.id).all()
    transports = db.query(Transport).filter(Transport.to_destination_id == dest.id).all()
    
    # Extract destination vendors (strictly matching destination name or state keywords)
    dest_name_clean = dest.name.split()[0].replace('(', '').replace(',', '')
    vendors = db.query(Vendor).filter(
        (Vendor.location.ilike(f"%{dest.name}%")) | 
        (Vendor.location.ilike(f"%{dest_name_clean}%")) |
        (Vendor.location.ilike(f"%{dest.state}%"))
    ).limit(12).all()

    # 3. Build Simulated Entity Graph
    simulated_entities: List[Dict[str, Any]] = []

    # Map Activities & Attractions
    for act in activities:
        outdoor = is_activity_outdoor(act.name, act.category, act.description)
        simulated_entities.append({
            "id": f"act_{act.id}",
            "entity_type": "activity",
            "name": act.name,
            "category": act.category,
            "is_outdoor": outdoor,
            "lat": act.lat,
            "lng": act.lng,
            "nominal_price": act.price,
            "rating": act.rating,
            "nominal_capacity": 100,  # percentage
            "simulated_capacity": 100,
            "status": "operational",   # operational, advisory, restricted, suspended
            "disruption_risk_pct": 0,
            "impact_reason": "Nominal seasonal operational state",
            "image_url": act.image_url
        })

    # Map Hotels & Resorts
    for h in hotels:
        simulated_entities.append({
            "id": f"hotel_{h.id}",
            "entity_type": "hotel",
            "name": h.name,
            "category": h.category,
            "stars": h.stars,
            "is_outdoor": False,
            "lat": h.lat,
            "lng": h.lng,
            "nominal_price": h.price_per_night,
            "rating": h.rating,
            "beach_proximity": h.beach_proximity,
            "nominal_capacity": 85,
            "simulated_capacity": 85,
            "lounge_demand_pct": 100,
            "status": "operational",
            "disruption_risk_pct": 0,
            "impact_reason": "Standard hospitality occupancy baseline",
            "image_url": h.image_url
        })

    # Map Transports
    for idx, t in enumerate(transports):
        # Determine mode
        t_type = t.transport_type.lower()
        sub_mode = "ferry" if "boat" in t_type or "ferry" in t_type else (
            "flight" if "flight" in t_type else (
                "train" if "train" in t_type else "road"
            )
        )
        simulated_entities.append({
            "id": f"trans_{t.id}",
            "entity_type": "transport",
            "name": f"{t.operator_name} ({t.transport_type})",
            "category": t.transport_type,
            "sub_mode": sub_mode,
            "is_outdoor": True,
            "from_city": t.from_city,
            "lat": dest.lat + 0.025 + (idx * 0.015),
            "lng": dest.lng - 0.025 - (idx * 0.012),
            "nominal_price": t.base_price,
            "nominal_delay_minutes": 0,
            "simulated_delay_minutes": 0,
            "status": "operational",
            "disruption_risk_pct": 0,
            "impact_reason": "On-time intercity transit schedule",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"
        })

    # Map Restaurants & Local Vendors
    for idx, v in enumerate(vendors):
        v_type = "restaurant" if v.category == "Restaurants" else (
            "transport_fleet" if v.category == "Transport" else "vendor_partner"
        )
        simulated_entities.append({
            "id": f"ven_{v.id}",
            "entity_type": v_type,
            "name": v.name,
            "category": v.category,
            "is_outdoor": False if v.category == "Restaurants" else True,
            "lat": dest.lat - 0.015 - ((idx % 3) * 0.008),
            "lng": dest.lng + 0.015 + ((idx % 3) * 0.009),
            "rating": v.rating,
            "nominal_capacity": 90,
            "simulated_capacity": 90,
            "status": "operational",
            "disruption_risk_pct": 0,
            "impact_reason": "Supply chain active with full inventory availability",
            "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"
        })

    # 4. Run Weather Impact Engine on this simulated state
    calculated_state = run_weather_impact_propagation(
        destination=dest,
        weather=weather_state,
        entities=simulated_entities
    )

    return calculated_state

def run_weather_impact_propagation(
    destination: Destination,
    weather: Dict[str, Any],
    entities: List[Dict[str, Any]],
    scenario_params: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Executes multi-tier probabilistic impact propagation:
    Rain/Wind/Temp -> Direct Outdoor Impact -> Traveler Shift -> Transport Latency -> Hospitality Surge
    """
    rain = float(weather.get("precipitation_mm", 0.0))
    wind = float(weather.get("wind_speed_kmh", 0.0))
    temp = float(weather.get("temperature_c", 28.0))
    storm_duration = float(scenario_params.get("storm_duration_h", 0.0)) if scenario_params else 0.0

    # 1. Tier 1: Probabilistic Disruption Factors
    # p_outdoor: Probability of disruption on outdoor activities
    p_outdoor = min(1.0, (rain / 25.0) * 0.55 + (wind / 50.0) * 0.35 + (storm_duration / 8.0) * 0.20)
    
    # Transport disruption probabilities
    p_ferry = min(1.0, (wind / 38.0) * 0.65 + (rain / 20.0) * 0.35)
    p_road = min(1.0, (rain / 30.0) * 0.55 + (storm_duration / 6.0) * 0.25)
    p_flight = min(1.0, (wind / 65.0) * 0.60 + (rain / 45.0) * 0.40)

    # 2. Tier 2: Traveler Movement Reallocation
    # As outdoor activities become hazardous, travelers shift indoors
    traveler_indoor_migration_pct = round(p_outdoor * 68.0, 1)

    # 3. Tier 3: Transportation Delay Propagation
    avg_road_delay = int(round(p_road * 45))
    avg_ferry_delay = int(round(p_ferry * 90))
    avg_flight_delay = int(round(p_flight * 60))

    # 4. Tier 4: Higher-Order Hospitality & Dining Surges
    indoor_dining_surge_pct = round(traveler_indoor_migration_pct * 0.85, 1)
    hotel_lounge_surge_pct = round(traveler_indoor_migration_pct * 0.70, 1)

    # Apply updates across simulated entities
    disrupted_count = 0
    total_revenue_at_risk = 0.0
    processed_entities = []

    for item in entities:
        ent = copy.deepcopy(item)
        e_type = ent.get("entity_type")
        is_outdoor = ent.get("is_outdoor", False)

        if e_type == "activity":
            if is_outdoor:
                # Stochastic variation around p_outdoor
                jitter = random.uniform(-0.08, 0.08)
                item_risk = max(0.0, min(1.0, p_outdoor + jitter))
                ent["disruption_risk_pct"] = int(round(item_risk * 100))
                
                if item_risk >= 0.70:
                    ent["status"] = "suspended"
                    ent["simulated_capacity"] = max(5, int(100 - (item_risk * 95)))
                    ent["impact_reason"] = f"Suspended due to hazardous rain ({rain:.1f} mm/h) and wind ({wind:.1f} km/h)"
                    disrupted_count += 1
                    total_revenue_at_risk += ent.get("nominal_price", 1500.0)
                elif item_risk >= 0.35:
                    ent["status"] = "restricted"
                    ent["simulated_capacity"] = int(100 - (item_risk * 50))
                    ent["impact_reason"] = f"Operating at reduced capacity; weather advisory in effect"
                    disrupted_count += 1
                    total_revenue_at_risk += (ent.get("nominal_price", 1500.0) * 0.4)
                elif item_risk >= 0.15:
                    ent["status"] = "advisory"
                    ent["simulated_capacity"] = 90
                    ent["impact_reason"] = "Precautionary weather watch active"
                else:
                    ent["status"] = "operational"
                    ent["simulated_capacity"] = 100
                    ent["impact_reason"] = "Standard operational capacity"
            else:
                # Indoor activities benefit from traveler migration!
                ent["disruption_risk_pct"] = 5
                ent["status"] = "operational"
                ent["simulated_capacity"] = min(150, int(100 + traveler_indoor_migration_pct * 0.5))
                ent["impact_reason"] = f"Indoor sheltered site: footfall increased by +{int(traveler_indoor_migration_pct * 0.5)}%"

        elif e_type == "transport":
            sub_mode = ent.get("sub_mode", "road")
            delay = 0
            t_risk = 0.0
            
            if sub_mode == "ferry":
                t_risk = p_ferry
                delay = avg_ferry_delay
            elif sub_mode == "flight":
                t_risk = p_flight
                delay = avg_flight_delay
            else:
                t_risk = p_road
                delay = avg_road_delay

            ent["disruption_risk_pct"] = int(round(t_risk * 100))
            ent["simulated_delay_minutes"] = delay

            if t_risk >= 0.75:
                ent["status"] = "suspended" if sub_mode == "ferry" else "restricted"
                ent["impact_reason"] = f"Severe delays expected (+{delay}m). Waterways halted / ground traffic gridlocked."
                disrupted_count += 1
            elif t_risk >= 0.35:
                ent["status"] = "restricted"
                ent["impact_reason"] = f"Moderate transit delay (+{delay}m) due to rain/road conditions."
            else:
                ent["status"] = "operational"
                ent["impact_reason"] = "Transit routes running on normal scheduled intervals."

        elif e_type == "hotel":
            ent["lounge_demand_pct"] = int(100 + hotel_lounge_surge_pct)
            ent["disruption_risk_pct"] = 2
            ent["status"] = "operational"
            if hotel_lounge_surge_pct > 15:
                ent["impact_reason"] = f"In-house dining & lounge demand up +{int(hotel_lounge_surge_pct)}% as guests shelter indoors."
            else:
                ent["impact_reason"] = "Standard room occupancy & dining service."

        elif e_type == "restaurant":
            ent["disruption_risk_pct"] = 3
            ent["status"] = "operational"
            ent["simulated_capacity"] = min(160, int(100 + indoor_dining_surge_pct))
            ent["impact_reason"] = f"Indoor culinary surge: customer footfall projected at +{int(indoor_dining_surge_pct)}%."

        processed_entities.append(ent)

    # 5. Multi-tier Impact Chain Visualization Nodes
    impact_chain = [
        {
            "step": 1,
            "title": "Atmospheric Inflow",
            "icon": "cloud-rain",
            "status": "critical" if rain >= 25 else ("warning" if rain >= 10 else "normal"),
            "headline": f"{weather.get('condition', 'Current')} — {rain:.1f} mm/h rain, {wind:.1f} km/h wind",
            "detail": f"Barometric pressure {weather.get('pressure_hpa', 1012)} hPa, humidity {weather.get('humidity_pct', 65)}%."
        },
        {
            "step": 2,
            "title": "Outdoor Activity Impact",
            "icon": "compass",
            "status": "critical" if p_outdoor >= 0.65 else ("warning" if p_outdoor >= 0.3 else "normal"),
            "headline": f"Outdoor Disruption Risk: {int(round(p_outdoor * 100))}%",
            "detail": f"Beaches, water sports & aerial tours facing {int(round(p_outdoor * 90))}% operational capacity loss."
        },
        {
            "step": 3,
            "title": "Traveler Spatial Shift",
            "icon": "users",
            "status": "warning" if traveler_indoor_migration_pct > 25 else "normal",
            "headline": f"+{traveler_indoor_migration_pct}% Travelers Migrating Indoors",
            "detail": "Tourists vacating coastal & open areas toward museums, covered markets, and hotel lobbies."
        },
        {
            "step": 4,
            "title": "Transport & Logistics",
            "icon": "truck",
            "status": "critical" if p_ferry >= 0.7 or p_road >= 0.6 else ("warning" if avg_road_delay > 15 else "normal"),
            "headline": f"Avg Transit Latency: +{avg_road_delay}m Road, +{avg_ferry_delay}m Waterway",
            "detail": "Localized waterlogging slowing arterial traffic; shuttle dispatch times buffered."
        },
        {
            "step": 5,
            "title": "Hospitality & Dining Demand",
            "icon": "coffee",
            "status": "normal",
            "headline": f"+{indoor_dining_surge_pct}% Dining & Lounge Surge",
            "detail": "In-house culinary revenue compensating for outdoor activity voucher postponements."
        }
    ]

    # Calculate overall Digital Twin resilience score (0-100)
    resilience_score = max(10, int(100 - (p_outdoor * 40 + p_road * 30 + (storm_duration * 2))))

    # Call Nugen AI service interface for future model alignment
    twin_summary = {
        "counts": {
            "total_entities": len(processed_entities),
            "disrupted_count": disrupted_count,
            "outdoor_count": sum(1 for e in processed_entities if e.get("is_outdoor")),
            "indoor_count": sum(1 for e in processed_entities if not e.get("is_outdoor"))
        }
    }
    ai_analysis = nugen_service.analyze_weather_impact(
        destination_name=destination.name,
        weather_state=weather,
        simulation_scenario=scenario_params or {},
        digital_twin_summary=twin_summary
    )

    return {
        "destination": {
            "id": destination.id,
            "name": destination.name,
            "state": destination.state,
            "lat": destination.lat,
            "lng": destination.lng,
            "description": destination.description,
            "image_url": destination.image_url
        },
        "weather_state": weather,
        "is_simulation_scenario": bool(scenario_params),
        "scenario_parameters": scenario_params,
        "metrics": {
            "resilience_score": resilience_score,
            "disrupted_entities_count": disrupted_count,
            "total_entities_count": len(processed_entities),
            "outdoor_disruption_risk_pct": int(round(p_outdoor * 100)),
            "traveler_indoor_migration_pct": traveler_indoor_migration_pct,
            "average_transit_delay_minutes": avg_road_delay,
            "ferry_transit_delay_minutes": avg_ferry_delay,
            "indoor_hospitality_surge_pct": indoor_dining_surge_pct,
            "estimated_ticket_revenue_at_risk": round(total_revenue_at_risk, 2)
        },
        "impact_chain": impact_chain,
        "ai_impact_analysis": ai_analysis,
        "entities": processed_entities
    }

def simulate_what_if_scenario(
    destination_id: int,
    db: Session,
    rainfall_mm_h: float,
    temperature_c: float,
    wind_speed_kmh: float,
    storm_duration_h: float
) -> Dict[str, Any]:
    """
    Executes a What-If scenario against an isolated simulated state
    and returns both Baseline and Simulated states with comparative delta.
    Strictly isolated: does not alter real operational bookings.
    """
    dest = db.query(Destination).filter(Destination.id == destination_id).first()
    if not dest:
        dest = db.query(Destination).first()

    # 1. Generate Baseline state using live weather
    baseline_state = build_destination_digital_twin_state(dest.id, db)

    # 2. Synthesize What-If Weather condition based on scenario parameters
    cond = "Clear"
    icon = "sun"
    if rainfall_mm_h >= 40:
        cond = "Violent Rainstorm / Cyclone Warning"
        icon = "cloud-lightning"
    elif rainfall_mm_h >= 15:
        cond = "Heavy Monsoonal Downpour"
        icon = "cloud-rain"
    elif rainfall_mm_h >= 3:
        cond = "Moderate Rain Showers"
        icon = "cloud-drizzle"
    elif wind_speed_kmh >= 50:
        cond = "Severe Windstorm"
        icon = "wind"
    elif temperature_c >= 42:
        cond = "Extreme Heatwave"
        icon = "sun"

    simulated_weather = {
        "source": "TRAVORA What-If Scenario Simulator",
        "source_url": "internal://travora-digital-twin-simulator",
        "timestamp": baseline_state["weather_state"]["timestamp"],
        "destination_name": dest.name,
        "latitude": dest.lat,
        "longitude": dest.lng,
        "temperature_c": round(temperature_c, 1),
        "feels_like_c": round(temperature_c + (2.0 if rainfall_mm_h > 10 else -1.0), 1),
        "humidity_pct": min(98, max(30, int(60 + rainfall_mm_h * 0.8))),
        "precipitation_mm": round(rainfall_mm_h, 1),
        "rain_mm": round(rainfall_mm_h, 1),
        "wind_speed_kmh": round(wind_speed_kmh, 1),
        "pressure_hpa": round(1013 - (rainfall_mm_h * 0.25) - (wind_speed_kmh * 0.1), 1),
        "weather_code": 65 if rainfall_mm_h >= 15 else (80 if rainfall_mm_h > 2 else 0),
        "condition": cond,
        "icon": icon,
        "severity": "critical" if (rainfall_mm_h >= 30 or wind_speed_kmh >= 55) else ("high" if rainfall_mm_h >= 10 else "low"),
        "is_scenario": True
    }

    scenario_params = {
        "rainfall_mm_h": rainfall_mm_h,
        "temperature_c": temperature_c,
        "wind_speed_kmh": wind_speed_kmh,
        "storm_duration_h": storm_duration_h
    }

    # 3. Generate Scenario State using the cloned entities
    # Clean clone of entities
    simulated_state = build_destination_digital_twin_state(
        destination_id=dest.id,
        db=db,
        override_weather=simulated_weather
    )
    
    # Re-run impact with explicit scenario duration
    simulated_state = run_weather_impact_propagation(
        destination=dest,
        weather=simulated_weather,
        entities=simulated_state["entities"],
        scenario_params=scenario_params
    )

    # 4. Compute comparative delta
    b_metrics = baseline_state["metrics"]
    s_metrics = simulated_state["metrics"]

    comparison_delta = {
        "resilience_delta": s_metrics["resilience_score"] - b_metrics["resilience_score"],
        "disrupted_entities_delta": s_metrics["disrupted_entities_count"] - b_metrics["disrupted_entities_count"],
        "outdoor_risk_delta_pct": s_metrics["outdoor_disruption_risk_pct"] - b_metrics["outdoor_disruption_risk_pct"],
        "traveler_shift_delta_pct": s_metrics["traveler_indoor_migration_pct"] - b_metrics["traveler_indoor_migration_pct"],
        "delay_delta_minutes": s_metrics["average_transit_delay_minutes"] - b_metrics["average_transit_delay_minutes"],
        "revenue_at_risk_delta": round(s_metrics["estimated_ticket_revenue_at_risk"] - b_metrics["estimated_ticket_revenue_at_risk"], 2)
    }

    return {
        "success": True,
        "destination": baseline_state["destination"],
        "scenario_parameters": scenario_params,
        "baseline_state": baseline_state,
        "simulated_state": simulated_state,
        "comparison_delta": comparison_delta
    }
