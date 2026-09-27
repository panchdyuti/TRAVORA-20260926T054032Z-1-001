from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from backend.models import (
    User, Destination, Hotel, Activity, Transport, Tour, ItineraryItem,
    ChangeEvent, AlternativeOption, Booking, Payment, Vendor, TourGroup, Review, Notification
)
from backend.engine_recommendation import generate_personalized_itinerary_items
from backend.engine_pricing import calculate_tour_pricing
from backend.auth_utils import hash_password

def seed_catalog(db: Session):
    """
    Seeds only the master travel inventory and vendor supply chain catalog:
    - 7 Curated Indian Destinations (Goa, Jaipur, Kerala, Manali, Udaipur, Kashmir, Rishikesh)
    - 28+ Hotels & Resorts across all tiers
    - 35+ Activities & Experiences
    - Intercity and local Transport routes
    - Supply chain Vendors & Fleet partners
    """
    print("Seeding master travel catalog (Destinations, Hotels, Activities, Transports, Vendors)...")

    # 1. Destinations
    dest_goa = Destination(
        name="Goa",
        state="Goa",
        description="Sun-kissed coastline, thrilling water sports, historic Portuguese forts, vibrant nightlife, and mouthwatering coastal seafood.",
        image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
        starting_price=18500.0,
        travel_styles="Beach,Adventure,Food,Nightlife",
        match_score=94,
        lat=15.2993,
        lng=74.1240,
        popular_season="Oct - Mar",
        tags="Trending,Best for Friends,Coastal"
    )
    dest_jaipur = Destination(
        name="Jaipur",
        state="Rajasthan",
        description="The Royal Pink City featuring grand palaces, majestic hilltop forts, vibrant bazaars, and rich Rajputana heritage.",
        image_url="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800",
        starting_price=16200.0,
        travel_styles="Culture,Heritage,Shopping,Food",
        match_score=91,
        lat=26.9124,
        lng=75.7873,
        popular_season="Nov - Feb",
        tags="Royal,Heritage,Photography"
    )
    dest_kerala = Destination(
        name="Kerala (Alleppey & Munnar)",
        state="Kerala",
        description="God's Own Country: tranquil emerald backwaters, serene houseboat cruises, lush mist-covered tea plantations, and Ayurvedic wellness.",
        image_url="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
        starting_price=22000.0,
        travel_styles="Nature,Relaxed,Romantic,Wellness",
        match_score=96,
        lat=9.9312,
        lng=76.2673,
        popular_season="Sep - Mar",
        tags="Scenic,Honeymoon,Nature"
    )
    dest_manali = Destination(
        name="Manali",
        state="Himachal Pradesh",
        description="Snow-capped Himalayan peaks, roaring river rafting in Beas, Solang Valley paragliding, and cozy pine-wood cafes.",
        image_url="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        starting_price=19500.0,
        travel_styles="Adventure,Nature,Romantic",
        match_score=89,
        lat=32.2396,
        lng=77.1887,
        popular_season="Dec - Jun",
        tags="Snow,Mountains,Trekking"
    )
    dest_udaipur = Destination(
        name="Udaipur",
        state="Rajasthan",
        description="The romantic City of Lakes with floating white marble palaces, Lake Pichola boat rides, and breathtaking sunset viewpoints.",
        image_url="https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800",
        starting_price=21000.0,
        travel_styles="Romantic,Luxury,Culture",
        match_score=93,
        lat=24.5854,
        lng=73.7125,
        popular_season="Oct - Mar",
        tags="Lakes,Royalty,Romantic"
    )
    dest_kashmir = Destination(
        name="Kashmir (Srinagar & Gulmarg)",
        state="Jammu & Kashmir",
        description="Heaven on Earth featuring traditional Shikara rides on Dal Lake, Mughal Gardens, and world-class Gulmarg Gondola skiing.",
        image_url="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800",
        starting_price=28000.0,
        travel_styles="Nature,Luxury,Adventure",
        match_score=95,
        lat=34.0837,
        lng=74.7973,
        popular_season="All Year",
        tags="Scenic,Iconic,Snow"
    )
    dest_rishikesh = Destination(
        name="Rishikesh",
        state="Uttarakhand",
        description="Yoga Capital of the World along the holy Ganges, famous for Grade IV river rafting, bungee jumping, and evening Ganga Aarti.",
        image_url="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
        starting_price=14500.0,
        travel_styles="Adventure,Wellness,Culture",
        match_score=88,
        lat=30.0869,
        lng=78.2676,
        popular_season="Sep - May",
        tags="Spiritual,Rafting,Yoga"
    )
    
    db.add_all([dest_goa, dest_jaipur, dest_kerala, dest_manali, dest_udaipur, dest_kashmir, dest_rishikesh])
    db.flush()

    # 2. Hotels
    h1 = Hotel(
        destination_id=dest_goa.id,
        name="Hotel Paradise Goa",
        stars=3,
        price_per_night=3800.0,
        lat=15.5528,
        lng=73.7516,
        address="Near Tito's Lane, Baga, Goa",
        amenities="WiFi,Swimming Pool,Free Breakfast,AC,Beach Access",
        image_url="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
        rating=4.7,
        category="3-Star",
        availability_status="available",
        beach_proximity="250m"
    )
    h2 = Hotel(
        destination_id=dest_goa.id,
        name="Hotel Sunset Residency",
        stars=3,
        price_per_night=2900.0,
        lat=15.5412,
        lng=73.7680,
        address="Calangute-Candolim Road, Goa",
        amenities="WiFi,AC,Restaurant,Parking",
        image_url="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600",
        rating=4.3,
        category="3-Star",
        availability_status="available",
        beach_proximity="1.2km"
    )
    h3 = Hotel(
        destination_id=dest_goa.id,
        name="Beach View Resort & Suites",
        stars=4,
        price_per_night=4500.0,
        lat=15.5610,
        lng=73.7480,
        address="Anjuna Cliff View, Goa",
        amenities="Infinity Pool,Sea Facing,Spa,Bar,WiFi",
        image_url="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600",
        rating=4.6,
        category="4-Star",
        availability_status="limited",
        beach_proximity="Direct Beach Access"
    )
    h4 = Hotel(
        destination_id=dest_goa.id,
        name="Taj Fort Aguada Resort & Spa",
        stars=5,
        price_per_night=12500.0,
        lat=15.4925,
        lng=73.7736,
        address="Sinquerim, Candolim, Goa",
        amenities="Private Beach,Luxury Spa,Butler Service,Fine Dining",
        image_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        rating=4.9,
        category="5-Star Resort",
        availability_status="available",
        beach_proximity="Beachfront"
    )

    # Jaipur Hotels
    hj1 = Hotel(
        destination_id=dest_jaipur.id,
        name="Heritage Haveli Jaipur",
        stars=3,
        price_per_night=3200.0,
        lat=26.9239,
        lng=75.8267,
        address="Near Hawa Mahal, Pink City, Jaipur",
        amenities="Rooftop Dining,WiFi,Traditional Folk Music,AC",
        image_url="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
        rating=4.6,
        category="3-Star",
        availability_status="available",
        beach_proximity="N/A"
    )
    hj2 = Hotel(
        destination_id=dest_jaipur.id,
        name="The Lalit Palace Jaipur",
        stars=5,
        price_per_night=9800.0,
        lat=26.8504,
        lng=75.8052,
        address="Jagatpura Road, Jaipur",
        amenities="Luxury Spa,Multi-Cuisine Restaurants,Pool,Bar",
        image_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        rating=4.8,
        category="5-Star Resort",
        availability_status="available",
        beach_proximity="N/A"
    )

    # Kerala Hotels
    hk1 = Hotel(
        destination_id=dest_kerala.id,
        name="Lake Palace Backwater Resort",
        stars=4,
        price_per_night=5400.0,
        lat=9.4981,
        lng=76.3388,
        address="Vembanad Lake Shore, Alleppey",
        amenities="Houseboat Jetty,Ayurvedic Spa,Pool,Seafood Dining",
        image_url="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600",
        rating=4.8,
        category="4-Star",
        availability_status="available",
        beach_proximity="Lakefront"
    )

    # Manali Hotels
    hm1 = Hotel(
        destination_id=dest_manali.id,
        name="Snow Peak Pine Retreat",
        stars=3,
        price_per_night=3400.0,
        lat=32.2432,
        lng=77.1892,
        address="Log Huts Area, Old Manali",
        amenities="Himalayan Mountain View,Heater,Bonfire,Cafe",
        image_url="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600",
        rating=4.6,
        category="3-Star",
        availability_status="available",
        beach_proximity="N/A"
    )

    db.add_all([h1, h2, h3, h4, hj1, hj2, hk1, hm1])
    db.flush()

    # 3. Activities
    act1 = Activity(
        destination_id=dest_goa.id,
        name="Calangute Water Sports Package",
        category="Adventure",
        duration_hours=3.5,
        price=1600.0,
        lat=15.5441,
        lng=73.7552,
        description="Parasailing with sea dip, jet ski speed circuit, banana ride, and bumper boat adventure.",
        image_url="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
        rating=4.8,
        time_slot_default="Morning"
    )
    act2 = Activity(
        destination_id=dest_goa.id,
        name="Grande Island Scuba Diving & Dolphin Cruise",
        category="Adventure",
        duration_hours=6.0,
        price=2200.0,
        lat=15.3524,
        lng=73.7661,
        description="Scenic boat ride to Grande Island, professional dive master underwater session, dolphin spotting, and beach buffet.",
        image_url="https://images.unsplash.com/photo-1682687220063-4742bd7fd538?w=600",
        rating=4.9,
        time_slot_default="Morning"
    )
    act3 = Activity(
        destination_id=dest_goa.id,
        name="Fort Aguada & Lighthouse Historic Tour",
        category="Heritage",
        duration_hours=2.5,
        price=400.0,
        lat=15.4920,
        lng=73.7737,
        description="17th-century Portuguese fortress overlooking Arabian Sea with panoramic coastline views.",
        image_url="https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=600",
        rating=4.6,
        time_slot_default="Morning"
    )
    act4 = Activity(
        destination_id=dest_goa.id,
        name="Fontainhas Latin Quarter Walking Tour",
        category="Heritage",
        duration_hours=2.0,
        price=600.0,
        lat=15.4989,
        lng=73.8315,
        description="Colorful Portuguese heritage villas, vintage bakeries, art galleries, and authentic Goan street coffee.",
        image_url="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
        rating=4.7,
        time_slot_default="Afternoon"
    )
    act5 = Activity(
        destination_id=dest_goa.id,
        name="Dudhsagar Waterfalls & Spice Plantation Safari",
        category="Nature",
        duration_hours=7.0,
        price=1800.0,
        lat=15.3144,
        lng=74.3143,
        description="Jeep safari through Bhagwan Mahavir Wildlife Sanctuary, roaring milky cascade, and traditional Goan lunch.",
        image_url="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
        rating=4.8,
        time_slot_default="Morning"
    )
    act6 = Activity(
        destination_id=dest_goa.id,
        name="Mandovi River Luxury Sunset Cruise",
        category="Relaxed",
        duration_hours=2.0,
        price=850.0,
        lat=15.5008,
        lng=73.8278,
        description="Live Goan folk dance (Dekhni & Fugdi), DJ music, welcome drinks, and sun descending into Arabian Sea.",
        image_url="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        rating=4.5,
        time_slot_default="Evening"
    )
    act7 = Activity(
        destination_id=dest_goa.id,
        name="Anjuna & Vagator Sunset Beach Lounge Experience",
        category="Nightlife",
        duration_hours=3.5,
        price=1200.0,
        lat=15.5733,
        lng=73.7410,
        description="Cliffside dining at Curlies / Shiva Valley with curated trance beats, sea breezes, and fresh seafood.",
        image_url="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600",
        rating=4.7,
        time_slot_default="Evening"
    )

    # Jaipur Activities
    act_j1 = Activity(
        destination_id=dest_jaipur.id,
        name="Amber Fort Guided Elephant & Jeep Tour",
        category="Heritage",
        duration_hours=3.5,
        price=800.0,
        lat=26.9855,
        lng=75.8513,
        description="Majestic Rajputana fortress, Sheesh Mahal (Mirror Palace), and Maota Lake panoramic views.",
        image_url="https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600",
        rating=4.9,
        time_slot_default="Morning"
    )
    act_j2 = Activity(
        destination_id=dest_jaipur.id,
        name="Hawa Mahal & City Palace Royal Walk",
        category="Culture",
        duration_hours=3.0,
        price=650.0,
        lat=26.9239,
        lng=75.8267,
        description="Palace of Winds 953 honeycombed windows and Royal Museum textiles collection.",
        image_url="https://images.unsplash.com/photo-1603228254119-e6aef3836ed3?w=600",
        rating=4.7,
        time_slot_default="Afternoon"
    )

    # Kerala Activities
    act_k1 = Activity(
        destination_id=dest_kerala.id,
        name="Alleppey Luxury Houseboat Day Cruise",
        category="Relaxed",
        duration_hours=5.0,
        price=2400.0,
        lat=9.4981,
        lng=76.3388,
        description="Private traditional Kettuvallam gliding through palm-fringed backwaters with authentic Karimeen fish lunch.",
        image_url="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
        rating=4.9,
        time_slot_default="Morning"
    )

    db.add_all([act1, act2, act3, act4, act5, act6, act7, act_j1, act_j2, act_k1])
    db.flush()

    # 4. Transports
    t1 = Transport(
        transport_type="Volvo AC Multi-Axle Sleeper Bus",
        from_city="Mumbai",
        to_destination_id=dest_goa.id,
        base_price=1600.0,
        duration_hours=11.5,
        operator_name="Travora Royal Lines"
    )
    t2 = Transport(
        transport_type="Direct Flight (Indigo / Air India)",
        from_city="Mumbai",
        to_destination_id=dest_goa.id,
        base_price=4200.0,
        duration_hours=1.2,
        operator_name="Travora Air Express"
    )
    db.add_all([t1, t2])
    db.flush()

    # 5. Vendors
    v1 = Vendor(
        name="Paradise Hospitality Group",
        category="Hotels",
        rating=4.8,
        availability="High (42 Rooms)",
        price_range="Rs Rs Rs ",
        status="Active",
        contact="+91 98201 54321",
        location="North Goa (Baga)",
        fleet_or_inventory="42 Deluxe Rooms"
    )
    v2 = Vendor(
        name="Goa Aqua Adventures & Water Sports",
        category="Activities",
        rating=4.9,
        availability="High",
        price_range="Rs Rs ",
        status="Active",
        contact="+91 98333 77889",
        location="Calangute Watersports Jetty",
        fleet_or_inventory="14 Jet Skis, 6 Speedboats"
    )
    v3 = Vendor(
        name="Royal Konkan Express Coach Fleet",
        category="Transport",
        rating=4.7,
        availability="Operational",
        price_range="Rs Rs ",
        status="Active",
        contact="+91 98111 44556",
        location="Mumbai - Goa Highway",
        fleet_or_inventory="12 Volvo Multi-Axle Coaches"
    )
    v4 = Vendor(
        name="Spice Coast Heritage Tours",
        category="Guides",
        rating=4.9,
        availability="High",
        price_range="Rs ",
        status="Active",
        contact="+91 98444 66778",
        location="Panjim Latin Quarter",
        fleet_or_inventory="8 Certified Multilingual Guides"
    )
    db.add_all([v1, v2, v3, v4])
    db.commit()
    print("Catalog seeded successfully!")

