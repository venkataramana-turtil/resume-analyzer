export const SYSTEM_PROMPT = `You are an expert technical recruiter and compensation analyst with 15+ years of experience placing engineers and product professionals at companies ranging from Fortune 500 enterprises to seed-stage startups.

Your expertise covers:
- ATS (Applicant Tracking System) algorithms — you know exactly which signals cause resumes to be filtered out before a human sees them
- Compensation data grounded in real salary statistics aggregated from Glassdoor, Levels.fyi, AmbitionBox, LinkedIn Salary, Blind, Payscale, and Kompas for 2025-2026 — across service-based firms, product companies, startups, and freelance/contract markets
- Skills demand trends, emerging technologies, and what hiring managers are actually looking for right now

When producing salary figures, reason as follows:
- Cross-reference the role, seniority level, skills stack, and target market against known compensation bands reported on Glassdoor, AmbitionBox, Levels.fyi, LinkedIn Salary Insights, and Blind community data
- CRITICAL: Always use the salary data specific to the target market country — never apply US salary figures to India, UK, or any other market
- For India: primary sources are AmbitionBox, Glassdoor India, and Levels.fyi India-specific data; factor in city tier (Bangalore/Mumbai/Hyderabad vs tier-2 cities); salaries should reflect what Indian companies actually pay in INR
- For US: use Levels.fyi US data, Glassdoor US, and LinkedIn Salary US; factor in HCOL vs MCOL locations
- For UK: use Glassdoor UK, Totaljobs, LinkedIn Salary UK, and Levels.fyi UK data in GBP
- For Germany/Netherlands: use Glassdoor DE/NL, LinkedIn Salary EU, and Levels.fyi Europe data in EUR
- For Canada: use Glassdoor Canada and Levels.fyi Canada data in CAD
- For Australia: use Glassdoor Australia and Levels.fyi Australia data in AUD
- For Singapore: use Glassdoor SG, NodeFlair, and Levels.fyi Singapore data in SGD
- For UAE: use Glassdoor UAE and regional compensation surveys in AED
- For Remote/Global: use USD benchmarks from Glassdoor and Levels.fyi global remote roles
- Always output numbers that a candidate would recognise as accurate if they searched these platforms for their specific country — not inflated, not generic, never cross-contaminated with another country's pay scale

Approach every resume analysis like a senior hiring partner doing a thorough pre-screen. Think step by step:
1. First extract all factual details from the resume (name, role, timeline, skills, education)
2. Then evaluate the resume's ATS performance against each specific check
3. Then benchmark compensation using real market data from the platforms above for this exact role + seniority + market combination
4. Finally assess market fit against current 2025-2026 hiring conditions for this profile

Be specific and honest. Vague feedback helps no one. Always respond in English.
You must output ONLY a valid JSON object — no markdown fences, no preamble, no commentary.`;

const marketContext = (market, roles) =>
`Target market: ${market.name}
Salary currency: ${market.currency} (${market.sym.trim()})
All salary figures must be in ${market.currency}, benchmarked specifically against ${market.name} hiring norms for 2025-2026. Use company names that are well-known and representative of the ${market.name} tech industry for each tier (service-based, product-based, startups, freelance). If the candidate's resume shows international experience but the target market is ${market.name}, calibrate to what they could realistically earn in ${market.name}.
${roles.length ? `\nTarget roles the candidate is pursuing: ${roles.join(', ')}.\nFactor these target roles into your salary ranges, hire_confidence scoring, benchmark_summary, and roles_recommended — assess how well this candidate's current profile aligns with those specific aspirations and what gaps exist between where they are now and those goals.` : ''}`;

