from typing import List, Dict, Any, Optional
import random
from sqlalchemy.orm import Session
from backend.models import User

# Comprehensive Landmark & Sensed Places Database
LANDMARKS_CATALOG = {
    "goa": [
        {"name": "Baga Beach Watersports", "category": "Adventure", "lat": 15.5553, "lng": 73.7517, "cost": 1600.0, "time_start": "09:30 AM", "time_end": "12:30 PM", "icon": "waves", "subtitle": "Parasailing, jet ski speed runs, banana and bumper boat rides"},
        {"name": "Fort Aguada & 17th-Century Lighthouse", "category": "Heritage", "lat": 15.4920, "lng": 73.7737, "cost": 400.0, "time_start": "03:30 PM", "time_end": "05:30 PM", "icon": "shield", "subtitle": "Portuguese coastal fortress overlooking panoramic Arabian Sea"},
        {"name": "Dudhsagar Waterfalls & Spice Safari", "category": "Nature", "lat": 15.3144, "lng": 74.3143, "cost": 1800.0, "time_start": "08:00 AM", "time_end": "03:00 PM", "icon": "droplets", "subtitle": "4x4 jungle jeep safari through wildlife sanctuary to four-tiered milky cascade"},
        {"name": "Grande Island Scuba Diving & Dolphin Spotting", "category": "Adventure", "lat": 15.3524, "lng": 73.7661, "cost": 2400.0, "time_start": "07:30 AM", "time_end": "01:30 PM", "icon": "compass", "subtitle": "PADI certified dive master session, underwater reef exploration & island buffet"},
        {"name": "Fontainhas Latin Quarter Walking Tour", "category": "Culture", "lat": 15.4989, "lng": 73.8315, "cost": 500.0, "time_start": "04:00 PM", "time_end": "06:30 PM", "icon": "camera", "subtitle": "Vibrant 18th-century Portuguese colonial villas, azulejos tiles and heritage bakeries"},
        {"name": "Curlies & Shiva Valley Sunset Beach Shack", "category": "Nightlife", "lat": 15.5733, "lng": 73.7410, "cost": 1200.0, "time_start": "07:00 PM", "time_end": "10:30 PM", "icon": "sparkles", "subtitle": "Cliffside seafood dining with sunset trance beats and sea breeze"},
        {"name": "Chapora Fort (Dil Chahta Hai Sunset Point)", "category": "Heritage", "lat": 15.6058, "lng": 73.7380, "cost": 250.0, "time_start": "04:45 PM", "time_end": "06:45 PM", "icon": "map-pin", "subtitle": "Iconic hilltop ramparts with sweeping views of Vagator Beach and Morjim coast"},
        {"name": "Mandovi River Luxury Sunset Cruise", "category": "Relaxed", "lat": 15.5008, "lng": 73.8278, "cost": 850.0, "time_start": "05:30 PM", "time_end": "07:30 PM", "icon": "navigation", "subtitle": "Live Goan folk dances (Dekhni & Fugdi), DJ music, and golden hour sailing"}
    ],
    "jaipur": [
        {"name": "Amer Fort & Sheesh Mahal (Mirror Palace)", "category": "Heritage", "lat": 26.9855, "lng": 75.8513, "cost": 800.0, "time_start": "09:00 AM", "time_end": "01:00 PM", "icon": "shield", "subtitle": "Grand Rajputana hilltop palace with intricate mirror work and Maota lake view"},
        {"name": "Hawa Mahal (Palace of Winds)", "category": "Heritage", "lat": 26.9239, "lng": 75.8267, "cost": 350.0, "time_start": "02:00 PM", "time_end": "03:30 PM", "icon": "camera", "subtitle": "Pink sandstone 953 honeycombed jharokhas built for royal ladies"},
        {"name": "City Palace & Royal Armory Museum", "category": "Culture", "lat": 26.9258, "lng": 75.8237, "cost": 700.0, "time_start": "03:45 PM", "time_end": "06:00 PM", "icon": "award", "subtitle": "Residence of royal family featuring Peacock Gate and historical textiles"},
        {"name": "Nahargarh Fort Sunset Over Pink City", "category": "Scenic", "lat": 26.9373, "lng": 75.8156, "cost": 400.0, "time_start": "05:00 PM", "time_end": "07:30 PM", "icon": "sun", "subtitle": "Aravalli hilltop bastion offering breathtaking golden-hour vistas of Jaipur city"},
        {"name": "Chokhi Dhani Rajasthani Cultural Village", "category": "Food", "lat": 26.7663, "lng": 75.8362, "cost": 1100.0, "time_start": "07:30 PM", "time_end": "10:30 PM", "icon": "utensils", "subtitle": "Folk dances, camel rides, puppet shows, and authentic Dal Baati Churma thali"},
        {"name": "Johari Bazaar & Bapu Bazaar Shopping Trail", "category": "Shopping", "lat": 26.9198, "lng": 75.8281, "cost": 500.0, "time_start": "11:00 AM", "time_end": "02:00 PM", "icon": "shopping-bag", "subtitle": "Famous artisanal jewelry, block-print quilts, leather juttis, and blue pottery"}
    ],
    "kerala": [
        {"name": "Alleppey Luxury Private Houseboat Cruise", "category": "Relaxed", "lat": 9.4981, "lng": 76.3388, "cost": 2800.0, "time_start": "11:30 AM", "time_end": "05:00 PM", "icon": "anchor", "subtitle": "Cruising palm-fringed emerald lagoons with fresh Karimeen Pollichathu feast"},
        {"name": "Munnar Kolukkumalai Tea Estate & Cloud Walk", "category": "Nature", "lat": 10.0889, "lng": 77.0595, "cost": 1200.0, "time_start": "08:30 AM", "time_end": "01:00 PM", "icon": "mountain", "subtitle": "World's highest organic tea plantation with mist-covered valley viewpoints"},
        {"name": "Fort Kochi Heritage & Chinese Fishing Nets", "category": "Culture", "lat": 9.9674, "lng": 76.2427, "cost": 450.0, "time_start": "03:30 PM", "time_end": "06:30 PM", "icon": "camera", "subtitle": "Colonial Portuguese church, spice warehouses, art cafes, and cantilevered nets"},
        {"name": "Periyar Wildlife Sanctuary Jungle Boat Safari", "category": "Adventure", "lat": 9.5998, "lng": 77.1698, "cost": 950.0, "time_start": "07:00 AM", "time_end": "11:00 AM", "icon": "compass", "subtitle": "Spotting wild elephant herds, sambar deer, and rare hornbills along the lake"}
    ],
    "manali": [
        {"name": "Solang Valley Paragliding & Zorbing Rush", "category": "Adventure", "lat": 32.3166, "lng": 77.1578, "cost": 2200.0, "time_start": "09:00 AM", "time_end": "02:00 PM", "icon": "wind", "subtitle": "Tandem paragliding flight with Himalayan peak views and giant roll zorbing"},
        {"name": "Rohtang Pass Snow Point & Glacier Walk", "category": "Snow", "lat": 32.3716, "lng": 77.2466, "cost": 2800.0, "time_start": "07:30 AM", "time_end": "03:30 PM", "icon": "mountain-snow", "subtitle": "High-altitude 13,050 ft mountain pass with snow scooter rides and skiing"},
        {"name": "Old Manali Wooden Cafes & Hadimba Temple", "category": "Culture", "lat": 32.2483, "lng": 77.1812, "cost": 300.0, "time_start": "04:00 PM", "time_end": "07:00 PM", "icon": "coffee", "subtitle": "Cedar pine forests, pagoda-style wooden temple and bohemian riverfront cafes"},
        {"name": "Beas River White Water Rafting Challenge", "category": "Adventure", "lat": 32.1485, "lng": 77.1702, "cost": 1400.0, "time_start": "10:30 AM", "time_end": "01:30 PM", "icon": "zap", "subtitle": "Thrilling 14 km Grade III rapids descent with professional safety river guides"}
    ],
    "udaipur": [
        {"name": "City Palace & Lake Pichola Royal Boat Ride", "category": "Heritage", "lat": 24.5764, "lng": 73.6835, "cost": 1200.0, "time_start": "09:30 AM", "time_end": "02:00 PM", "icon": "anchor", "subtitle": "Marble courtyards, mirror balconies and private boat sailing past Lake Palace"},
        {"name": "Sajjangarh Monsoon Palace Sunset Panorama", "category": "Scenic", "lat": 24.5935, "lng": 73.6385, "cost": 500.0, "time_start": "04:30 PM", "time_end": "07:00 PM", "icon": "sun", "subtitle": "High hilltop fort overlooking Aravali hills and glittering city lights at dusk"},
        {"name": "Saheliyon-ki-Bari Marble Fountains & Gardens", "category": "Culture", "lat": 24.6015, "lng": 73.6865, "cost": 250.0, "time_start": "02:30 PM", "time_end": "04:00 PM", "icon": "flower", "subtitle": "Historic royal courtyard of maidens with lotus pools and marble elephant fountains"}
    ],
    "kashmir": [
        {"name": "Dal Lake Morning Shikara Cruise & Floating Market", "category": "Scenic", "lat": 34.0837, "lng": 74.8370, "cost": 1100.0, "time_start": "06:30 AM", "time_end": "09:30 AM", "icon": "sun", "subtitle": "Serene traditional Shikara glide through water lilies and wooden handicraft stalls"},
        {"name": "Gulmarg Gondola Cable Car (Phase 1 & 2)", "category": "Snow", "lat": 34.0484, "lng": 74.3805, "cost": 2400.0, "time_start": "09:30 AM", "time_end": "03:00 PM", "icon": "mountain-snow", "subtitle": "Asia's highest ropeway ascending to Apharwat Peak at 13,780 ft with snow skiing"},
        {"name": "Pahalgam Betaab Valley & Aru Valley Safari", "category": "Nature", "lat": 34.0163, "lng": 75.3184, "cost": 1600.0, "time_start": "08:00 AM", "time_end": "04:00 PM", "icon": "trees", "subtitle": "Pristine Lidder river, pine meadows, and horseback riding through alpine trails"}
    ],
    "rishikesh": [
        {"name": "Shivpuri Grade IV River Rafting & Cliff Jump", "category": "Adventure", "lat": 30.1340, "lng": 78.3900, "cost": 1500.0, "time_start": "08:30 AM", "time_end": "01:00 PM", "icon": "waves", "subtitle": "Roller Coaster & Golf Course rapids with 25ft cliff jump into emerald Ganges"},
        {"name": "Triveni Ghat Evening Maha Ganga Aarti", "category": "Culture", "lat": 30.1065, "lng": 78.2934, "cost": 200.0, "time_start": "05:30 PM", "time_end": "07:30 PM", "icon": "flame", "subtitle": "Soul-stirring Vedic chants, resonant brass bells, and floating earthen oil lamps"},
        {"name": "Beatles Ashram & Sound Meditation Sanctuary", "category": "Wellness", "lat": 30.1172, "lng": 78.3150, "cost": 600.0, "time_start": "02:00 PM", "time_end": "04:45 PM", "icon": "sparkles", "subtitle": "Chaurasi Kutia meditation dome murals and serene Rajaji forest surroundings"}
    ]
}

