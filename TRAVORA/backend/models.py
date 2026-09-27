from sqlalchemy import Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="traveler")  # 'traveler' or 'operator'
    password_hash = Column(String, nullable=False, default="")
    phone = Column(String, nullable=True)
    
    # Operator specific profile attributes
    company_name = Column(String, nullable=True)
    specialties = Column(String, nullable=True)  # comma-separated e.g. "Beach, Adventure, Scuba Diving"
    operating_destinations = Column(String, nullable=True)  # comma-separated e.g. "Goa, Mumbai, Jaipur"
    rating = Column(Float, default=4.8)
    tours_completed = Column(Integer, default=120)
    fleet_size = Column(String, default="12 Vehicles")
    response_time_minutes = Column(Integer, default=5)
    badge = Column(String, default="Verified Partner")
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tours = relationship("Tour", back_populates="user", foreign_keys="Tour.user_id")
    bookings = relationship("Booking", back_populates="user")
    reviews = relationship("Review", back_populates="user", foreign_keys="Review.user_id")
    notifications = relationship("Notification", back_populates="user")

class Destination(Base):
    __tablename__ = "destinations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    state = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=False)
    starting_price = Column(Float, nullable=False)
    travel_styles = Column(String, nullable=False)  # comma-separated e.g. "Beach,Adventure,Food"
    match_score = Column(Integer, default=90)
    lat = Column(Float, default=15.2993)
    lng = Column(Float, default=74.1240)
    popular_season = Column(String, default="Oct - Mar")
    tags = Column(String, default="Trending,Popular")

class Hotel(Base):
    __tablename__ = "hotels"
    
    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    name = Column(String, nullable=False)
    stars = Column(Integer, default=3)
    price_per_night = Column(Float, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    address = Column(String, nullable=False)
    amenities = Column(String, default="WiFi,Breakfast,Pool,AC")
    image_url = Column(String, nullable=False)
    rating = Column(Float, default=4.5)
    category = Column(String, default="3-Star")  # Budget, 3-Star, 4-Star, 5-Star Resort, Boutique
    availability_status = Column(String, default="available")  # 'available', 'limited', 'unavailable'
    beach_proximity = Column(String, default="500m")

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Adventure, Beach, Heritage, Food, Nightlife, Nature
    duration_hours = Column(Float, default=2.5)
    price = Column(Float, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String, nullable=False)
    rating = Column(Float, default=4.7)
    time_slot_default = Column(String, default="Morning")  # Morning, Afternoon, Evening

class Transport(Base):
    __tablename__ = "transports"
    
    id = Column(Integer, primary_key=True, index=True)
    transport_type = Column(String, nullable=False)  # 'Volvo Bus', 'Express Train', 'Flight', 'Private Cab'
    from_city = Column(String, default="Mumbai")
    to_destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    base_price = Column(Float, nullable=False)
    duration_hours = Column(Float, default=8.0)
    operator_name = Column(String, default="Travora Express Lines")

class Tour(Base):
    __tablename__ = "tours"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)  # e.g. TR1024
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Assigned/Selected Tour Operator
    title = Column(String, nullable=False)
    duration_days = Column(Integer, default=4)
    travelers_count = Column(Integer, default=2)
    budget_total = Column(Float, default=25000.0)
    estimated_cost = Column(Float, default=20500.0)
    status = Column(String, default="active")  # 'draft', 'planned', 'booked', 'active', 'attention', 'disrupted', 'completed'
    travel_style = Column(String, default="Beach + Adventure + Food")
    accommodation_type = Column(String, default="3-Star")
    transport_type = Column(String, default="Volvo Bus")
    start_date = Column(String, default="2026-09-12")
    end_date = Column(String, default="2026-09-15")
    match_percentage = Column(Integer, default=92)
    coordinator_name = Column(String, default="Aarav Mehta")
    desired_places = Column(Text, nullable=True)  # Real-time sensed requested landmarks/spots
    ai_recommendation_reason = Column(Text, nullable=True)  # AI Matchmaking explanation
    package_type = Column(String, default="customized")  # 'standard', 'customized', 'festival', 'group', 'private'
    is_private = Column(Boolean, default=False)
    festival_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="tours", foreign_keys=[user_id])
    operator = relationship("User", foreign_keys=[operator_id])
    destination = relationship("Destination")
    itinerary_items = relationship("ItineraryItem", back_populates="tour", cascade="all, delete-orphan")
    change_events = relationship("ChangeEvent", back_populates="tour", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="tour")

