"""
TRAVORA EXTENDED DATABASE INITIALIZATION & SEED SCRIPT
Safely migrates existing tables, creates new tables, and seeds:
- 802 Indian Administrative Districts
- Comprehensive Festival Intelligence Calendar
- 62 Synthetic Demonstration Hotels (52 recommended + 10 three/four-star)
- 500 Synthetic Tour Operators with complete profiles
- Demonstration Packages (standard, festival, group, private)
- Corporate Travel demonstration records
- Default Demo Accounts for all 4 roles (Traveler, Operator, Corporate, Admin)
"""

import sys
import os
import sqlite3
import json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.database import engine, Base, SessionLocal
from backend.models import (
    User, Destination, Hotel, Activity, Transport, Tour, ItineraryItem,
    ChangeEvent, AlternativeOption, Booking, Payment, Vendor, TourGroup,
    Review, Notification, District, Festival, OperatorPackage, PlaceRequest,
    CorporateBooking, AuditLog, PlatformFeedback
)
from backend.auth_utils import hash_password
from backend.india_districts_data import INDIA_DISTRICTS
from backend.festivals_data import FESTIVALS_CALENDAR
from backend.hotels_data import SYNTHETIC_HOTELS
from backend.operators_data import generate_500_operators

DB_PATH = os.path.join(BASE_DIR, "travora.db")

