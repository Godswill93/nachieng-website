export const TMMS = {
    name: "TMMS",
    longName: "TMMS — Maintenance Management System",
    status: "In development",
    availability: "Private demonstration by enquiry",
    lead:
        "TMMS is a Maintenance Management System currently in development by Nachi Eng Ltd. It is shaped by hands-on maintenance work in manufacturing and commercial environments, and is demonstrated privately by enquiry.",
    problem:
        "Reactive maintenance can create higher overall costs through unplanned downtime, emergency labour, production disruption, expedited parts and secondary equipment damage. A CMMS becomes particularly valuable when spreadsheets, paper records or individual memory no longer provide a reliable view of assets, work orders, maintenance history and upcoming tasks.",
    intent:
        "TMMS is being developed to give maintenance teams one connected view of assets, work orders, preventive maintenance and inventory — so planned work is protected, history is not lost, and decisions rest on recorded information rather than recollection.",
    sectors: [
        "Manufacturing",
        "Logistics and warehousing",
        "Commercial facilities",
        "Hospitality",
    ],
    futureSectors: ["Healthcare estates"],
};

export const TMMS_MODULES = [
    { name: "Dashboard", text: "Open work, overdue tasks, asset condition and headline indicators on one screen." },
    { name: "Assets", text: "An asset register with location, status, condition and service history per item." },
    { name: "Work orders", text: "Raising, assigning, tracking and closing corrective work, with priority and status." },
    { name: "Preventive maintenance", text: "A planned-maintenance schedule with due dates, compliance view and overdue flags." },
    { name: "Inventory", text: "Spares and consumables with stock levels, minimums and reorder prompts." },
    { name: "Reports", text: "Indicators such as completion, compliance and repair time, summarised for review." },
    { name: "Messaging", text: "Threaded communication between engineers and supervisors attached to the work." },
    { name: "Safety", text: "Incident and safety logs kept alongside the assets and work they relate to." },
    { name: "Engineers", text: "Team members, roles and current assignments." },
];

export const TMMS_DEMOS = [
    {
        slug: "factory",
        label: "Factory & manufacturing",
        text: "Production lines, plant assets, PPM schedule, work orders, inventory and safety logs.",
        future: false,
    },
    {
        slug: "warehouse",
        label: "Warehouse & logistics",
        text: "Zones, MHE and conveyor assets, temperature-controlled areas and planned maintenance.",
        future: false,
    },
    {
        slug: "hotel",
        label: "Hotel & hospitality",
        text: "Guest-facing zones, plant rooms, lifts, pool plant and reactive fault handling.",
        future: false,
    },
    {
        slug: "hospital",
        label: "Hospital & healthcare",
        text: "Departments, critical estates assets, compliance-led PPM and escalation.",
        future: true,
    },
];

export const DEMO_NOTICE =
    "Simulated demonstration — sample data. Every asset, person, figure, message and event is fictional. No live system, customer or named organisation is represented.";

export const WALKTHROUGH = {
    title: "See how maintenance work moves through TMMS.",
    intro:
        "Explore selected workflows across assets, work orders, preventive maintenance and inventory. Each walkthrough demonstrates how information moves through one connected maintenance system.",
    items: [
        { id: "assets", title: "Assets", published: false, poster: null, sources: [], captions: null, transcript: null, caption: null },
        { id: "work-orders", title: "Work orders", published: false, poster: null, sources: [], captions: null, transcript: null, caption: null },
        { id: "preventive-maintenance", title: "Preventive maintenance", published: false, poster: null, sources: [], captions: null, transcript: null, caption: null },
        { id: "inventory", title: "Inventory", published: false, poster: null, sources: [], captions: null, transcript: null, caption: null },
    ],
};

export const SHOW_PREVIEW_MEDIA = process.env.REACT_APP_PREVIEW_MEDIA === "true";
