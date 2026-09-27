from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# --- AUTH SCHEMAS ---
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "traveler"  # 'traveler' or 'operator'
    phone: Optional[str] = None
    # Operator specific fields
    company_name: Optional[str] = None
    specialties: Optional[str] = None
    operating_destinations: Optional[str] = None
    fleet_size: Optional[str] = None
    bio: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = None

class ResetPasswordRequest(BaseModel):
    email: str
    new_password: str

class UserBase(BaseModel):
    email: str
    name: str
    role: str = "traveler"
    phone: Optional[str] = None
    company_name: Optional[str] = None
    specialties: Optional[str] = None
    operating_destinations: Optional[str] = None
    rating: Optional[float] = 4.8
    tours_completed: Optional[int] = 120
    fleet_size: Optional[str] = "12 Vehicles"
    response_time_minutes: Optional[int] = 5
    badge: Optional[str] = "Verified Partner"
    bio: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- OPERATOR SCHEMAS ---
class OperatorMatchResponse(BaseModel):
    id: int
    name: str
    company_name: str
    email: str
    phone: str
    rating: float
    tours_completed: int
    fleet_size: str
    response_time_minutes: int
    badge: str
    bio: str
    specialties: List[str]
    operating_destinations: List[str]
    match_score: int
    is_recommended: bool = False
    ai_recommendation_reason: str

# --- PLAN TRIP SCHEMA ---
class PlanTripRequest(BaseModel):
    destination_name: str = "Goa"
    start_date: str = "2026-09-12"
    end_date: str = "2026-09-15"
    travelers_count: int = 2
    budget_total: float = 25000.0
    travel_style: str = "Beach + Adventure + Food"
    interests: List[str] = ["Beach", "Adventure", "Food"]
    accommodation_type: str = "3-Star"
    transport_type: str = "Volvo Bus"
    user_id: int = 1
    operator_id: Optional[int] = None  # User selected or AI matched operator
    desired_places: Optional[List[str]] = None  # Real-time sensed landmarks/spots
    custom_places_text: Optional[str] = None

# --- ITINERARY ITEM SCHEMA ---
class ItineraryItemSchema(BaseModel):
    id: Optional[int] = None
    day_number: int
    item_type: str
    title: str
    subtitle: Optional[str] = None
    time_start: str
    time_end: str
    cost: float
    location_name: str
    lat: float
    lng: float
    icon: str = "map-pin"
    is_disrupted: bool = False
    disruption_note: Optional[str] = None
    replacement_status: str = "normal"
    order_index: int = 0
    
    class Config:
        from_attributes = True

# --- ALTERNATIVE OPTION SCHEMA ---
class AlternativeOptionSchema(BaseModel):
    id: Optional[int] = None
    title: str
    category: str
    price_delta: float
    distance_km: float
    preference_match: int
    budget_match: int
    location_match: int
    availability_match: int
    time_match: int
    overall_score: int
    is_recommended: bool = False
    is_selected: bool = False
    description: Optional[str] = None
    beach_proximity: Optional[str] = None
    checkin_compatible: bool = True
    image_url: Optional[str] = None
    
    class Config:
        from_attributes = True

# --- CHANGE EVENT SCHEMA ---
class ChangeEventSchema(BaseModel):
    id: Optional[int] = None
    tour_id: int
    disrupted_item_id: Optional[int] = None
    event_type: str
    status: str
    severity: str
    title: str
    reason: str
    impact_summary: str
    affected_accommodation: Optional[str] = None
    affected_checkin: Optional[str] = None
    affected_transport: Optional[str] = None
    cost_delta: float = 0.0
    alternatives: List[AlternativeOptionSchema] = []
    
    class Config:
        from_attributes = True

# --- TOUR SCHEMAS ---
class TourSummaryResponse(BaseModel):
    id: int
    code: str
    title: str
    destination_name: str
    duration_days: int
    travelers_count: int
    budget_total: float
    estimated_cost: float
    status: str
    travel_style: str
    accommodation_type: str
    transport_type: str
    start_date: str
    end_date: str
    match_percentage: int
    coordinator_name: str
    customer_name: Optional[str] = "Krishna Singh"
    operator_id: Optional[int] = None
    operator_name: Optional[str] = None
    operator_company: Optional[str] = None
    desired_places: Optional[str] = None
    ai_recommendation_reason: Optional[str] = None
    
    class Config:
        from_attributes = True

class TourDetailResponse(TourSummaryResponse):
    itinerary_items: List[ItineraryItemSchema]
    change_events: List[ChangeEventSchema]
    cost_breakdown: Dict[str, float] = {}

# --- MUTATION REQUESTS ---
class AddItineraryItemRequest(BaseModel):
    day_number: int = 1
    title: str
    subtitle: Optional[str] = ""
    item_type: str = "activity"
    time_start: str = "02:00 PM"
    time_end: str = "04:30 PM"
    cost: float = 1200.0
    location_name: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    icon: Optional[str] = "sparkles"

class UpdateItemRequest(BaseModel):
    item_id: int
    new_title: Optional[str] = None
    new_cost: Optional[float] = None
    new_time_start: Optional[str] = None
    new_time_end: Optional[str] = None
    new_item_type: Optional[str] = None

class ApplyAlternativeRequest(BaseModel):
    change_event_id: int
    alternative_id: int

class BookTourRequest(BaseModel):
    tour_id: int
    user_id: int
    payment_method: str = "UPI / NetBanking"
    contact_phone: str = "+91 98765 43210"
    special_requests: Optional[str] = None

class AIChatRequest(BaseModel):
    message: str
    tour_id: Optional[int] = None
    context_type: Optional[str] = "traveler"

class ReviewRequest(BaseModel):
    tour_id: int
    user_id: int
    overall_rating: float
    hotel_rating: float
    activity_rating: float
    transport_rating: float
    operator_rating: float
    comment: str

# --- GENERIC CRUD PAYLOADS ---
class GenericCRUDRequest(BaseModel):
    data: Dict[str, Any]

class AlertOperatorRequest(BaseModel):
    tour_id: Optional[int] = 1
    reason: Optional[str] = "Traveller issue reported during trip disruption"
    message: Optional[str] = "Contact traveller: he/she has an issue"
    traveller_name: Optional[str] = None
    traveller_phone: Optional[str] = None

# --- DIGITAL TWIN SIMULATION SCHEMAS ---
class WhatIfSimulationRequest(BaseModel):
    destination_id: int = 1
    rainfall_mm_h: float = 25.0
    temperature_c: float = 28.0
    wind_speed_kmh: float = 35.0
    storm_duration_h: float = 4.0