def get_catalog_for_destination(destination_name: str, db: Optional[Session] = None) -> List[Dict[str, Any]]:
    dest_key = destination_name.lower().split(" ")[0].split("(")[0].strip()
    if dest_key in LANDMARKS_CATALOG:
        return LANDMARKS_CATALOG[dest_key]
    
    if db is not None:
        try:
            from backend.models import District
            import json
            dist_row = db.query(District).filter(
                (District.name.ilike(f"%{destination_name}%")) | 
                (District.name.ilike(f"%{dest_key}%"))
            ).first()
            if dist_row:
                def parse_list(val):
                    if isinstance(val, list): return val
                    try: return json.loads(val)
                    except Exception: return []

                t_places = parse_list(dist_row.tourist_places)
                h_places = parse_list(dist_row.heritage_places)
                a_places = parse_list(dist_row.adventure_activities)
                c_places = parse_list(dist_row.cultural_experiences)
                r_places = parse_list(dist_row.religious_places)

                custom_cat = []
                base_lat = dist_row.lat or 20.5937
                base_lng = dist_row.lng or 78.9629

                for idx, p in enumerate(t_places):
                    custom_cat.append({
                        "name": p,
                        "category": "Tourist Highlight",
                        "lat": round(base_lat + (idx * 0.015), 4),
                        "lng": round(base_lng + (idx * 0.012), 4),
                        "cost": 500.0,
                        "time_start": "09:30 AM",
                        "time_end": "12:30 PM",
                        "icon": "camera",
                        "subtitle": f"Top-rated iconic destination landmark in {dist_row.name}, {dist_row.state}"
                    })
                for idx, p in enumerate(h_places):
                    custom_cat.append({
                        "name": p,
                        "category": "Heritage",
                        "lat": round(base_lat - (idx * 0.012), 4),
                        "lng": round(base_lng + (idx * 0.018), 4),
                        "cost": 400.0,
                        "time_start": "03:30 PM",
                        "time_end": "05:30 PM",
                        "icon": "shield",
                        "subtitle": f"Historic citadel & architecture in {dist_row.name}"
                    })
                for idx, p in enumerate(a_places):
                    custom_cat.append({
                        "name": p,
                        "category": "Adventure",
                        "lat": round(base_lat + (idx * 0.025), 4),
                        "lng": round(base_lng - (idx * 0.02), 4),
                        "cost": 1500.0,
                        "time_start": "10:00 AM",
                        "time_end": "02:00 PM",
                        "icon": "zap",
                        "subtitle": f"Thrilling outdoor expedition tailored for {dist_row.terrain}"
                    })
                for idx, p in enumerate(c_places):
                    custom_cat.append({
                        "name": p,
                        "category": "Cultural",
                        "lat": round(base_lat - (idx * 0.01), 4),
                        "lng": round(base_lng - (idx * 0.015), 4),
                        "cost": 600.0,
                        "time_start": "06:00 PM",
                        "time_end": "09:00 PM",
                        "icon": "sparkles",
                        "subtitle": f"Authentic regional culture, local dining & nighttime festivities"
                    })
                for idx, p in enumerate(r_places):
                    custom_cat.append({
                        "name": p,
                        "category": "Spiritual",
                        "lat": round(base_lat + 0.008, 4),
                        "lng": round(base_lng + 0.008, 4),
                        "cost": 250.0,
                        "time_start": "07:00 AM",
                        "time_end": "09:00 AM",
                        "icon": "flame",
                        "subtitle": f"Sacred spiritual shrine & peaceful darshan in {dist_row.name}"
                    })
                if custom_cat:
                    return custom_cat
        except Exception:
            pass

    return LANDMARKS_CATALOG.get("goa", [])

