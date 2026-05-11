import type { Campaign } from "@/types/campaign";

export const schoolProfile = {
  schoolName: "Quail Run Elementary School",
  ptaName: "Quail Run PTA",
  tagline: "Helping every classroom feel supported, supplied, and celebrated.",
  paymentSystemName: "the district-approved payment portal"
};

export const principalProfile = {
  name: "Dr. Maya Patel",
  title: "Principal",
  image:
    "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&q=80",
  message:
    "At Quail Run, every enrichment program, classroom resource, and community event helps students feel known, supported, and excited to learn. Thank you for partnering with our PTA to make these opportunities possible for every child."
};

export const ptaTeam = [
  {
    name: "Jessie C.",
    role: "PTA President",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Priya S.",
    role: "Auction Lead",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Michelle L.",
    role: "Restaurant Fundraisers",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Daniel K.",
    role: "Events Volunteer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Anika R.",
    role: "Classroom Support",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Carlos M.",
    role: "Volunteer Coordinator",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
  }
];

export const campaigns: Campaign[] = [
  {
    id: "learning-fund-donation",
    slug: "learning-fund-donation",
    title: "Learning Fund Donation",
    type: "Direct Donation",
    shortDescription: "**For $3.75 per school day your child receives:** Full Time Librarian, Small Group Reading and Math Specialists, Social Emotional Counselor, and a Certificated Art Teacher.\n\nThis year funds will also be used to support digital subscriptions used in the classroom, on and off-site field trips, and professional development for teachers.\n\n**Donate what you can and support our students.**",
    fullDescription: "**For $3.75 per school day your child receives:** Full Time Librarian, Small Group Reading and Math Specialists, Social Emotional Counselor, and a Certificated Art Teacher.\n\nThis year funds will also be used to support digital subscriptions used in the classroom, on and off-site field trips, and professional development for teachers.\n\n**Donate what you can and support our students.**",
    supports: "Full Time Librarian, reading and math specialists, social emotional counseling, certificated art instruction, classroom digital subscriptions, field trips, and teacher professional development.",
    goalAmount: 208000,
    amountRaised: 28750,
    startDate: "2026-04-01",
    deadline: "2026-06-07",
    heroImage: "/qrlf-learning-fund-centered.png",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://quail.futurefund.com/store/campaigns/54837-learning-fund-donation?c=1",
    externalActionLabel: "Donate now",
    status: "active",
    featured: true,
    pastImpact: [
      "Funded 26 classroom library refreshes last year.",
      "Covered field trip assistance for 84 students.",
      "Purchased shared science and art supplies for every grade."
    ],
    displayOrder: 6
  },
  {
    id: "quail-run-auction",
    slug: "quail-run-auction",
    title: "Quail Run Elementary Auction",
    type: "Gala / Event",
    shortDescription: "New items have been added to the auction. Join the bidding fun and support Quail Run students.",
    fullDescription: "Browse the latest auction additions and place bids through the official Quail Run Auctria auction page. The PTA Fundraising Hub shares campaign visibility only; all bidding and checkout happen through Auctria.",
    supports: "Arts and crafts kits, classroom enrichment, family outing experiences, student supplies, and school community programs.",
    goalAmount: 45000,
    amountRaised: 28750,
    startDate: "2026-04-01",
    deadline: "2026-06-07",
    heroImage: "/quail-run-auction-flyer.png",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://event.auctria.com/e7ea1fa8-7496-4c22-a89f-8d56859d5fe1/",
    externalActionLabel: "Bid now",
    status: "active",
    pastImpact: [
      "Funded 26 classroom library refreshes last year.",
      "Covered field trip assistance for 84 students.",
      "Purchased shared science and art supplies for every grade."
    ],
    displayOrder: 2,
    managerUserId: "pta-user-1778212336697"
  },
  {
    id: "hazy-barbecue-dine-donate",
    slug: "hazy-barbecue-dine-donate",
    title: "Hazy Barbecue Dine N' Donate",
    type: "Restaurant Fundraiser",
    shortDescription: "Dine in or order takeout from Hazy Barbecue and use code QR to support Quail Run Elementary.",
    fullDescription: "Join Quail Run families for an all-day Dine N' Donate fundraiser at Hazy Barbecue. Use code QR when ordering online, or mention Quail Run Elementary when dining in or ordering takeout. Hazy will donate 15% of eligible sales back, with a 20% giveback if the event reaches $2,500 in sales.",
    supports: "Restaurant giveback funds help support Quail Run Elementary PTA programs, classroom needs, and student enrichment.",
    goalAmount: 500,
    amountRaised: 0,
    startDate: "2026-05-04",
    deadline: "2026-05-04",
    heroImage: "/hazy-barbecue-dine-donate.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://www.hazybarbecue.com/",
    status: "active",
    pastImpact: [
      "Restaurant nights helped fund classroom supplies and PTA enrichment programs.",
      "Family dine-out events made it easier for parents to support school fundraising.",
      "Local business partnerships brought the school community together."
    ],
    restaurant: {
      restaurantName: "Hazy Barbecue",
      location: "200 Hartz Avenue, Danville, CA 94526",
      instructions: "Valid all day for takeout, dine-in, alcohol, and food purchases. Use code QR when ordering online.",
      donationPercentage: 15,
      promoCode: "QR",
      participationCount: 0,
      expectedDonation: 375,
      actualReceivedAmount: 0,
      payoutStatus: "pending",
      parentSelfReportNote: "Parent self-reports are unverified backup information until Hazy Barbecue confirms final eligible sales and payout."
    },
    displayOrder: 3,
    externalActionLabel: "Order online"
  },
  {
    id: "teacher-staff-appreciation-week",
    slug: "teacher-staff-appreciation-week",
    title: "Teacher & Staff Appreciation Week",
    type: "School event",
    shortDescription: "Help make Teacher & Staff Appreciation Week special by signing up to contribute items.",
    fullDescription: "🍎 📚 Teacher & Staff Appreciation Week is coming up May 4–8, and we need your help to make it special!\n\nOur amazing teachers and staff do so much for our students every day, and this is a wonderful opportunity to show our gratitude.\n\nPlease sign up to contribute items to support the week’s activities. Thank you for helping us show our appreciation!",
    supports: "Daily appreciation activities for Quail Run teachers and staff, including the cafe bar, smoothie bar, taco bar, salad bar, and Friday spiritwear celebration.",
    goalAmount: 120,
    amountRaised: 0,
    startDate: "2026-05-04",
    deadline: "2026-05-08",
    heroImage: "/teacher-staff-appreciation-week.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
    externalActionLabel: "Sign up",
    status: "active",
    pastImpact: [
      "5 appreciation days planned for teachers and staff.",
      "120 contribution spots help families support the week.",
      "1 school community comes together to say thank you."
    ],
    displayOrder: 2
  },
  {
    id: "fifth-grade-gift",
    slug: "fifth-grade-gift",
    title: "Camp Quail",
    type: "Class Contribution",
    shortDescription: "Camp Quail costs $70 early bird or $80 regular per student and supports the Learning Fund.",
    fullDescription: "Camp Quail gives families a night off while students enjoy 3.5 hours of games, team-building activities, arts and crafts, pizza dinner, drinks, chips, snacks, and a treat. Registration is $70 early bird or $80 regular per student.",
    supports: "All proceeds benefit the Quail Run Learning Fund, which directly supports the school.",
    goalAmount: 80,
    amountRaised: 0,
    startDate: "2026-05-01",
    deadline: "2026-05-01",
    heroImage: "/camp-quail-flyer.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
    externalActionLabel: "Sign up",
    status: "active",
    pastImpact: [
      "3.5 hours of student activities and dinner.",
      "70 dollar early bird registration supports the Learning Fund.",
      "1 evening for families to connect and support school enrichment."
    ],
    displayOrder: 4
  },
  {
    id: "event-1778278003479",
    slug: "new-event-1778278003479",
    title: "Multi Cultural Night",
    type: "School event",
    shortDescription: "Represent and celebrate all the cultures that make up our school community. This event is about inclusion, connection, and community building",
    fullDescription: "You do not need to prepare a formal presentation — casual conversations and hands-on experiences are often the most meaningful. Even a small display with a few personal touches can make a big impact. By sharing our traditions and stories, we help our students see that our diversity is something to celebrate and that it strengthens our entire school community.",
    supports: "Our goal is to represent and celebrate all the cultures that make up our school community. This event is about inclusion, connection, and community building — and we would love for every family to feel welcome to participate.",
    goalAmount: 0,
    amountRaised: 0,
    startDate: "2026-05-08",
    deadline: "2026-05-09",
    heroImage: "/new-event-1778278003479.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "",
    externalActionLabel: "Just show up!",
    status: "active",
    category: "event",
    pastImpact: [
      "Add a past impact or participation note before publishing."
    ],
    displayOrder: 1
  },
  {
    id: "campaign-1778255370264",
    slug: "new-campaign-1778255370264",
    title: "New PTA Campaign",
    type: "Direct Donation",
    shortDescription: "Briefly describe why families may want to support this effort.",
    fullDescription: "Add the longer parent-facing explanation for this campaign.",
    supports: "Describe the supplies, programs, or student experiences this funding supports.",
    goalAmount: 5000,
    amountRaised: 0,
    startDate: "2026-05-06",
    deadline: "2026-06-06",
    heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://example.edu/payments/new-campaign",
    externalActionLabel: "Donate now",
    status: "draft",
    category: "campaign",
    pastImpact: [
      "Add a past impact example before publishing."
    ],
    displayOrder: 7
  },
  {
    id: "campaign-1778169602458",
    slug: "new-campaign-1778169602458",
    title: "Quail Run Color Run",
    type: "Direct Donation",
    shortDescription: "💵 Donate and ✉️ Share. We are encouraging every family to share their donation page with 10 people.",
    fullDescription: " 💵 Donate and ✉️ Share. We are encouraging every family to share their donation page with 10 people. 🎁 Each class will earn fun rewards based on how much they raise as a class during the fundraiser. \n\n\n",
    supports: "Our school goal is to raise $35000 for funding our librarian, instructional assistants, school counselor, digital subscriptions, and other programs on campus! We can’t do this without everyone’s help! ",
    goalAmount: 35000,
    amountRaised: 6500,
    startDate: "2026-05-13",
    deadline: "2026-05-13",
    heroImage: "/new-campaign-1778169602458.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 16%",
    externalDonationUrl: "https://mybooster.com/v3",
    externalActionLabel: "Sign up on Booster",
    status: "active",
    pastImpact: [
      "Add a past impact example before publishing."
    ],
    category: "campaign",
    displayOrder: 1,
    managerUserId: "pta-user-1778212336697"
  },
  {
    id: "event-1778127214342",
    slug: "new-event-1778127214342",
    title: "Bakers and Makers Fair",
    type: "School event",
    shortDescription: "Briefly describe how families can participate in this event.",
    fullDescription: "Add the longer parent-facing explanation for this event.",
    supports: "Describe the volunteer need, signup purpose, or school community benefit.",
    goalAmount: 0,
    amountRaised: 0,
    startDate: "2026-03-01",
    deadline: "2026-03-01",
    heroImage: "/new-event-1778127214342.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
    externalActionLabel: "Sign up",
    status: "ended",
    pastImpact: [
      "Add a past impact or participation note before publishing."
    ],
    displayOrder: 5
  },
  {
    id: "event-1778127149043",
    slug: "new-event-1778127149043",
    title: "Reading Is Groovy Book Fair",
    type: "School event",
    shortDescription: "Briefly describe how families can participate in this event.",
    fullDescription: "Add the longer parent-facing explanation for this event.",
    supports: "Describe the volunteer need, signup purpose, or school community benefit.",
    goalAmount: 0,
    amountRaised: 0,
    startDate: "2026-03-18",
    deadline: "2026-03-18",
    heroImage: "/new-event-1778127149043.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
    externalActionLabel: "Sign up",
    status: "ended",
    pastImpact: [
      "Add a past impact or participation note before publishing."
    ],
    displayOrder: 4
  },
  {
    id: "event-1778127071378",
    slug: "new-event-1778127071378",
    title: "Quail Run Family Education Night",
    type: "School event",
    shortDescription: "Briefly describe how families can participate in this event.",
    fullDescription: "Add the longer parent-facing explanation for this event.",
    supports: "Describe the volunteer need, signup purpose, or school community benefit.",
    goalAmount: 0,
    amountRaised: 0,
    startDate: "2026-03-28",
    deadline: "2026-03-28",
    heroImage: "/new-event-1778127071378.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
    externalActionLabel: "Sign up",
    status: "ended",
    pastImpact: [
      "Add a past impact or participation note before publishing."
    ],
    displayOrder: 3
  },
  {
    id: "campaign-1778119911271",
    slug: "new-campaign-1778119911271",
    title: "Dine Out at Danville Harvest",
    type: "Restaurant Fundraiser",
    shortDescription: "First Dine Out in March to support the Learning Fund!",
    fullDescription: "Add the longer parent-facing explanation for this campaign.",
    supports: "Describe the supplies, programs, or student experiences this funding supports.",
    goalAmount: 5000,
    amountRaised: 0,
    startDate: "2026-04-15",
    deadline: "2026-04-30",
    heroImage: "/new-campaign-1778119911271.jpg",
    heroImageFit: "cover",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://www.danvilleharvest.com/menu",
    status: "active",
    pastImpact: [
      "Add a past impact example before publishing."
    ],
    externalActionLabel: "Order online",
    restaurant: {
      restaurantName: "Danville Harvest",
      location: "500 Hartz Ave, Danville, CA 94526",
      instructions: "Mention Quail Run Elementary ",
      donationPercentage: 15,
      promoCode: "",
      participationCount: 0,
      expectedDonation: 0,
      actualReceivedAmount: 0,
      payoutStatus: "pending",
      parentSelfReportNote: "Parent self-reports are unverified backup information until payout is confirmed."
    },
    displayOrder: 5
  }
];
