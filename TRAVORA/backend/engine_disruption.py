from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any, List, Optional
from backend.models import Tour, ItineraryItem, ChangeEvent, AlternativeOption, Notification, Hotel, Destination
from backend.engine_pricing import calculate_tour_pricing
from backend.weather_service import get_live_weather

def calculate_explainable_score(
    pref_match: int,
    budget_match: int,
    loc_match: int,
    avail_match: int,
    time_match: int
) -> int:
    """
    Explainable Multi-Criteria Scoring Formula:
    30% Preference Match + 25% Budget Match + 20% Location + 15% Availability + 10% Time Compatibility
    """
    raw_score = (
        0.30 * pref_match +
        0.25 * budget_match +
        0.20 * loc_match +
        0.15 * avail_match +
        0.10 * time_match
    )
    return int(round(raw_score))

def get_destination_natural_weather_hazard(dest_name: str, state_name: str) -> Dict[str, Any]:
    """
    Generates realistic, scientifically grounded meteorological and natural hazard profiles
    customized strictly to the traveler's active destination geography.
    """
    d_lower = dest_name.lower()
    s_lower = (state_name or "").lower()

    if "manali" in d_lower or "kullu" in d_lower or "himachal" in s_lower:
        return {
            "hazard_title": "Severe Himalayan Cloudburst & Flash Flood Red Alert",
            "weather_type": "Torrential Monsoon Downpour (126 mm/hr) & Beas River Basin Inundation",
            "condition_summary": "Intense cloudburst over upper Beas River catchment triggering flash flood warnings and active debris flow along riverbank properties.",
            "impact_area": "Beas Riverside Corridor & Lower Old Manali Hub",
            "safe_zone": "Upper Dhungri Pine Ridge (Certified Flood-Safe Elevated Zone)",
            "safe_zone_distance_km": 2.4,
            "transport_reroute": "High-ridge bypass shuttle via Hadimba Wooded Ridge (+2.4 km, ~12 min)",
            "fallback_hotels": [
                {
                    "title": "Himalayan Cedar Wood Chalets & Spa",
                    "category": "5-Star Elevated Mountain Chalet",
                    "price_delta": 900.0,
                    "distance_km": 1.8,
                    "safe_zone": "Old Manali Upper Log Huts Ridge (Flood-Safe)",
                    "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                },
                {
                    "title": "Solang Snow Valley Adventure Hotel",
                    "category": "4-Star High-Ground Resort",
                    "price_delta": 450.0,
                    "distance_km": 3.6,
                    "safe_zone": "Solang Valley Highland Safe Corridor",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": "Snow Peak Pine Retreat",
                    "category": "3.5-Star Boutique Pine Lodge",
                    "price_delta": -250.0,
                    "distance_km": 2.1,
                    "safe_zone": "Log Huts Sanctuary (Elevated)",
                    "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
                }
            ]
        }
    elif "kashmir" in d_lower or "srinagar" in d_lower or "gulmarg" in d_lower:
        return {
            "hazard_title": "High-Altitude Blizzard & Sub-Zero Mountain Pass Freeze Warning",
            "weather_type": "Severe Alpine Snowstorm (45cm accumulation, winds 78 km/h)",
            "condition_summary": "Sudden Western Disturbance triggered blizzard conditions and sub-zero black ice along lower valley transit passes, affecting standard road access.",
            "impact_area": "Lower Dal Lake Shore & Unpaved Mountain Passes",
            "safe_zone": "Boulevard All-Weather Safe Corridor & High Plateau",
            "safe_zone_distance_km": 3.1,
            "transport_reroute": "Winter 4x4 snow-chained transit reroute (+3.1 km, ~15 min)",
            "fallback_hotels": [
                {
                    "title": "The Khyber Himalayan Resort & Spa",
                    "category": "5-Star Luxury Alpine Resort",
                    "price_delta": 1200.0,
                    "distance_km": 2.2,
                    "safe_zone": "Gulmarg Highland Protected Plateau",
                    "image_url": "https://images.unsplash.com/photo-1548013146-72479768bada?w=600"
                },
                {
                    "title": "Vivanta Dal View Srinagar",
                    "category": "5-Star Lake View Sanctuary",
                    "price_delta": 800.0,
                    "distance_km": 3.8,
                    "safe_zone": "Kralsangri Elevated Ridge (Safe Zone)",
                    "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"
                },
                {
                    "title": "Dal Lake Royal Cedar Houseboat & Suites",
                    "category": "4-Star Anchored Luxury Suite",
                    "price_delta": -150.0,
                    "distance_km": 1.5,
                    "safe_zone": "Ghat 7 Protected Harbor Safe Zone",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                }
            ]
        }
    elif "jaipur" in d_lower or ("rajasthan" in s_lower and "udaipur" not in d_lower):
        return {
            "hazard_title": "Severe Thar Sandstorm & High-Velocity Microburst Gale Alert",
            "weather_type": "Extreme Desert Dust Storm & Microburst Gale (Winds 82 km/h, visibility <150m)",
            "condition_summary": "Intense desert dust squall with regional structural awning damage, low-visibility road hazards, and localized power safety cutoffs in exposed open city sectors. Municipal disaster authorities have ordered immediate relocation to structurally shielded havens.",
            "impact_area": "Exposed Pink City Periphery & Hawa Mahal / Amer Road Open Belt",
            "safe_zone": "Amer Fort Wind-Shielded Foothills Sector & Civil Lines Safe Enclave",
            "safe_zone_distance_km": 2.2,
            "transport_reroute": "Protected arterial bypass via Tonk Road & Amer Foothill Corridor (+2.2 km, ~10 min delay)",
            "fallback_hotels": [
                {
                    "title": "The Oberoi Rajvilas Luxury Palace",
                    "category": "5-Star Luxury Heritage Palace",
                    "price_delta": 950.0,
                    "distance_km": 2.4,
                    "safe_zone": "Amer-Goner Road, Wind-Shielded Foothills Sector, Jaipur",
                    "image_url": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600"
                },
                {
                    "title": "ITC Rajputana Luxury Collection Haveli",
                    "category": "5-Star Rajputana Haveli",
                    "price_delta": 450.0,
                    "distance_km": 1.9,
                    "safe_zone": "Civil Lines Protected Safe Enclave, Jaipur",
                    "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                },
                {
                    "title": "Jai Mahal Palace Heritage Estate",
                    "category": "4.5-Star Royal Palace Haven",
                    "price_delta": -200.0,
                    "distance_km": 3.1,
                    "safe_zone": "Jacob Road Inner Heritage Sanctuary, Jaipur",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                }
            ]
        }
    elif "kerala" in d_lower or "alleppey" in d_lower or "munnar" in d_lower:
        return {
            "hazard_title": "Monsoon Inundation & Vembanad Backwater Surge Advisory",
            "weather_type": "Tropical Heavy Squall & Coastal Tide Surge (Water level +1.4m)",
            "condition_summary": "Prolonged monsoon squall causing backwater spillway rises, leading disaster teams to suspend low-lying canal chalets and advise relocation.",
            "impact_area": "Punnamada Canal Banks & Low Waterline Lodges",
            "safe_zone": "Kumarakom Elevated Bank & Tea Estate Safe Plateau",
            "safe_zone_distance_km": 3.5,
            "transport_reroute": "High-ground inland transfer avoiding canal spillways (+3.5 km, ~14 min delay)",
            "fallback_hotels": [
                {
                    "title": "Emerald Palm Lagoon Houseboat & Resort",
                    "category": "5-Star Elevated Backwater Sanctuary",
                    "price_delta": 850.0,
                    "distance_km": 2.8,
                    "safe_zone": "Upper Punnamada Secure Lagoon Bank",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": "Misty Cloud Mist Tea Valley Retreat",
                    "category": "4-Star Highland Tea Sanctuary",
                    "price_delta": 400.0,
                    "distance_km": 4.1,
                    "safe_zone": "Munnar Tea Estate Upper Ridge",
                    "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600"
                },
                {
                    "title": "Lake Palace Backwater Resort",
                    "category": "4-Star Waterfront Safe Haven",
                    "price_delta": -180.0,
                    "distance_km": 2.5,
                    "safe_zone": "Vembanad Elevated Western Shore",
                    "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
                }
            ]
        }
    elif "udaipur" in d_lower:
        return {
            "hazard_title": "Lake Pichola Hydro-Surge & Severe Thunderstorm Warning",
            "weather_type": "Flash Storm Downpour & Lake Embankment Overflow",
            "condition_summary": "Intense squall line over the Aravalli catchment causing rapid lake water elevation, requiring temporary relocation away from waterfront docks.",
            "impact_area": "Low-Lying Lake Pichola Pier & Promenade",
            "safe_zone": "Aravalli Sunset Ridge & High Ground Haveli Sanctuary",
            "safe_zone_distance_km": 2.5,
            "transport_reroute": "Elevated Aravalli ring road transit (+2.5 km, ~11 min delay)",
            "fallback_hotels": [
                {
                    "title": "Lake Pichola White Palace Sanctuaries",
                    "category": "5-Star Elevated Lakefront Haveli",
                    "price_delta": 950.0,
                    "distance_km": 2.2,
                    "safe_zone": "Pichola Promenade High Ground Plateau",
                    "image_url": "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600"
                },
                {
                    "title": "Aravalli Sunset Ridge Haveli",
                    "category": "4.5-Star Mountain Ridge Haven",
                    "price_delta": 500.0,
                    "distance_km": 3.7,
                    "safe_zone": "Monsoon Palace High Ridge (Storm-Safe)",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                },
                {
                    "title": "Royal Rajput Palace Suites",
                    "category": "4-Star City Heritage Hotel",
                    "price_delta": -250.0,
                    "distance_km": 1.9,
                    "safe_zone": "Udaipur High Bank Safe Corridor",
                    "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
                }
            ]
        }
    elif "rishikesh" in d_lower or "dehradun" in d_lower or "uttarakhand" in s_lower:
        return {
            "hazard_title": "Ganges Upper Catchment Cloudburst & River Runoff Red Alert",
            "weather_type": "Flash Mountain Runoff & Ganges Discharge Warning",
            "condition_summary": "Heavy precipitation in Tehri catchment has triggered rapid river water level spikes, leading police to clear low-elevation ghat lodges.",
            "impact_area": "Ram Jhula / Lakshman Jhula Low Riverfront",
            "safe_zone": "Tapovan Upper Ridge & Narendra Nagar Safe Heights",
            "safe_zone_distance_km": 2.0,
            "transport_reroute": "Upper Badrinath Highway bypass route (+2.0 km, ~9 min delay)",
            "fallback_hotels": [
                {
                    "title": "Aloha On The Ganges Resort",
                    "category": "4.5-Star Upper Tapovan Sanctuary",
                    "price_delta": 800.0,
                    "distance_km": 1.9,
                    "safe_zone": "Tapovan High Bank (Flood-Safe Zone)",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": "Ganges Riverside Wellness Sanctuary",
                    "category": "4-Star Highland Retreat",
                    "price_delta": 400.0,
                    "distance_km": 2.8,
                    "safe_zone": "Upper Tapovan Cliffside Plateau",
                    "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                },
                {
                    "title": "Triveni Riverfront Ashram & Hotel",
                    "category": "3.5-Star Heritage Stay",
                    "price_delta": -200.0,
                    "distance_km": 3.4,
                    "safe_zone": "High Ridge Protected Corridor",
                    "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
                }
            ]
        }
    elif "varanasi" in d_lower or "kashi" in d_lower:
        return {
            "hazard_title": "Ganges River High Water Flood Level & Lightning Squall Alert",
            "weather_type": "Severe Riverfront Flash Spate & Heavy Lightning Activity",
            "condition_summary": "Upstream monsoon surge submerged lower stone ghat steps and caused temporary evacuation of waterfront heritage properties.",
            "impact_area": "Dashashwamedh & Assi Riverfront Waterline",
            "safe_zone": "Cantonment & Sarnath Elevated Heritage Safe Corridor",
            "safe_zone_distance_km": 3.0,
            "transport_reroute": "Sheltered inner city transit avoiding inundated ghat lanes (+3.0 km, ~15 min delay)",
            "fallback_hotels": [
                {
                    "title": "Taj Ganges Varanasi",
                    "category": "5-Star Luxury Heritage Palace",
                    "price_delta": 950.0,
                    "distance_km": 2.8,
                    "safe_zone": "Cantonment High-Elevation Palace Grounds",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": "Radisson Hotel Varanasi",
                    "category": "4-Star Cantonment Central Hotel",
                    "price_delta": 400.0,
                    "distance_km": 3.1,
                    "safe_zone": "The Mall Road Secure Urban Zone",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                },
                {
                    "title": "Brijrama Ghat Heritage Palace",
                    "category": "4.5-Star Upper Stone Citadel",
                    "price_delta": -150.0,
                    "distance_km": 2.2,
                    "safe_zone": "Darbhanga Upper Fortress Pavilion",
                    "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
                }
            ]
        }
    elif "goa" in d_lower or "panaji" in d_lower:
        return {
            "hazard_title": "Arabian Sea Cyclonic Surge & Coastal Gale Winds Alert",
            "weather_type": "Severe Tropical Storm Surge (Winds 68 km/h, 4.2m swell waves)",
            "condition_summary": "Rough coastal swell and gale-force onshore winds causing beach erosion and seawater inundation in immediate low-lying beach belt properties.",
            "impact_area": "Baga Coastal Promenade & Direct Beachline Lodges",
            "safe_zone": "Arpora / Candolim High Ground Plateau (Certified Safe Zone)",
            "safe_zone_distance_km": 2.1,
            "transport_reroute": "Inland highway reroute avoiding flooded beach access roads (+2.1 km, ~10 min delay)",
            "fallback_hotels": [
                {
                    "title": "Palacio de Fontainhas Heritage Inn",
                    "category": "4-Star Heritage Boutique Hotel",
                    "price_delta": 450.0,
                    "distance_km": 2.5,
                    "safe_zone": "Fontainhas Latin Quarter High Ground, Goa",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                },
                {
                    "title": "Taj Fort Aguada Resort & Spa",
                    "category": "5-Star Cliffside Fort Resort",
                    "price_delta": 900.0,
                    "distance_km": 3.8,
                    "safe_zone": "Sinquerim Elevated Cliffside (Storm-Safe), Goa",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": "Azure Horizon Protected Hillside Suites",
                    "category": "4-Star Protected Inland Suites",
                    "price_delta": -200.0,
                    "distance_km": 2.1,
                    "safe_zone": "Arpora Hillside Buffer Zone, Goa",
                    "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600"
                }
            ]
        }
    elif "delhi" in d_lower or "ncr" in d_lower:
        return {
            "hazard_title": "Severe Dust Squall & Microburst Red Advisory",
            "weather_type": "High-Velocity Thunder squall (Winds 75 km/h, visibility <300m)",
            "condition_summary": "Sudden dust squall caused localized tree falls, road diversions, and safety directives for low-lying unprotected hotel canopies.",
            "impact_area": "Connaught Place Outer Ring & Yamuna Floodplain Corridor",
            "safe_zone": "Chanakyapuri Protected Safe Enclave, New Delhi",
            "safe_zone_distance_km": 2.6,
            "transport_reroute": "Arterial bypass via Shanti Path & Ring Road (+2.6 km, ~12 min delay)",
            "fallback_hotels": [
                {
                    "title": "The Taj Mahal Hotel New Delhi",
                    "category": "5-Star Luxury Lutyens Hotel",
                    "price_delta": 950.0,
                    "distance_km": 2.4,
                    "safe_zone": "Mansingh Road Diplomatic Enclave, New Delhi",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": "ITC Maurya Luxury Collection",
                    "category": "5-Star Diplomatic Sanctuary",
                    "price_delta": 650.0,
                    "distance_km": 3.2,
                    "safe_zone": "Sardar Patel Marg Safe Corridor, New Delhi",
                    "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                },
                {
                    "title": "The Claridges New Delhi",
                    "category": "4.5-Star Heritage Manor",
                    "price_delta": -150.0,
                    "distance_km": 1.9,
                    "safe_zone": "APJ Abdul Kalam Road Protected Zone, New Delhi",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                }
            ]
        }
    elif "mumbai" in d_lower or "thane" in d_lower:
        return {
            "hazard_title": "High Arabian Sea Spring Tide & Coastal Rain Alert",
            "weather_type": "Coastal High Tide Surge (4.8m wave swell) & Heavy Monsoon Downpour",
            "condition_summary": "Extremely high spring tide combining with regional rainfall triggered marine drive splashovers and municipal inland diversions.",
            "impact_area": "Marine Drive Promenade & Low Waterline Colaba Docks",
            "safe_zone": "Malabar Hill / Bandra West Elevated Safe Belt, Mumbai",
            "safe_zone_distance_km": 3.2,
            "transport_reroute": "Elevated coastal road & Western Expressway bypass (+3.2 km, ~16 min delay)",
            "fallback_hotels": [
                {
                    "title": "The Taj Mahal Palace & Tower",
                    "category": "5-Star Iconic Luxury Heritage",
                    "price_delta": 1100.0,
                    "distance_km": 2.5,
                    "safe_zone": "Apollo Bunder High Ground Harbor Zone, Mumbai",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": "The St. Regis Mumbai",
                    "category": "5-Star High-Rise Sanctuary",
                    "price_delta": 750.0,
                    "distance_km": 4.1,
                    "safe_zone": "Lower Parel Elevated Safe Quarter, Mumbai",
                    "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                },
                {
                    "title": "Trident Nariman Point",
                    "category": "4.5-Star Reinforced Waterfront",
                    "price_delta": -180.0,
                    "distance_km": 1.8,
                    "safe_zone": "Nariman Point Protected Commercial Zone, Mumbai",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                }
            ]
        }
    else:
        # Dynamic location-specific hazard for any other district/city in India
        clean_name = dest_name.title() if dest_name else "Destination"
        return {
            "hazard_title": f"Regional Meteorological Gale & Severe Weather Alert — {clean_name}",
            "weather_type": f"Localized High-Velocity Gale & Intense Precipitation (Winds 65 km/h)",
            "condition_summary": f"Regional weather observatory issued an amber alert for sudden squall lines across {clean_name}. Municipal guidelines advise relocating from open periphery properties.",
            "impact_area": f"{clean_name} Exposed Periphery & Low-Lying Sector",
            "safe_zone": f"{clean_name} Central Municipal Protected Safe Corridor",
            "safe_zone_distance_km": 2.2,
            "transport_reroute": f"Shielded transit arterial route through {clean_name} (+2.2 km, ~11 min delay)",
            "fallback_hotels": [
                {
                    "title": f"The Grand {clean_name} Heritage Palace",
                    "category": "5-Star Luxury Heritage Haven",
                    "price_delta": 850.0,
                    "distance_km": 2.1,
                    "safe_zone": f"Central Protected Sector, {clean_name}",
                    "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                },
                {
                    "title": f"Fortune Park {clean_name} Central",
                    "category": "4-Star Certified Safe Hotel",
                    "price_delta": 400.0,
                    "distance_km": 2.8,
                    "safe_zone": f"Municipal Safe Corridor, {clean_name}",
                    "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                },
                {
                    "title": f"{clean_name} Residency & Suites",
                    "category": "3.5-Star Shielded Urban Hotel",
                    "price_delta": -200.0,
                    "distance_km": 1.7,
                    "safe_zone": f"Civil Lines Safe Zone, {clean_name}",
                    "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                }
            ]
        }

def trigger_disruption_event(tour_id: int, db: Session, target_item_id: int = None) -> ChangeEvent:
    """
    Simulates real-world disruption on a tour deeply integrated with active destination
    meteorological/climate/natural conditions and location-specific traveler itineraries.
    Strictly structured around 4 explicit bases:
    1. ALERT - DIRECT CONTACT OPERATOR
    2. HOTEL COLLISION
    3. WEATHER/CLIMATE CHANGES
    4. TRANSPORTATION CHANGE/DELAY
    """
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise ValueError(f"Tour {tour_id} not found")
        
    dest = tour.destination
    
    # Auto-sense if destination is mismatched with tour title
    if tour.title:
        t_low = tour.title.lower()
        for c_name in ["jaipur", "kashmir", "srinagar", "kerala", "alleppey", "munnar", "manali", "udaipur", "varanasi", "rishikesh", "goa"]:
            if c_name in t_low:
                matched_dest = db.query(Destination).filter(Destination.name.ilike(f"%{c_name}%")).first()
                if matched_dest:
                    dest = matched_dest
                    tour.destination_id = dest.id
                break

    dest_name = dest.name if dest else ("Jaipur" if ("jaipur" in (tour.title or "").lower()) else "Goa")
    dest_state = dest.state if dest else ("Rajasthan" if ("jaipur" in (tour.title or "").lower()) else "Goa")
    traveler_name = tour.user.name if tour.user else "Traveler"
    coordinator_name = tour.coordinator_name or (tour.operator.name if tour.operator else "Aarav Mehta")

    # Clean up any stale or obsolete pending change events for this tour to ensure fresh destination generation
    stale_pending = db.query(ChangeEvent).filter(
        ChangeEvent.tour_id == tour.id,
        ChangeEvent.status == "pending"
    ).all()
    for sp in stale_pending:
        db.delete(sp)
    db.flush()

    # Identify meteorological hazard customized to this location
    hazard = get_destination_natural_weather_hazard(dest_name, dest_state)

    # Find the target hotel item (prefer Day 2 hotel or first hotel)
    hotel_item = None
    if target_item_id:
        hotel_item = db.query(ItineraryItem).filter(ItineraryItem.id == target_item_id).first()
    
    if not hotel_item:
        hotel_item = db.query(ItineraryItem).filter(
            ItineraryItem.tour_id == tour.id,
            ItineraryItem.item_type == "hotel"
        ).first()
        
    if not hotel_item:
        hotel_item = db.query(ItineraryItem).filter(
            ItineraryItem.tour_id == tour.id
        ).first()

    orig_hotel_title = hotel_item.title if hotel_item else f"Check-in at Hotel Royal {dest_name} (3-Star)"
    
    # Ensure hotel title matches destination location (prevent Goa hotels leaking into Jaipur plan)
    if "jaipur" in dest_name.lower() and ("goa" in orig_hotel_title.lower() or "xyz" in orig_hotel_title.lower()):
        orig_hotel_title = "Check-in at Hotel Royal Jaipur (3-Star)"
        if hotel_item:
            hotel_item.title = orig_hotel_title
            hotel_item.location_name = "Jaipur Central Hub"

    day_num = hotel_item.day_number if hotel_item and hotel_item.day_number else 2

    if hotel_item:
        hotel_item.is_disrupted = True
        hotel_item.disruption_note = f"Disrupted by {hazard['hazard_title']}: Property in active impact zone ({hazard['impact_area']}). Evacuation & relocation active."
        hotel_item.replacement_status = "affected"

    tour.status = "attention"

    # Fetch real hotels from database for this specific destination
    db_dest_hotels = []
    if dest:
        db_dest_hotels = db.query(Hotel).filter(
            Hotel.destination_id == dest.id,
            Hotel.name != orig_hotel_title
        ).all()

    # Formulate 3 authentic replacement alternatives in this specific destination
    candidates = []
    
    # 1. First choice from DB destination hotels if available
    for h in db_dest_hotels:
        candidates.append({
            "title": h.name,
            "category": h.category or f"{h.stars}-Star Heritage Safe Haven",
            "price_delta": 950.0 if len(candidates) == 0 else (450.0 if len(candidates) == 1 else -200.0),
            "distance_km": round(1.8 + len(candidates) * 0.9, 1),
            "safe_zone": h.address or f"{hazard['safe_zone']} ({dest_name})",
            "image_url": h.image_url or "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600"
        })
        if len(candidates) >= 3:
            break

    # 2. Fill remainder from realistic fallback hotels for this destination
    if len(candidates) < 3:
        for fb in hazard["fallback_hotels"]:
            if not any(c["title"] == fb["title"] for c in candidates):
                candidates.append(fb)
            if len(candidates) >= 3:
                break

    # Structure 4 Explicit Bases into Change Event
    p1_alert = f"[1. ALERT - DIRECT CONTACT OPERATOR]\nEmergency operator contact protocol active. Assigned Coordinator: {coordinator_name} (+91 98765 43210). Standing by for instant traveler direct phone & messaging contact."
    p2_hotel = f"[2. HOTEL COLLISION]\nAccommodation conflict & room inventory lock at {orig_hotel_title} in {hazard['impact_area']}. Municipal disaster evacuation directive requires relocation to certified safe ground."
    p3_weather = f"[3. WEATHER/CLIMATE CHANGES]\nMeteorological Warning: {hazard['hazard_title']}. Details: {hazard['weather_type']}. {hazard['condition_summary']}"
    p4_transport = f"[4. TRANSPORTATION CHANGE/DELAY]\nRoute Detour: {hazard['transport_reroute']}. Dedicated all-weather emergency corridor transfer pre-arranged."

    change_event = ChangeEvent(
        tour_id=tour.id,
        disrupted_item_id=hotel_item.id if hotel_item else None,
        event_type="weather_alert",
        status="pending",
        severity="critical",
        title=f"{hazard['hazard_title']} — {dest_name} (Tour #{tour.code})",
        reason=f"{p1_alert}\n\n{p2_hotel}\n\n{p3_weather}\n\n{p4_transport}",
        impact_summary=f"4-Pillar Incident for {traveler_name} in {dest_name}: 1. Emergency Operator Connected. 2. Hotel Collision at {orig_hotel_title} ({hazard['impact_area']}). 3. Weather Hazard ({hazard['weather_type']}). 4. Transit Detour ({hazard['transport_reroute']}).",
        affected_accommodation=f"{orig_hotel_title} ({hazard['impact_area']})",
        affected_checkin=f"Relocated to {hazard['safe_zone']}",
        affected_transport=hazard["transport_reroute"],
        cost_delta=candidates[0]["price_delta"] if candidates else 950.0,
        created_at=datetime.utcnow()
    )
    db.add(change_event)
    db.flush()

    # Generate 3 explainable alternatives
    alt1_score = calculate_explainable_score(94, 90, 96, 100, 95)  # ~94%
    alt2_score = calculate_explainable_score(82, 98, 75, 100, 88)  # ~87%
    alt3_score = calculate_explainable_score(88, 78, 85, 85, 90)   # ~85%

    c1 = candidates[0]
    alt1 = AlternativeOption(
        change_event_id=change_event.id,
        title=c1["title"],
        category=c1["category"],
        price_delta=c1["price_delta"],
        distance_km=c1["distance_km"],
        preference_match=94,
        budget_match=90,
        location_match=96,
        availability_match=100,
        time_match=95,
        overall_score=alt1_score,
        is_recommended=True,
        is_selected=False,
        description=f"Directly situated in {c1['safe_zone']}. Unaffected by {hazard['hazard_title']}. Includes 24/7 power backup, verified road connectivity, and immediate check-in synchronization for traveler {traveler_name}.",
        beach_proximity=c1["safe_zone"],
        checkin_compatible=True,
        image_url=c1["image_url"]
    )

    c2 = candidates[1] if len(candidates) > 1 else candidates[0]
    alt2 = AlternativeOption(
        change_event_id=change_event.id,
        title=c2["title"],
        category=c2["category"],
        price_delta=c2["price_delta"],
        distance_km=c2["distance_km"],
        preference_match=82,
        budget_match=98,
        location_match=75,
        availability_match=100,
        time_match=88,
        overall_score=alt2_score,
        is_recommended=False,
        is_selected=False,
        description=f"Economical safe-harbor alternative in {c2['safe_zone']}. Verified storm buffer with minimal transit overhead (+{c2['distance_km']} km).",
        beach_proximity=c2["safe_zone"],
        checkin_compatible=True,
        image_url=c2["image_url"]
    )

    c3 = candidates[2] if len(candidates) > 2 else candidates[0]
    alt3 = AlternativeOption(
        change_event_id=change_event.id,
        title=c3["title"],
        category=c3["category"],
        price_delta=c3["price_delta"],
        distance_km=c3["distance_km"],
        preference_match=88,
        budget_match=78,
        location_match=85,
        availability_match=85,
        time_match=90,
        overall_score=alt3_score,
        is_recommended=False,
        is_selected=False,
        description=f"Distinctive safe-ground sanctuary in {c3['safe_zone']}. Robust meteorological shielding. Check-in available with verified shuttle coordination.",
        beach_proximity=c3["safe_zone"],
        checkin_compatible=False,
        image_url=c3["image_url"]
    )

    db.add_all([alt1, alt2, alt3])

    # Add Operator Alert Notification (Explicit Weather & Location Details)
    notif_op = Notification(
        user_id=None,
        role="operator",
        tour_id=tour.id,
        title=f"WEATHER & HOTEL COLLISION ALERT: {traveler_name} in {dest_name} (Tour #{tour.code})",
        message=f"{hazard['hazard_title']} active in {dest_name}. Accommodation collision at {orig_hotel_title} ({hazard['impact_area']}). 3 safe-zone relocation alternatives generated for {traveler_name}.",
        type="critical",
        is_read=False
    )
    # Add Traveler Notification (Explicit Weather Safety Notice)
    notif_tr = Notification(
        user_id=tour.user_id,
        role="traveler",
        tour_id=tour.id,
        title=f"Disruption Safety Notice: Relocation Active in {dest_name}",
        message=f"Dear {traveler_name}, due to {hazard['hazard_title']} in {dest_name}, check-in at {orig_hotel_title} has collided with environmental safety orders. Coordinator {coordinator_name} has generated 3 safe relocation options.",
        type="critical",
        is_read=False
    )
    db.add_all([notif_op, notif_tr])
    db.commit()
    db.refresh(change_event)
    return change_event

def apply_alternative_resolution(change_event_id: int, alternative_id: int, db: Session) -> Dict[str, Any]:
    """
    Applies the chosen alternative option, modifies the itinerary item seamlessly,
    recalculates dynamic pricing, sets status to resolved, and notifies the traveler.
    """
    change_event = db.query(ChangeEvent).filter(ChangeEvent.id == change_event_id).first()
    if not change_event:
        raise ValueError("Change event not found")
        
    alt = db.query(AlternativeOption).filter(AlternativeOption.id == alternative_id).first()
    if not alt:
        raise ValueError("Alternative option not found")

    tour = db.query(Tour).filter(Tour.id == change_event.tour_id).first()
    dest = tour.destination if tour else None
    dest_name = dest.name if dest else "Destination"
    
    # Mark alternative selection
    for other_alt in change_event.alternatives:
        other_alt.is_selected = (other_alt.id == alt.id)
        
    change_event.status = "resolved"
    change_event.resolved_at = datetime.utcnow()
    
    # Update Itinerary Item with Destination-Specific Coordinates
    if change_event.disrupted_item_id:
        item = db.query(ItineraryItem).filter(ItineraryItem.id == change_event.disrupted_item_id).first()
        if item:
            item.title = f"Check-in at {alt.title}"
            item.subtitle = f"Relocated to {alt.beach_proximity} — Weather synchronized safe haven"
            item.cost = max(0.0, item.cost + alt.price_delta)
            item.is_disrupted = False
            item.disruption_note = None
            item.replacement_status = "replaced"
            
            # Match destination's actual latitude and longitude with slight displacement
            if dest:
                item.lat = dest.lat + 0.008
                item.lng = dest.lng + 0.006
                item.location_name = dest.name
            
    # Recalculate Tour total
    items = db.query(ItineraryItem).filter(ItineraryItem.tour_id == tour.id).all()
    pricing = calculate_tour_pricing(items, tour.budget_total, tour.travelers_count)
    tour.estimated_cost = pricing["total"]
    tour.status = "active"

    # Push Success Notifications
    notif_tr = Notification(
        user_id=tour.user_id,
        role="traveler",
        tour_id=tour.id,
        title="Safe Zone Accommodation Confirmed",
        message=f"Weather-safe relocation confirmed at {alt.title} ({dest_name}). Check-in and emergency transport are fully synchronized.",
        type="success",
        is_read=False
    )
    notif_op = Notification(
        user_id=None,
        role="operator",
        tour_id=tour.id,
        title=f"Tour #{tour.code} Disruption Resolved",
        message=f"Weather emergency resolved. Applied {alt.title} ({alt.overall_score}% match). Itinerary, pricing, and traveler views synchronized in {dest_name}.",
        type="success",
        is_read=False
    )
    db.add_all([notif_tr, notif_op])
    db.commit()
    db.refresh(tour)
    
    return {
        "success": True,
        "message": f"Successfully applied {alt.title}",
        "tour_code": tour.code,
        "new_estimated_cost": tour.estimated_cost,
        "pricing": pricing
    }

