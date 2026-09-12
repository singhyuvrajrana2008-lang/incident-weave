# INCIDENTWEAVE

# MASTER UI/UX + FRONTEND BUILD PROMPT

# BUILD THE ENTIRE PRODUCT IN ONE CONTINUOUS EXECUTION

You are the lead product designer, UX architect, interaction designer, and frontend UI engineer for a premium investigation platform called:

# INCIDENTWEAVE

I want you to build the **complete frontend UI/UX and interaction experience from scratch**.

Do not patch an existing IncidentWeave design.

Do not create a static prototype.

Do not create disconnected screens.

Do not produce a generic AI SaaS dashboard.

Build one coherent, polished, responsive, interactive product.

The final result should feel like a **real, expensive professional investigation platform**, ready for a high-level hackathon demonstration.

---

# 1. REFERENCE DESIGN — USE THE PROVIDED ATS PROJECT AS THE DESIGN BENCHMARK

I have provided the code from this Figma Community reference project:

**ATS Resume Analyzer Dashboard — Community**

Use the reference as inspiration for:

* application shell
* persistent sidebar
* information architecture
* dashboard composition
* analytical panel density
* metrics presentation
* progress visualization
* content hierarchy
* tables/lists
* settings patterns
* component reuse
* navigation behavior
* interaction states
* responsive layout
* polished product feel

The reference demonstrates a useful principle:

## Keep lots of information visible without making the interface feel chaotic.

Use that principle heavily.

However:

### DO NOT COPY

Do not copy:

* ATS branding
* resume terminology
* candidate terminology
* HR terminology
* logos
* exact copy
* exact visual assets
* exact illustrations
* exact page content
* exact gradients
* exact layouts where they do not make sense for IncidentWeave

Do not reproduce the reference literally.

Instead:

> Extract the design language and rebuild it around IncidentWeave.

The reference currently uses purple/teal gradient backgrounds, blurred blobs, translucent surfaces and other decorative effects.

Do NOT reproduce those effects as the primary IncidentWeave visual language.

IncidentWeave needs a much more refined visual identity.

---

# 2. WHAT INCIDENTWEAVE ACTUALLY IS

IncidentWeave is an:

# AI-ASSISTED MULTIMODAL INVESTIGATION AND INCIDENT RECONSTRUCTION PLATFORM

An investigator may receive fragmented evidence such as:

* screenshots
* call logs
* PDFs
* documents
* emails
* photos
* audio/transcripts
* text files
* timestamps
* other digital records

The system correlates these pieces of evidence.

It reconstructs:

* chronological events
* evidence relationships
* contradictions
* unknowns/evidence gaps
* confidence
* explainable findings

The core product story is:

FRAGMENTED EVIDENCE
↓
CORRELATION
↓
RECONSTRUCTION
↓
TIMELINE
↓
CONTRADICTIONS
↓
UNKNOWN EVIDENCE
↓
INVESTIGATOR REVIEW

---

# 3. IMPORTANT DOMAIN RULE

THIS IS NOT A CYBERSECURITY PRODUCT.

Do not frame the interface as:

* SOC
* SIEM
* threat monitoring
* malware analysis
* network security
* hacker operations
* cyber attack monitoring
* firewall management

Do not use:

* hacker imagery
* cyberpunk visuals
* terminal screens
* green Matrix text
* server-room imagery
* security dashboard clichés

The domain is:

# INVESTIGATION + EVIDENCE + CORRELATION + CHRONOLOGY

---

# 4. CORE PRODUCT DIFFERENTIATOR

IncidentWeave does not merely analyze files individually.

It connects information across different evidence types.

For example:

CALL LOG
10:14

↓

SCREENSHOT
10:16

↓

DOCUMENT
10:21

↓

RECORDING
references earlier event

↓

IncidentWeave correlates them

↓

TIMELINE

↓

CONTRADICTION

↓

UNKNOWN

This relationship between evidence is the heart of the product.

The UI must make those relationships visually obvious.

---