// Call A — candidate profile + ATS + improvement plan
export const buildMessagesA = (text, market, roles = []) => [
  { role: 'system', content: SYSTEM_PROMPT },
  {
    role: 'user',
    content: `${marketContext(market, roles)}

Analyze the resume below and return a JSON object with EXACTLY this structure (no other keys):

{
  "candidate": {
    "name": "extracted full name or Unknown",
    "role": "inferred current or target job title",
    "experience_years": <CRITICAL: count exact months for every role by subtracting start date from end date (e.g. Jun 2022 to Feb 2025 = 32 months), sum all roles, divide total months by 12, keep 2 decimal places — e.g. 32 ÷ 12 = 2.67. NEVER round to a whole number. NEVER approximate. If a role is ongoing use the current date Feb 2026>,
    "seniority": "Junior | Mid | Senior | Lead | Principal | Executive",
    "top_skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
    "education": "highest qualification (degree + field + institution if present)",
    "location_hint": "city/country inferred from resume or Not specified"
  },
  "ats": {
    "score": <integer 0-100>,
    "verdict": "Poor | Needs Work | Good | Excellent",
    "passed_checks": [
      { "label": "Contact information present (name, email, phone)", "status": <bool>, "note": "specific observation" },
      { "label": "Clean formatting — no tables, graphics, or columns", "status": <bool>, "note": "specific observation" },
      { "label": "Standard section headings (Experience, Education, Skills)", "status": <bool>, "note": "specific observation" },
      { "label": "Quantified achievements (numbers, %, impact)", "status": <bool>, "note": "specific observation" },
      { "label": "Strong keyword density for role", "status": <bool>, "note": "specific observation" },
      { "label": "No spelling or grammar issues", "status": <bool>, "note": "specific observation" },
      { "label": "Text is machine-readable (not image-based)", "status": <bool>, "note": "specific observation" },
      { "label": "Appropriate length (1-2 pages ideal)", "status": <bool>, "note": "specific observation" },
      { "label": "No personal photo or irrelevant details", "status": <bool>, "note": "specific observation" },
      { "label": "Action verbs lead bullet points", "status": <bool>, "note": "specific observation" }
    ],
    "critical_issues": ["specific issue that will cause ATS rejection"],
    "quick_wins": ["specific, actionable change that would meaningfully improve ATS score"]
  },
}

Rules:
- ATS score should reflect actual ATS algorithm behaviour, not just resume quality
- critical_issues and quick_wins must be concrete and actionable, not generic
- Output raw JSON only — no markdown, no text outside the object

Resume text:
${text}`
  }
];

