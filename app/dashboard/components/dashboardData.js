export const dashboardNav = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "chat", icon: "💬", label: "AI Chat", badge: "3" },
  { id: "nova", icon: "🤖", label: "Nova Receptionist", badge: "Live", badgeGreen: true },
  { id: "automations", icon: "⚡", label: "Automations" },
  { id: "docs", icon: "📄", label: "Documents" },
];

export const businessNav = [
  { id: "leads", icon: "👥", label: "Leads & CRM" },
  { id: "appointments", icon: "📆", label: "Appointments" },
  { id: "reviews", icon: "⭐", label: "Reviews" },
];

export const accountNav = [
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "billing-link", icon: "💳", label: "Billing" },
];

export const kpis = [
  { tone: "a", label: "Leads Captured", value: "247", change: "↑ 34% vs last month" },
  { tone: "g", label: "Calls Handled by Nova", value: "189", change: "↑ 100% (was 0)" },
  { tone: "c", label: "Avg Response Time", value: "87s", change: "↓ 94% from 6 hrs" },
  { tone: "p", label: "Time Saved (hrs)", value: "43h", change: "↑ Automations running" },
];

export const chartHeights = [30, 45, 60, 40, 70, 55, 80, 65, 90, 75, 85, 95, 100, 88];

export const activityItems = [
  { color: "var(--green)", text: "Nova answered inbound call from +1 (703) 4XX-XXXX", time: "2m ago" },
  { color: "var(--amber)", text: "Lead captured: Sarah M. - wants lesson booking", time: "6m ago" },
  { color: "var(--cyan)", text: "Follow-up sequence triggered for Marcus T.", time: "14m ago" },
  { color: "var(--purple)", text: "Review request sent to James K. after lesson", time: "28m ago" },
  { color: "var(--green)", text: "Appointment confirmed: Aisha R. - Thu 2pm lesson", time: "1h ago" },
];

export const conversations = [
  { id: "pricing-strategy", title: "Driving school pricing strategy", time: "Just now" },
  { id: "summer-campaign", title: "Summer marketing campaign ideas", time: "2h ago" },
  { id: "no-show-rates", title: "How to reduce no-show rates", time: "Yesterday" },
  { id: "competitor-analysis", title: "Competitor analysis DMV area", time: "2 days ago" },
];

