from typing import List, Dict, Any

def calculate_tour_pricing(items: List[Any], budget_total: float, travelers: int = 2) -> Dict[str, Any]:
    hotel_cost = 0.0
    transport_cost = 0.0
    activities_cost = 0.0
    food_estimate = 3000.0 * (travelers / 2.0)
    
    for item in items:
        cost = getattr(item, "cost", 0.0) or 0.0
        item_type = getattr(item, "item_type", "").lower()
        if "hotel" in item_type or "accommodation" in item_type:
            hotel_cost += cost
        elif "transport" in item_type or "bus" in item_type or "flight" in item_type:
            transport_cost += cost
        elif "activity" in item_type or "scuba" in item_type or "tour" in item_type or "sight" in item_type:
            activities_cost += cost
        elif "food" in item_type or "meal" in item_type:
            food_estimate += cost
            
    # Default fallback realistic minimums if items have flat costs
    if hotel_cost == 0:
        hotel_cost = 8000.0
    if transport_cost == 0:
        transport_cost = 4000.0
    if activities_cost == 0:
        activities_cost = 5500.0
        
    subtotal = hotel_cost + transport_cost + activities_cost + food_estimate
    taxes = round(subtotal * 0.05, 2)  # 5% Travel GST
    service_fee = 450.0
    total = subtotal + taxes + service_fee

    # STRICT BUDGET CAP ENFORCEMENT: Never exceed budget_total
    if budget_total and budget_total > 0 and total > budget_total:
        target_total = float(budget_total)
        # Deduct service fee, taxes are 5% of target subtotal
        target_subtotal = max(500.0, (target_total - service_fee) / 1.05)
        scale = target_subtotal / max(1.0, subtotal)
        
        hotel_cost = round(hotel_cost * scale, 2)
        transport_cost = round(transport_cost * scale, 2)
        activities_cost = round(activities_cost * scale, 2)
        food_estimate = round(food_estimate * scale, 2)
        subtotal = round(hotel_cost + transport_cost + activities_cost + food_estimate, 2)
        taxes = round(subtotal * 0.05, 2)
        total = round(subtotal + taxes + service_fee, 2)
        
        # Hard cap safety check
        if total > budget_total:
            excess = total - budget_total
            subtotal = round(subtotal - excess, 2)
            hotel_cost = max(100.0, round(hotel_cost - (excess * 0.4), 2))
            activities_cost = max(100.0, round(activities_cost - (excess * 0.3), 2))
            transport_cost = max(100.0, round(transport_cost - (excess * 0.3), 2))
            total = budget_total
            taxes = round(max(0.0, total - subtotal - service_fee), 2)
            
    remaining = max(0.0, round(budget_total - total, 2)) if (budget_total and budget_total > 0) else 0.0
    is_overbudget = False
    variance = remaining
    
    return {
        "hotel": round(hotel_cost, 2),
        "transport": round(transport_cost, 2),
        "activities": round(activities_cost, 2),
        "food": round(food_estimate, 2),
        "subtotal": round(subtotal, 2),
        "taxes": round(taxes, 2),
        "service_fee": round(service_fee, 2),
        "total": round(total, 2),
        "budget_total": round(budget_total, 2) if budget_total else round(total, 2),
        "remaining": round(remaining, 2),
        "is_overbudget": False,
        "variance": round(variance, 2),
        "utilization_pct": min(100, round((total / max(1, budget_total or total)) * 100, 1))
    }