def migrate_existing_tables_schema():
    """Dynamically ensures newly added columns exist in sqlite tables without data loss."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    columns_to_ensure = {
        "tours": [
            ("package_type", "TEXT DEFAULT 'customized'"),
            ("is_private", "BOOLEAN DEFAULT 0"),
            ("festival_name", "TEXT")
        ],
        "bookings": [
            ("payment_method", "TEXT DEFAULT 'UPI'"),
            ("base_price", "FLOAT DEFAULT 0.0"),
            ("taxes", "FLOAT DEFAULT 0.0"),
            ("service_fee", "FLOAT DEFAULT 0.0"),
            ("discount", "FLOAT DEFAULT 0.0"),
            ("final_total", "FLOAT DEFAULT 0.0"),
            ("transaction_ref", "TEXT"),
            ("trip_completed", "BOOLEAN DEFAULT 0"),
            ("post_trip_reviewed", "BOOLEAN DEFAULT 0")
        ],
        "payments": [
            ("upi_id", "TEXT"),
            ("card_last4", "TEXT"),
            ("bank_name", "TEXT"),
            ("verified_at", "DATETIME"),
            ("gateway_signature", "TEXT")
        ],
        "reviews": [
            ("review_type", "TEXT DEFAULT 'operator'"),
            ("operator_id", "INTEGER"),
            ("communication_rating", "FLOAT DEFAULT 5.0"),
            ("itinerary_rating", "FLOAT DEFAULT 5.0")
        ]
    }

    for table, col_defs in columns_to_ensure.items():
        try:
            cur.execute(f"PRAGMA table_info({table})")
            existing_cols = [row[1] for row in cur.fetchall()]
            for col_name, col_type in col_defs:
                if col_name not in existing_cols:
                    print(f"Adding column '{col_name}' to '{table}' table...")
                    cur.execute(f"ALTER TABLE {table} ADD COLUMN {col_name} {col_type}")
        except Exception as e:
            print(f"Schema check error on {table}: {e}")

    conn.commit()
    conn.close()

def seed_districts(db):
    if db.query(District).count() >= 800:
        print(f"[OK] Districts already seeded ({db.query(District).count()} districts present).")
        return

    print("Seeding 802 Indian administrative districts...")
    for d in INDIA_DISTRICTS:
        dist_record = District(
            district_code=d["district_id"],
            name=d["name"],
            state=d["state"],
            region=d["region"],
            lat=d["lat"],
            lng=d["lng"],
            terrain=d["terrain"],
            popular_season=d["popular_season"],
            recommended_months=d.get("recommended_months", "October to March"),
            tourist_places=json.dumps(d.get("tourist_places", [])),
            heritage_places=json.dumps(d.get("heritage_places", [])),
            religious_places=json.dumps(d.get("religious_places", [])),
            adventure_activities=json.dumps(d.get("adventure_activities", [])),
            cultural_experiences=json.dumps(d.get("cultural_experiences", [])),
            festivals=json.dumps(d.get("festivals", [])),
            transport_connectivity=d.get("transport_connectivity", "Direct Highway & Rail Transfer"),
            is_featured=d.get("is_featured", False)
        )
        db.add(dist_record)
    db.commit()
    print(f"[OK] {len(INDIA_DISTRICTS)} Indian administrative districts seeded successfully!")

def seed_festivals(db):
    if db.query(Festival).count() >= len(FESTIVALS_CALENDAR):
        print(f"[OK] Festivals already seeded ({db.query(Festival).count()} festivals present).")
        return

    print("Seeding India festival calendar intelligence...")
    for f in FESTIVALS_CALENDAR:
        fest_record = Festival(
            code=f["id"],
            name=f["name"],
            state=f["state"],
            districts=",".join(f.get("districts", [])),
            destinations=",".join(f.get("destinations", [])),
            months=",".join(str(m) for m in f.get("months", [])),
            date_window=f.get("date_window", "Seasonal Window"),
            description=f.get("description", ""),
            crowd_factor=f.get("crowd_factor", "High"),
            pricing_surge_pct=f.get("pricing_surge_pct", 20),
            key_experiences=json.dumps(f.get("key_experiences", [])),
            accommodation_advice=f.get("accommodation_advice", ""),
            itinerary_impact=f.get("itinerary_impact", ""),
            special_package_title=f.get("special_package_title", "")
        )
        db.add(fest_record)
    db.commit()
    print(f"[OK] {len(FESTIVALS_CALENDAR)} Festivals seeded successfully!")

def seed_synthetic_hotels(db):
    if db.query(Hotel).count() >= len(SYNTHETIC_HOTELS):
        print(f"[OK] Hotels already seeded ({db.query(Hotel).count()} hotels present).")
        return

    print("Seeding 62 synthetic demonstration hotels (52 recommended + 10 three/four-star)...")
    dest_goa = db.query(Destination).filter(Destination.name.ilike("%goa%")).first()
    dest_default_id = dest_goa.id if dest_goa else 1

    for h in SYNTHETIC_HOTELS:
        # Check if hotel name already exists
        if db.query(Hotel).filter(Hotel.name == h["name"]).first():
            continue
            
        # Match destination
        matched_dest = db.query(Destination).filter(Destination.name.ilike(f"%{h['district']}%")).first()
        dest_id = matched_dest.id if matched_dest else dest_default_id

        hotel_obj = Hotel(
            destination_id=dest_id,
            name=h["name"],
            stars=h["stars"],
            price_per_night=h["price_per_night"],
            lat=h["lat"],
            lng=h["lng"],
            address=h["address"],
            amenities=h["amenities"],
            image_url=h["image_url"],
            rating=h["rating"],
            category=h["category"],
            availability_status="available",
            beach_proximity=h.get("beach_proximity", "250m")
        )
        db.add(hotel_obj)
    db.commit()
    print(f"[OK] 62 Synthetic demonstration hotels verified and seeded!")

def seed_500_operators(db):
    op_count = db.query(User).filter(User.role == "operator").count()
    if op_count >= 500:
        print(f"[OK] 500 Tour Operators already seeded ({op_count} operators present).")
        return

    print(f"Seeding 500 Synthetic Tour Operators across Indian states & districts (currently {op_count})...")
    ops_list = generate_500_operators()
    pass_hash = hash_password("password123")

    for op in ops_list:
        existing = db.query(User).filter(User.email == op["email"]).first()
        if not existing:
            new_op = User(
                name=op["name"],
                email=op["email"],
                role="operator",
                password_hash=pass_hash,
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
            db.add(new_op)
    db.commit()
    final_op_count = db.query(User).filter(User.role == "operator").count()
    print(f"[OK] {final_op_count} Tour Operators present in database!")

def seed_sample_packages(db):
    if db.query(OperatorPackage).count() > 0:
        print(f"[OK] Packages already seeded ({db.query(OperatorPackage).count()} packages present).")
        return

    print("Seeding sample standard, festival, group, and private packages...")
    first_ops = db.query(User).filter(User.role == "operator").limit(20).all()
    if not first_ops:
        return

    sample_packages = [
        {
            "title": "Goa Coastal Discovery & Watersports Extravaganza",
            "package_type": "standard",
            "destination_name": "Goa",
            "district_name": "North Goa",
            "duration_days": 4,
            "capacity": 20,
            "available_seats": 14,
            "base_price": 18500.0,
            "travel_style": "Beach, Adventure, Food",
            "accommodation_type": "3-Star Deluxe Beachfront",
            "transport_type": "Volvo AC Coach",
            "places_covered": "Baga Beach, Fort Aguada, Dudhsagar Waterfalls, Grande Island",
            "highlights": "Includes PADI scuba session, parasailing, and sunset catamaran cruise",
            "is_group": False,
            "is_private": False
        },
        {
            "title": "Ganesh Utsav Divine Immersion VIP Tour",
            "package_type": "festival",
            "destination_name": "Mumbai",
            "district_name": "Mumbai City",
            "duration_days": 3,
            "capacity": 15,
            "available_seats": 6,
            "base_price": 22000.0,
            "travel_style": "Spiritual, Heritage, Festival",
            "accommodation_type": "4-Star City Heritage",
            "transport_type": "Private AC Vehicle",
            "places_covered": "Lalbaugcha Raja, Girgaon Chowpatty, Siddhivinayak, Marine Drive",
            "highlights": "Priority Darshan pass, Dhol Tasha live experience, authentic Modak tasting",
            "festival_id": "fest_ganesh",
            "is_group": True,
            "is_private": False
        },
        {
            "title": "Rajasthan Royal Forts & Palaces Private Odyssey",
            "package_type": "private",
            "destination_name": "Jaipur",
            "district_name": "Jaipur",
            "duration_days": 5,
            "capacity": 4,
            "available_seats": 4,
            "base_price": 32000.0,
            "travel_style": "Luxury, Heritage, Royal",
            "accommodation_type": "5-Star Heritage Palace",
            "transport_type": "Private Chauffeur Sedan",
            "places_covered": "Amer Fort, City Palace, Hawa Mahal, Nahargarh Sunset, Chokhi Dhani",
            "highlights": "Dedicated private guide, candlelit palace courtyard dinner, private airport transfers",
            "is_group": False,
            "is_private": True
        },
        {
            "title": "Kerala Backwaters & Tea Country Group Escapade",
            "package_type": "group",
            "destination_name": "Kerala",
            "district_name": "Alappuzha",
            "duration_days": 5,
            "capacity": 24,
            "available_seats": 8,
            "base_price": 19500.0,
            "travel_style": "Nature, Relaxed, Cultural",
            "accommodation_type": "Houseboat & 3-Star Resort",
            "transport_type": "Volvo AC Coach",
            "places_covered": "Alleppey Lagoons, Munnar Tea Gardens, Fort Kochi, Periyar Sanctuary",
            "highlights": "Overnight private houseboat, traditional Kathakali show, tea tasting tour",
            "is_group": True,
            "is_private": False
        },
        {
            "title": "White Desert Rann Utsav Stargazing Encampment",
            "package_type": "festival",
            "destination_name": "Kutch",
            "district_name": "Kutch",
            "duration_days": 3,
            "capacity": 18,
            "available_seats": 7,
            "base_price": 24500.0,
            "travel_style": "Desert, Cultural, Photography",
            "accommodation_type": "Tent City Luxury Cottage",
            "transport_type": "4x4 Desert AC Van",
            "places_covered": "White Salt Desert, Kala Dungar, Bhujodi Handicrafts, Dhordo Tent City",
            "highlights": "Full moon midnight desert walk, live Kutchi folk dances, telescope stargazing",
            "festival_id": "fest_rann_utsav",
            "is_group": True,
            "is_private": False
        },
        {
            "title": "Himalayan Snow Adventure & Solang Paragliding",
            "package_type": "standard",
            "destination_name": "Manali",
            "district_name": "Kullu",
            "duration_days": 4,
            "capacity": 16,
            "available_seats": 11,
            "base_price": 17800.0,
            "travel_style": "Adventure, Snow, Mountains",
            "accommodation_type": "3-Star Pine Lodge",
            "transport_type": "AC Semi-Sleeper Coach",
            "places_covered": "Solang Valley, Rohtang Pass Snow Point, Old Manali, Beas River",
            "highlights": "Tandem paragliding, Grade III river rafting in Beas, ski gear included",
            "is_group": False,
            "is_private": False
        }
    ]

    for idx, p in enumerate(sample_packages):
        op = first_ops[idx % len(first_ops)]
        pkg = OperatorPackage(
            operator_id=op.id,
            title=p["title"],
            package_type=p["package_type"],
            destination_name=p["destination_name"],
            district_name=p["district_name"],
            state=(op.operating_destinations.split(',')[-1].strip() if op.operating_destinations else "India"),
            duration_days=p["duration_days"],
            capacity=p["capacity"],
            available_seats=p["available_seats"],
            base_price=p["base_price"],
            travel_style=p["travel_style"],
            accommodation_type=p["accommodation_type"],
            transport_type=p["transport_type"],
            places_covered=p["places_covered"],
            highlights=p["highlights"],
            festival_id=p.get("festival_id"),
            is_group=p["is_group"],
            is_private=p["is_private"],
            is_active=True
        )
        db.add(pkg)
    db.commit()
    print("[OK] Sample operator packages seeded!")

def seed_corporate_bookings(db):
    if db.query(CorporateBooking).count() > 0:
        print("[OK] Corporate bookings already present.")
        return

    corp_user = db.query(User).filter(User.role == "business_operator").first()
    if not corp_user:
        return

    print("Seeding sample corporate bookings for Business Travel workflow...")
    sample_corps = [
        {
            "employee_name": "Ananya Sen",
            "employee_email": "ananya.sen@tata.demo",
            "department": "Enterprise Cloud Architecture",
            "travel_purpose": "Annual Client Tech Architecture Review",
            "origin": "Mumbai",
            "destination": "Bengaluru",
            "start_date": "2026-10-12",
            "end_date": "2026-10-15",
            "budget_limit": 45000.0,
            "estimated_cost": 38500.0,
            "hotel_name": "The Leela Palace Bengaluru (Business Suite)",
            "transport_mode": "Flight (Economy Flexi - Air India)",
            "meeting_logistics": "10-seater boardroom reserved with HD hybrid video conferencing",
            "approval_status": "approved",
            "expense_status": "settled",
            "policy_compliant": True
        },
        {
            "employee_name": "Rajesh Varma",
            "employee_email": "rajesh.varma@tata.demo",
            "department": "Strategic Partnerships",
            "travel_purpose": "Vendor Negotiations & Supply Chain Signing",
            "origin": "Delhi NCR",
            "destination": "Hyderabad",
            "start_date": "2026-10-18",
            "end_date": "2026-10-20",
            "budget_limit": 35000.0,
            "estimated_cost": 31200.0,
            "hotel_name": "ITC Kohenur HITEC City (Executive Club)",
            "transport_mode": "Flight (Economy Flexi - IndiGo)",
            "meeting_logistics": "Executive conference room and chauffeur sedan transfer",
            "approval_status": "approved",
            "expense_status": "approved",
            "policy_compliant": True
        }
    ]

    for c in sample_corps:
        b = CorporateBooking(
            user_id=corp_user.id,
            company_name=corp_user.company_name or "Tata Enterprise Corporate Travel",
            employee_name=c["employee_name"],
            employee_email=c["employee_email"],
            department=c["department"],
            travel_purpose=c["travel_purpose"],
            origin=c["origin"],
            destination=c["destination"],
            start_date=c["start_date"],
            end_date=c["end_date"],
            budget_limit=c["budget_limit"],
            estimated_cost=c["estimated_cost"],
            hotel_name=c["hotel_name"],
            transport_mode=c["transport_mode"],
            meeting_logistics=c["meeting_logistics"],
            approval_status=c["approval_status"],
            expense_status=c["expense_status"],
            policy_compliant=c["policy_compliant"]
        )
        db.add(b)
    db.commit()
    print("[OK] Corporate bookings seeded successfully!")

def seed_demo_tours_and_bookings(db):
    """
    Seeds comprehensive interconnected demonstration data:
    1. Active Confirmed Tour (TR1024) for traveler@travora.demo with operator@travora.demo
    2. Verified Booking (BK-TR1024-99) with cryptographic payment signature & receipt
    3. Pending Additional Place Request (Dudhsagar Waterfalls) with impact analysis
    4. Disruption Event with evaluated alternatives for instant adaptation demo
    5. Completed Tour (TR0981) for post-trip operator review demonstration
    """
    traveler = db.query(User).filter(User.email == "traveler@travora.demo").first()
    operator = db.query(User).filter(User.email == "operator@travora.demo").first()
    
    if not traveler or not operator:
        print("Traveler or operator account not found for tour seeding.")
        return

    # 1. Active Tour (TR1024)
    active_tour = db.query(Tour).filter(Tour.code == "TR1024").first()
    if not active_tour:
        active_tour = Tour(
            code="TR1024",
            user_id=traveler.id,
            operator_id=operator.id,
            destination_id=1,  # Goa
            title="Goa Coastal & Heritage Expedition",
            duration_days=4,
            travelers_count=2,
            budget_total=32000.0,
            estimated_cost=28500.0,
            status="booked",
            travel_style="Beach + Adventure + Heritage",
            accommodation_type="3-Star Resort",
            transport_type="Private AC Innova Crysta",
            start_date="2026-10-15",
            end_date="2026-10-18",
            match_percentage=96,
            coordinator_name=operator.name,
            package_type="customized",
            is_private=True,
            ai_recommendation_reason="96% Match: High budget compatibility (95%), matches Beach & Adventure style (100%), verified operator with 4.9 rating."
        )
        db.add(active_tour)
        db.commit()
        db.refresh(active_tour)

        # Itinerary Items
        items_data = [
            (1, "transport", "Private AC Airport Transfer to North Goa", "Pickup from Dabolim / Mopa Airport to North Goa Resort", "10:00 AM", "12:00 PM", 1200.0, "Goa Airport", 15.3800, 73.8300, "car"),
            (1, "hotel", "Resort Check-in: Sterling Goa Varca", "Deluxe Pool-View Room (3-Star Boutique)", "02:00 PM", "03:00 PM", 7500.0, "Sterling Goa Varca", 15.2200, 73.9200, "hotel"),
            (1, "activity", "Sunset Walk & Shacks at Baga Beach", "Evening leisure walk, coastal snacks, and beach shacks", "05:30 PM", "08:00 PM", 800.0, "Baga Beach", 15.5553, 73.7516, "sunset"),
            (2, "activity", "Grand Island Scuba Diving & Dolphin Cruise", "Guided underwater scuba dive with video & boat ride", "08:30 AM", "01:00 PM", 4500.0, "Grand Island", 15.3500, 73.7600, "compass"),
            (2, "activity", "Watersports: Parasailing & Jet Ski at Calangute", "Speedboat rides and dual parasailing combo", "02:30 PM", "05:00 PM", 3200.0, "Calangute Beach", 15.5439, 73.7553, "waves"),
            (3, "activity", "Historic Fort Aguada & Lighthouse Tour", "Portuguese 17th-century coastal fortress & panoramic sea view", "09:30 AM", "12:30 PM", 900.0, "Fort Aguada", 15.4920, 73.7737, "landmark"),
            (3, "activity", "Fontainhas Latin Quarter Heritage Walk & Cafe", "Explore vibrant Portuguese quarter, heritage architecture, and local bakery", "03:00 PM", "06:00 PM", 1400.0, "Fontainhas, Panaji", 15.4989, 73.8340, "camera"),
            (4, "activity", "Old Goa Churches: Basilica of Bom Jesus", "UNESCO World Heritage site with historic architecture", "10:00 AM", "12:30 PM", 600.0, "Old Goa", 15.5009, 73.9116, "map-pin"),
            (4, "transport", "Mandovi River Sunset Cruise & Return Airport Transfer", "1-hour river cruise with live cultural dance, followed by airport drop", "03:00 PM", "06:00 PM", 2400.0, "Mandovi River", 15.5000, 73.8200, "car")
        ]

        for idx, (day, itype, title, sub, tstart, tend, cost, loc, lat, lng, icon) in enumerate(items_data):
            it_item = ItineraryItem(
                tour_id=active_tour.id,
                day_number=day,
                item_type=itype,
                title=title,
                subtitle=sub,
                time_start=tstart,
                time_end=tend,
                cost=cost,
                location_name=loc,
                lat=lat,
                lng=lng,
                icon=icon,
                order_index=idx
            )
            db.add(it_item)
        db.commit()

        # Confirmed Booking & Payment
        booking = Booking(
            booking_code="BK-TR1024-99",
            tour_id=active_tour.id,
            user_id=traveler.id,
            amount_paid=28500.0,
            payment_method="UPI",
            base_price=24152.0,
            taxes=4348.0,
            service_fee=0.0,
            discount=0.0,
            final_total=28500.0,
            transaction_ref="TXN-UPI-TRAVORA-88412",
            payment_status="completed",
            booking_status="confirmed",
            trip_completed=False,
            post_trip_reviewed=False
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)

        payment = Payment(
            booking_id=booking.id,
            subtotal=24152.0,
            taxes=4348.0,
            service_fee=0.0,
            discount=0.0,
            total=28500.0,
            method="UPI",
            status="Success",
            transaction_ref="TXN-UPI-TRAVORA-88412",
            upi_id="krishna@okhdfcbank",
            gateway_signature="SIG_UPI_VERIFIED_TRAVORA_88412"
        )
        db.add(payment)

        # Audit Log & Notification
        audit = AuditLog(
            entity_type="booking",
            entity_id=booking.id,
            action="booking_confirmed",
            before_state=json.dumps({"status": "pending"}),
            after_state=json.dumps({"status": "confirmed", "booking_code": booking.booking_code, "amount": 28500.0}),
            reason="Verified cryptographic payment processed via UPI TXN-UPI-TRAVORA-88412",
            approved_by="Traveller"
        )
        db.add(audit)

        notif = Notification(
            user_id=traveler.id,
            tour_id=active_tour.id,
            title="Booking Confirmed: Goa Expedition",
            message="Your booking BK-TR1024-99 for Goa Coastal & Heritage Expedition has been confirmed. Operator Aarav Mehta has been notified.",
            type="booking"
        )
        db.add(notif)

        # Pending Additional Place Request for Operator review demo
        place_req = PlaceRequest(
            tour_id=active_tour.id,
            user_id=traveler.id,
            operator_id=operator.id,
            place_name="Dudhsagar Waterfalls Jungle Safari",
            requested_day=3,
            status="pending",
            impact_cost_transport=1400.0,
            impact_cost_activity=500.0,
            impact_cost_meal=300.0,
            impact_cost_total=2200.0,
            impact_time_hours=4.5,
            impact_distance_km=68.0,
            schedule_delay_note="Fontainhas Latin Quarter walk shifts by 1.5 hours to 04:30 PM",
            dependency_impact_note="Requires early 07:00 AM 4x4 Jeep transfer and forest clearance pass",
            operator_notes="Traveller requested jungle safari addition on Day 3 morning"
        )
        db.add(place_req)

        # Disruption Event with Alternative Options for Adaptation demo
        change_ev = ChangeEvent(
            tour_id=active_tour.id,
            event_type="hotel_cancellation",
            status="pending",
            severity="critical",
            title="Accommodation Notice: Sterling Resort Maintenance",
            reason="Water supply system maintenance at Sterling Resort on Day 2 requires room reallocation.",
            impact_summary="Requires check-in at verified nearby luxury resort. Distance delta: +1.8 km.",
            affected_accommodation="Day 2 Hotel Sterling Varca",
            affected_checkin="Check-in delayed by 30 mins (02:30 PM)",
            affected_transport="Cab reroute +1.8 km covered by operator",
            cost_delta=900.0
        )
        db.add(change_ev)
        db.commit()
        db.refresh(change_ev)

        alt1 = AlternativeOption(
            change_event_id=change_ev.id,
            title="Heritage Palms Beach Resort & Spa",
            category="4-Star Beachfront",
            price_delta=900.0,
            distance_km=1.8,
            preference_match=96,
            budget_match=92,
            location_match=98,
            availability_match=100,
            time_match=95,
            overall_score=96,
            is_recommended=True,
            is_selected=False,
            description="Upgraded 4-star beachfront resort with complimentary sea-facing balcony and breakfast.",
            beach_proximity="150m to beach",
            checkin_compatible=True,
            image_url="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
        )
        alt2 = AlternativeOption(
            change_event_id=change_ev.id,
            title="Taj Holiday Village Resort & Spa",
            category="5-Star Luxury",
            price_delta=2800.0,
            distance_km=3.2,
            preference_match=98,
            budget_match=82,
            location_match=94,
            availability_match=95,
            time_match=90,
            overall_score=91,
            is_recommended=False,
            is_selected=False,
            description="Premium 5-star luxury cottage with private beach access and spa facilities.",
            beach_proximity="Direct Beach Access",
            checkin_compatible=True,
            image_url="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
        )
        db.add(alt1)
        db.add(alt2)
        db.commit()
    else:
        # Ensure pending place request and disruption event exist for active_tour
        if db.query(PlaceRequest).filter(PlaceRequest.tour_id == active_tour.id).count() == 0:
            place_req = PlaceRequest(
                tour_id=active_tour.id,
                user_id=traveler.id,
                operator_id=operator.id,
                place_name="Dudhsagar Waterfalls Jungle Safari",
                requested_day=3,
                status="pending",
                impact_cost_transport=1400.0,
                impact_cost_activity=500.0,
                impact_cost_meal=300.0,
                impact_cost_total=2200.0,
                impact_time_hours=4.5,
                impact_distance_km=68.0,
                schedule_delay_note="Fontainhas Latin Quarter walk shifts by 1.5 hours to 04:30 PM",
                dependency_impact_note="Requires early 07:00 AM 4x4 Jeep transfer and forest clearance pass",
                operator_notes="Traveller requested jungle safari addition on Day 3 morning"
            )
            db.add(place_req)
            db.commit()

        if db.query(ChangeEvent).filter(ChangeEvent.tour_id == active_tour.id, ChangeEvent.status == "pending").count() == 0:
            change_ev = ChangeEvent(
                tour_id=active_tour.id,
                event_type="hotel_cancellation",
                status="pending",
                severity="critical",
                title="Accommodation Notice: Sterling Resort Maintenance",
                reason="Water supply system maintenance at Sterling Resort on Day 2 requires room reallocation.",
                impact_summary="Requires check-in at verified nearby luxury resort. Distance delta: +1.8 km.",
                affected_accommodation="Day 2 Hotel Sterling Varca",
                affected_checkin="Check-in delayed by 30 mins (02:30 PM)",
                affected_transport="Cab reroute +1.8 km covered by operator",
                cost_delta=900.0
            )
            db.add(change_ev)
            db.commit()
            db.refresh(change_ev)

            alt1 = AlternativeOption(
                change_event_id=change_ev.id,
                title="Heritage Palms Beach Resort & Spa",
                category="4-Star Beachfront",
                price_delta=900.0,
                distance_km=1.8,
                preference_match=96,
                budget_match=92,
                location_match=98,
                availability_match=100,
                time_match=95,
                overall_score=96,
                is_recommended=True,
                is_selected=False,
                description="Upgraded 4-star beachfront resort with complimentary sea-facing balcony and breakfast.",
                beach_proximity="150m to beach",
                checkin_compatible=True,
                image_url="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
            )
            alt2 = AlternativeOption(
                change_event_id=change_ev.id,
                title="Taj Holiday Village Resort & Spa",
                category="5-Star Luxury",
                price_delta=2800.0,
                distance_km=3.2,
                preference_match=98,
                budget_match=82,
                location_match=94,
                availability_match=95,
                time_match=90,
                overall_score=91,
                is_recommended=False,
                is_selected=False,
                description="Premium 5-star luxury cottage with private beach access and spa facilities.",
                beach_proximity="Direct Beach Access",
                checkin_compatible=True,
                image_url="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
            )
            db.add(alt1)
            db.add(alt2)
            db.commit()

    # 2. Completed Tour (TR0981) for post-trip operator review demo
    completed_tour = db.query(Tour).filter(Tour.code == "TR0981").first()
    if not completed_tour:
        completed_tour = Tour(
            code="TR0981",
            user_id=traveler.id,
            operator_id=operator.id,
            destination_id=3,  # Kerala
            title="Kerala Backwaters & Munnar Tea Trails",
            duration_days=4,
            travelers_count=2,
            budget_total=26000.0,
            estimated_cost=24000.0,
            status="completed",
            travel_style="Nature + Backwaters + Relaxation",
            accommodation_type="Deluxe Houseboat & Tea Resort",
            transport_type="AC Sedan",
            start_date="2026-08-10",
            end_date="2026-08-14",
            match_percentage=94,
            coordinator_name=operator.name,
            package_type="standard",
            is_private=False,
            ai_recommendation_reason="94% Match: Houseboat luxury experience with guided tea plantation walks."
        )
        db.add(completed_tour)
        db.commit()
        db.refresh(completed_tour)

        comp_booking = Booking(
            booking_code="BK-TR0981-42",
            tour_id=completed_tour.id,
            user_id=traveler.id,
            amount_paid=24000.0,
            payment_method="Card",
            base_price=20339.0,
            taxes=3661.0,
            service_fee=0.0,
            discount=0.0,
            final_total=24000.0,
            transaction_ref="TXN-CARD-TRAVORA-77291",
            payment_status="completed",
            booking_status="confirmed",
            trip_completed=True,
            post_trip_reviewed=False
        )
        db.add(comp_booking)
        db.commit()

    print("[OK] Demo tours, bookings, place requests, and disruption events seeded successfully!")

def run_extended_initialization():
    print("==================================================================")
    print("  TRAVORA EXTENDED DATABASE INITIALIZATION")
    print("==================================================================")
    
    # 1. Create all tables that do not exist yet
    Base.metadata.create_all(bind=engine)
    
    # 2. Add any new columns to existing tables
    migrate_existing_tables_schema()
    
    # 3. Seed data
    db = SessionLocal()
    try:
        from backend.seed_data import seed_catalog, seed_default_demo_accounts
        if db.query(Destination).count() == 0:
            seed_catalog(db)
            
        seed_default_demo_accounts(db)
        seed_districts(db)
        seed_festivals(db)
        seed_synthetic_hotels(db)
        seed_500_operators(db)
        seed_sample_packages(db)
        seed_corporate_bookings(db)
        seed_demo_tours_and_bookings(db)
        
        print("\n==================================================================")
        print("  [OK] ALL EXTENDED DATA INITIALIZED AND VERIFIED!")
        print("==================================================================")
    finally:
        db.close()

if __name__ == "__main__":
    run_extended_initialization()
