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
    shortDescription:
      "**For $3.75 per school day your child receives:** Full Time Librarian, Small Group Reading and Math Specialists, Social Emotional Counselor, and a Certificated Art Teacher.\n\nThis year funds will also be used to support digital subscriptions used in the classroom, on and off-site field trips, and professional development for teachers.\n\n**Donate what you can and support our students.**",
    fullDescription:
      "**For $3.75 per school day your child receives:** Full Time Librarian, Small Group Reading and Math Specialists, Social Emotional Counselor, and a Certificated Art Teacher.\n\nThis year funds will also be used to support digital subscriptions used in the classroom, on and off-site field trips, and professional development for teachers.\n\n**Donate what you can and support our students.**",
    supports:
      "Full Time Librarian, reading and math specialists, social emotional counseling, certificated art instruction, classroom digital subscriptions, field trips, and teacher professional development.",
    goalAmount: 208000,
    amountRaised: 28750,
    startDate: "2026-04-01",
    deadline: "2026-06-07",
    heroImage: "/qrlf-learning-fund-centered.png",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl:
      "https://quail.futurefund.com/store/campaigns/54837-learning-fund-donation?c=1",
    externalActionLabel: "Donate now",
    status: "active",
    featured: true,
    pastImpact: [
      "Funded 26 classroom library refreshes last year.",
      "Covered field trip assistance for 84 students.",
      "Purchased shared science and art supplies for every grade."
    ]
  },
  {
    id: "quail-run-auction",
    slug: "quail-run-auction",
    title: "Quail Run Elementary Auction",
    type: "Gala / Event",
    shortDescription:
      "New items have been added to the auction. Join the bidding fun and support Quail Run students.",
    fullDescription:
      "Browse the latest auction additions and place bids through the official Quail Run Auctria auction page. The PTA Fundraising Hub shares campaign visibility only; all bidding and checkout happen through Auctria.",
    supports:
      "Arts and crafts kits, classroom enrichment, family outing experiences, student supplies, and school community programs.",
    goalAmount: 45000,
    amountRaised: 28750,
    startDate: "2026-04-01",
    deadline: "2026-06-07",
    heroImage: "/quail-run-auction-flyer.png",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://event.auctria.com/e7ea1fa8-7496-4c22-a89f-8d56859d5fe1/",
    externalActionLabel: "Bid now",
    status: "active",
    pastImpact: [
      "Funded 26 classroom library refreshes last year.",
      "Covered field trip assistance for 84 students.",
      "Purchased shared science and art supplies for every grade."
    ]
  },
  {
    id: "hazy-barbecue-dine-donate",
    slug: "hazy-barbecue-dine-donate",
    title: "Hazy Barbecue Dine N' Donate",
    type: "Restaurant Fundraiser",
    shortDescription:
      "Dine in or order takeout from Hazy Barbecue and use code QR to support Quail Run Elementary.",
    fullDescription:
      "Join Quail Run families for an all-day Dine N' Donate fundraiser at Hazy Barbecue. Use code QR when ordering online, or mention Quail Run Elementary when dining in or ordering takeout. Hazy will donate 15% of eligible sales back, with a 20% giveback if the event reaches $2,500 in sales.",
    supports:
      "Restaurant giveback funds help support Quail Run Elementary PTA programs, classroom needs, and student enrichment.",
    goalAmount: 500,
    amountRaised: 0,
    startDate: "2026-05-04",
    deadline: "2026-05-04",
    heroImage: "/hazy-barbecue-dine-donate.jpg",
    heroImageFit: "contain",
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
      instructions:
        "Valid all day for takeout, dine-in, alcohol, and food purchases. Use code QR when ordering online.",
      donationPercentage: 15,
      promoCode: "QR",
      participationCount: 0,
      expectedDonation: 375,
      actualReceivedAmount: 0,
      payoutStatus: "pending",
      parentSelfReportNote:
        "Parent self-reports are unverified backup information until Hazy Barbecue confirms final eligible sales and payout."
    }
  },
  {
    id: "restaurant-fundraiser-placeholder",
    slug: "restaurant-fundraiser-placeholder",
    title: "Restaurant Fundraiser Placeholder",
    type: "Restaurant Fundraiser",
    shortDescription:
      "Add the next restaurant partner, date, and giveback details for families.",
    fullDescription:
      "Use this placeholder campaign to draft a future restaurant fundraiser. Update the flyer, restaurant information, and external link in the admin dashboard.",
    supports:
      "Future restaurant giveback funds can support PTA programs, classroom needs, and student enrichment.",
    goalAmount: 1000,
    amountRaised: 0,
    startDate: "2026-06-01",
    deadline: "2026-06-01",
    heroImage: "/hazy-barbecue-dine-donate.jpg",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://example.com",
    status: "draft",
    pastImpact: [
      "Restaurant nights make school support easy for busy families.",
      "Local business partnerships strengthen the Quail Run community."
    ],
    restaurant: {
      restaurantName: "Future Restaurant Partner",
      location: "Add restaurant address",
      instructions: "Add dine-in, takeout, promo code, and timing instructions.",
      donationPercentage: 15,
      promoCode: "QR",
      participationCount: 0,
      expectedDonation: 0,
      actualReceivedAmount: 0,
      payoutStatus: "pending",
      parentSelfReportNote:
        "Parent self-reports are unverified backup information until the restaurant confirms final eligible sales and payout."
    }
  },
  {
    id: "direct-donation-placeholder",
    slug: "direct-donation-placeholder",
    title: "Direct Donation Placeholder",
    type: "Direct Donation",
    shortDescription:
      "Add a future direct donation campaign with a clear goal and school-approved giving link.",
    fullDescription:
      "Use this placeholder campaign to draft a future direct donation effort. Update the image, goal, description, and external payment link in the admin dashboard.",
    supports:
      "Future direct donations can support classroom supplies, enrichment programs, field trips, and student resources.",
    goalAmount: 5000,
    amountRaised: 0,
    startDate: "2026-06-15",
    deadline: "2026-07-15",
    heroImage: "/qrlf-learning-fund-centered.png",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl: "https://example.com",
    externalActionLabel: "Donate now",
    status: "draft",
    pastImpact: [
      "1 future giving campaign ready to customize.",
      "Families can use one clear official giving link."
    ]
  },
  {
    id: "teacher-staff-appreciation-week",
    slug: "teacher-staff-appreciation-week",
    title: "Teacher & Staff Appreciation Week",
    type: "Class Contribution",
    shortDescription:
      "Help make Teacher & Staff Appreciation Week special by signing up to contribute items.",
    fullDescription:
      "🍎 📚 Teacher & Staff Appreciation Week is coming up May 4–8, and we need your help to make it special!\n\nOur amazing teachers and staff do so much for our students every day, and this is a wonderful opportunity to show our gratitude.\n\nPlease sign up to contribute items to support the week’s activities. Thank you for helping us show our appreciation!",
    supports:
      "Daily appreciation activities for Quail Run teachers and staff, including the cafe bar, smoothie bar, taco bar, salad bar, and Friday spiritwear celebration.",
    goalAmount: 120,
    amountRaised: 0,
    startDate: "2026-05-04",
    deadline: "2026-05-08",
    heroImage: "/teacher-staff-appreciation-week.jpg",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl:
      "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
    externalActionLabel: "Sign up on SignUpGenius",
    status: "active",
    pastImpact: [
      "5 appreciation days planned for teachers and staff.",
      "120 contribution spots help families support the week.",
      "1 school community comes together to say thank you."
    ]
  },
  {
    id: "fifth-grade-gift",
    slug: "fifth-grade-gift",
    title: "Camp Quail",
    type: "Class Contribution",
    shortDescription:
      "Camp Quail costs $70 early bird or $80 regular per student and supports the Learning Fund.",
    fullDescription:
      "Camp Quail gives families a night off while students enjoy 3.5 hours of games, team-building activities, arts and crafts, pizza dinner, drinks, chips, snacks, and a treat. Registration is $70 early bird or $80 regular per student.",
    supports:
      "All proceeds benefit the Quail Run Learning Fund, which directly supports the school.",
    goalAmount: 80,
    amountRaised: 0,
    startDate: "2026-05-01",
    deadline: "2026-05-01",
    heroImage: "/camp-quail-flyer.jpg",
    heroImageFit: "contain",
    heroImagePosition: "50% 50%",
    externalDonationUrl:
      "https://m.signupgenius.com/#!/showSignUp/60B0C4EAEA922A5F94-63567652-teacher?useFullSite=false",
    externalActionLabel: "Sign up",
    status: "active",
    pastImpact: [
      "3.5 hours of student activities and dinner.",
      "70 dollar early bird registration supports the Learning Fund.",
      "1 evening for families to connect and support school enrichment."
    ]
  }
];