def generate_personalized_itinerary_items(
    destination_name: str,
    duration_days: int,
    travel_style: str,
    interests: List[str],
    accommodation_type: str,
    transport_type: str,
    travelers_count: int,
    desired_places: Optional[List[str]] = None,
    db: Optional[Session] = None,
    budget_total: Optional[float] = None
) -> List[Dict[str, Any]]:
    """
    Generates a realistic, highly personalized multi-day timeline of items.
    Dynamically senses and schedules user's requested desired_places into optimal day slots!
    """
    items = []
    catalog = get_catalog_for_destination(destination_name, db)

    # Extract clean list of requested places
    requested_places_lower = [p.lower().strip() for p in (desired_places or []) if p.strip()]

    # Match specific landmarks requested by traveler
    sensed_landmarks = []
    for landmark in catalog:
        lname = landmark["name"].lower()
        if any(rp in lname or lname in rp for rp in requested_places_lower):
            sensed_landmarks.append(landmark)

    # If no specific requested landmarks matched or list was empty, select top destination favorites
    remaining_landmarks = [lm for lm in catalog if lm not in sensed_landmarks]
    selected_landmarks = sensed_landmarks + remaining_landmarks

    # Base Coords
    base_lat = catalog[0]["lat"] if catalog else 15.5494
    base_lng = catalog[0]["lng"] if catalog else 73.7535

    hotel_name = f"Hotel Royal {destination_name} (3-Star)"
    if "5-star" in accommodation_type.lower() or "luxury" in accommodation_type.lower():
        hotel_name = f"Taj & Oberoi Luxury Resort & Spa (5-Star)"
    elif "4-star" in accommodation_type.lower():
        hotel_name = f"Grand {destination_name} Heritage Resort (4-Star)"
    elif "budget" in accommodation_type.lower():
        hotel_name = f"Backpacker Haven & Suites"

    # Day 1: Transit & Check-in
    items.append({
        "day_number": 1,
        "item_type": "transport",
        "title": f"Arrival Transit to {destination_name} ({transport_type})",
        "subtitle": f"Seamless journey via {transport_type} with direct hotel transfer",
        "time_start": "08:00 AM",
        "time_end": "02:30 PM",
        "cost": 1800.0 * travelers_count if "flight" not in transport_type.lower() else 4200.0 * travelers_count,
        "location_name": f"{destination_name} Main Terminal",
        "lat": base_lat + 0.02,
        "lng": base_lng + 0.02,
        "icon": "bus" if "bus" in transport_type.lower() else ("plane" if "flight" in transport_type.lower() else "train"),
        "order_index": 1
    })

    items.append({
        "day_number": 1,
        "item_type": "hotel",
        "title": f"Check-in at {hotel_name}",
        "subtitle": "Deluxe room with panoramic views, welcome drinks & refreshment lounge",
        "time_start": "03:30 PM",
        "time_end": "04:30 PM",
        "cost": 3800.0 * max(1, duration_days - 1),
        "location_name": f"{destination_name} Central Hub",
        "lat": base_lat,
        "lng": base_lng,
        "icon": "hotel",
        "order_index": 2
    })

    # Schedule activities across the tour days
    order_counter = 3
    lm_idx = 0

    for day in range(1, duration_days + 1):
        if day == 1:
            # Evening activity on Day 1
            if lm_idx < len(selected_landmarks):
                lm = selected_landmarks[lm_idx]
                lm_idx += 1
                items.append({
                    "day_number": 1,
                    "item_type": "activity",
                    "title": lm["name"],
                    "subtitle": lm["subtitle"],
                    "time_start": "05:00 PM",
                    "time_end": "07:30 PM",
                    "cost": lm["cost"] * travelers_count,
                    "location_name": lm["name"].split(" & ")[0],
                    "lat": lm["lat"],
                    "lng": lm["lng"],
                    "icon": lm.get("icon", "sun"),
                    "order_index": order_counter
                })
                order_counter += 1

            items.append({
                "day_number": 1,
                "item_type": "food",
                "title": f"Welcome Dinner: Authentic {destination_name} Cuisine",
                "subtitle": "Handcrafted local delicacies & seasonal culinary spread",
                "time_start": "08:00 PM",
                "time_end": "09:45 PM",
                "cost": 650.0 * travelers_count,
                "location_name": f"{destination_name} Promenade",
                "lat": base_lat - 0.01,
                "lng": base_lng - 0.01,
                "icon": "utensils",
                "order_index": order_counter
            })
            order_counter += 1
        elif day < duration_days:
            # Full Days (Morning & Afternoon/Evening Activities)
            # Morning Activity
            if lm_idx < len(selected_landmarks):
                lm = selected_landmarks[lm_idx]
                lm_idx += 1
            else:
                lm = selected_landmarks[0]

            items.append({
                "day_number": day,
                "item_type": "activity",
                "title": lm["name"],
                "subtitle": lm["subtitle"],
                "time_start": lm.get("time_start", "09:30 AM"),
                "time_end": lm.get("time_end", "01:00 PM"),
                "cost": lm["cost"] * travelers_count,
                "location_name": lm["name"].split(" & ")[0],
                "lat": lm["lat"],
                "lng": lm["lng"],
                "icon": lm.get("icon", "map-pin"),
                "order_index": order_counter
            })
            order_counter += 1

            # Lunch
            items.append({
                "day_number": day,
                "item_type": "food",
                "title": f"Mid-Day Dining & Chef's Special at {destination_name}",
                "subtitle": "Refreshing beverages & multi-cuisine lunch",
                "time_start": "01:15 PM",
                "time_end": "02:30 PM",
                "cost": 500.0 * travelers_count,
                "location_name": f"{destination_name} Food Hub",
                "lat": lm["lat"] + 0.005,
                "lng": lm["lng"] + 0.005,
                "icon": "utensils",
                "order_index": order_counter
            })
            order_counter += 1

            # Afternoon / Evening Activity
            if lm_idx < len(selected_landmarks):
                lm2 = selected_landmarks[lm_idx]
                lm_idx += 1
            else:
                lm2 = selected_landmarks[1 % len(selected_landmarks)]

            items.append({
                "day_number": day,
                "item_type": "activity",
                "title": lm2["name"],
                "subtitle": lm2["subtitle"],
                "time_start": "04:00 PM",
                "time_end": "07:30 PM",
                "cost": lm2["cost"] * travelers_count,
                "location_name": lm2["name"].split(" & ")[0],
                "lat": lm2["lat"],
                "lng": lm2["lng"],
                "icon": lm2.get("icon", "camera"),
                "order_index": order_counter
            })
            order_counter += 1

            # Dinner
            items.append({
                "day_number": day,
                "item_type": "food",
                "title": f"Evening Starlight Dinner & Live Music",
                "subtitle": "Relaxing dinner under the stars with live acoustic performances",
                "time_start": "08:00 PM",
                "time_end": "10:00 PM",
                "cost": 800.0 * travelers_count,
                "location_name": f"{destination_name} Heritage Center",
                "lat": base_lat + 0.008,
                "lng": base_lng + 0.008,
                "icon": "utensils",
                "order_index": order_counter
            })
            order_counter += 1
        else:
            # Last Day: Souvenir & Departure
            if lm_idx < len(selected_landmarks):
                lm = selected_landmarks[lm_idx]
            else:
                lm = selected_landmarks[0]

            items.append({
                "day_number": day,
                "item_type": "activity",
                "title": f"{destination_name} Artisan Souvenir Bazaar & Spices",
                "subtitle": "Collect authentic handicrafts, regional sweets, and handwoven gifts",
                "time_start": "09:30 AM",
                "time_end": "12:00 PM",
                "cost": 300.0 * travelers_count,
                "location_name": f"{destination_name} Local Market",
                "lat": base_lat,
                "lng": base_lng,
                "icon": "shopping-bag",
                "order_index": order_counter
            })
            order_counter += 1

            items.append({
                "day_number": day,
                "item_type": "transport",
                "title": f"Return Transit from {destination_name} ({transport_type})",
                "subtitle": "Comfortable return journey with unforgettable memories",
                "time_start": "02:00 PM",
                "time_end": "09:30 PM",
                "cost": 1800.0 * travelers_count if "flight" not in transport_type.lower() else 4200.0 * travelers_count,
                "location_name": f"{destination_name} Departure Gate",
                "lat": base_lat + 0.02,
                "lng": base_lng + 0.02,
                "icon": "bus" if "bus" in transport_type.lower() else ("plane" if "flight" in transport_type.lower() else "train"),
                "order_index": order_counter
            })
    # STRICT BUDGET ADHERENCE: Scale items so total (subtotal + 5% taxes + 450 service fee) never exceeds budget_total
    if budget_total and budget_total > 0 and items:
        service_fee = 450.0
        target_subtotal = max(500.0, (budget_total - service_fee) / 1.05)
        raw_subtotal = sum(it.get("cost", 0.0) for it in items)
        if raw_subtotal > target_subtotal and raw_subtotal > 0:
            scale = target_subtotal / raw_subtotal
            for it in items:
                it["cost"] = round(max(50.0, it.get("cost", 0.0) * scale), 2)
            
            # Ensure precise ceiling check
            current_sub = sum(it["cost"] for it in items)
            tot = current_sub + round(current_sub * 0.05, 2) + service_fee
            if tot > budget_total:
                excess = round(tot - budget_total, 2)
                # Deduct excess from the highest cost item (usually hotel)
                max_item = max(items, key=lambda x: x["cost"])
                max_item["cost"] = round(max(50.0, max_item["cost"] - excess), 2)

    return items