class ItineraryItem(Base):
    __tablename__ = "itinerary_items"
    
    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False)
    day_number = Column(Integer, nullable=False)  # 1, 2, 3, 4
    item_type = Column(String, nullable=False)  # 'transport', 'hotel', 'activity', 'food'
    title = Column(String, nullable=False)
    subtitle = Column(String, nullable=True)
    time_start = Column(String, default="09:00 AM")
    time_end = Column(String, default="11:30 AM")
    cost = Column(Float, default=0.0)
    location_name = Column(String, default="Goa")
    lat = Column(Float, default=15.5494)
    lng = Column(Float, default=73.7535)
    icon = Column(String, default="map-pin")
    is_disrupted = Column(Boolean, default=False)
    disruption_note = Column(String, nullable=True)
    replacement_status = Column(String, default="normal")  # 'normal', 'affected', 'replaced'
    order_index = Column(Integer, default=0)
    
    tour = relationship("Tour", back_populates="itinerary_items")

class ChangeEvent(Base):
    __tablename__ = "change_events"
    
    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False)
    disrupted_item_id = Column(Integer, ForeignKey("itinerary_items.id"), nullable=True)
    event_type = Column(String, default="hotel_cancellation")  # hotel_cancellation, transport_delay, weather_alert
    status = Column(String, default="pending")  # 'pending', 'resolved', 'rejected'
    severity = Column(String, default="critical")  # 'critical', 'warning', 'info'
    title = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    impact_summary = Column(Text, nullable=False)
    affected_accommodation = Column(String, default="Day 2 Hotel XYZ")
    affected_checkin = Column(String, default="Check-in affected (Delay +30m)")
    affected_transport = Column(String, default="Minor cab rerouting required (+2.1 km)")
    cost_delta = Column(Float, default=900.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    
    tour = relationship("Tour", back_populates="change_events")
    alternatives = relationship("AlternativeOption", back_populates="change_event", cascade="all, delete-orphan")

class AlternativeOption(Base):
    __tablename__ = "alternative_options"
    
    id = Column(Integer, primary_key=True, index=True)
    change_event_id = Column(Integer, ForeignKey("change_events.id"), nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, default="3-Star Hotel")
    price_delta = Column(Float, default=900.0)  # +900 or -200
    distance_km = Column(Float, default=2.1)
    preference_match = Column(Integer, default=92)
    budget_match = Column(Integer, default=90)
    location_match = Column(Integer, default=95)
    availability_match = Column(Integer, default=100)
    time_match = Column(Integer, default=94)
    overall_score = Column(Integer, default=94)  # Weighted calculation
    is_recommended = Column(Boolean, default=False)
    is_selected = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    beach_proximity = Column(String, default="250m to Baga Beach")
    checkin_compatible = Column(Boolean, default=True)
    image_url = Column(String, default="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600")
    
    change_event = relationship("ChangeEvent", back_populates="alternatives")

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_code = Column(String, unique=True, index=True, nullable=False)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount_paid = Column(Float, default=20500.0)
    payment_method = Column(String, default="UPI")  # 'UPI', 'Card', 'NetBanking', 'EMI'
    base_price = Column(Float, default=17500.0)
    taxes = Column(Float, default=2100.0)
    service_fee = Column(Float, default=900.0)
    discount = Column(Float, default=0.0)
    final_total = Column(Float, default=20500.0)
    transaction_ref = Column(String, nullable=True)
    payment_status = Column(String, default="completed")  # 'completed', 'pending', 'refunded'
    booking_status = Column(String, default="confirmed")  # 'confirmed', 'modified', 'cancelled'
    trip_completed = Column(Boolean, default=False)
    post_trip_reviewed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tour = relationship("Tour", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    subtotal = Column(Float, default=17500.0)
    taxes = Column(Float, default=2100.0)
    service_fee = Column(Float, default=900.0)
    discount = Column(Float, default=0.0)
    total = Column(Float, default=20500.0)
    method = Column(String, default="UPI")
    status = Column(String, default="Success")
    transaction_ref = Column(String, default="TXN-TRV-89421")
    upi_id = Column(String, nullable=True)
    card_last4 = Column(String, nullable=True)
    bank_name = Column(String, nullable=True)
    verified_at = Column(DateTime, default=datetime.utcnow)
    gateway_signature = Column(String, default="VERIFIED_SIG_TRV_SUCCESS")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    booking = relationship("Booking", back_populates="payments")

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # 'Hotels', 'Transport', 'Activities', 'Guides', 'Restaurants'
    rating = Column(Float, default=4.8)
    availability = Column(String, default="High")
    price_range = Column(String, default="Rs Rs Rs ")
    status = Column(String, default="Active")
    contact = Column(String, default="+91 98201 54321")
    location = Column(String, default="North Goa")
    fleet_or_inventory = Column(String, default="42 Rooms / 10 Shuttles")

class TourGroup(Base):
    __tablename__ = "tour_groups"
    
    id = Column(Integer, primary_key=True, index=True)
    group_code = Column(String, unique=True, index=True, nullable=False)
    tour_title = Column(String, nullable=False)
    members_count = Column(Integer, default=18)
    coordinator_name = Column(String, default="Aarav Mehta")
    transport_info = Column(String, default="Volvo Luxury Coach #GA-03-9912")
    hotel_info = Column(String, default="Hotel Paradise Goa")
    status = Column(String, default="Active")

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    review_type = Column(String, default="operator")  # 'operator' or 'platform'
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    overall_rating = Column(Float, default=5.0)
    hotel_rating = Column(Float, default=4.8)
    activity_rating = Column(Float, default=5.0)
    transport_rating = Column(Float, default=4.7)
    operator_rating = Column(Float, default=5.0)
    communication_rating = Column(Float, default=5.0)
    itinerary_rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="reviews", foreign_keys=[user_id])

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    role = Column(String, default="traveler")  # 'traveler', 'operator', 'business_operator', 'admin', 'all'
    tour_id = Column(Integer, nullable=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info")  # 'critical', 'warning', 'success', 'info'
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="notifications")

class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    district_code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, index=True, nullable=False)
    state = Column(String, index=True, nullable=False)
    region = Column(String, default="West")  # North, South, East, West, Central, North-East
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    terrain = Column(String, default="Heritage & Scenic")
    popular_season = Column(String, default="Oct - Mar")
    recommended_months = Column(String, default="October to March")
    tourist_places = Column(Text, nullable=True)  # JSON string
    heritage_places = Column(Text, nullable=True)
    religious_places = Column(Text, nullable=True)
    adventure_activities = Column(Text, nullable=True)
    cultural_experiences = Column(Text, nullable=True)
    festivals = Column(Text, nullable=True)
    transport_connectivity = Column(String, default="Direct Highway & Rail Transfer")
    is_featured = Column(Boolean, default=False)