# 5. DESIGN PHILOSOPHY

Combine:

REFERENCE PRODUCT QUALITY
+
ANALYTICAL DASHBOARD DENSITY
+
INVESTIGATION WORKSPACE
+
CINEMATIC BUT RESTRAINED MOTION

The visual personality should be:

* premium
* intelligent
* investigative
* precise
* composed
* trustworthy
* modern
* analytical
* slightly cinematic
* data-rich
* calm under pressure

The product should feel closer to:

**a premium professional investigation workspace**

than:

**a generic AI startup dashboard**

---

# 6. COLOR SYSTEM

Completely replace the ATS reference's purple/teal visual palette.

Use a sophisticated dark-neutral system.

## BASE

Background:

* #080A0D
* #0B0F14
* #10151C

Surfaces:

* #121820
* #151D26
* #19212B

Raised surfaces:

* #1B2530
* #202B37

Borders:

* subtle cool-gray/blue borders
* low contrast by default
* slightly brighter on hover

## PRIMARY ACCENT

Use restrained electric blue / cyan.

Suggested visual range:

* #38BDF8
* #22D3EE
* #60A5FA

Use the primary accent for:

* active navigation
* primary CTAs
* selected timeline elements
* links
* interactive relationships
* important system state

Do NOT make the whole interface cyan.

---

# 7. SEMANTIC COLORS

## CRIMSON — CONTRADICTIONS

Use for:

* conflicting evidence
* suspicious chronology
* investigation conflicts
* unresolved inconsistencies

Suggested range:

#EF4444
#DC2626
#F05252

Use sparingly.

Do not make everything red.

---

## AMBER — UNKNOWN / UNCERTAINTY

Use for:

* incomplete evidence
* unresolved questions
* medium confidence
* evidence gaps
* needs review

Suggested:

#F59E0B
#FBBF24

---

## GREEN — VERIFIED / HIGH CONFIDENCE

Use for:

* verified evidence
* high-confidence events
* successful processing
* resolved findings

Suggested:

#34D399
#22C55E

---

# 8. BACKGROUND TEXTURE

Use an extremely subtle sense of depth.

Possible techniques:

* very faint noise
* subtle grid
* fine technical lines
* barely visible radial gradients
* restrained depth behind major sections

Do NOT use giant blurry color blobs.

Do NOT use:

* floating gradient blobs
* huge colorful background circles
* excessive glow
* neon everywhere

The background should disappear behind the content.

---

# 9. TYPOGRAPHY

Use a modern professional sans-serif.

Typography must feel sophisticated and dense enough for an analytical application.

Use:

large bold page titles
medium section headings
clear body copy
muted metadata

Use a monospace face selectively for:

* timestamps
* evidence IDs
* filenames
* source references
* metadata
* event IDs
* technical values

Example:

10:14:21 UTC

evidence_0042

call_log.pdf

Do not make the entire UI monospace.

---

# 10. SPACING SYSTEM

Use a disciplined spacing system.

The reference's strongest quality is its organized information density.

Preserve that.

Avoid enormous empty spaces unless deliberately used in a hero section.

Dashboard content should feel information-rich.

---

# 11. CORNER RADIUS

Do not make every component a giant rounded pill.

Use:

small radius for controls
medium radius for panels
slightly larger radius for major containers

Avoid exaggerated:

* 24px+ everything
* pill buttons everywhere
* floating bubble cards

The visual system should feel engineered.

---

# 12. BORDERS

Use subtle 1px borders.

Default:

very low contrast.

Hover:

slightly brighter.

Active:

accent-colored.

Contradiction:

controlled crimson.

Unknown:

controlled amber.

This creates hierarchy without needing huge shadows.

---

# 13. SHADOWS

Use restrained shadows.

Prefer:

* subtle depth
* dark ambient shadows
* very slight elevation

Do NOT use glowing shadows on every panel.

---

# 14. GLOBAL APPLICATION ARCHITECTURE

Build:

PUBLIC WEBSITE

↓

AUTHENTICATION

↓