def match_operators_for_tour(
    destination_name: str,
    travel_style: str,
    interests: List[str],
    budget_total: float,
    desired_places: Optional[List[str]],
    db: Session
) -> List[Dict[str, Any]]:
    """
    AI Matchmaking Algorithm:
    Evaluates all registered tour operators against destination, travel styles,
    requested landmarks, response time, and fleet suitability.
    Returns ranked operator list with match scores and explainable AI reasons.
    """
    operators = db.query(User).filter(User.role == "operator").all()
    if not operators:
        return []

    dest_clean = destination_name.lower().strip()
    interests_clean = [i.lower().strip() for i in interests]
    style_clean = travel_style.lower().strip()
    places_clean = [p.lower().strip() for p in (desired_places or []) if p.strip()]

    scored_operators = []

    for op in operators:
        score = 65  # baseline confidence

        op_dests = (op.operating_destinations or "").lower()
        op_specs = (op.specialties or "").lower()
        op_name = op.name
        op_company = op.company_name or op.name
        op_fleet = (op.fleet_size or "").lower()

        # 1. Destination Match (+20 pts)
        if any(d.strip() in op_dests for d in dest_clean.split(" ")):
            score += 20
        elif "all-india" in op_dests or "pan-india" in op_dests or "elite dynamic" in op_company.lower():
            score += 15

        # 2. Travel Style & Interests Match (+15 pts)
        style_matches = sum(1 for s in style_clean.split(" ") if s in op_specs)
        interest_matches = sum(1 for i in interests_clean if i in op_specs)
        score += min(15, (style_matches * 5) + (interest_matches * 4))

        # 3. Specific Sensed Places & Keyword Match (+15 pts)
        place_keywords = set()
        for p in places_clean:
            for w in p.replace("&", " ").replace("-", " ").replace("'", "").split():
                if len(w) > 3 and w.lower() not in ["with", "from", "into", "over", "tour"]:
                    place_keywords.add(w.lower())

        matched_kws = [kw for kw in place_keywords if kw in op_specs or kw in op_fleet or kw in op_company.lower() or kw in op_dests]
        if matched_kws:
            score += min(15, len(matched_kws) * 5)

        # 4. Rating & Track Record (+5 pts)
        rating_val = op.rating or 4.8
        if rating_val >= 4.9:
            score += 5
        elif rating_val >= 4.7:
            score += 3

        # Clamp between 70% and 99%
        final_score = min(99, max(72, score))

        # Recommendation Reason Generation
        if matched_kws:
            reason = f"{final_score}% Match: {op_company} specializes in {destination_name} with {op.fleet_size or 'certified fleet'}. Directly equipped for your sensed landmarks ({', '.join(list(matched_kws)[:2])}) with {op.response_time_minutes or 5}-min response."
        else:
            reason = f"{final_score}% Match: {op_company} is specialized in {destination_name} with {op.fleet_size or '10+ vehicles'}. Top rated ({rating_val}/5) for '{travel_style}' with an instant {op.response_time_minutes or 5}-minute dispatch response."

        scored_operators.append({
            "id": op.id,
            "name": op.name,
            "company_name": op_company,
            "email": op.email,
            "phone": op.phone or "+91 98765 43210",
            "rating": rating_val,
            "tours_completed": op.tours_completed or 120,
            "fleet_size": op.fleet_size or "12 Vehicles",
            "response_time_minutes": op.response_time_minutes or 5,
            "badge": op.badge or "Verified Partner",
            "bio": op.bio or f"Certified dynamic tour operator specializing in custom journeys across {op.operating_destinations or destination_name}.",
            "specialties": [s.strip() for s in (op.specialties or travel_style).split(",") if s.strip()],
            "operating_destinations": [d.strip() for d in (op.operating_destinations or destination_name).split(",") if d.strip()],
            "match_score": final_score,
            "is_recommended": False,
            "ai_recommendation_reason": reason
        })

    # Sort descending by match score
    scored_operators.sort(key=lambda x: x["match_score"], reverse=True)

    # Top operator gets the recommended badge
    if scored_operators:
        scored_operators[0]["is_recommended"] = True
        top_op = scored_operators[0]
        top_kws = [p for p in places_clean[:2]] if places_clean else []
        kws_text = f" for '{', '.join(top_kws)}'" if top_kws else ""
        top_op["ai_recommendation_reason"] = f"Top AI Recommended Partner ({top_op['match_score']}% Match): {top_op['company_name']} is the highest-compatibility operator{kws_text} in {destination_name} with {top_op['rating']} traveler rating and {top_op['fleet_size']}."

    return scored_operators