export const conversationThreads = {
  "pricing-strategy": {
    title: "Driving school pricing strategy",
    model: "claude-sonnet-4",
    messages: [
      {
        role: "user",
        time: "10:42 AM",
        content:
          "What’s a competitive pricing strategy for a driving school in the DMV area? We currently charge $65/lesson but I think we’re underpriced.",
      },
      {
        role: "assistant",
        time: "10:42 AM",
        content:
          "Based on current market data for the DMV area, $65/lesson is indeed below the market median. Here’s what I recommend:\n\nMarket positioning: Most driving schools in Northern Virginia charge $75-$95/lesson for a 60-min session. Maryland tends to run $70-$85.\n\nRecommendation: Move to $79/lesson with a 10-lesson package at $699, which saves $91 while keeping you accessible.\n\nYou could also add a Road Test Ready package at $299 for 3 lessons plus road test accompaniment to improve margins.",
      },
      {
        role: "user",
        time: "10:44 AM",
        content: "Can you write me an email announcing the new pricing to existing students?",
      },
      {
        role: "typing",
      },
    ],
  },
  "summer-campaign": {
    title: "Summer marketing campaign ideas",
    model: "claude-sonnet-4",
    messages: [
      {
        role: "user",
        time: "2:08 PM",
        content:
          "Give me some summer marketing campaign ideas for our driving school that could help us bring in more teen students and parents before vacation season.",
      },
      {
        role: "assistant",
        time: "2:09 PM",
        content:
          "Here are 4 strong summer campaign angles for a driving school:\n\n1. Summer Slots Fill Fast: Promote limited lesson availability for June-August and use urgency-driven ads.\n\n2. Parent Peace-of-Mind Campaign: Focus messaging on safety, licensed instructors, and flexible scheduling.\n\n3. Road Test Ready Package: Bundle lessons with test prep and pickup/drop-off convenience.\n\n4. Refer-a-Friend Summer Bonus: Offer a small credit or free practice session when an enrolled family refers another student.\n\nBest channels: local Facebook parent groups, Instagram Reels with instructor tips, Google Search ads for permit/test prep, and SMS follow-ups to old leads.",
      },
      {
        role: "user",
        time: "2:11 PM",
        content: "Which one would you prioritize if I only had a small budget?",
      },
      {
        role: "assistant",
        time: "2:11 PM",
        content:
          "I’d prioritize the Parent Peace-of-Mind campaign first. It speaks to the actual buyer, works well across organic social, email, and retargeting, and doesn’t require heavy production. Pair it with a limited summer availability message and a simple landing page focused on trust, safety, and booking convenience.",
      },
    ],
  },
  "no-show-rates": {
    title: "How to reduce no-show rates",
    model: "claude-sonnet-4",
    messages: [
      {
        role: "user",
        time: "Yesterday",
        content:
          "Our driving school still has too many no-shows for booked lessons. What are the fastest ways to reduce that?",
      },
      {
        role: "assistant",
        time: "Yesterday",
        content:
          "Start with operational fixes that create immediate accountability:\n\n1. Automated reminder sequence: send confirmations at booking, 24 hours before, and 2 hours before.\n\n2. Clear cancellation policy: require acknowledgment of your reschedule and no-show rules.\n\n3. Easy rescheduling: let students move appointments without calling.\n\n4. Deposit or prepaid package model: prepayment consistently reduces no-show behavior.\n\n5. Follow-up tagging: track which students miss once and trigger a higher-touch reminder workflow for future lessons.",
      },
      {
        role: "user",
        time: "Yesterday",
        content: "Can you rank those by impact for a small team?",
      },
      {
        role: "assistant",
        time: "Yesterday",
        content:
          "For a small team, I’d rank them:\n\n1. Automated reminders\n2. Deposit/prepaid lessons\n3. Easy rescheduling link\n4. Clear cancellation policy\n5. Repeat no-show workflow\n\nThe first two usually create the biggest drop fastest, with the least manual effort once set up.",
      },
    ],
  },
  "competitor-analysis": {
    title: "Competitor analysis DMV area",
    model: "claude-sonnet-4",
    messages: [
      {
        role: "user",
        time: "2 days ago",
        content:
          "Can you help me think through competitor analysis for driving schools in the DMV area so we can position ourselves better?",
      },
      {
        role: "assistant",
        time: "2 days ago",
        content:
          "Yes. I’d compare competitors across 5 categories:\n\n1. Lesson pricing and package structure\n2. Review volume and average rating\n3. Booking convenience and website UX\n4. Service differentiators like pickup zones, test prep, and bilingual instructors\n5. Speed to lead response for calls and contact forms\n\nThat usually reveals whether you should compete on trust, convenience, premium service, or value bundles.",
      },
      {
        role: "user",
        time: "2 days ago",
        content: "What gaps should I look for first?",
      },
      {
        role: "assistant",
        time: "2 days ago",
        content:
          "Look first for weak response speed, unclear package pricing, outdated websites, and low review freshness. If competitors feel slow or confusing, you can win with a cleaner booking flow, clearer pricing, and faster follow-up using Nova and your automations.",
      },
    ],
  },
};

export const automationsSeed = [
  {
    id: "lead-capture",
    triggerClass: "at-webhook",
    trigger: "⚡ Webhook Trigger",
    name: "Lead Capture → CRM",
    desc: "When Nova captures a lead via phone call, automatically create a contact in GoHighLevel CRM and assign to follow-up pipeline.",
    stats: [
      { value: "847", label: "Runs", className: "green" },
      { value: "99.2%", label: "Success", className: "amber" },
      { value: "2.3s", label: "Avg Time", style: { color: "var(--cyan)" } },
    ],
    enabled: true,
  },
  {
    id: "appointment-reminder",
    triggerClass: "at-schedule",
    trigger: "🕐 Scheduled",
    name: "Appointment Reminder",
    desc: "Send SMS reminder 24 hours before a scheduled driving lesson. Include instructor name, location, and what to bring.",
    stats: [
      { value: "234", label: "Sent", className: "green" },
      { value: "12%", label: "No-show reduction", className: "amber" },
    ],
    enabled: true,
  },
  {
    id: "review-request",
    triggerClass: "at-event",
    trigger: "📍 Post-Event",
    name: "Review Request",
    desc: "2 hours after a lesson is marked complete, send personalized SMS asking for a Google review with a direct link.",
    stats: [
      { value: "89", label: "Reviews", className: "green" },
      { value: "4.9★", label: "Avg Rating", className: "amber" },
    ],
    enabled: true,
  },
  {
    id: "cold-lead",
    triggerClass: "at-schedule",
    trigger: "🔁 7-Day Re-engage",
    name: "Cold Lead Nurture",
    desc: "If a lead hasn't booked after 7 days, send a sequence of 3 personalized follow-up messages over 2 weeks.",
    stats: [
      { value: "Paused", label: "Status", style: { color: "var(--muted)" } },
      { value: "18%", label: "Re-engage rate", className: "amber" },
    ],
    enabled: false,
  },
];