APPLICATION

Application shell:

SIDEBAR
+
TOP BAR
+
MAIN CONTENT

The app should feel like one consistent system.

---

# 15. LANDING PAGE

Create a complete public website.

Hero:

# WEAVE THE EVIDENCE.

# RECONSTRUCT THE INCIDENT.

Subtitle:

IncidentWeave connects fragmented evidence across screenshots, call records, documents, recordings and other sources to reconstruct what happened, surface contradictions, and reveal what remains unknown.

Primary button:

START AN INVESTIGATION

Secondary:

EXPLORE HOW IT WORKS

---

# 16. HERO VISUAL

This must be highly polished.

Do not use:

* stock image
* generic AI illustration
* robot
* generic dashboard screenshot

Instead create an interactive evidence system.

Show:

[Screenshot]

[Call Log]

[PDF]

[Message]

[Recording]

These are fragmented.

Animate subtle movement.

Then:

Evidence streams converge

↓

CORRELATION

↓

Timeline nodes appear

↓

One relationship becomes red

↓

CONTRADICTION

↓

Another item appears amber

↓

UNKNOWN

The entire hero should communicate the product in seconds.

---

# 17. LANDING PAGE STORYTELLING

Create sections:

1. Hero
2. The Fragmentation Problem
3. The IncidentWeave Approach
4. Evidence Correlation
5. Timeline Reconstruction
6. Contradiction Detection
7. Evidence Gaps / Unknowns
8. Human Investigator Review
9. Product Preview
10. Final CTA

Use scroll-driven transitions.

Use staggered entrances.

Keep the page fast.

---

# 18. PRODUCT NAVIGATION

PUBLIC NAV:

Product
How It Works
Investigation
About
Sign In
Start Investigation

After authentication:

Dashboard
New Investigation
Investigations
Evidence
Timeline
Contradictions
Unknowns
Search

Secondary:

Notifications
Settings
Profile

Logout

---

# 19. AUTHENTICATION — FULL EXPERIENCE

Create fully designed:

## Sign In

Email
Password

Buttons:

Sign In

Links:

Forgot Password
Create Account

States:

idle
focus
validation
loading
success
invalid credentials
network failure

---

# 20. SIGN UP

Fields:

Name
Email
Password
Confirm Password

Include:

password strength
validation messages
loading
success
error

Make the form feel premium and immediate.

---

# 21. FORGOT PASSWORD

Email.

State:

ENTER EMAIL

↓

SENDING

↓

EMAIL SENT

Error state.

Return to Sign In.

---

# 22. LOGOUT

User menu:

Profile
Settings
Logout

Logout should actually transition to the signed-out experience.

Do not create fake dead buttons.

---

# 23. APP SHELL

Follow the reference's strong persistent navigation approach.

Desktop:

approximately 240–270px sidebar

Top navigation:

approximately 64–72px

Main content:

large flexible area

Sidebar:

Logo

Navigation group 1

* Dashboard
* New Investigation
* Investigations

Navigation group 2

* Evidence
* Timeline
* Contradictions
* Unknowns

Navigation group 3

* Search

Bottom:

Notifications
Settings
Profile

Add collapsible sidebar.

Collapsed state should show icons and tooltips.

---

# 24. DASHBOARD

This should be inspired by the reference's analytical dashboard structure.

Do NOT create four boring KPI cards.

Instead:

## HEADER

Welcome / workspace title

Example:

"Investigation Command Center"

Subtitle:

"Monitor active investigations and unresolved evidence."

Primary CTA:

* New Investigation

---

# 25. PRIMARY DASHBOARD PANEL

Create a large Active Investigation panel.

Example:

NORTHBRIDGE INCIDENT

Status:
Analysis Complete

Updated:
Today, 10:24

Evidence:
18

Timeline Events:
27

Contradictions:
3

Unknowns:
5

Overall Confidence:
82%

This should be visually important.

---

# 26. INVESTIGATION HEALTH / COVERAGE

Use an analytical visualization.

Possible:

circular confidence indicator

or:

horizontal evidence coverage

or:

multi-segment state visualization

Example:

Evidence Coverage
82%

Verified
14

Uncertain
3

Missing
5

Do NOT overdo charts.

Every visual must communicate useful information.

---

# 27. RECENT INVESTIGATIONS

Create a polished list/table.

Columns:

Case
Status
Evidence
Contradictions
Unknowns
Confidence
Updated

Example:

Northbridge Incident
Completed
18
3
5
82%
4m ago

Airport Incident
Analyzing
9
1
2
67%
21m ago

Use:

row hover

quick actions

open button

status indicator

---

# 28. ACTIVITY FEED

Show:

10:24
Analysis completed

10:21
Contradiction detected

10:18
Screenshot evidence processed

10:14
Call log uploaded

Use vertical timeline style.

This reinforces the investigation theme.

---

# 29. NEW INVESTIGATION WORKFLOW

Build this as a guided experience.

STEP 1

Create Investigation

Fields:

Title
Description
Incident Date
Notes

STEP 2

Evidence Intake

Drag and drop.

STEP 3

Evidence Review

STEP 4

Reconstruct

---

# 30. EVIDENCE INTAKE SCREEN

This should be a flagship UI.

Create a large drop zone.

Inside:

Upload evidence

"Drop screenshots, call logs, PDFs, documents, recordings or text files here."

Buttons:

Browse Files

Add Folder if appropriate

---

# 31. UPLOAD QUEUE

After files are added show:

icon
filename
type
size
status
progress

Example:

screenshot_01.png
IMAGE
4.2 MB
READY

call_log.pdf
PDF
1.8 MB
PROCESSING

statement.pdf
PDF
700 KB
READY

Use subtle motion as items enter.

---

# 32. EVIDENCE PREVIEW

Selecting evidence opens an inspector.

Show:

preview
filename
type
size
uploaded at
source ID
relevant metadata

Then:

Related Timeline Events

Related Contradictions

Investigator Notes

---

# 33. ANALYSIS START SCREEN

Primary CTA:

# RECONSTRUCT INCIDENT

Under it:

"IncidentWeave will correlate the uploaded evidence, reconstruct the timeline, identify contradictions, and surface unresolved questions."

---

# 34. ANALYSIS EXPERIENCE

This should NOT be a loading spinner.

Create a sophisticated processing experience.

Stages:

01
INGESTING EVIDENCE

02
NORMALIZING TIMESTAMPS

03
CORRELATING SOURCES

04
RECONSTRUCTING EVENTS

05
SEARCHING FOR CONTRADICTIONS

06
IDENTIFYING UNKNOWN EVIDENCE

07
ASSEMBLING TIMELINE

08
INVESTIGATION READY

Animate stage transitions.

Show relevant evidence fragments entering a central system.

Use progress.

Use subtle motion.

---

# 35. ANALYSIS MOTION

When moving between stages:

old stage fades/slides away

new stage enters

progress advances

small evidence nodes move through the correlation layer

timeline nodes progressively appear

At contradiction stage:

one relationship can briefly highlight crimson

At unknown stage:

an unresolved node appears amber

This should look purposeful rather than flashy.

---

# 36. INVESTIGATION RESULT WORKSPACE

This is the most important application screen.

Create:

TOP HEADER

Investigation name

Status

Last analyzed

Evidence count

Actions

MAIN CONTENT

Timeline

RIGHT PANEL

Contradictions / Unknowns / Insights

BOTTOM / SECONDARY:

Evidence relationship explorer

---

# 37. INVESTIGATION HEADER

Example:

NORTHBRIDGE INCIDENT

Analysis Complete

18 Evidence Items

27 Timeline Events

3 Contradictions

5 Unknowns

Actions:

Re-run Analysis

Add Evidence

Export

More

---

# 38. TIMELINE

Timeline should be the central experience.

Each event contains:

timestamp

description

confidence

source evidence

Example:

10:14:21

Call initiated between Person A and Person B.