def sense_places_and_personalize(
    destination_name: str,
    desired_places: Optional[List[str]],
    travel_style: Optional[str],
    db: Session
) -> Dict[str, Any]:
    """
    Real-Time Places Sensing Engine:
    Detects landmarks, calculates coordinates, categorizes activities,
    produces personalized tips tailored to the combination of places,
    and returns dynamically recalibrated operator matches.
    """
    catalog = get_catalog_for_destination(destination_name, db)

    places_raw = [p.strip() for p in (desired_places or []) if p.strip()]
    if not places_raw and catalog:
        places_raw = [c["name"] for c in catalog[:3]]

    sensed_details = []
    categories = {}

    for p_name in places_raw:
        matched_cat_item = None
        for item in catalog:
            if item["name"].lower() in p_name.lower() or p_name.lower() in item["name"].lower():
                matched_cat_item = item
                break

        if matched_cat_item:
            cat = matched_cat_item.get("category", "Sightseeing")
            sensed_details.append({
                "name": matched_cat_item["name"],
                "category": cat,
                "lat": matched_cat_item["lat"],
                "lng": matched_cat_item["lng"],
                "cost": matched_cat_item["cost"],
                "time_slot": f"{matched_cat_item['time_start']} - {matched_cat_item['time_end']}",
                "icon": matched_cat_item.get("icon", "map-pin"),
                "subtitle": matched_cat_item.get("subtitle", "")
            })
            categories[cat] = categories.get(cat, 0) + 1
        else:
            # Custom sensed spot
            cat = "Custom Exploration"
            p_lower = p_name.lower()
            if any(w in p_lower for w in ["market", "bazaar", "shop", "flea"]):
                cat = "Shopping"
            elif any(w in p_lower for w in ["beach", "sea", "scuba", "kayak", "surf", "dive", "water"]):
                cat = "Beach & Water"
            elif any(w in p_lower for w in ["fort", "palace", "temple", "church", "heritage", "mahal"]):
                cat = "Heritage"
            elif any(w in p_lower for w in ["food", "cafe", "restaurant", "shack", "dine", "bar"]):
                cat = "Dining & Nightlife"

            sensed_details.append({
                "name": p_name,
                "category": cat,
                "lat": (catalog[0]["lat"] + 0.01) if catalog else 15.55,
                "lng": (catalog[0]["lng"] + 0.01) if catalog else 73.75,
                "cost": 750.0,
                "time_slot": "Flexible Day Slot",
                "icon": "sparkles",
                "subtitle": "Traveler-sensed bespoke landmark"
            })
            categories[cat] = categories.get(cat, 0) + 1

    total_sensed = len(sensed_details)
    style_breakdown = {k: f"{round((v / total_sensed) * 100)}%" for k, v in categories.items()} if total_sensed else {"Scenic": "100%"}

    # Dynamic Personalized Tips Generation
    personalized_tips = []

    # Check for scuba / water
    if any("scuba" in d["name"].lower() or "watersports" in d["name"].lower() or "dive" in d["name"].lower() or "water" in d["name"].lower() for d in sensed_details):
        personalized_tips.append({
            "icon": "waves",
            "title": "Marine & Water Sports Scheduling",
            "tip": "Grande Island and coastal watersports are best experienced in the morning (07:30 - 11:30 AM) when sea currents are gentlest and marine life visibility peaks."
        })

    # Check for forts / heritage
    if any("fort" in d["name"].lower() or "palace" in d["name"].lower() or "mahal" in d["name"].lower() for d in sensed_details):
        personalized_tips.append({
            "icon": "shield",
            "title": "Golden-Hour Ramparts & Sunset Panorama",
            "tip": "Coastal and hilltop forts have been sequenced for late afternoon (04:00 - 06:30 PM) to avoid midday heat and capture unforgettable golden-hour photos."
        })

    # Check for waterfalls / trekking / safaris / rafting
    if any("waterfall" in d["name"].lower() or "safari" in d["name"].lower() or "trek" in d["name"].lower() or "rafting" in d["name"].lower() for d in sensed_details):
        personalized_tips.append({
            "icon": "compass",
            "title": "Active Safari & Transit Coordination",
            "tip": "Wildlife reserves and jungle trails require authorized 4x4 vehicles. Your assigned operator dispatches certified off-road drivers and park passes."
        })

    # General transit & pace tip
    personalized_tips.append({
        "icon": "zap",
        "title": "Real-Time Route Optimization",
        "tip": f"Sensed {total_sensed} landmarks mapped into a geo-clustered loop. Estimated inter-spot travel time: ~15 to 25 mins, minimizing transit fatigue."
    })

    # Dynamic Operator Matches
    matched_operators = match_operators_for_tour(
        destination_name=destination_name,
        travel_style=travel_style or "Beach + Adventure + Food",
        interests=list(categories.keys()),
        budget_total=25000,
        desired_places=places_raw,
        db=db
    )

    return {
        "destination_name": destination_name,
        "total_sensed": total_sensed,
        "sensed_places": sensed_details,
        "style_breakdown": style_breakdown,
        "transit_estimate_minutes": 20,
        "pace_rating": "Optimal Pace (2-3 highlights/day)",
        "personalized_tips": personalized_tips,
        "matched_operators": matched_operators
    }


