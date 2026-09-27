"""
TRAVORA FESTIVAL INTELLIGENCE ENGINE DATABASE
Real-world festival calendar across Indian States & Districts
"""

FESTIVALS_CALENDAR = [
    {
        "id": "fest_ganesh",
        "name": "Ganesh Chaturthi",
        "state": "Maharashtra",
        "districts": ["Mumbai City", "Mumbai Suburban", "Pune", "Thane", "Raigad", "Sindhudurg", "North Goa"],
        "destinations": ["Mumbai", "Pune", "Goa", "Konkan"],
        "months": [8, 9],  # August - September
        "date_window": "Aug 25 - Sep 15",
        "description": "Maharashtra's grandest festival honoring Lord Ganesha with massive idol installations, vibrant dhol-tasha beats, and sea immersion processions.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 25,
        "key_experiences": [
            "Lalbaugcha Raja & Dagdusheth Halwai Ganpati Darshan",
            "Live Dhol-Tasha energy beats & street cultural performances",
            "Authentic Ukadiche Modak tasting trail",
            "Girgaon Chowpatty / Arabian Sea Visarjan procession experience"
        ],
        "accommodation_advice": "High hotel demand near Central Mumbai and South Pune. Early booking strongly advised.",
        "itinerary_impact": "Adds dedicated evening cultural Darshan slot, expands transit buffers around immersion routes by +45 mins.",
        "special_package_title": "Grand Ganesh Chaturthi Cultural & Heritage Immersion"
    },
    {
        "id": "fest_durga_puja",
        "name": "Durga Puja (Sharadotsav)",
        "state": "West Bengal",
        "districts": ["Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas", "Hooghly"],
        "destinations": ["Kolkata", "Bengal"],
        "months": [9, 10],  # September - October
        "date_window": "Sep 20 - Oct 25",
        "description": "UNESCO Intangible Cultural Heritage: Kolkata transforms into a world-famous open-air art gallery with thousands of architectural theme pandals.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 30,
        "key_experiences": [
            "All-night heritage pandal-hopping VIP pass trail",
            "Dhunuchi Naach rhythmic dance with dhak drummers",
            "Authentic Bengali festive feast (Bhog & street rolls at Park Street)",
            "Kumartuli idol artisans workshop walk"
        ],
        "accommodation_advice": "Central Kolkata hotels fill fast. Recommended central boutique stays with guided night transit.",
        "itinerary_impact": "Includes evening/midnight pandal trails, coordinated VIP vehicle access through traffic diversions.",
        "special_package_title": "Kolkata Durga Puja Heritage & Pandal Artistry Tour"
    },
    {
        "id": "fest_navratri",
        "name": "Navratri & Garba Raas",
        "state": "Gujarat",
        "districts": ["Ahmedabad", "Vadodara", "Surat", "Rajkot", "Gandhinagar"],
        "destinations": ["Ahmedabad", "Vadodara", "Gujarat"],
        "months": [9, 10],
        "date_window": "Sep 25 - Oct 28",
        "description": "The world's longest dance festival: 9 nights of synchronized Garba and Dandiya Raas in colorful Chaniya Cholis and Kediyus.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 20,
        "key_experiences": [
            "United Way & GMDC Ground VIP Garba pass access",
            "Traditional Gujarati Kathiyawadi midnight food walks",
            "Artisanal Bandhani & mirror-work shopping trail",
            "Heritage stepwell illumination evening tour"
        ],
        "accommodation_advice": "Hotels near SG Highway and Vadodara Palace grounds have surging occupancy.",
        "itinerary_impact": "Shifts major activities to late evening/night (08:30 PM - 01:30 AM), afternoon relaxed pacing.",
        "special_package_title": "Gujarat Vibrant Navratri & Royal Garba Experience"
    },
    {
        "id": "fest_rann_utsav",
        "name": "Rann Utsav (White Desert Festival)",
        "state": "Gujarat",
        "districts": ["Kutch"],
        "destinations": ["Kutch", "Bhuj", "Gujarat"],
        "months": [11, 12, 1, 2],  # Nov to Feb
        "date_window": "Nov 01 - Feb 28",
        "description": "A magical carnival of music, desert dance, and handicrafts under the moonlit white salt marshes of the Great Rann of Kutch.",
        "crowd_factor": "High",
        "pricing_surge_pct": 25,
        "key_experiences": [
            "Full moon midnight walk on sparkling White Salt Desert",
            "Luxury desert tent city stay with Kutchi folk recitals",
            "ATV desert biking, paramotoring & camel cart ride",
            "Kala Dungar (Black Hill) panoramic sunset & handicraft villages"
        ],
        "accommodation_advice": "Tent City Dhordo requires advance reservation. Certified desert camps equipped with room heating.",
        "itinerary_impact": "Integrates sunset white desert excursion, moonrise viewing, and artisan village trails.",
        "special_package_title": "White Desert Rann Utsav Full Moon Celebration"
    },
    {
        "id": "fest_dev_deepawali",
        "name": "Dev Deepawali (Festival of Gods)",
        "state": "Uttar Pradesh",
        "districts": ["Varanasi"],
        "destinations": ["Varanasi", "Kashi"],
        "months": [11],
        "date_window": "Nov 05 - Nov 28",
        "description": "Occurring on Kartik Purnima, all 84 ghats of Varanasi are illuminated with more than a million glittering earthen diyas.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 35,
        "key_experiences": [
            "Exclusive boat ride on River Ganges viewing 84 illuminated ghats",
            "Dashashwamedh Ghat Grand Maha Aarti with Vedic fire rituals",
            "Spectacular laser and sound projection show over Chet Singh Ghat",
            "Morning Subah-e-Banaras classical music & sunrise boat glide"
        ],
        "accommodation_advice": "River-facing heritage havelis are locked months ahead. Early booking premium applies.",
        "itinerary_impact": "Includes chartered evening Ganges boat, priority ghat seating, and heritage walking guides.",
        "special_package_title": "Varanasi Dev Deepawali Million Diyas & Ganga Aarti Tour"
    },
    {
        "id": "fest_chhath",
        "name": "Chhath Puja",
        "state": "Bihar",
        "districts": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Vaishali"],
        "destinations": ["Patna", "Bihar", "Gaya"],
        "months": [10, 11],
        "date_window": "Oct 25 - Nov 20",
        "description": "Ancient Vedic festival dedicated to Surya and Usha, celebrated with rigorous fasting and sacred offerings on riverbanks.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 15,
        "key_experiences": [
            "Ganges riverbank Arghya sunrise & sunset ceremonial views",
            "Traditional Thekua Prasad culinary preparation",
            "Illuminated river ghat walk and folk devotional hymns",
            "Nalanda & Rajgir spiritual heritage excursion"
        ],
        "accommodation_advice": "Patna city hotels experience regional festive family surge.",
        "itinerary_impact": "Schedules sunrise and twilight ghat viewing, incorporates regional festive cuisine.",
        "special_package_title": "Sacred Chhath Mahaparv & Cultural Bihar Journey"
    },
    {
        "id": "fest_onam",
        "name": "Onam & Vallam Kali (Snake Boat Race)",
        "state": "Kerala",
        "districts": ["Alappuzha", "Ernakulam", "Kottayam", "Thrissur", "Thiruvananthapuram"],
        "destinations": ["Kerala", "Alleppey", "Kochi", "Munnar"],
        "months": [8, 9],
        "date_window": "Aug 20 - Sep 15",
        "description": "Kerala's harvest homecoming festival featuring massive 100-oarsmen snake boat races, Athapookkalam floral carpets, and grand Onasadya feasts.",
        "crowd_factor": "High",
        "pricing_surge_pct": 20,
        "key_experiences": [
            "Nehru Trophy Vallam Kali Snake Boat Race VIP pavilion view",
            "26-dish traditional Onasadya served on plantain leaves",
            "Pulikali Tiger dance & Kathakali cultural performances in Thrissur",
            "Private luxury backwater cruise during festive season"
        ],
        "accommodation_advice": "Alleppey houseboats and heritage backwater resorts fill up for the boat races.",
        "itinerary_impact": "Coordinates timing around race heats, embeds authentic Onasadya feast on Day 2.",
        "special_package_title": "Kerala Royal Onam & Snake Boat Race Expedition"
    },
    {
        "id": "fest_bihu",
        "name": "Rongali Bihu",
        "state": "Assam",
        "districts": ["Kamrup Metropolitan", "Guwahati", "Jorhat", "Dibrugarh", "Majuli"],
        "destinations": ["Assam", "Guwahati", "Kaziranga"],
        "months": [4],
        "date_window": "Apr 10 - Apr 22",
        "description": "Assamese spring new year carnival celebrated with energetic Bihu dance, Pepa buffalo horn music, and Dhol beats.",
        "crowd_factor": "Moderate",
        "pricing_surge_pct": 15,
        "key_experiences": [
            "Open-air Bihu Husori folk dance & musical recitals",
            "Kaziranga National Park Rhino Jeep Safari",
            "Traditional Pitha & Laru sweet delicacy tastings",
            "Brahmaputra River sunset cruise with folk performances"
        ],
        "accommodation_advice": "Eco-resorts near Kaziranga and Guwahati city centers recommended.",
        "itinerary_impact": "Includes Kaziranga safari morning and evening cultural Bihu celebrations.",
        "special_package_title": "Assam Rongali Bihu & Kaziranga Wildlife Safari"
    },
    {
        "id": "fest_rath_yatra",
        "name": "Jagannath Puri Rath Yatra",
        "state": "Odisha",
        "districts": ["Puri", "Khordha"],
        "destinations": ["Puri", "Bhubaneswar", "Odisha"],
        "months": [6, 7],
        "date_window": "Jun 20 - Jul 15",
        "description": "The world-renowned Chariot Festival where Lord Jagannath, Balabhadra, and Subhadra travel on colossal decorated wooden chariots.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 35,
        "key_experiences": [
            "Grand Badadanda chariot pulling & viewing arrangements",
            "Puri Golden Beach sunset and sand art exhibitions",
            "Konark Sun Temple architectural evening light & sound show",
            "Authentic Mahaprasad Chhappan Bhog culinary experience"
        ],
        "accommodation_advice": "Puri sea-facing hotels must be booked months in advance due to millions of pilgrims.",
        "itinerary_impact": "Provides organized private transport with special entry zones, buffer transit.",
        "special_package_title": "Puri Jagannath Rath Yatra & Konark Sun Temple Trail"
    },
    {
        "id": "fest_janmashtami",
        "name": "Krishna Janmashtami & Dahi Handi",
        "state": "Uttar Pradesh",
        "districts": ["Mathura", "Agra", "Mumbai City", "Thane"],
        "destinations": ["Mathura", "Vrindavan", "Mumbai"],
        "months": [8, 9],
        "date_window": "Aug 15 - Sep 05",
        "description": "The birth celebration of Lord Krishna celebrated with midnight deity abhishekams, Rasleela theater, and high human pyramid Dahi Handi.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 25,
        "key_experiences": [
            "Shri Krishna Janmabhoomi midnight temple darshan",
            "Prem Mandir & Banke Bihari Vrindavan festive illumination",
            "Witness thrilling 9-tier human pyramid Dahi Handi contests",
            "Traditional Mathura Peda & Makhan Mishri tasting"
        ],
        "accommodation_advice": "Mathura and Vrindavan boutique ashrams and 3-4 star hotels have surge pricing.",
        "itinerary_impact": "Adds temple midnight ceremony and special Darshan queue guidance.",
        "special_package_title": "Mathura Vrindavan Janmashtami Devotion & Heritage Tour"
    },
    {
        "id": "fest_holi",
        "name": "Braj Ki Holi (Lathmar & Phoolon Ki Holi)",
        "state": "Uttar Pradesh",
        "districts": ["Mathura", "Agra"],
        "destinations": ["Vrindavan", "Mathura", "Barsana"],
        "months": [3],
        "date_window": "Mar 05 - Mar 25",
        "description": "India's most joyful and vibrant celebration: organic gulal, flower petal showers (Phoolon ki Holi), and traditional folk singing.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 30,
        "key_experiences": [
            "Banke Bihari Temple Phoolon Wali Holi (flower petals festival)",
            "Barsana famous Lathmar Holi spectacle",
            "Traditional Thandai & Gujiya festive tasting",
            "Heritage guided photo walks with safe herbal gulal"
        ],
        "accommodation_advice": "High photographer and international tourist traffic. Protective gear and escort included.",
        "itinerary_impact": "Assigns certified local escort, safe zones for color play, and evening cleanup lounges.",
        "special_package_title": "Braj Heritage Holi & Royal Cultural Celebration"
    },
    {
        "id": "fest_lohri",
        "name": "Lohri & Maghi",
        "state": "Punjab",
        "districts": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
        "destinations": ["Amritsar", "Punjab"],
        "months": [1],
        "date_window": "Jan 10 - Jan 18",
        "description": "Winter harvest bonfire festival celebrated with joyful Bhangra, Giddha, Sarson da Saag with Makki di Roti, and kite flying.",
        "crowd_factor": "Moderate",
        "pricing_surge_pct": 15,
        "key_experiences": [
            "Golden Temple evening illumination & sacred lake parikrama",
            "Village farmstay bonfire night with live Giddha & Dhol",
            "Authentic Amritsari Kulcha & Sarson da Saag farm feast",
            "Wagah Border flag lowering ceremony with VIP passes"
        ],
        "accommodation_advice": "Comfortable boutique stays near Golden Temple and heritage Punjabi farm retreats.",
        "itinerary_impact": "Evening bonfire festival setup with dinner, Wagah border afternoon trip.",
        "special_package_title": "Punjab Royal Lohri Bonfire & Golden Temple Experience"
    },
    {
        "id": "fest_guru_nanak",
        "name": "Guru Nanak Gurpurab (Prakash Utsav)",
        "state": "Punjab",
        "districts": ["Amritsar", "Kapurthala", "Gurdaspur"],
        "destinations": ["Amritsar", "Punjab"],
        "months": [11],
        "date_window": "Nov 10 - Nov 30",
        "description": "The sacred birth anniversary of Guru Nanak Dev Ji celebrated with breathtaking Golden Temple illumination, fireworks, and 24/7 Langar.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 25,
        "key_experiences": [
            "Golden Temple magical deepmala lighting and midnight fireworks",
            "Participate in sacred Guru Ram Das Langar seva",
            "Nagar Kirtan grand religious procession led by Panj Pyare",
            "Heritage heritage walk through Amritsar old katras"
        ],
        "accommodation_advice": "Hotels within 1 km of Sri Harmandir Sahib get booked out quickly.",
        "itinerary_impact": "Includes spiritual night walk, volunteer seva slot, and historical Gurdwara circuit.",
        "special_package_title": "Amritsar Prakash Utsav Spiritual Pilgrimage"
    },
    {
        "id": "fest_christmas",
        "name": "Christmas & New Year Festivities",
        "state": "Sikkim",
        "districts": ["Gangtok", "South Goa", "North Goa", "Shillong"],
        "destinations": ["Gangtok", "Goa", "Shillong"],
        "months": [12, 1],
        "date_window": "Dec 20 - Jan 03",
        "description": "Festive winter wonderland with illuminated cathedrals, midnight choir masses, street carnivals, and live beach concerts.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 35,
        "key_experiences": [
            "Se Cathedral Old Goa midnight mass & illuminated historic churches",
            "MG Marg Gangtok winter carnival & Himalayan band concerts",
            "New Year beach shack fireworks and starlight dining",
            "Traditional plum cake and Goan bebinca tastings"
        ],
        "accommodation_advice": "Peak holiday premium season. Mandatory gala dinner supplements may apply.",
        "itinerary_impact": "Includes midnight mass visit, festive beach dinner, and winter sightseeing.",
        "special_package_title": "Goa & Gangtok Festive Winter Carnival & New Year Gala"
    },
    {
        "id": "fest_ram_navami",
        "name": "Ram Navami & Ayodhya Deepotsav",
        "state": "Uttar Pradesh",
        "districts": ["Ayodhya"],
        "destinations": ["Ayodhya", "Lucknow"],
        "months": [3, 4],
        "date_window": "Mar 25 - Apr 20",
        "description": "Grand celebrations at the Ram Janmabhoomi Mandir featuring Surya Tilak ceremony, Saryu river aarti, and colorful chariot processions.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 30,
        "key_experiences": [
            "Shri Ram Janmabhoomi Temple Surya Tilak darshan",
            "Evening Saryu River Maha Aarti & illuminated ghat walk",
            "Hanuman Garhi & Kanak Bhavan historic temple visit",
            "Awadhi vegetarian festive cuisine tasting"
        ],
        "accommodation_advice": "Rapidly growing hotel sector in Ayodhya. Certified hotels and premium tent cottages available.",
        "itinerary_impact": "Priority temple darshan assistance, morning Saryu boat ride, and serene evening aarti.",
        "special_package_title": "Divine Ayodhya Ram Navami & Heritage Pilgrimage"
    },
    {
        "id": "fest_uttarayan",
        "name": "International Kite Festival (Uttarayan)",
        "state": "Gujarat",
        "districts": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
        "destinations": ["Ahmedabad", "Gujarat"],
        "months": [1],
        "date_window": "Jan 10 - Jan 16",
        "description": "Skies filled with millions of kites, friendly 'Kai Po Che' battles from heritage haveli rooftops, illuminated Tukkals (lanterns) at night.",
        "crowd_factor": "High",
        "pricing_surge_pct": 20,
        "key_experiences": [
            "Old City heritage haveli rooftop kite-flying with local family",
            "Sabarmati Riverfront International Kite Flying Pavilion",
            "Authentic festive Undhiyu & Jalebi seasonal feast",
            "Midnight night-sky Tukkal lanterns celebration"
        ],
        "accommodation_advice": "Heritage havelis in the Old Pols offer authentic rooftop packages.",
        "itinerary_impact": "Rooftop kite flying session included on Day 2, evening Sabarmati walk.",
        "special_package_title": "Ahmedabad Uttarayan Kite Festival & Pols Heritage Walk"
    },
    {
        "id": "fest_char_dham",
        "name": "Char Dham Yatra Opening",
        "state": "Uttarakhand",
        "districts": ["Chamoli", "Rudraprayag", "Uttarkashi", "Haridwar", "Dehradun"],
        "destinations": ["Rishikesh", "Kedarnath", "Badrinath", "Uttarakhand"],
        "months": [4, 5, 6, 9, 10],
        "date_window": "May 01 - Oct 31",
        "description": "Sacred Himalayan pilgrimage across Kedarnath, Badrinath, Gangotri, and Yamunotri nestled in the Garhwal Himalayas.",
        "crowd_factor": "Very High",
        "pricing_surge_pct": 30,
        "key_experiences": [
            "Kedarnath Jyotirlinga high-altitude temple darshan (11,755 ft)",
            "Badrinath Temple & Tapt Kund natural hot springs bath",
            "Mana - The Last Indian Village & Saraswati River origin walk",
            "Helicopter shuttle or scenic pony/palki mountain trail"
        ],
        "accommodation_advice": "High-altitude mountain lodges have strictly limited inventory. Biometric registration mandatory.",
        "itinerary_impact": "Incorporates weather-contingency days, mountain vehicle permit checks, and acclimatization stops.",
        "special_package_title": "Sacred Char Dham & Kedarnath Badrinath Himalayan Odyssey"
    },
    {
        "id": "fest_pushkar",
        "name": "Pushkar Camel & Cultural Fair",
        "state": "Rajasthan",
        "districts": ["Ajmer", "Jaipur"],
        "destinations": ["Jaipur", "Pushkar", "Ajmer", "Rajasthan"],
        "months": [10, 11],
        "date_window": "Nov 05 - Nov 22",
        "description": "One of India's most iconic spectacles: thousands of decorated camels, turbans, mustache competitions, and hot air balloons.",
        "crowd_factor": "High",
        "pricing_surge_pct": 25,
        "key_experiences": [
            "Hot Air Balloon flight over Pushkar sand dunes at sunrise",
            "Pushkar Sacred Lake Brahma Temple morning parikrama",
            "Camel beauty contests, folk music & turban-tying competitions",
            "Desert camp glamping under starry Rajasthan night skies"
        ],
        "accommodation_advice": "Heritage desert resorts and luxury tented encampments booked 3 months prior.",
        "itinerary_impact": "Includes hot air balloon slot and afternoon desert fairground access.",
        "special_package_title": "Pushkar Royal Camel Fair & Desert Glamping Safari"
    },
    {
        "id": "fest_hornbill",
        "name": "Hornbill Festival (Festival of Festivals)",
        "state": "Nagaland",
        "districts": ["Kohima", "Dimapur"],
        "destinations": ["Kohima", "Nagaland", "North-East"],
        "months": [12],
        "date_window": "Dec 01 - Dec 10",
        "description": "All 17 Naga indigenous tribes come together at Kisama Heritage Village to showcase rich warrior heritage, dances, songs, and traditional sports.",
        "crowd_factor": "High",
        "pricing_surge_pct": 30,
        "key_experiences": [
            "Kisama Naga Heritage Village traditional morungs exploration",
            "Tribal war dance & indigenous archery / fire-making contests",
            "Authentic Naga smoked pork, bamboo shoot & King Chilli cuisine",
            "Hornbill International Rock Concert night sessions"
        ],
        "accommodation_advice": "Kohima boutique homestays and glamping tents are in high demand.",
        "itinerary_impact": "Full-day cultural festival access and evening international music concert pass.",
        "special_package_title": "Nagaland Hornbill Tribal Grandeur & Cultural Immersion"
    },
    {
        "id": "fest_hemis",
        "name": "Hemis Monastery Tsechu Festival",
        "state": "Ladakh",
        "districts": ["Leh"],
        "destinations": ["Ladakh", "Leh", "Kashmir"],
        "months": [6, 7],
        "date_window": "Jun 25 - Jul 15",
        "description": "Tribute to Guru Padmasambhava at the 300-year-old Hemis Monastery featuring sacred Cham masked dances and vibrant silk thangkas.",
        "crowd_factor": "High",
        "pricing_surge_pct": 20,
        "key_experiences": [
            "Sacred Cham masked tantric dance in Hemis courtyard",
            "Unfurling of the legendary two-storey high silk Padmasambhava Thangka",
            "Pangong Tso high-altitude lake excursion",
            "Traditional Ladakhi butter tea and Thukpa tasting"
        ],
        "accommodation_advice": "Acclimatization day required in Leh before visiting high altitude monasteries.",
        "itinerary_impact": "Day 1 strictly rest & acclimatize; Day 2 full day Hemis monastery festival.",
        "special_package_title": "Ladakh Hemis Festival & High-Altitude Lake Odyssey"
    }
]