HIGH CONFIDENCE

Sources:
call_log.pdf
screenshot_02.png

---

# 39. TIMELINE DESIGN

Use a central vertical line or structured chronological layout.

Events appear as nodes.

Colors:

high confidence → green/neutral

medium → amber

low → muted amber/red depending on context

Contradiction relationship → crimson

Selected event → blue

Do not use too many colors simultaneously.

---

# 40. TIMELINE EVENT INTERACTION

On hover:

show quick metadata

On click:

select event

Then animate:

related evidence → highlighted

related contradictions → highlighted

neighboring timeline events → contextual emphasis

This is essential.

---

# 41. CROSS-EVIDENCE LINKING

This is the signature IncidentWeave interaction.

When selecting evidence:

Timeline events connected to it highlight.

When selecting timeline event:

source evidence highlights.

When selecting contradiction:

both source pieces highlight.

Create subtle animated connector lines.

This should make the product feel like it is actually "weaving" evidence.

---

# 42. EVIDENCE RELATIONSHIP VIEW

Create a visual panel.

Example:

CALL LOG


EVENT 04
/       
/         
SCREENSHOT     STATEMENT

Use lines and nodes.

This does not need to become a giant graph.

Keep it readable.

---

# 43. CONTRADICTIONS PANEL

Title:

CONTRADICTIONS

Counter:

03

Each item:

POTENTIAL CONTRADICTION

Source A:

Call Log
10:14 PM

Source B:

Statement
10:21 PM

Issue:

"The recorded sequence differs between the two sources."

Confidence:

High

Action:

Review

---

# 44. CONTRADICTION DETAIL DRAWER

When clicked:

slide in a right-side drawer.

Show:

Title

Why it was detected

Source A

Source B

Timeline positions

Difference

Confidence

Review status

Investigator notes

Actions:

Mark Reviewing
Resolve
Dismiss

---

# 45. UNKNOWN / EVIDENCE GAP PANEL

Title:

UNKNOWN / EVIDENCE GAPS

Example:

EXACT LOCATION REMAINS UNSUPPORTED

Current evidence does not establish location between 21:14 and 21:22.

Potential evidence:

CCTV footage

Location metadata

Additional call records

Action:

Add Evidence

Mark Investigating

---

# 46. EVIDENCE EXPLORER

Create a complete evidence management page.

Top:

Search

Filter

Sort

Filter types:

All
Images
PDF
Documents
Audio
Text

Additional:

Date
Status
Confidence

---

# 47. EVIDENCE TABLE

Columns:

Evidence

Type

Relevant Time

Status

Related Events

Contradictions

Actions

Rows should feel dense but readable.

Use realistic metadata.

---

# 48. EVIDENCE INSPECTOR DRAWER

Click evidence.

Open drawer from right.

Show:

Preview

File information

Timeline references

Contradictions

AI observations

Confidence

Notes

Actions

---

# 49. PREVIOUS INVESTIGATIONS

Create a polished investigation history page.

Features:

Search

Filters

Sort

List/table

Example columns:

Case
Created
Updated
Evidence
Events
Contradictions
Unknowns
Status

---

# 50. SEARCH / COMMAND PALETTE

Global keyboard shortcut:

⌘/Ctrl + K

Search:

Investigations
Evidence
Timeline Events
Contradictions
Unknowns

Results grouped by type.

Keyboard navigation.

Enter opens result.

Escape closes.

---

# 51. NOTIFICATIONS

Notification center.

Examples:

Analysis completed

3 contradictions detected

Evidence processing completed

Unknown evidence identified

Investigation requires review

Use unread indicator.

---

# 52. PROFILE

Create profile page.

Fields:

Name

Email

Role

Avatar

Workspace

Created date

Activity

---

# 53. SETTINGS

Create:

General

Notifications

Appearance

Investigation Preferences

Data Preferences

Use polished controls.

No dead toggles.

---

# 54. COMMAND / SEARCH / GLOBAL INTERACTION

The product should feel fast.

Support:

keyboard shortcuts