class Festival(Base):
    __tablename__ = "festivals"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    districts = Column(Text, nullable=False)  # JSON or comma-separated
    destinations = Column(Text, nullable=False)
    months = Column(String, default="9,10")
    date_window = Column(String, default="Sep 15 - Oct 15")
    description = Column(Text, nullable=False)
    crowd_factor = Column(String, default="High")
    pricing_surge_pct = Column(Integer, default=20)
    key_experiences = Column(Text, nullable=True)
    accommodation_advice = Column(Text, nullable=True)
    itinerary_impact = Column(Text, nullable=True)
    special_package_title = Column(String, nullable=True)

class OperatorPackage(Base):
    __tablename__ = "operator_packages"
    
    id = Column(Integer, primary_key=True, index=True)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    package_type = Column(String, default="standard")  # 'standard', 'customized', 'festival', 'group', 'private'
    destination_name = Column(String, nullable=False)
    district_name = Column(String, nullable=True)
    state = Column(String, nullable=True)
    duration_days = Column(Integer, default=4)
    capacity = Column(Integer, default=20)
    available_seats = Column(Integer, default=15)
    base_price = Column(Float, default=18500.0)
    travel_style = Column(String, default="Beach, Adventure, Food")
    accommodation_type = Column(String, default="3-Star")
    transport_type = Column(String, default="Volvo Bus")
    places_covered = Column(Text, nullable=True)
    highlights = Column(Text, nullable=True)
    festival_id = Column(String, nullable=True)
    is_group = Column(Boolean, default=False)
    is_private = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    operator = relationship("User", foreign_keys=[operator_id])