def check_festivals_for_trip(arg1: str, arg2: str, arg3: str):
    """
    Festival-aware travel planning engine.
    Matches destination/district AND travel dates against the festival calendar.
    Accepts (destination_name, start_date, end_date) or (start_date, end_date, destination_name).
    """
    from datetime import datetime
    
    # Intelligently detect parameter order
    if "-" in arg1 and len(arg1) == 10 and "-" in arg2 and len(arg2) == 10:
        start_date_str, end_date_str, destination_name = arg1, arg2, arg3
    elif "-" in arg2 and len(arg2) == 10 and "-" in arg3 and len(arg3) == 10:
        destination_name, start_date_str, end_date_str = arg1, arg2, arg3
    else:
        destination_name, start_date_str, end_date_str = str(arg1), str(arg2), str(arg3)

    detected = []
    try:
        d_start = datetime.strptime(start_date_str, "%Y-%m-%d")
        d_end = datetime.strptime(end_date_str, "%Y-%m-%d")
        start_month = d_start.month
        end_month = d_end.month
        trip_months = list(range(start_month, end_month + 1)) if end_month >= start_month else [start_month, end_month]
    except Exception:
        trip_months = [9]  # Default September
        
    dest_clean = str(destination_name).lower()
    
    for f in FESTIVALS_CALENDAR:
        # Check destination or district relevance
        dest_match = any(d.lower() in dest_clean or dest_clean in d.lower() for d in f["destinations"])
        district_match = any(dist.lower() in dest_clean for dist in f["districts"])
        
        # Check date/month overlap
        month_match = any(m in f["months"] for m in trip_months)
        
        if (dest_match or district_match) and month_match:
            detected.append({
                **f,
                "is_active_during_trip": True,
                "advisory": f"Festival Alert: {f['name']} occurs during your travel window in {f['state']}. Expect vibrant celebrations, +{f['pricing_surge_pct']}% accommodation demand, and memorable cultural events."
            })
            
    return detected