hover states

focus states

quick actions

command palette

context menus

toasts

drawers

modals

---

# 55. MOTION SYSTEM

Motion is mandatory.

Use a professional motion language.

PAGE TRANSITIONS

150–350ms

SIDEBAR

smooth width transition

PANELS

fade + small translate

DRAWERS

slide from edge

MODALS

fade + scale

LISTS

staggered reveal

TIMELINE

progressive construction

UPLOADS

slide/fade into queue

ANALYSIS

stage-to-stage transitions

RELATIONSHIPS

animated connection emphasis

TOASTS

short slide/fade

BUTTONS

subtle press feedback

Never use excessive bouncing.

Never animate every component simultaneously.

---

# 56. REDUCED MOTION

Support prefers-reduced-motion.

When enabled:

remove large movement

reduce transitions

keep state changes understandable

---

# 57. RESPONSIVE DESIGN

Desktop is primary.

Support:

1440px
1280px
1024px
768px
390px+

At desktop:

sidebar + full analytical workspace

At tablet:

sidebar collapses

panels stack

At mobile:

sidebar becomes drawer

drawers become full-width sheets

timeline becomes vertical

tables become cards/list rows

No horizontal overflow.

---

# 58. LOADING STATES

Every important page needs skeletons.

Dashboard skeleton.

Investigation skeleton.

Timeline skeleton.

Evidence skeleton.

Do not use only spinning circles.

---

# 59. EMPTY STATES

Create:

No investigations

No evidence

No contradictions

No unknowns

No notifications

No search results

Every empty state should explain:

what happened

why it is empty

what to do next

---

# 60. ERROR STATES

Create:

Authentication error

Upload failure

Analysis failure

Network error

Permission error

Missing investigation

Missing evidence

Give recovery actions.

---

# 61. TOASTS

Examples:

Evidence added

Investigation created

Analysis started

Analysis completed

Contradiction updated

Evidence removed

Settings saved

Use subtle notification motion.

---

# 62. COMPONENT SYSTEM

Create reusable components.

Core:

Button
IconButton
Input
Textarea
Select
Dropdown
Tabs
Badge
StatusBadge
Card
Panel
Dialog
Drawer
Tooltip
Toast
Progress
Skeleton
Avatar
Search
Table
EmptyState
ErrorState

Investigation:

InvestigationHeader
InvestigationCard
EvidenceItem
EvidenceInspector
Timeline
TimelineEvent
TimelineConnector
ContradictionCard
ContradictionDrawer
UnknownCard
EvidenceRelationshipMap
AnalysisProgress
ConfidenceIndicator

Navigation:

Sidebar
Topbar
Breadcrumbs
CommandPalette
UserMenu
NotificationPanel

---

# 63. DATA VISUALIZATION

Use visuals only when they communicate useful investigation information.

Useful:

confidence distribution

evidence coverage

timeline density

contradiction count

unknown count

processing progress

Avoid:

random pie charts

fake analytics

decorative graphs

"AI score" gauges with no explanation

---

# 64. INVESTIGATION SUMMARY VISUAL

Create a concise summary panel.

Example:

Evidence Coverage
78%

Timeline Confidence
84%

Contradictions
03

Unknowns
05

Requires Review
04

This should resemble a professional analytical summary.

---

# 65. HUMAN-IN-THE-LOOP DESIGN

Make human review explicit.

Use labels:

AI OBSERVATION

INFERRED

EVIDENCE-BACKED

UNCERTAIN

INVESTIGATOR REVIEW

Do not make the AI look like a judge.

Never display:

GUILTY

INNOCENT

unless purely in fictional demo content and clearly not an actual conclusion.

The system should surface evidence rather than determine legal guilt.

---

# 66. DEMO CONTENT

Use entirely fictional data.

Example investigation:

"NORTHBRIDGE INCIDENT"

Evidence:

call_log.pdf
message_capture.png
witness_statement.pdf
cctv_frame.png
incident_notes.txt
audio_transcript.txt

Timeline:

10:12:08
10:14:21
10:16:03
10:18:47
10:21:12

Contradictions:

3

Unknowns:

5

Confidence:

82%

This is demo data only.

---

# 67. FRONTEND STATE MODEL

Build the UI so the backend can later replace mock data.

Separate:

data

state

services

UI

Do not hardcode everything inside page components.

Create a central API/data abstraction.

Use realistic states.

Example:

analysisStatus:

idle
uploading
processing
complete
error

investigationStatus:

draft
ready
analyzing
complete
archived

---

# 68. BACKEND INTEGRATION READY

The actual backend will be implemented separately with:

Supabase
Gemini
Next.js APIs

Prepare frontend service abstractions for:

auth

investigations

evidence

analysis

timeline

contradictions

unknowns

notifications

profile

search

Do not embed backend implementation into UI components.

---

# 69. EXPECTED API CONCEPTS

Prepare around:

POST /api/investigations

GET /api/investigations

GET /api/investigations/:id

PATCH /api/investigations/:id

POST /api/investigations/:id/evidence

GET /api/investigations/:id/evidence

POST /api/investigations/:id/analyze

GET /api/investigations/:id/results

GET /api/search

Endpoint names can be changed later, but keep frontend architecture centralized.

---

# 70. AUTH UI MUST BE READY FOR SUPABASE

Do not invent custom password storage.

Design around:

Supabase Sign In
Supabase Sign Up
Supabase Session
Supabase Password Reset
Supabase Sign Out

Keep frontend auth state separate from presentation.

---

# 71. DO NOT OVERUSE CARDS

This is extremely important.

The ATS reference has many reusable card/panel patterns.

Use them where useful.

BUT:

Do not turn every section into a floating card.

Some content should be:

* full-width
* inline
* table-based
* timeline-based
* drawer-based
* panel-based
* border-separated

This will make the design feel significantly more premium.

---

# 72. DO NOT OVERUSE GLASSMORPHISM

The reference may inspire layered surfaces.

Use:

subtle surface differences

instead of:

transparent floating glass everywhere.

The main interface should feel grounded and structured.

---

# 73. DO NOT USE GENERIC AI AESTHETICS

No:

purple AI gradient

robot

brain icon

neural-network background

giant "AI POWERED" badge

magic sparkle overload

Instead communicate intelligence through:

correlation

motion

relationships

analysis

information hierarchy

---

# 74. IMPORTANT VISUAL SIGNATURE

Create a subtle "weaving" motif.

This could be:

fine connecting lines

timeline relationships

evidence source connectors

cross-reference highlights

subtle line animations

Do NOT turn this into a literal thread/spiderweb graphic.

Keep it elegant.

---

# 75. INTERACTION SIGNATURE

The product should feel intelligent when the user explores it.

Example:

Click:

CALL_LOG.PDF

Then:

Timeline event A highlights

Timeline event B highlights

Contradiction 02 highlights

Relevant evidence relationship lines brighten

The user immediately understands:

"These pieces are connected."

That is the experience we want judges to remember.

---

# 76. FINAL APPLICATION STRUCTURE

Create all of these routes/pages:

/

Landing

/sign-in

/sign-up

/forgot-password

/app

/app/dashboard

/app/investigations

/app/investigations/new

/app/investigations/[id]

/app/evidence

/app/timeline

/app/contradictions

/app/unknowns

/app/search

/app/notifications

/app/profile

/app/settings

---

# 77. LANDING / APP CONSISTENCY

The public landing page and application must feel like the same product.

Same:

logo

typography

color tokens

buttons

radius

icons

motion

visual language

---

# 78. ICONOGRAPHY

Use a consistent modern icon family.

Prefer simple line icons.

Avoid mixing multiple icon styles.

Suggested concepts:

Home

Folder

Upload

Image

FileText

Phone

Mic

Clock

GitBranch / relationship

AlertTriangle

HelpCircle

Search

Bell

Settings

User

LogOut

Chevron

MoreHorizontal

---