class PlaceRequest(Base):
    __tablename__ = "place_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    tour_id = Column(Integer, ForeignKey("tours.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    place_name = Column(String, nullable=False)
    requested_day = Column(Integer, default=2)
    status = Column(String, default="pending")  # 'pending', 'approved', 'modified', 'rejected'
    impact_cost_transport = Column(Float, default=1200.0)
    impact_cost_activity = Column(Float, default=500.0)
    impact_cost_meal = Column(Float, default=300.0)
    impact_cost_total = Column(Float, default=2000.0)
    impact_time_hours = Column(Float, default=3.0)
    impact_distance_km = Column(Float, default=18.5)
    schedule_delay_note = Column(String, default="Next activity delayed by 1 hour")
    dependency_impact_note = Column(String, default="Transport rerouted; evening dinner delayed by 45 mins")
    operator_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    tour = relationship("Tour")
    user = relationship("User", foreign_keys=[user_id])
    operator = relationship("User", foreign_keys=[operator_id])

class CorporateBooking(Base):
    __tablename__ = "corporate_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String, nullable=False)
    employee_name = Column(String, nullable=False)
    employee_email = Column(String, nullable=False)
    department = Column(String, default="Executive Leadership")
    travel_purpose = Column(String, default="Strategic Client Review")
    origin = Column(String, default="Mumbai")
    destination = Column(String, default="Bengaluru")
    start_date = Column(String, default="2026-10-10")
    end_date = Column(String, default="2026-10-13")
    budget_limit = Column(Float, default=45000.0)
    estimated_cost = Column(Float, default=38000.0)
    hotel_name = Column(String, default="Grand Business Hotel & Suites")
    transport_mode = Column(String, default="Flight (Economy Flexi)")
    meeting_logistics = Column(String, default="8-seater boardroom reserved with video conferencing")
    approval_status = Column(String, default="approved")  # 'approved', 'pending', 'rejected'
    expense_status = Column(String, default="settled")   # 'submitted', 'approved', 'settled'
    policy_compliant = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String, nullable=False)  # 'tour', 'package', 'hotel', 'booking', 'place_request', 'disruption'
    entity_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False)
    before_state = Column(Text, nullable=True)
    after_state = Column(Text, nullable=True)
    reason = Column(Text, nullable=False)
    approved_by = Column(String, default="Traveller")
    timestamp = Column(DateTime, default=datetime.utcnow)

class PlatformFeedback(Base):
    __tablename__ = "platform_feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    booking_id = Column(Integer, nullable=True)
    app_experience_rating = Column(Float, default=5.0)
    booking_experience_rating = Column(Float, default=5.0)
    ui_rating = Column(Float, default=5.0)
    recommendation_quality_rating = Column(Float, default=5.0)
    payment_experience_rating = Column(Float, default=5.0)
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])
