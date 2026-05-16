# Stage 1 Report: Team Formation & Idea Development

**Project Name:** TBD *(to be finalized by the team)*  
**School:** Holberton School — Foundations Track, Semester 3  
**Date:** May 16, 2026  

<br>

## 1. Team Formation

### Team Members

| Name | Role |
|------|------|
| Mohammed | Project Manager (Stage 1) + Frontend Developer |
| Salman | Team Lead + Backend Developer |
| Abdullah | Team Member |
| Fahad | Team Member |

Roles are still under discussion and may rotate between stages. The goal is for everyone to get experience in both technical and management responsibilities.

### How We Work Together

We agreed on a few simple ground rules at our first meeting:

- WhatsApp for day-to-day communication
- Weekly standup to check progress and flag blockers
- GitHub for all code and task tracking
- Technical decisions go through Salman as Team Lead; everything else is discussed together

<br>

## 2. Research & Brainstorming

### Process

We started individually — each person listed problems they personally dealt with or noticed around them. Then we got together, shared what we found, and started grouping ideas.

Most of the problems we noticed fell into two themes: fragmented services (where you have to contact 5 different people to get one thing done) and lack of trust (you never really know if a vendor is good until it's too late).

### Techniques Used

**Mind Mapping**  
We mapped out problems across different areas — transportation, weddings, home repair, pricing. The wedding and events space kept coming up as something with a lot of pain points and no good solution in Saudi Arabia.

**SCAMPER Framework**  
We looked at platforms like Haraj and Booking.com and asked: what's missing? The big gap: there's no platform that handles an entire wedding from one place, and nothing that lets *two people* plan together.

**"How Might We" Questions**  
- *How might we make event planning less exhausting for everyone involved?*
- *How might we let couples make decisions together even when they're not in the same place?*

These two questions basically defined the core of our idea.

<br>

## 3. Idea Evaluation

### Evaluation Criteria

We scored each idea on:

- **Technical Feasibility** — Can we build it with what we know? (Flask, MySQL, Python)
- **Learning Value** — Will we actually learn something from building it?
- **Curriculum Coverage** — Does it naturally require DB, API, Auth, Frontend, and Testing?
- **Team Fit** — Is the scope realistic for 3 months?
- **Market Differentiation** — Is it solving something that isn't already solved well?
- **MVP Clarity** — Can we ship a working version in 4 weeks?

### Ideas Explored

| Idea | Verdict | Notes |
|------|---------|-------|
| Wedding & Events Platform | ✅ Selected | Best overall fit — see Section 4 |
| Car Service Platform | ✅ Strong | Great technically, strong AI angle — didn't choose due to team preference |
| Home Maintenance Auctions | ✅ Strong | Very clear flow, covers all requirements — also a close second |
| Best Price Finder | 🟡 Possible | Interesting idea but depends on web scraping, which is unreliable |
| Construction Materials Supply | 🟡 Possible | Clear B2B model, but needs real partnerships with suppliers to be useful |
| Photographers Platform | 🟡 Possible | Simple to build, but didn't push us technically |
| Startup Project Management | 🟡 Possible | Already done well by Trello and Notion — hard to add something new |
| Cars Social Media | 🟡 Possible | Market exists, but Syarah and Haraj already cover most of it |
| Real Estate Social Media | ❌ Rejected | Way too big for 3 months — no realistic MVP we could define |
| Investment Social Media | ❌ Rejected | Legal issue — financial advice needs a regulatory license in Saudi Arabia |
| Date Quality via Computer Vision | ❌ Rejected | Needs TensorFlow/OpenCV which we haven't studied |
| AI Children's Tutor + iPad Control | ❌ Rejected | Controlling the iPad isn't possible from a web app |
| AI — Learn to Use AI | ❌ Rejected | Crowded space — YouTube and Coursera do this at a scale we can't compete with |
| Gen-Z Dictionary | ❌ Rejected | Too simple for a 4-person project |
| Beauty & Makeup Platform | ❌ Rejected | Not enough technical depth for what the curriculum expects |

<br>

## 4. Selected MVP

### The Problem

Planning a wedding in Saudi Arabia usually means calling 10+ vendors, comparing prices manually, and coordinating decisions across WhatsApp threads. It's fragmented, slow, and stressful — and the couple is often not even in the same place when making decisions.

The same problem applies to other big events like engagements and family gatherings, but weddings are where the pain is most obvious and the market is biggest.

There's no platform that brings all of this together, and nothing that lets both partners plan as a team.

### Who It's For

- **Primary:** Couples planning their wedding — the platform is built around them
- **Secondary:** Vendors — venues, catering, photographers, decorators — who want to reach couples directly
- **Future scope:** Other event types like engagements and large family events, once the core is solid

### Core Features

- Shared couple workspace — both partners can browse, shortlist, and confirm services together
- Vendor marketplace where vendors post their services, pricing, and availability
- Book individual services (just tables, just a photographer) or go through the full package wizard
- Step-by-step wizard that guides couples from venue to last detail
- AI recommendations based on budget, date, and guest count
- Reviews after the event

### Why We Chose This

Honestly, we kept coming back to it. Every other idea had a reason to say no — too big, too legally risky, needs tools we don't know yet, or just not different enough from what's out there.

This one had a clear problem, a realistic MVP, and something we hadn't seen done well in the Saudi market. The shared couple workspace in particular felt like a real differentiator — no existing platform treats wedding planning as a two-person decision.

It also covers everything the curriculum requires naturally — database, REST API, authentication, frontend, and testing — without us having to force it.

### Challenges We're Expecting

- Real-time sync for the couple workspace will be the trickiest part technically
- Keeping the MVP tight enough to actually ship in 4 weeks
- Making vendor onboarding smooth enough that vendors actually want to sign up

### Opportunities

- No direct competitor in Saudi Arabia doing this end-to-end
- The core platform works for weddings first, then naturally extends to other events
- If we onboard even a few real vendors after graduation, this could become an actual product