# 79. MICRO-INTERACTIONS

Add:

button hover

button press

row hover

sidebar active indicator

tooltip

status pulse only when meaningful

file added

file removed

timeline selected

drawer opened

toast arrived

search result focused

notification read

Do not overanimate.

---

# 80. ACCESSIBILITY

Ensure:

keyboard navigation

focus states

readable contrast

semantic labels

accessible dialogs

accessible drawers

screen-reader-friendly controls

reduced-motion support

---

# 81. PERFORMANCE

Keep visual effects lightweight.

Do not create massive continuous animations.

Avoid expensive visual effects across the entire page.

Prioritize:

smooth scrolling

quick navigation

responsive UI

efficient lists

simple CSS motion

---

# 82. FINAL ACCEPTANCE TEST

Before considering the UI complete, manually verify:

LANDING PAGE

↓

START INVESTIGATION

↓

SIGN UP

↓

SIGN IN

↓

DASHBOARD

↓

NEW INVESTIGATION

↓

CREATE CASE

↓

UPLOAD MULTIPLE FILES

↓

REVIEW EVIDENCE

↓

START ANALYSIS

↓

ANALYSIS ANIMATION

↓

INVESTIGATION READY

↓

TIMELINE

↓

SELECT TIMELINE EVENT

↓

RELATED EVIDENCE HIGHLIGHTS

↓

SELECT EVIDENCE

↓

RELATED TIMELINE HIGHLIGHTS

↓

SELECT CONTRADICTION

↓

SOURCE A + SOURCE B HIGHLIGHT

↓

VIEW UNKNOWN

↓

EVIDENCE EXPLORER

↓

SEARCH

↓

NOTIFICATIONS

↓

PROFILE

↓

SETTINGS

↓

LOGOUT

↓

LANDING PAGE

Every button must have a meaningful interaction.

Every major page must have:

loading

empty

error

success

states.

---

# 83. FINAL VISUAL QUALITY BAR

The final product should feel like:

### A premium analytical dashboard

inspired by the strong organizational qualities of the ATS reference

*

### A professional investigation workspace

built around evidence correlation

*

### A cinematic evidence-reconstruction experience

through meaningful motion

*

### A restrained dark visual system

with blue/cyan interaction, crimson contradiction, amber uncertainty, green verification

It should NOT feel like:

an ATS clone

a cybersecurity dashboard

a generic AI SaaS template

a Figma starter project

an AI-generated card grid

---

# 84. MOST IMPORTANT PRIORITIES

Prioritize in this order:

1. PRODUCT CLARITY
2. INFORMATION HIERARCHY
3. REAL INTERACTIONS
4. INVESTIGATION WORKFLOW
5. EVIDENCE RELATIONSHIPS
6. TIMELINE EXPERIENCE
7. VISUAL POLISH
8. MOTION
9. RESPONSIVENESS
10. DECORATION

Function before decoration.

Meaningful interaction before flashy animation.

Clarity before visual complexity.

---

# 85. FINAL COMMAND

Build the entire IncidentWeave UI/UX as a unified product.

Do not stop after creating the dashboard.

Do not stop after creating the landing page.

Do not leave authentication as a visual placeholder.

Do not leave buttons inactive.

Do not create fake screens that cannot connect to a backend.

Create the reusable frontend architecture, component system, route structure, states, interactions, responsive behavior, realistic demo data, and polished visual system needed for the complete hackathon product.

Use the supplied ATS reference for **quality, information density, analytical layout discipline, and application structure**.

But make IncidentWeave visually and conceptually its own product.

The final product should make a judge think:

> "They didn't just wrap Gemini in a website. They designed an actual investigation workflow."

The central visual narrative must always remain:

# FRAGMENTED EVIDENCE

# ↓

# CONNECTED EVIDENCE

# ↓

# RECONSTRUCTED TIMELINE

# ↓

# CONTRADICTIONS

# ↓

# UNKNOWN EVIDENCE

# ↓

# HUMAN INVESTIGATION

Build the complete experience now.
