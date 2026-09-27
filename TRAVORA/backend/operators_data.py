"""
TRAVORA 500 SYNTHETIC OPERATORS DATASET
Distributed across all regions and states of India.
NOTE: These 500 tour operators are synthetic demonstration profiles created for testing,
simulation, and evaluation of multi-operator isolation, bidding, and regional routing.
"""

import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

REGIONAL_OPERATOR_TEMPLATES = [
    # North
    ("Himalayan Crest Expeditions", "Himachal Pradesh", ["Kullu", "Shimla", "Lahaul and Spiti", "Kangra"], "Adventure, Snow Trekking, Mountain Safaris", "16 4x4 SUVs & Force Travellers", "Tandem Paragliding, Snow Skiing, High Altitude Camping"),
    ("Pink City Royal Caravans", "Rajasthan", ["Jaipur", "Amer", "Dausa", "Alwar"], "Heritage, Royal Palaces, Cultural Forts", "12 AC Mini-Coaches & Luxury Sedans", "Amer Fort Heritage Walk, Royal Dinner, Chokhi Dhani"),
    ("Mewar Heritage Trail Liners", "Rajasthan", ["Udaipur", "Rajsamand", "Chittorgarh"], "Lakes, Luxury, Romantic Evenings", "14 Luxury Boats & AC Tempo Travellers", "Lake Pichola Sunset Cruise, Monsoon Palace Tour"),
    ("Varanasi Divine Ghats & Temple Fleet", "Uttar Pradesh", ["Varanasi", "Prayagraj", "Ayodhya"], "Spiritual, Heritage, Sacred Rivers", "10 Chartered Ganges Boats & AC Shuttles", "Ganga Maha Aarti, Sarnath Buddhist Trail, Silk Bazaars"),
    ("Golden Temple & Punjab Heritage Tours", "Punjab", ["Amritsar", "Ludhiana", "Jalandhar"], "Spiritual, Heritage, Farm Stays", "12 AC Coaches & Farm Vans", "Golden Temple VIP Darshan, Wagah Border Ceremony, Farmstay"),
    ("Garhwal Himalayan Odyssey", "Uttarakhand", ["Dehradun", "Rishikesh", "Chamoli", "Rudraprayag"], "River Rafting, Yoga, Char Dham Yatra", "18 Mountain Jeeps & AC Shuttles", "Ganga White Water Rafting, Cliff Jump, Kedarnath Heli-link"),
    ("Kashmir Paradise Shikara & Ski Fleet", "Jammu & Kashmir", ["Srinagar", "Baramulla", "Anantnag"], "Scenic Lakes, Snow Gondola, Pine Forests", "20 Traditional Shikaras & Heated Luxury Vans", "Dal Lake Shikara Glide, Gulmarg Gondola Skiing, Betaab Valley"),
    ("Ladakh High Altitude Overland Explorers", "Ladakh", ["Leh", "Kargil", "Nubra", "Zanskar"], "High Altitude Desert, Monasteries, Passes", "15 4x4 Off-Road Expeditions", "Pangong Tso Camping, Khardung La Pass, Hemis Monastery"),
    ("Braj Bhoomi Pilgrim & Festival Planners", "Uttar Pradesh", ["Mathura", "Agra"], "Festivals, Temples, Heritage", "10 AC Electric Vans", "Banke Bihari Darshan, Phoolon Ki Holi, Taj Mahal Sunrise"),
    
    # West
    ("Goa Coastal Waves & Watersports", "Goa", ["North Goa", "South Goa"], "Beach, Adventure, Watersports, Nightlife", "14 Speedboats, 6 Jet Skis, 8 AC Vans", "Grande Island Scuba Diving, Parasailing, Fontainhas Walk"),
    ("Konkan Coast & Sahyadri Trails", "Maharashtra", ["Raigad", "Ratnagiri", "Sindhudurg"], "Coastal Forts, Scuba, Mango Orchards", "12 AC Vans & Catamarans", "Tarkarli Scuba, Murud Janjira Fort, Malvani Seafood"),
    ("Mumbai Metropolis & Heritage Shuttles", "Maharashtra", ["Mumbai City", "Mumbai Suburban", "Thane", "Pune"], "Urban Culture, Street Food, Architecture", "22 Electric Executive Sedans & Coaches", "South Bombay Heritage Walk, Elephanta Caves, Marine Drive"),
    ("Rann of Kutch White Desert Caravans", "Gujarat", ["Kutch", "Bhuj"], "White Desert, Cultural Festivals, Crafts", "16 Desert Jeeps & Luxury Tents", "Rann Utsav Stargazing, Kala Dungar Sunset, Handicraft Villages"),
    ("Saurashtra Lion & Somnath Temple Tours", "Gujarat", ["Gir Somnath", "Junagadh", "Jamnagar"], "Wildlife Safaris, Coastal Temples", "14 Safari Open Gypsies", "Gir Forest Asiatic Lion Safari, Somnath Temple Aarti"),
    
    # South
    ("Kerala Backwaters & Spice Odyssey", "Kerala", ["Alappuzha", "Kottayam", "Ernakulam"], "Backwaters, Houseboats, Wellness", "15 Luxury Houseboats & 8 AC Shuttles", "Alleppey Houseboat Cruise, Kathakali Show, Ayurvedic Spa"),
    ("Malabar Coast & Wayanad Rainforest Tours", "Kerala", ["Wayanad", "Kozhikode", "Kannur"], "Rainforest, Treehouses, Coffee Trails", "12 4x4 Mountain Jeeps", "Edakkal Caves Trek, Bamboo Rafting, Malabar Food Trail"),
    ("Coromandel Heritage & Temple Corridors", "Tamil Nadu", ["Chennai", "Kanchipuram", "Chengalpattu"], "Temples, Classical Arts, Silk Weaving", "16 AC Deluxe Coaches", "Mahabalipuram Shore Temple, Kanchipuram Silk Walk"),
    ("Madurai Meenakshi & Chettinad Mansions", "Tamil Nadu", ["Madurai", "Sivaganga", "Dindigul"], "Heritage, Architecture, Culinary", "14 AC Shuttles", "Meenakshi Temple Evening Ceremony, Chettinad Feast"),
    ("Nilgiri Mountain Rail & Tea Trails", "Tamil Nadu", ["Nilgiris", "Coimbatore"], "Hill Station, Tea Estates, Toy Train", "10 Mini Mountain Coaches", "Ooty Botanical Garden, Tea Factory Tour, Toy Train Ride"),
    ("Mysore Palace & Coorg Coffee Escapes", "Karnataka", ["Mysuru", "Kodagu", "Hassan"], "Royalty, Coffee Plantations, Waterfalls", "12 AC Tempo Travellers", "Mysore Palace Illumination, Coorg River Rafting"),
    ("Hampi Ruins & Vijayanagara Heritage", "Karnataka", ["Vijayanagara", "Ballari", "Koppal"], "Ancient Boulders, Architecture, Coracle Rides", "10 AC Vans & E-Bikes", "Virupaksha Temple Sunrise, Tungabhadra Coracle Ride"),
    ("Deccan Nizami Heritage & Tech Hub Tours", "Telangana", ["Hyderabad", "Ranga Reddy", "Warangal"], "Monuments, Pearls, Biryani Trails", "18 Executive Shuttles", "Charminar Walk, Golconda Light Show, Ramoji Film City"),
    ("Andhra Coastal & Araku Valley Vistas", "Andhra Pradesh", ["Visakhapatnam", "Alluri Sitharama Raju"], "Beaches, Hill Caves, Coffee Estates", "12 AC Tourist Coaches", "Borra Caves, Araku Valley Vistadome Train, Rishikonda Beach"),
    
    # East & North-East
    ("Sundarbans Mangrove Tiger Safari Liners", "West Bengal", ["South 24 Parganas", "North 24 Parganas"], "Mangroves, Bengal Tigers, Estuary Boat", "8 Motorized Forest Cruise Launches", "Tiger Spotting Canopy Walk, Village Folk Theater"),
    ("Darjeeling Kanchenjunga Tea Country", "West Bengal", ["Darjeeling", "Kalimpong"], "Himalayan Views, Tea Estates, Monasteries", "14 4x4 Hill Vehicles", "Tiger Hill Sunrise, Batasia Loop, Happy Valley Tea Walk"),
    ("Puri Golden Beach & Konark Sun Chariot", "Odisha", ["Puri", "Khordha"], "Temple, Golden Beach, UNESCO Sun Temple", "16 AC Vans", "Jagannath Temple Darshan, Konark Sun Temple, Raghurajpur Crafts"),
    ("Brahmaputra Cruise & Kaziranga Safaris", "Assam", ["Kamrup Metropolitan", "Golaghat", "Jorhat"], "Rhino Wildlife, River Island, Tea Gardens", "12 Safari Gypsies & River Boat", "Kaziranga One-Horned Rhino Safari, Majuli Island Walk"),
    ("Meghalaya Abode of Clouds & Living Bridges", "Meghalaya", ["East Khasi Hills", "Ri Bhoi", "West Jaintia Hills"], "Waterfalls, Living Root Bridges, Caving", "14 4x4 Mountain Shuttles", "Nohkalikai Falls, Double Decker Root Bridge Trek, Dawki Boating"),
    ("Sikkim Kanchenjunga Alpine Adventures", "Sikkim", ["Gangtok", "Gyalshing", "Mangan"], "Snow Passes, Monasteries, Glacial Lakes", "15 Hill SUVs", "Tsomgo Lake, Nathu La Pass, Rumtek Monastery"),
    ("Nagaland Tribal Horizons & Hornbill Guides", "Nagaland", ["Kohima", "Dimapur"], "Tribal Culture, Festivals, War Memorial", "10 4x4 Hill Jeeps", "Hornbill Festival Village, Dzukou Valley Trek"),
    ("Arunachal Tawang Monastery & Sela Pass", "Arunachal Pradesh", ["Tawang", "West Kameng"], "High Passes, Monasteries, Snow Peaks", "12 High Clearance SUVs", "Sela Pass Snow Point, Tawang Monastery Prayer, Madhuri Lake")
]

