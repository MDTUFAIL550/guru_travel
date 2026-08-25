export const routeCategories = [
  { id: "all", label: "All Corridors" },
  { id: "bihar", label: "Bihar Local Routes" },
  { id: "hubs", label: "Patna Airport & Railway Hubs" },
  { id: "outstation", label: "Long-Distance & Outstation" },
  { id: "special", label: "Nepal & Himalayan Tours" }
];

export const routesData = {
  bihar: [
    {
      id: "v-p",
      origin: "Vaishali",
      destination: "Patna",
      label: "Vaishali → Patna",
      distance: "35 km",
      time: "~1 hour",
      type: "Local / Nearby",
      tagline: "Convenient chauffeur-driven travel between Vaishali and Patna via Setu / JP Ganga Path."
    },
    {
      id: "p-v",
      origin: "Patna",
      destination: "Vaishali",
      label: "Patna → Vaishali",
      distance: "35 km",
      time: "~1 hour",
      type: "Local / Nearby",
      tagline: "Return journey from Patna capital to Vaishali district operating hub."
    },
    {
      id: "p-m",
      origin: "Patna",
      destination: "Muzaffarpur",
      label: "Patna → Muzaffarpur",
      distance: "75 km",
      time: "~2 hours",
      type: "Commercial Corridor",
      tagline: "Fast 4-lane highway connect between Bihar's capital and north trade hub."
    },
    {
      id: "m-p",
      origin: "Muzaffarpur",
      destination: "Patna",
      label: "Muzaffarpur → Patna",
      distance: "75 km",
      time: "~2 hours",
      type: "Commercial Corridor",
      tagline: "Daily executive and medical transport from Muzaffarpur to Patna."
    },
    {
      id: "v-m",
      origin: "Vaishali",
      destination: "Muzaffarpur",
      label: "Vaishali → Muzaffarpur",
      distance: "60 km",
      time: "~1.5 hours",
      type: "Inter-District",
      tagline: "Frequent family, commercial, and business travel corridor."
    },
    {
      id: "v-h",
      origin: "Vaishali",
      destination: "Hajipur",
      label: "Vaishali → Hajipur",
      distance: "25 km",
      time: "~45 mins",
      type: "Local Route",
      tagline: "Quick transfer to district headquarters and major railway junction."
    },
    {
      id: "v-d",
      origin: "Vaishali",
      destination: "Darbhanga",
      label: "Vaishali → Darbhanga",
      distance: "125 km",
      time: "~3 hours",
      type: "Mithila Corridor",
      tagline: "Smooth highway transit connecting Vaishali to Darbhanga cultural hub."
    },
    {
      id: "m-b",
      origin: "Muzaffarpur",
      destination: "Begusarai",
      label: "Muzaffarpur → Begusarai",
      distance: "110 km",
      time: "~2.5 hours",
      type: "Industrial Route",
      tagline: "Connecting north-central commercial and refinery industrial centers."
    },
    {
      id: "h-d",
      origin: "Hajipur",
      destination: "Darbhanga",
      label: "Hajipur → Darbhanga",
      distance: "135 km",
      time: "~3.5 hours",
      type: "Direct Transit",
      tagline: "Direct connection across the Mithilanchal highway belt."
    },
    {
      id: "v-l",
      origin: "Vaishali",
      destination: "Lalganj",
      label: "Vaishali → Lalganj",
      distance: "15 km",
      time: "~30 mins",
      type: "Local Express",
      tagline: "Fast point-to-point transfers across local township points."
    },
    {
      id: "v-c",
      origin: "Vaishali",
      destination: "Chhapra",
      label: "Vaishali → Chhapra",
      distance: "55 km",
      time: "~1.5 hours",
      type: "Saran Belt",
      tagline: "Direct river bridge connection into Saran and western Bihar."
    },
    {
      id: "v-bs",
      origin: "Vaishali",
      destination: "Biharsarif",
      label: "Vaishali → Biharsarif",
      distance: "105 km",
      time: "~2.5 hours",
      type: "Nalanda Route",
      tagline: "Direct transit to Nalanda district commercial and heritage centers."
    }
  ],

  hubs: [
    {
      id: "pat-v",
      origin: "Patna Airport (PAT)",
      destination: "Vaishali",
      label: "Patna Airport (PAT) → Vaishali",
      distance: "40 km",
      time: "~1 hour",
      type: "Airport Transfer",
      tagline: "Meet & greet at terminal with direct chauffeur drop to Vaishali doorstep."
    },
    {
      id: "pat-m",
      origin: "Patna Airport (PAT)",
      destination: "Muzaffarpur",
      label: "Patna Airport (PAT) → Muzaffarpur",
      distance: "80 km",
      time: "~2 hours",
      type: "Airport Transfer",
      tagline: "Punctual flight pickup with luggage assistance and clean AC cabs."
    },
    {
      id: "pat-d",
      origin: "Patna Airport (PAT)",
      destination: "Darbhanga",
      label: "Patna Airport (PAT) → Darbhanga",
      distance: "140 km",
      time: "~3.5 hours",
      type: "Airport Transfer",
      tagline: "Door-to-door long distance airport transit across North Bihar."
    },
    {
      id: "rly-v",
      origin: "Patna Railway Station",
      destination: "Vaishali",
      label: "Patna Railway Station → Vaishali",
      distance: "38 km",
      time: "~1 hour",
      type: "Railway Transfer",
      tagline: "24/7 train arrival synchronization. Zero waiting stress or surge fares."
    },
    {
      id: "rly-m",
      origin: "Patna Railway Station",
      destination: "Muzaffarpur",
      label: "Patna Railway Station → Muzaffarpur",
      distance: "78 km",
      time: "~2 hours",
      type: "Railway Transfer",
      tagline: "Direct pickup from Patna Junction / Patliputra station."
    },
    {
      id: "dnr-v",
      origin: "Danapur Railway Station",
      destination: "Vaishali",
      label: "Danapur Railway Station → Vaishali",
      distance: "45 km",
      time: "~1 hour 15 mins",
      type: "Railway Transfer",
      tagline: "Western Patna rail hub transfer avoiding central city traffic."
    },
    {
      id: "dnr-m",
      origin: "Danapur Railway Station",
      destination: "Muzaffarpur",
      label: "Danapur Railway Station → Muzaffarpur",
      distance: "82 km",
      time: "~2 hours 15 mins",
      type: "Railway Transfer",
      tagline: "Direct station pickup for outstation trains arriving at Danapur (DNR)."
    }
  ],

  outstation: [
    {
      id: "v-del",
      origin: "Vaishali",
      destination: "Delhi / NCR",
      label: "Vaishali → Delhi",
      distance: "1,050 km",
      time: "~18 hours",
      type: "Inter-State Outstation",
      tagline: "Long-distance expressway journey via Purvanchal & Agra-Lucknow Expressway."
    },
    {
      id: "v-kol",
      origin: "Vaishali",
      destination: "Kolkata / WB",
      label: "Vaishali → Kolkata",
      distance: "620 km",
      time: "~12 hours",
      type: "Inter-State Outstation",
      tagline: "Seamless journey along NH-19 with verified highway chauffeurs."
    },
    {
      id: "p-kol",
      origin: "Patna",
      destination: "Kolkata / WB",
      label: "Patna → Kolkata",
      distance: "580 km",
      time: "~11 hours",
      type: "Inter-State Outstation",
      tagline: "Full-day highway cab with experienced long-distance highway chauffeurs."
    },
    {
      id: "p-pune",
      origin: "Patna",
      destination: "Pune",
      label: "Patna → Pune",
      distance: "1,750 km",
      time: "~32 hours",
      type: "Long-Distance Transit",
      tagline: "Special multi-day inter-state relocation and family road journey."
    },
    {
      id: "p-mum",
      origin: "Patna",
      destination: "Mumbai",
      label: "Patna → Mumbai",
      distance: "1,800 km",
      time: "~34 hours",
      type: "Long-Distance Transit",
      tagline: "Chauffeur-driven express transit across central and western India."
    },
    {
      id: "p-rnc",
      origin: "Patna",
      destination: "Ranchi / Jharkhand",
      label: "Patna → Ranchi",
      distance: "330 km",
      time: "~7 hours",
      type: "Interstate Route",
      tagline: "Comfortable scenic drive through Hazaribagh valley and hills."
    },
    {
      id: "v-up",
      origin: "Vaishali",
      destination: "Uttar Pradesh (Varanasi / Ayodhya)",
      label: "Vaishali → Varanasi / Ayodhya",
      distance: "280 km",
      time: "~6 hours",
      type: "Pilgrimage Corridor",
      tagline: "Direct pilgrimage road tour to Kashi Vishwanath and Ram Janmabhoomi."
    },
    {
      id: "v-dgr",
      origin: "Vaishali",
      destination: "Jharkhand (Deoghar)",
      label: "Vaishali → Deoghar (Baidyanath Dham)",
      distance: "260 km",
      time: "~6 hours",
      type: "Pilgrimage Route",
      tagline: "Dedicated temple circuit cab for Baba Baidyanath Dham darshan."
    }
  ],

  special: [
    {
      id: "p-nep-ktm",
      origin: "Patna",
      destination: "Nepal (Kathmandu / Pokhara)",
      label: "Patna → Kathmandu (Nepal)",
      distance: "370 km",
      time: "~10 hours",
      type: "Nepal International Tour",
      tagline: "Cross-border international tour with customs-compliant vehicles and drivers."
    },
    {
      id: "p-nep-pkr",
      origin: "Patna",
      destination: "Nepal (Kathmandu / Pokhara)",
      label: "Patna → Pokhara (Nepal)",
      distance: "390 km",
      time: "~11 hours",
      type: "Nepal Himalayan Tour",
      tagline: "Scenic mountain lake destination travel from Bihar via Raxaul / Birgunj."
    },
    {
      id: "v-nep",
      origin: "Vaishali",
      destination: "Nepal (Kathmandu / Pokhara)",
      label: "Vaishali → Nepal Border (Raxaul)",
      distance: "185 km",
      time: "~4.5 hours",
      type: "Border Transit",
      tagline: "Direct link from Vaishali hub to India-Nepal international entry gate."
    },
    {
      id: "v-darj",
      origin: "Vaishali",
      destination: "Darjeeling",
      label: "Vaishali → Darjeeling (WB)",
      distance: "460 km",
      time: "~10 hours",
      type: "Hill Station Tour",
      tagline: "Queen of the Hills holiday journey with experienced hill-terrain drivers."
    },
    {
      id: "v-gang",
      origin: "Vaishali",
      destination: "Gangtok (Sikkim)",
      label: "Vaishali → Gangtok (Sikkim)",
      distance: "540 km",
      time: "~12 hours",
      type: "Sikkim Tour",
      tagline: "Eastern Himalayan tour with all-weather comfortable SUV cabs."
    }
  ]
};