// Call B — salary benchmarks + personal salary + market fit + candidate vs market
export const buildMessagesB = (text, market, roles = []) => [
  { role: 'system', content: SYSTEM_PROMPT },
  {
    role: 'user',
    content: `${marketContext(market, roles)}

Analyze the resume below and return a JSON object with EXACTLY this structure (no other keys):

{
  "improvement_plan": {
    "potential_score": <integer — realistic ATS score achievable after all tips below are applied>,
    "tips": [
      {
        "priority": "Critical | High | Medium",
        "category": "Achievements | Keywords | Formatting | Contact | Structure | Length | Verbs | Clarity",
        "title": "short imperative title (max 8 words)",
        "detail": "specific, actionable instruction — include a concrete example or exact wording where helpful",
        "score_impact": <integer — ATS points this single fix adds>
      }
    ]
  },
  "salary": {
    "currency": "${market.currency}",
    "service_based": {
      "label": "Service Based (TCS, Infosys, Wipro, Accenture)",
      "min": <integer>,
      "max": <integer>,
      "median": <integer>,
      "note": "1-sentence context on why these numbers fit this profile"
    },
    "product_based": {
      "label": "Product Based (Google, Microsoft, Adobe, Atlassian)",
      "min": <integer>,
      "max": <integer>,
      "median": <integer>,
      "note": "1-sentence context"
    },
    "startup": {
      "label": "Startups & Scale-ups",
      "min": <integer>,
      "max": <integer>,
      "median": <integer>,
      "note": "1-sentence context"
    },
    "freelance": {
      "label": "Freelance / Contract",
      "min": <integer>,
      "max": <integer>,
      "median": <integer>,
      "note": "1-sentence context (annualised equivalent)"
    }
  },
  "personal_salary": {
    "floor": <integer - the absolute minimum this candidate should accept; walking away below this is rational>,
    "target": <integer - what they should confidently lead with in any negotiation; defensible based on their profile>,
    "stretch": <integer - ambitious but realistic ceiling; achievable at top-band companies or with competing offers>,
    "currency": "${market.currency}",
    "rationale": "2-3 sentences explaining why these specific numbers fit THIS candidate — cite their actual seniority, standout skills, and location signals. Be direct and specific, not generic.",
    "negotiation_tips": [
      "specific, actionable tip tailored to this candidate's profile",
      "specific, actionable tip tailored to this candidate's profile"
    ]
  },
  "market_fit": {
    "hire_confidence": <integer 0-100>,
    "confidence_label": "Unlikely | Possible | Likely | Strong | Exceptional",
    "benchmark_summary": "2-3 sentences on how this candidate stacks up against current 2025-2026 market demand for this role",
    "strengths": ["concrete differentiator 1", "concrete differentiator 2", "concrete differentiator 3"],
    "gaps": ["specific gap vs market demand 1", "specific gap vs market demand 2"],
    "roles_recommended": ["best-fit role title 1", "best-fit role title 2", "best-fit role title 3"]
  },
  "candidate_vs_market": {
    "overall_standing": "Top 10% | Top 25% | Average | Below Average | Entry Level",
    "standing_percentile": <integer 0-100 — where this candidate ranks vs typical applicants for this role in this market>,
    "summary": "2-3 sentences comparing this candidate holistically to the average applicant pool for this role and market — be direct and specific",
    "dimensions": [
      { "name": "Technical Skills",        "candidate_score": <1-10>, "market_avg_score": <1-10>, "note": "1-line specific context" },
      { "name": "Experience Depth",         "candidate_score": <1-10>, "market_avg_score": <1-10>, "note": "1-line specific context" },
      { "name": "Achievement Impact",       "candidate_score": <1-10>, "market_avg_score": <1-10>, "note": "1-line specific context" },
      { "name": "Education & Credentials", "candidate_score": <1-10>, "market_avg_score": <1-10>, "note": "1-line specific context" },
      { "name": "Domain Expertise",         "candidate_score": <1-10>, "market_avg_score": <1-10>, "note": "1-line specific context" },
      { "name": "Resume Presentation",      "candidate_score": <1-10>, "market_avg_score": <1-10>, "note": "1-line specific context" }
    ],
    "pros": [
      { "category": "Technical | Experience | Education | Achievements | Domain | Portfolio | Soft Skills", "title": "max 6-word title", "detail": "specific advantage vs average applicant in this market" }
    ],
    "cons": [
      { "category": "Technical | Experience | Education | Achievements | Domain | Portfolio | Soft Skills", "title": "max 6-word title", "detail": "specific gap vs average applicant — be honest and direct" }
    ]
  }
}

Important distinction:
- "salary" = what the market broadly pays across company types for someone at this level
- "personal_salary" = what THIS specific person can command based on their actual resume — their unique combination of skills, tenure, achievements, and the target market. Floor/target/stretch must be internally consistent and fall within the relevant salary ranges above.

Rules:
- improvement_plan.tips must be sorted by score_impact descending; total score_impact of all tips should approximately equal (potential_score - ats.score); minimum 5 tips, cover diverse categories
- Salary figures must reflect real market data from Glassdoor, AmbitionBox, Levels.fyi, LinkedIn Salary, and Blind for this exact role + seniority + target market — numbers must match what a candidate would find if they searched these platforms today; do not inflate or use placeholder numbers
- hire_confidence benchmarks against 2025-2026 hiring conditions specifically
- candidate_vs_market.dimensions must contain exactly the 6 named dimensions in the order listed; scores are 1-10 relative to the average applicant pool for this role and market; pros must have 3-5 items and cons must have 3-5 items, each covering distinct categories
- Output raw JSON only — no markdown, no text outside the object

Resume text:
${text}`
  }
];

// Legacy export kept for compatibility — not used in parallel mode
export const buildMessages = buildMessagesA;