CITY_SUFFIXES = [
    "Travel & Tours", "Expeditions", "Holidays", "Tour Liners", "Travel Copilot",
    "Safari Co.", "Heritage Voyagers", "Journeys", "Adventures", "Travel Network"
]

def generate_500_operators():
    operators = []
    base_id = 1
    
    # 32 core template seeds
    for idx, (comp_base, state_base, dist_base, styles, fleet, acts) in enumerate(REGIONAL_OPERATOR_TEMPLATES):
        op_id = base_id
        base_id += 1
        operators.append({
            "id": op_id,
            "name": f"Partner Lead #{op_id}",
            "email": f"operator{op_id}@travora.demo",
            "company_name": comp_base,
            "phone": f"+91 {98000 + op_id * 13:05d} {10000 + (op_id * 27) % 90000:05d}",
            "role": "operator",
            "state": state_base,
            "operating_destinations": ", ".join(dist_base),
            "specialties": styles,
            "rating": round(4.7 + (op_id % 3) * 0.1, 1),
            "tours_completed": 110 + (op_id * 17) % 450,
            "fleet_size": fleet,
            "response_time_minutes": 2 + (op_id % 4),
            "badge": "Top Verified Regional Partner" if op_id <= 30 else "Verified Tour Operator",
            "bio": f"Certified regional tour operator providing personalized itineraries, on-ground transport, and real-time disruption mitigation across {state_base}.",
            "activities_offered": acts,
            "supports_group": True,
            "supports_private": True,
            "supports_festivals": True,
            "is_synthetic_demonstration": True
        })

    # Generate up to 500 across all 802 Indian districts
    import random
    random.seed(42)

    from backend.india_districts_data import INDIA_DISTRICTS

    while base_id <= 500:
        d = INDIA_DISTRICTS[(base_id * 3) % len(INDIA_DISTRICTS)]
        suffix = CITY_SUFFIXES[base_id % len(CITY_SUFFIXES)]
        comp_name = f"{d['name']} {suffix}"
        terrain = d.get("terrain", "Heritage & Scenic")

        if "Beach" in terrain:
            spec = "Beach, Water Sports, Coastal Dining"
            fleet = f"{6 + (base_id % 10)} AC Shuttles & Speedboats"
        elif "Snow" in terrain or "Mountain" in terrain:
            spec = "Mountains, Snow Trekking, Valley Safaris"
            fleet = f"{8 + (base_id % 12)} 4x4 Mountain Jeeps & Heated Shuttles"
        elif "Desert" in terrain:
            spec = "Desert, Forts, Stargazing Camps"
            fleet = f"{10 + (base_id % 8)} Desert Gypsies & AC Caravans"
        elif "Backwaters" in terrain:
            spec = "Backwaters, Houseboat Cruising, Spice Trails"
            fleet = f"{4 + (base_id % 6)} Houseboats & 8 AC Vans"
        else:
            spec = "Heritage, Cultural Trails, Local Culinary"
            fleet = f"{10 + (base_id % 10)} Multi-Axle AC Coaches & Sedans"

        operators.append({
            "id": base_id,
            "name": f"Coordinator {d['name']}",
            "email": f"operator{base_id}@travora.demo",
            "company_name": comp_name,
            "phone": f"+91 {97000 + (base_id * 19) % 2500:05d} {20000 + (base_id * 31) % 70000:05d}",
            "role": "operator",
            "state": d["state"],
            "operating_destinations": f"{d['name']}, {d['state']}",
            "specialties": spec,
            "rating": round(4.5 + (base_id % 5) * 0.1, 1),
            "tours_completed": 45 + (base_id * 11) % 400,
            "fleet_size": fleet,
            "response_time_minutes": 3 + (base_id % 5),
            "badge": "Verified Regional Partner",
            "bio": f"Registered dynamic tour operator based in {d['name']}, {d['state']}. Specializes in personalized itineraries, certified drivers, and instant operational adaptability.",
            "activities_offered": ", ".join(d.get("tourist_places", ["Local Sightseeing"])[:3]),
            "supports_group": True,
            "supports_private": (base_id % 3 != 0),
            "supports_festivals": True,
            "is_synthetic_demonstration": True
        })
        base_id += 1

    return operators

if __name__ == "__main__":
    ops = generate_500_operators()
    print(f"Total Synthetic Tour Operators generated: {len(ops)}")
    print(f"Sample Operator #1: {ops[0]['company_name']} ({ops[0]['state']})")
    print(f"Sample Operator #500: {ops[499]['company_name']} ({ops[499]['state']})")