export const documents = [
  {
    id: "policy",
    icon: "📋",
    name: "Student Policy Handbook",
    meta: "PDF · 24 pages · 1.2MB",
    badge: "✓ Indexed",
    badgeClass: "db-indexed",
  },
  {
    id: "contract",
    icon: "📝",
    name: "Instructor Contract Template",
    meta: "DOCX · 8 pages · 0.4MB",
    badge: "✓ Indexed",
    badgeClass: "db-indexed",
  },
  {
    id: "pricing",
    icon: "💰",
    name: "Pricing & Packages 2025",
    meta: "PDF · 2 pages · 0.1MB",
    badge: "Processing...",
    badgeClass: "db-processing",
  },
  {
    id: "routes",
    icon: "🗺️",
    name: "Route Maps & Test Areas",
    meta: "PDF · 12 pages · 3.4MB",
    badge: "✓ Indexed",
    badgeClass: "db-indexed",
  },
];

export const settingsTabs = [
  "👤 Profile",
  "🔔 Notifications",
  "🔌 Integrations",
  "🤖 AI Model",
  "💳 Billing",
  "👥 Team",
];

export const recentCalls = [
  {
    color: "var(--green)",
    text: "Inbound call from +1 (703) 4XX-XXXX - Lead captured: Lesson booking for Sarah M.",
    time: "2m ago",
  },
  {
    color: "var(--amber)",
    text: 'Inbound call - FAQ: "What age do I need to be to start?" - Answered by Nova',
    time: "18m ago",
  },
  {
    color: "var(--green)",
    text: "Inbound call from +1 (240) 5XX-XXXX - Appointment rescheduled for James T.",
    time: "45m ago",
  },
  {
    color: "var(--cyan)",
    text: "Inbound call - Pricing inquiry - Lead captured, follow-up triggered automatically",
    time: "1.2h ago",
  },
];

export const leadPipeline = [
  {
    id: "new-inquiry",
    title: "New Inquiries",
    count: 18,
    value: "$7.4k",
    leads: [
      {
        id: "lead-1",
        name: "Sarah Mitchell",
        source: "Nova call capture",
        status: "Needs callback",
        priority: "Hot",
        packageInterest: "10-lesson package",
        nextStep: "Call today at 4:30 PM",
      },
      {
        id: "lead-2",
        name: "Jason Reed",
        source: "Website form",
        status: "Pricing request",
        priority: "Warm",
        packageInterest: "Road Test Ready",
        nextStep: "Send quote + package PDF",
      },
      {
        id: "lead-3",
        name: "Amina Khan",
        source: "Instagram ad",
        status: "Parent follow-up",
        priority: "Hot",
        packageInterest: "Teen starter bundle",
        nextStep: "SMS reminder tonight",
      },
    ],
  },
  {
    id: "qualified",
    title: "Qualified",
    count: 9,
    value: "$5.9k",
    leads: [
      {
        id: "lead-4",
        name: "Marcus Taylor",
        source: "Referral",
        status: "Ready to book",
        priority: "Hot",
        packageInterest: "Weekly lessons",
        nextStep: "Confirm Tuesday slot",
      },
      {
        id: "lead-5",
        name: "Olivia Brooks",
        source: "Google Search",
        status: "Parent review sent",
        priority: "Warm",
        packageInterest: "Road test prep",
        nextStep: "Follow up tomorrow",
      },
    ],
  },
  {
    id: "booked",
    title: "Booked",
    count: 14,
    value: "$9.8k",
    leads: [
      {
        id: "lead-6",
        name: "Daniel Green",
        source: "Nova receptionist",
        status: "Deposit paid",
        priority: "Won",
        packageInterest: "12-lesson premium",
        nextStep: "Welcome SMS automation",
      },
      {
        id: "lead-7",
        name: "Leah Cooper",
        source: "Facebook campaign",
        status: "First lesson scheduled",
        priority: "Won",
        packageInterest: "Beginner package",
        nextStep: "Instructor assigned",
      },
    ],
  },
];