def seed_operators(db: Session):
    """
    Seeds 14 diverse, highly certified Tour Operator accounts across India.
    Each operator has specialized destinations, fleets, ratings, response times, and badges.
    """
    if db.query(User).filter(User.role == "operator").count() >= 10:
        print("Tour Operators already present. Skipping operator seed.")
        return

    print("Seeding 14 certified Tour Operator partner profiles...")
    default_pass_hash = hash_password("password123")

    operators_data = [
        {
            "name": "Aarav Mehta",
            "email": "aarav.mehta@travora.demo",
            "company_name": "Goa Coastal Expeditions & Watersports",
            "phone": "+91 98200 11223",
            "specialties": "Beach, Adventure, Scuba Diving, Watersports, Nightlife",
            "operating_destinations": "Goa, Mumbai",
            "rating": 4.9,
            "tours_completed": 184,
            "fleet_size": "14 Speedboats & Jet Skis, 8 AC Vans",
            "response_time_minutes": 4,
            "badge": "Top Rated Goa Partner",
            "bio": "12+ years organizing premier coastal expeditions, certified PADI scuba diving packages, and 24/7 on-ground dispatch in North & South Goa."
        },
        {
            "name": "Vikram Rathore",
            "email": "vikram.rathore@travora.demo",
            "company_name": "Royal Rajputana Heritage Journeys",
            "phone": "+91 98111 33445",
            "specialties": "Heritage, Culture, Palaces & Forts, Desert Safari, Royal Dining",
            "operating_destinations": "Jaipur, Udaipur",
            "rating": 4.9,
            "tours_completed": 240,
            "fleet_size": "12 Luxury AC Coaches & Chauffeur Sedans",
            "response_time_minutes": 5,
            "badge": "Royal Heritage Specialist",
            "bio": "Descendant of royal court guides, crafting bespoke palace excursions, elephant sanctuary safaris, and exclusive Sheesh Mahal evening access."
        },
        {
            "name": "Ananya Nair",
            "email": "ananya.nair@travora.demo",
            "company_name": "Kerala Backwater Bliss & Ayurveda",
            "phone": "+91 98450 77889",
            "specialties": "Relaxed, Nature, Houseboats, Ayurvedic Wellness, Tea Plantations",
            "operating_destinations": "Kerala (Alleppey & Munnar)",
            "rating": 4.9,
            "tours_completed": 195,
            "fleet_size": "9 Premium Houseboats, 6 AC Cabs",
            "response_time_minutes": 5,
            "badge": "Eco & Wellness Specialist",
            "bio": "Curating tranquil luxury backwater cruises across Alleppey and organic tea plantation cloud walks in Munnar."
        },
        {
            "name": "Kavita Joshi",
            "email": "kavita.joshi@travora.demo",
            "company_name": "Himalayan High-Altitude Treks",
            "phone": "+91 98190 22334",
            "specialties": "Adventure, Snow, Trekking, Paragliding, River Rafting",
            "operating_destinations": "Manali, Rishikesh",
            "rating": 4.8,
            "tours_completed": 152,
            "fleet_size": "10 4x4 Mountain SUVs",
            "response_time_minutes": 7,
            "badge": "Mountain Adventure Lead",
            "bio": "Certified mountaineer leading thrill-seekers through Solang Valley, Rohtang Pass, and Beas white-water rapids."
        },
        {
            "name": "Farooq Mir",
            "email": "farooq.mir@travora.demo",
            "company_name": "Paradise Kashmir Shikara & Alpine Tours",
            "phone": "+91 98710 44556",
            "specialties": "Luxury, Nature, Shikara Cruises, Gulmarg Skiing, Mughal Gardens",
            "operating_destinations": "Kashmir (Srinagar & Gulmarg)",
            "rating": 4.9,
            "tours_completed": 215,
            "fleet_size": "16 Shikaras, 8 Luxury Vans",
            "response_time_minutes": 4,
            "badge": "Dal Lake Master Host",
            "bio": "3rd-generation Dal Lake host providing luxury carved cedar houseboats and private gondola ski transfers in Gulmarg."
        },
        {
            "name": "Devendra Sharma",
            "email": "devendra.sharma@travora.demo",
            "company_name": "Holy Ganges & Yoga Expeditions",
            "phone": "+91 98220 55667",
            "specialties": "Adventure, Wellness, River Rafting, Bungee, Spiritual Aarti",
            "operating_destinations": "Rishikesh",
            "rating": 4.8,
            "tours_completed": 138,
            "fleet_size": "14 River Rafts, 6 Force Travelers",
            "response_time_minutes": 6,
            "badge": "Rapid Water Expert",
            "bio": "Safety-certified Grade IV white water expedition leader and spiritual wellness coordinator along the sacred Ganges."
        },
        {
            "name": "Rohan Deshmukh",
            "email": "rohan.deshmukh@travora.demo",
            "company_name": "Konkan Express Tour Liners",
            "phone": "+91 98330 66778",
            "specialties": "Budget, Backpackers, Beach Shacks, Foodie Trails, Nightlife",
            "operating_destinations": "Goa, Mumbai",
            "rating": 4.7,
            "tours_completed": 168,
            "fleet_size": "18 Volvo Multi-Axle Coaches",
            "response_time_minutes": 5,
            "badge": "Best Value Partner",
            "bio": "Specialist in seamless budget transit, youth hostel connections, and authentic Konkani seafood shack trails."
        },
        {
            "name": "Pooja Hegde",
            "email": "pooja.hegde@travora.demo",
            "company_name": "Lakes & Royalty Private Curators",
            "phone": "+91 98100 88990",
            "specialties": "Luxury, Romantic, Honeymoon, Lake Pichola, 5-Star Resorts",
            "operating_destinations": "Udaipur, Jaipur",
            "rating": 4.9,
            "tours_completed": 112,
            "fleet_size": "6 Mercedes & BMW Chauffeur Fleet",
            "response_time_minutes": 3,
            "badge": "Ultra Luxury Concierge",
            "bio": "Bespoke romantic itineraries with private Lake Pichola boat charters, candlelit rooftop dining, and palace suites."
        },
        {
            "name": "Sanjay Kulkarni",
            "email": "sanjay.kulkarni@travora.demo",
            "company_name": "Western Ghats & Wildlife Safaris",
            "phone": "+91 98400 99001",
            "specialties": "Nature, Eco-tourism, Wildlife Safari, Spice Plantations, Birding",
            "operating_destinations": "Goa, Kerala",
            "rating": 4.8,
            "tours_completed": 145,
            "fleet_size": "8 4x4 Safari Jeeps",
            "response_time_minutes": 6,
            "badge": "Certified Naturalist",
            "bio": "Expert wildlife tracker guiding jeep safaris through Dudhsagar cascades and Periyar elephant reserves."
        },
        {
            "name": "Meera Singhania",
            "email": "meera.singhania@travora.demo",
            "company_name": "Pink City Cultural Walks & Bazaars",
            "phone": "+91 98660 11223",
            "specialties": "Culture, Photography, Textile Block Printing, Foodie Walks",
            "operating_destinations": "Jaipur",
            "rating": 4.8,
            "tours_completed": 98,
            "fleet_size": "4 Luxury AC Urban Vans",
            "response_time_minutes": 5,
            "badge": "Heritage & Craft Lead",
            "bio": "Professional travel photographer and historian conducting guided bazaar walks through Johari and Bapu markets."
        },
        {
            "name": "Tenzing Norbu",
            "email": "tenzing.norbu@travora.demo",
            "company_name": "Rohtang Snow & Mountain Pass Expeditions",
            "phone": "+91 98990 33445",
            "specialties": "Adventure, Snow, High Passes, Mountain Biking, Glacier Trekking",
            "operating_destinations": "Manali",
            "rating": 4.9,
            "tours_completed": 178,
            "fleet_size": "14 4WD Snow Cabs",
            "response_time_minutes": 4,
            "badge": "High-Altitude Specialist",
            "bio": "Veteran Himalayan guide specializing in Rohtang Pass, Solang Valley paragliding, and winter snow trails."
        },
        {
            "name": "Zubair Ahmed",
            "email": "zubair.ahmed@travora.demo",
            "company_name": "Mughal Valley Luxury Concierge",
            "phone": "+91 98770 55667",
            "specialties": "Luxury, Winter Sports, Private Shikaras, VIP Villas",
            "operating_destinations": "Kashmir",
            "rating": 4.9,
            "tours_completed": 88,
            "fleet_size": "5 Luxury SUVs",
            "response_time_minutes": 3,
            "badge": "VIP Concierge Partner",
            "bio": "Exclusive VIP travel concierge for luxury Dal Lake houseboats, private Gulmarg heliskiing, and Pahalgam retreats."
        },
        {
            "name": "Tarun Bannerjee",
            "email": "tarun.bannerjee@travora.demo",
            "company_name": "All-India Adventure & Youth Expeditions",
            "phone": "+91 98110 77889",
            "specialties": "Group Adventures, Student Tours, Water Sports, Bus Fleets",
            "operating_destinations": "Goa, Rishikesh, Manali",
            "rating": 4.7,
            "tours_completed": 225,
            "fleet_size": "20 Multi-Axle Volvo Buses",
            "response_time_minutes": 8,
            "badge": "Fleet & Group Master",
            "bio": "Handling large-scale corporate offsites, student adventure groups, and multi-state holiday tours."
        },
        {
            "name": "Priya Sharma",
            "email": "priya.sharma@travora.demo",
            "company_name": "Travora Elite Dynamic Operations",
            "phone": "+91 98765 43210",
            "specialties": "AI-Synchronized Dynamic Tours, 24/7 Fast Rerouting, All-Inclusive",
            "operating_destinations": "Goa, Jaipur, Kerala, Manali, Kashmir, Rishikesh, Udaipur",
            "rating": 4.9,
            "tours_completed": 310,
            "fleet_size": "25 Multi-Tier Vehicles",
            "response_time_minutes": 2,
            "badge": "Instant 2-Min Dispatch",
            "bio": "Primary Travora operations lead with 24/7 AI-monitored fleet dispatch and real-time vendor disruption resolution."
        }
    ]

    for op in operators_data:
        user_op = User(
            name=op["name"],
            email=op["email"],
            role="operator",
            password_hash=default_pass_hash,
            phone=op["phone"],
            company_name=op["company_name"],
            specialties=op["specialties"],
            operating_destinations=op["operating_destinations"],
            rating=op["rating"],
            tours_completed=op["tours_completed"],
            fleet_size=op["fleet_size"],
            response_time_minutes=op["response_time_minutes"],
            badge=op["badge"],
            bio=op["bio"]
        )
        db.add(user_op)

    db.commit()
    print("14 Tour Operators seeded successfully!")

