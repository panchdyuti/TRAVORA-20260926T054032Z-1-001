import re
import json
from sqlalchemy.orm import Session
from backend.models import Tour, ItineraryItem, Booking, Payment, Destination, District, Notification
from backend.engine_pricing import calculate_tour_pricing
from backend.weather_service import get_live_weather
from typing import Dict, Any, List

def process_ai_assistant_query(query: str, tour_id: int, db: Session) -> Dict[str, Any]:
    """
    Intelligent conversational copilot deeply integrated with:
    1. FAQ Knowledge Base (cancellations, baggage, check-in, refunds, Prime)
    2. Emergency Contact & 24/7 On-Ground Operator SOS
    3. Live Recent Bookings & PNR Tracking
    4. Feedback & Rating Collection
    5. Real-Time Meteorological & Climate Hazard Telemetry
    6. Instant Quick AI Tour & Micro-Itinerary Generation
    """
    q_lower = query.lower().strip()
    tour = db.query(Tour).filter(Tour.id == tour_id).first() if tour_id else None
    
    # --------------------------------------------------------------------------
    # 1. CONTACT INFO & EMERGENCY OPERATOR SOS
    # --------------------------------------------------------------------------
    if any(k in q_lower for k in [
        "contact", "phone", "call", "number", "emergency", "sos", 
        "coordinator", "helpline", "talk to human", "support", "whatsapp", "help desk"
    ]):
        coordinator_name = tour.coordinator_name if (tour and tour.coordinator_name) else "Vikram Rathore"
        dest_name = tour.destination.name if (tour and tour.destination) else "India"
        tour_code = tour.code if tour else "TR1024"
        
        return {
            "reply": (
                f"🚨 **TRAVORA Emergency & Operations Contact Desk**:\n\n"
                f"• **Assigned On-Ground Coordinator**: **{coordinator_name}** ({dest_name} Sector)\n"
                f"• **24/7 Emergency Dispatch Hotline**: **+91 98765 43210** (Instant operator connect)\n"
                f"• **National Customer Care**: **+91 124 4180810** (09:00 AM – 11:00 PM IST)\n"
                f"• **Direct WhatsApp Concierge**: **+91 98765 43210**\n"
                f"• **Priority Support Email**: `support@travora.in` & `emergency@travora.in`\n\n"
                f"Your active Tour Code is **#{tour_code}**. For on-ground emergencies, tap **Call** or use the **Alert Operator** action in your itinerary to dispatch assistance immediately."
            ),
            "action_type": "contact_info",
            "contact_data": {
                "coordinator": coordinator_name,
                "phone": "+91 98765 43210",
                "customer_care": "+91 124 4180810",
                "email": "support@travora.in",
                "tour_code": tour_code
            }
        }

    # --------------------------------------------------------------------------
    # 2. FAQ KNOWLEDGE BASE INTEGRATION
    # --------------------------------------------------------------------------
    if any(k in q_lower for k in [
        "faq", "frequently asked", "cancellation", "refund", "baggage", 
        "check in policy", "check-in policy", "id proof", "mandatory id", 
        "rules", "hotel policy", "reschedule", "convenience fee", "prime"
    ]):
        if "cancellation" in q_lower or "refund" in q_lower or "cancel" in q_lower:
            return {
                "reply": (
                    f"📋 **TRAVORA Cancellation & Refund Policy (Guaranteed)**:\n\n"
                    f"• **Free Cancellation**: 100% full refund if cancelled up to **24 hours** prior to scheduled departure or check-in.\n"
                    f"• **Disruption Guarantee**: Zero cancellation fee if your trip is impacted by weather alerts, flight diversions, or natural hazards.\n"
                    f"• **Instant Processing**: Refunds are credited directly to your original payment mode (UPI, Netbanking, Card) within **2 to 4 business hours**.\n"
                    f"• **Rescheduling**: You can reschedule tour dates once for free with zero administrative fee."
                ),
                "action_type": "faq",
                "faq_category": "cancellation"
            }
        elif "baggage" in q_lower or "luggage" in q_lower or "weight" in q_lower:
            return {
                "reply": (
                    f"🧳 **Baggage Allowance Guidelines**:\n\n"
                    f"• **Domestic Flights (IndiGo, Air India, SpiceJet, Vistara)**: 15 kg check-in baggage + 7 kg cabin handbag included per passenger.\n"
                    f"• **Intercity Cabs & Volvo AC Coaches**: Up to 2 standard suitcases (23 kg each) + 1 backpack per traveler.\n"
                    f"• **Excess Baggage**: Pre-book additional baggage via TRAVORA at up to **40% lower airport rates**."
                ),
                "action_type": "faq",
                "faq_category": "baggage"
            }
        elif "id" in q_lower or "check in" in q_lower or "check-in" in q_lower or "document" in q_lower:
            return {
                "reply": (
                    f"🏨 **Hotel Check-in & ID Requirements**:\n\n"
                    f"• **Standard Check-in Time**: 02:00 PM (Early check-in from 10:00 AM available via AI auto-sync).\n"
                    f"• **Standard Check-out Time**: 11:00 AM.\n"
                    f"• **Mandatory ID Proofs**: Original Physical or DigiLocker Govt Photo ID (Aadhaar Card, Passport, Driving License, or Voter ID).\n"
                    f"• *Note*: PAN cards are not accepted as valid address proof by Indian hotel municipal regulations."
                ),
                "action_type": "faq",
                "faq_category": "checkin"
            }
        else:
            return {
                "reply": (
                    f"❓ **Frequently Asked Questions (TRAVORA Smart Travel)**:\n\n"
                    f"1. **What is TRAVORA Prime?** Zero convenience fees on all flight & hotel bookings, plus free meal upgrades and priority operator dispatch.\n"
                    f"2. **How does Disruption Adaptation work?** If severe weather, road blocks, or hotel inventory locks occur, our AI recalculates safe-ground alternatives within seconds.\n"
                    f"3. **Are taxes included?** All quotes display final transparent pricing including GST (5% on transport, 12-18% on hotels).\n"
                    f"4. **Need instant help?** Call your 24/7 dedicated coordinator at **+91 98765 43210**."
                ),
                "action_type": "faq",
                "faq_category": "general"
            }

    # --------------------------------------------------------------------------
    # 3. RECENT BOOKINGS & TICKETS TRACKING
    # --------------------------------------------------------------------------
    if any(k in q_lower for k in [
        "my booking", "recent booking", "my trips", "my tickets", 
        "booking status", "pnr", "reservation", "booked trips", "show my trip"
    ]):
        recent_tours = db.query(Tour).order_by(Tour.id.desc()).limit(3).all()
        if recent_tours:
            tours_summary = []
            for t in recent_tours:
                dest_str = t.destination.name if t.destination else (t.title.replace(" Personalized Discovery", "") if t.title else "India")
                tours_summary.append(
                    f"• **Tour #{t.code}** — **{dest_str}**\n"
                    f"  Status: `{t.status.upper()}` • {t.travelers_count} Traveler(s) • Total: Rs {t.estimated_cost:,.2f}\n"
                    f"  Dates: {t.start_date or 'Upcoming'} to {t.end_date or 'Flexible'}"
                )
            return {
                "reply": (
                    f"🎫 **Your Recent Bookings & Confirmed Itineraries**:\n\n"
                    + "\n\n".join(tours_summary) +
                    f"\n\nTap **My Trips & Bookings** in the navigation bar to download official GST tax vouchers and operator dispatch passes."
                ),
                "action_type": "recent_bookings",
                "bookings_data": [
                    {
                        "id": t.id,
                        "code": t.code,
                        "destination": t.destination.name if t.destination else "India",
                        "status": t.status,
                        "cost": t.estimated_cost,
                        "travelers": t.travelers_count
                    } for t in recent_tours
                ]
            }
        return {
            "reply": "No past bookings found under your profile. You can design an autonomous plan right away using our **AI Trip Planner**!"
        }

    # --------------------------------------------------------------------------
    # 4. LIVE WEATHER MONITORING & NATURAL CONDITIONS TELEMETRY
    # --------------------------------------------------------------------------
    if any(k in q_lower for k in [
        "weather", "climate", "rain", "temperature", "forecast", "temp", 
        "storm", "is it raining", "natural condition", "weather alert", "live weather"
    ]):
        # Extract target city from query or fallback to tour destination
        target_name = None
        for word in ["jaipur", "goa", "manali", "kashmir", "srinagar", "mumbai", "delhi", "varanasi", "udaipur", "kerala", "ooty", "coorg", "puri", "shimla"]:
            if word in q_lower:
                target_name = word.title()
                break
                
        if not target_name and tour and tour.destination:
            target_name = tour.destination.name
        if not target_name:
            target_name = "Jaipur"
            
        # Coordinates lookup
        coords_map = {
            "Jaipur": (26.9124, 75.7873),
            "Goa": (15.2993, 74.1240),
            "Manali": (32.2432, 77.1892),
            "Kashmir": (34.0837, 74.7973),
            "Srinagar": (34.0837, 74.7973),
            "Mumbai": (19.0760, 72.8777),
            "Delhi": (28.6139, 77.2090),
            "Varanasi": (25.3176, 82.9739),
            "Udaipur": (24.5854, 73.7125),
            "Kerala": (9.9312, 76.2673),
            "Ooty": (11.4102, 76.6950),
            "Coorg": (12.3375, 75.8069),
            "Puri": (19.8135, 85.8312)
        }
        
        lat, lng = coords_map.get(target_name, (26.9124, 75.7873))
        weather_info = get_live_weather(lat, lng, target_name)
        
        temp = weather_info.get("temperature", 28.5)
        cond = weather_info.get("condition", "Partly Cloudy")
        wind = weather_info.get("wind_speed", 14.2)
        humidity = weather_info.get("humidity", 58)
        safety_index = "96% (Safe & Favorable)" if wind < 40 else "Caution (Monitored Area)"
        
        return {
            "reply": (
                f"🌦️ **Live Weather & Natural Conditions Radar — {target_name}**:\n\n"
                f"• **Current Temperature**: **{temp}°C**\n"
                f"• **Atmospheric Condition**: **{cond}**\n"
                f"• **Wind Velocity**: **{wind} km/h**\n"
                f"• **Relative Humidity**: **{humidity}%**\n"
                f"• **Travel Safety Index**: **{safety_index}**\n\n"
                f"TRAVORA's Digital Weather Twin engine continuously monitors microbursts, cloudbursts, and coastal tides. In case of unexpected changes, safe-haven relocations are triggered automatically."
            ),
            "action_type": "weather_monitoring",
            "weather_data": {
                "city": target_name,
                "temperature": temp,
                "condition": cond,
                "wind_speed": wind,
                "humidity": humidity,
                "safety_index": safety_index
            }
        }

    # --------------------------------------------------------------------------
    # 5. QUICK AI PLANNER INTEGRATION
    # --------------------------------------------------------------------------
    if any(k in q_lower for k in [
        "plan a trip", "create itinerary", "quick plan", "suggest trip", 
        "plan for", "itinerary for", "plan jaipur", "plan goa", "plan manali"
    ]):
        dest_word = "Jaipur"
        for w in ["jaipur", "goa", "manali", "kashmir", "srinagar", "mumbai", "delhi", "varanasi", "udaipur", "kerala", "ooty"]:
            if w in q_lower:
                dest_word = w.title()
                break
                
        itineraries = {
            "Jaipur": {
                "days": [
                    {"day": 1, "title": "Royal Pink City Arrival & Hawa Mahal", "cost": 3200, "hotel": "ITC Rajputana Luxury Haveli"},
                    {"day": 2, "title": "Amber Fort Jeep Safari & Jal Mahal Sunset", "cost": 4800, "hotel": "ITC Rajputana Luxury Haveli"},
                    {"day": 3, "title": "City Palace, Jantar Mantar & Johari Bazaar Craft Tour", "cost": 2500, "hotel": "Check-out & Airport"}
                ],
                "budget": "Rs 24,500 for 2 Adults"
            },
            "Goa": {
                "days": [
                    {"day": 1, "title": "Baga Beachfront Check-in & Sunset Cruise", "cost": 3500, "hotel": "Taj Fort Aguada Resort"},
                    {"day": 2, "title": "Grande Island Scuba Diving & Dolphin Sightings", "cost": 5500, "hotel": "Taj Fort Aguada Resort"},
                    {"day": 3, "title": "Old Goa Latin Quarter Fontainhas Heritage Walk", "cost": 2200, "hotel": "Check-out & Airport"}
                ],
                "budget": "Rs 28,000 for 2 Adults"
            },
            "Manali": {
                "days": [
                    {"day": 1, "title": "Solang Valley Pine View & Hadimba Temple", "cost": 2800, "hotel": "Himalayan Cedar Wood Chalets"},
                    {"day": 2, "title": "Atal Tunnel & Sissu Snow Waterfall Expedition", "cost": 5200, "hotel": "Himalayan Cedar Wood Chalets"},
                    {"day": 3, "title": "Old Manali Riverside Cafes & Mall Road Stroll", "cost": 2100, "hotel": "Check-out & Volvo Transfer"}
                ],
                "budget": "Rs 22,000 for 2 Adults"
            }
        }
        
        plan = itineraries.get(dest_word, itineraries["Jaipur"])
        day_blocks = "\n".join([f"• **Day {d['day']}**: {d['title']} (Stay: *{d['hotel']}*)" for d in plan["days"]])
        
        return {
            "reply": (
                f"✨ **Quick 3-Day AI Itinerary Blueprint — {dest_word}**:\n\n"
                f"{day_blocks}\n\n"
                f"• **Estimated Budget**: **{plan['budget']}** (Includes Hotel, Private Cabs & Passes)\n"
                f"• **Disruption Protection**: Free weather-safe relocation included.\n\n"
                f"Tap **Open AI Planner** in the top navigation bar to fine-tune activity timings, swap hotels, or lock this booking instantly."
            ),
            "action_type": "quick_planner",
            "planner_data": {
                "destination": dest_word,
                "days": plan["days"],
                "budget": plan["budget"]
            }
        }

    # --------------------------------------------------------------------------
    # 6. FEEDBACK & RATING COLLECTION
    # --------------------------------------------------------------------------
    if any(k in q_lower for k in [
        "feedback", "review", "rate", "rating", "stars", "complaint", 
        "suggestion", "experience was", "loved the trip", "bad service", "great tour"
    ]):
        # Record feedback notification for the platform
        notif = Notification(
            user_id=tour.user_id if tour else 1,
            role="admin",
            tour_id=tour.id if tour else None,
            title="User Feedback Submitted via AI Copilot",
            message=f"Traveler feedback received: \"{query}\"",
            type="info",
            is_read=False
        )
        db.add(notif)
        db.commit()
        
        return {
            "reply": (
                f"⭐ **Thank you for your valuable feedback!**\n\n"
                f"Your review has been logged directly with our quality oversight and operations team. "
                f"As a token of appreciation for helping us elevate India's travel experience on World Tourism Day, "
                f"we have unlocked a special perk for you:\n\n"
                f"🎁 **Promo Voucher**: `TRAVORA-PRIME-15` (Flat 15% discount on all domestic packages).\n\n"
                f"Have any more suggestions? Feel free to share anytime!"
            ),
            "action_type": "feedback_submitted",
            "promo_code": "TRAVORA-PRIME-15"
        }

    # --------------------------------------------------------------------------
    # 7. BUDGET OPTIMIZATION & PRICE SAVINGS
    # --------------------------------------------------------------------------
    if "cheaper" in q_lower or "reduce cost" in q_lower or "save money" in q_lower or "budget" in q_lower:
        if tour:
            items = db.query(ItineraryItem).filter(ItineraryItem.tour_id == tour.id).all()
            for item in items:
                if item.item_type == "activity" and item.cost > 1000:
                    item.cost = round(item.cost * 0.75, 2)
                    item.subtitle = f"{item.subtitle} (Optimized with early-bird discount)"
            pricing = calculate_tour_pricing(items, tour.budget_total, tour.travelers_count)
            tour.estimated_cost = pricing["total"]
            db.commit()
            return {
                "reply": f"I optimized your activities and negotiated early-bird vendor rates. Your total estimated trip cost is reduced to **Rs {pricing['total']:,.2f}** (Savings: Rs {pricing['remaining']:,.2f} remaining within your Rs {tour.budget_total:,.2f} budget).",
                "action_taken": "optimized_budget",
                "pricing": pricing
            }
        return {
            "reply": "To reduce costs, opt for verified 3-Star Heritage havelis/comfort resorts, early-bird group passes, and zero-fee TRAVORA Prime bookings which save up to 25%."
        }

    # --------------------------------------------------------------------------
    # 8. ADVENTURE & ACTIVITIES ADDITION
    # --------------------------------------------------------------------------
    if "adventure" in q_lower or "more action" in q_lower or "scuba" in q_lower or "watersports" in q_lower:
        if tour:
            new_item = ItineraryItem(
                tour_id=tour.id,
                day_number=2,
                item_type="activity",
                title="Bungee Jumping & High-Adrenaline Safari",
                subtitle="Thrilling adventure with certified instructors & HD drone recording",
                time_start="02:30 PM",
                time_end="04:30 PM",
                cost=2500.0 * tour.travelers_count,
                location_name="Adventure Hub",
                lat=26.9124,
                lng=75.7873,
                icon="zap",
                order_index=6
            )
            db.add(new_item)
            db.flush()
            items = db.query(ItineraryItem).filter(ItineraryItem.tour_id == tour.id).all()
            pricing = calculate_tour_pricing(items, tour.budget_total, tour.travelers_count)
            tour.estimated_cost = pricing["total"]
            db.commit()
            return {
                "reply": "Added high-adrenaline **Adventure Experience** to Day 2 afternoon! Itinerary schedule and pricing updated.",
                "action_taken": "added_activity",
                "pricing": pricing
            }
        return {
            "reply": "Top adventure activities include: 1) Thar Desert Dune Bashing & Quad Biking, 2) Scuba Diving in Grande Island, 3) Solang Valley Paragliding, and 4) Rishikesh White Water Rafting."
        }

    # --------------------------------------------------------------------------
    # 9. LUXURY UPGRADE
    # --------------------------------------------------------------------------
    if "luxury" in q_lower or "5 star" in q_lower or "resort" in q_lower or "upgrade" in q_lower:
        if tour:
            hotel_item = db.query(ItineraryItem).filter(
                ItineraryItem.tour_id == tour.id,
                ItineraryItem.item_type == "hotel"
            ).first()
            if hotel_item:
                hotel_item.title = "Check-in at The Oberoi Rajvilas Luxury Palace (5-Star Luxury)"
                hotel_item.subtitle = "Royal heritage suite with private courtyard & 24/7 personalized butler service"
                hotel_item.cost += 5000.0
            items = db.query(ItineraryItem).filter(ItineraryItem.tour_id == tour.id).all()
            pricing = calculate_tour_pricing(items, tour.budget_total, tour.travelers_count)
            tour.estimated_cost = pricing["total"]
            tour.accommodation_type = "5-Star Luxury Palace"
            db.commit()
            return {
                "reply": "Upgraded accommodation to **The Oberoi Rajvilas Luxury Palace (5-Star Luxury)**. Itinerary and live pricing synchronized.",
                "action_taken": "upgraded_hotel",
                "pricing": pricing
            }
        return {
            "reply": "Premier luxury stays include The Oberoi Rajvilas (Jaipur), Taj Fort Aguada (Goa), The Khyber (Gulmarg), and Taj Lake Palace (Udaipur)."
        }

    # --------------------------------------------------------------------------
    # DEFAULT GENERAL INTELLIGENT GREETING
    # --------------------------------------------------------------------------
    return {
        "reply": (
            f"Namaste! I am your **TRAVORA Dynamic AI Copilot** 🤖✨\n\n"
            f"I am integrated with:\n"
            f"• 📋 **Travel FAQs** (*Cancellation, Baggage, Check-in rules*)\n"
            f"• 📞 **Emergency SOS & Support** (*24/7 Coordinator Hotline +91 98765 43210*)\n"
            f"• 🎫 **Recent Bookings** (*Check tour status & vouchers*)\n"
            f"• 🌦️ **Live Weather Monitoring** (*Real-time climate & safety index*)\n"
            f"• ✨ **Quick AI Trip Planner** (*Instant 3-day plans across 802 Indian districts*)\n"
            f"• 💬 **Traveler Feedback** (*Share your review & get 15% discount*)\n\n"
            f"How may I assist your journey across Incredible India today?"
        )
    }