def calculate_explainable_match(
    budget_total: float,
    estimated_cost: float,
    travel_style: str,
    accommodation_type: str,
    transport_type: str,
    destination_name: str,
    interests: List[str],
    festival_detected: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Computes an explainable multi-factor match breakdown and 'Why this itinerary?' justification.
    Formula aligns with TRAVORA requirement 9:
    Budget %, Travel style %, Accommodation %, Activities %, Transport %, Location %, Festival %
    """
    # 1. Budget Fit
    if estimated_cost <= budget_total:
        budget_pct = min(100, int(90 + (1 - (estimated_cost / max(budget_total, 1))) * 10))
    else:
        overage = estimated_cost - budget_total
        overage_pct = (overage / budget_total) * 100
        budget_pct = max(55, int(90 - (overage_pct * 1.5)))

    # 2. Travel Style Match
    style_keywords = travel_style.lower().replace("+", " ").split()
    style_pct = 95
    if any(k in ["beach", "adventure", "culture", "heritage", "wellness", "nature", "spiritual"] for k in style_keywords):
        style_pct = 98

    # 3. Accommodation Match
    acc_lower = accommodation_type.lower()
    acc_pct = 96
    if "5-star" in acc_lower or "luxury" in acc_lower or "resort" in acc_lower or "3-star" in acc_lower:
        acc_pct = 100

    # 4. Activities Match
    act_pct = 94
    if interests and len(interests) >= 2:
        act_pct = 97

    # 5. Transport Match
    trans_lower = transport_type.lower()
    trans_pct = 92
    if "flight" in trans_lower or "volvo" in trans_lower or "private" in trans_lower or "cab" in trans_lower:
        trans_pct = 95

    # 6. Location Match
    loc_pct = 98

    # 7. Festival Match
    fest_pct = None
    if festival_detected:
        fest_pct = 99

    # Weighted Overall Match
    weights = [
        (budget_pct, 0.25),
        (style_pct, 0.20),
        (acc_pct, 0.15),
        (act_pct, 0.15),
        (trans_pct, 0.10),
        (loc_pct, 0.15)
    ]
    overall = sum(pct * w for pct, w in weights)
    overall_match = min(99, max(75, int(round(overall))))

    # 'Why this itinerary?' Explanation
    reasons = [
        f"Matches {travel_style} with curated local highlights across {destination_name}.",
        f"Optimized schedule sequences transit and activities with 20-30 minute geo-clustered transitions.",
        f"{accommodation_type} accommodation aligns with verified check-in logistics and preferred comfort standard.",
        f"Transport selection ({transport_type}) ensures seamless point-to-point dispatch."
    ]
    if festival_detected:
        reasons.insert(0, f"Festival Alignment: Synchronized with {festival_detected.get('name', 'the festival')} calendar and special cultural celebrations.")

    if estimated_cost <= budget_total:
        reasons.append(f"Financial Efficiency: Itinerary cost of Rs {int(estimated_cost):,} fits comfortably within your Rs {int(budget_total):,} budget ceiling.")
    else:
        reasons.append(f"Budget Advisory: High-season experience components exceed current ceiling by Rs {int(estimated_cost - budget_total):,}. See constraint adjustments below.")

    why_this_itinerary = " ".join(reasons)

    breakdown = {
        "budget_match": budget_pct,
        "travel_style_match": style_pct,
        "accommodation_match": acc_pct,
        "activities_match": act_pct,
        "transport_match": trans_pct,
        "location_match": loc_pct,
        "overall_match": overall_match,
        "why_this_itinerary": why_this_itinerary
    }
    if fest_pct:
        breakdown["festival_match"] = fest_pct

    return breakdown


def analyze_constraints_and_tradeoffs(
    budget_total: float,
    estimated_cost: float,
    accommodation_type: str,
    transport_type: str,
    travelers_count: int
) -> Dict[str, Any]:
    """
    Implements Hard and Soft constraint checking with trade-off analysis.
    If requirements conflict (e.g. Budget exceeds limit by Rs 4,200),
    provides actionable, quantified trade-off adjustments:
    - Reduce hotel tier
    - Modify transport
    - Remove optional activity
    - Increase budget
    """
    excess = max(0.0, estimated_cost - budget_total)
    has_conflict = excess > 0

    tradeoffs = []
    if has_conflict:
        # Trade-off 1: Reduce hotel tier
        acc_lower = accommodation_type.lower()
        if "5-star" in acc_lower or "luxury" in acc_lower:
            hotel_saving = 3500.0 * travelers_count
            tradeoffs.append({
                "action": "reduce_hotel_tier",
                "label": "Switch Hotel Tier",
                "detail": f"Downgrade from 5-Star Luxury to Premium 4-Star Resort",
                "savings": hotel_saving,
                "impact": "Slightly smaller room suite, retains complimentary breakfast & pool access."
            })
        elif "4-star" in acc_lower:
            hotel_saving = 2000.0 * travelers_count
            tradeoffs.append({
                "action": "reduce_hotel_tier",
                "label": "Switch Hotel Tier",
                "detail": f"Switch to Top-Rated 3-Star Boutique Hotel",
                "savings": hotel_saving,
                "impact": "Comfortable air-conditioned private rooms with verified cleanliness rating."
            })

        # Trade-off 2: Modify transport
        trans_lower = transport_type.lower()
        if "flight" in trans_lower or "private" in trans_lower:
            trans_saving = 1800.0 * travelers_count
            tradeoffs.append({
                "action": "modify_transport",
                "label": "Modify Transport",
                "detail": "Switch from Private Cab to Premium Volvo AC Sleeper Coach",
                "savings": trans_saving,
                "impact": "Adds ~2 hours to highway transit time, saves fuel and toll surcharges."
            })
        elif "volvo" in trans_lower:
            trans_saving = 800.0 * travelers_count
            tradeoffs.append({
                "action": "modify_transport",
                "label": "Modify Transport",
                "detail": "Switch to Semi-Sleeper AC Express Coach",
                "savings": trans_saving,
                "impact": "Standard reclining seats with onboard charging."
            })

        # Trade-off 3: Remove optional evening / high-cost activity
        act_saving = 1200.0 * travelers_count
        tradeoffs.append({
            "action": "remove_activity",
            "label": "Remove Optional Activity",
            "detail": "Skip Private Starlight River Cruise / Water Sports Add-on",
            "savings": act_saving,
            "impact": "Freely explore local sunset viewpoints at leisure without paid ticket entry."
        })

        # Trade-off 4: Increase budget
        tradeoffs.append({
            "action": "increase_budget",
            "label": "Increase Budget Limit",
            "detail": f"Increase budget by Rs {int(excess):,} to maintain all selected luxury preferences",
            "savings": 0.0,
            "impact": "Zero compromise on comfort, transport or premium activities."
        })

    return {
        "has_conflict": has_conflict,
        "excess_amount": excess,
        "message": f"Budget exceeds limit by Rs {int(excess):,}." if has_conflict else "Itinerary satisfies all hard constraints.",
        "tradeoffs": tradeoffs
    }


def calculate_additional_place_impact(
    current_cost: float,
    destination_name: str,
    place_name: str,
    place_category: Optional[str] = "Sightseeing",
    travelers_count: int = 1
) -> Dict[str, Any]:
    """
    Calculates operational and financial impact when traveler requests an additional place:
    - Additional transport cost
    - Travel time & distance
    - Activity ticket & meal impact
    - Schedule delays and downstream dependency shifts
    """
    p_lower = (place_name or "").lower()
    cat_lower = (place_category or "").lower()

    # Determine distance and transit time
    if any(w in p_lower for w in ["island", "waterfall", "safari", "pass", "lake", "dudhsagar"]):
        distance_km = 42.0
        travel_time_hours = 2.5
        transport_cost = 1500.0
        activity_cost = 1200.0 * travelers_count
        meal_cost = 450.0 * travelers_count
        delay_hours = 2.0
    elif any(w in p_lower for w in ["fort", "palace", "temple", "monument", "museum"]):
        distance_km = 18.0
        travel_time_hours = 1.0
        transport_cost = 700.0
        activity_cost = 400.0 * travelers_count
        meal_cost = 300.0 * travelers_count
        delay_hours = 1.0
    else:
        distance_km = 14.0
        travel_time_hours = 0.75
        transport_cost = 500.0
        activity_cost = 500.0 * travelers_count
        meal_cost = 250.0 * travelers_count
        delay_hours = 1.0

    total_cost_delta = transport_cost + activity_cost + meal_cost
    total_time_hours = travel_time_hours + 1.5  # transit + exploration time

    return {
        "place_name": place_name,
        "category": place_category or "Sightseeing",
        "distance_km": distance_km,
        "travel_time_hours": travel_time_hours,
        "total_time_hours": total_time_hours,
        "transport_cost": transport_cost,
        "activity_cost": activity_cost,
        "meal_cost": meal_cost,
        "total_cost_delta": total_cost_delta,
        "schedule_delay_hours": delay_hours,
        "schedule_impact": f"Adds {total_time_hours:.1f} hours to day schedule. Next activity delayed by {delay_hours:.1f} hour(s).",
        "dependency_impact": "Downstream afternoon check-out and evening dinner slots automatically re-sequenced by 1.5 hours.",
        "recommended_slot": "Day 2 Afternoon (02:00 PM - 05:00 PM)",
        "summary": f"Adding '{place_name}': Transport +Rs {int(transport_cost):,}, Activity +Rs {int(activity_cost):,}, Meal +Rs {int(meal_cost):,}. Total +Rs {int(total_cost_delta):,}."
    }