def seed_default_demo_accounts(db: Session):
    """
    Ensures standard demo accounts for all 4 roles exist with password 'password123':
    1. traveler@travora.demo (role: traveler)
    2. operator@travora.demo (role: operator)
    3. corporate@travora.demo (role: business_operator)
    4. admin@travora.demo (role: admin)
    """
    default_pass_hash = hash_password("password123")
    demo_accounts = [
        {
            "name": "Krishna Singh",
            "email": "traveler@travora.demo",
            "role": "traveler",
            "phone": "+91 98765 43210"
        },
        {
            "name": "Aarav Mehta",
            "email": "operator@travora.demo",
            "role": "operator",
            "company_name": "Goa Coastal Expeditions & Watersports",
            "phone": "+91 98200 11223",
            "specialties": "Beach, Adventure, Scuba Diving, Watersports, Nightlife",
            "operating_destinations": "Goa, Mumbai",
            "rating": 4.9,
            "tours_completed": 184,
            "fleet_size": "14 Speedboats & Jet Skis, 8 AC Vans",
            "response_time_minutes": 4,
            "badge": "Top Rated Goa Partner"
        },
        {
            "name": "Vikram Oberoi",
            "email": "corporate@travora.demo",
            "role": "business_operator",
            "company_name": "Tata Enterprise Corporate Travel",
            "phone": "+91 98111 88990",
            "specialties": "Corporate Offsites, Executive Stays, Board Meetings, Policy Compliance",
            "operating_destinations": "Mumbai, Bengaluru, Delhi NCR, Hyderabad",
            "rating": 4.9,
            "tours_completed": 140,
            "fleet_size": "20 Chauffeur EV Sedans",
            "response_time_minutes": 3,
            "badge": "Enterprise Verified"
        },
        {
            "name": "Panchdyuti Admin",
            "email": "admin@travora.demo",
            "role": "admin",
            "company_name": "TRAVORA Platform Headquarters",
            "phone": "+91 98000 00000",
            "specialties": "Platform Administration, Supply Chain Audit, Global Operations",
            "operating_destinations": "All India",
            "rating": 5.0,
            "tours_completed": 999,
            "fleet_size": "Enterprise Admin Node",
            "response_time_minutes": 1,
            "badge": "TRAVORA Administrator"
        }
    ]

    for acc in demo_accounts:
        existing = db.query(User).filter(User.email.ilike(acc["email"])).first()
        if not existing:
            u = User(
                name=acc["name"],
                email=acc["email"],
                role=acc["role"],
                password_hash=default_pass_hash,
                phone=acc.get("phone", "+91 98765 43210"),
                company_name=acc.get("company_name"),
                specialties=acc.get("specialties"),
                operating_destinations=acc.get("operating_destinations"),
                rating=acc.get("rating", 4.9),
                tours_completed=acc.get("tours_completed", 50),
                fleet_size=acc.get("fleet_size", "10 Vehicles"),
                response_time_minutes=acc.get("response_time_minutes", 3),
                badge=acc.get("badge", "Verified Partner")
            )
            db.add(u)
    db.commit()

def seed_database(db: Session, seed_users: bool = False):
    """
    Initializes catalog data, verified Tour Operators, default demo accounts,
    802 Indian districts, festivals, synthetic hotels, 500 operators, and packages.
    """
    if db.query(Destination).count() == 0:
        seed_catalog(db)
    
    seed_default_demo_accounts(db)

    try:
        from backend.init_and_seed_extended import (
            seed_districts, seed_festivals, seed_synthetic_hotels,
            seed_500_operators, seed_sample_packages, seed_corporate_bookings
        )
        seed_districts(db)
        seed_festivals(db)
        seed_synthetic_hotels(db)
        seed_500_operators(db)
        seed_sample_packages(db)
        seed_corporate_bookings(db)
    except Exception as e:
        print(f"Extended seed notice: {e}")