export const crmMetrics = [
  { label: "Open Leads", value: "41", tone: "amber", detail: "Across all channels" },
  { label: "Qualified Rate", value: "62%", tone: "green", detail: "Up 8% this month" },
  { label: "Booked Revenue", value: "$9.8k", tone: "cyan", detail: "Pipeline won this month" },
  { label: "Avg Response", value: "6m", tone: "purple", detail: "Nova + team follow-up" },
];

export const leadActivities = [
  { color: "var(--green)", text: "Nova captured Sarah Mitchell and assigned the lead to Sales.", time: "4m ago" },
  { color: "var(--amber)", text: "Jason Reed opened the pricing PDF twice after follow-up email.", time: "19m ago" },
  { color: "var(--cyan)", text: "Amina Khan clicked the booking link from Instagram nurture flow.", time: "37m ago" },
  { color: "var(--purple)", text: "Marcus Taylor moved to Qualified after parent callback completed.", time: "1h ago" },
];

export const appointmentMetrics = [
  { label: "Today’s Lessons", value: "12", tone: "amber", detail: "Across 4 instructors" },
  { label: "Confirmed Rate", value: "91%", tone: "green", detail: "AI reminders sent" },
  { label: "Reschedules", value: "3", tone: "cyan", detail: "Handled automatically" },
  { label: "Road Tests", value: "4", tone: "purple", detail: "This week" },
];

export const todaysAppointments = [
  {
    id: "appt-1",
    time: "9:00 AM",
    student: "Sarah Mitchell",
    instructor: "Alex Morgan",
    type: "Behind-the-wheel",
    location: "Fairfax Route A",
    status: "Confirmed",
  },
  {
    id: "appt-2",
    time: "10:30 AM",
    student: "Daniel Green",
    instructor: "Maria Lopez",
    type: "Road test prep",
    location: "Springfield DMV loop",
    status: "In Progress",
  },
  {
    id: "appt-3",
    time: "1:00 PM",
    student: "Leah Cooper",
    instructor: "Chris Patel",
    type: "Beginner lesson",
    location: "Annandale pickup",
    status: "Confirmed",
  },
  {
    id: "appt-4",
    time: "3:30 PM",
    student: "Marcus Taylor",
    instructor: "Alex Morgan",
    type: "Road test accompaniment",
    location: "Fair Oaks DMV",
    status: "Needs Confirmation",
  },
];

export const instructorSchedule = [
  {
    id: "inst-1",
    name: "Alex Morgan",
    lessons: "4 lessons",
    utilization: "92%",
    nextSlot: "11:30 AM",
  },
  {
    id: "inst-2",
    name: "Maria Lopez",
    lessons: "3 lessons",
    utilization: "78%",
    nextSlot: "2:15 PM",
  },
  {
    id: "inst-3",
    name: "Chris Patel",
    lessons: "3 lessons",
    utilization: "85%",
    nextSlot: "1:00 PM",
  },
];

export const appointmentAlerts = [
  {
    title: "1 student still unconfirmed",
    body: "Marcus Taylor has not replied to the 24-hour reminder. Nova can place a follow-up confirmation call.",
    tone: "amber",
  },
  {
    title: "Route clustering opportunity",
    body: "Two Fairfax pickups are 12 minutes apart. AI suggests grouping instructor assignments to reduce drive time.",
    tone: "cyan",
  },
  {
    title: "No-show risk reduced",
    body: "Students who received both SMS and voice reminders confirmed 18% faster this week.",
    tone: "green",
  },
];
