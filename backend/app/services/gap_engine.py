from typing import Dict, List, Any

# PLACEHOLDER SEED TABLE: Maps official MoSPI / NSSTA roles to target competency benchmark levels (0-100).
# NOTE: This is a placeholder seed matrix for demo/development purposes.
# To be replaced with authoritative NSSTA Cadre Competency Matrix from central database in future iterations.
ROLE_REQUIRED_LEVELS: Dict[str, Dict[str, float]] = {
    "Joint Director": {
        "statistical": 85.0,
        "technical": 80.0,
        "digital_governance": 75.0,
        "behavioural": 75.0,
    },
    "Senior Joint Director / Director (Field Operations)": {
        "statistical": 85.0,
        "technical": 80.0,
        "digital_governance": 75.0,
        "behavioural": 80.0,
    },
    "Director": {
        "statistical": 90.0,
        "technical": 80.0,
        "digital_governance": 80.0,
        "behavioural": 85.0,
    },
    "Deputy Director": {
        "statistical": 75.0,
        "technical": 70.0,
        "digital_governance": 65.0,
        "behavioural": 65.0,
    },
    "Senior Statistical Officer": {
        "statistical": 70.0,
        "technical": 65.0,
        "digital_governance": 60.0,
        "behavioural": 55.0,
    },
    "Deputy Director General": {
        "statistical": 90.0,
        "technical": 85.0,
        "digital_governance": 85.0,
        "behavioural": 90.0,
    },
}

# Fallback default benchmark if specific role is not in the placeholder seed table:
DEFAULT_REQUIRED_LEVELS: Dict[str, float] = {
    "statistical": 80.0,
    "technical": 75.0,
    "digital_governance": 70.0,
    "behavioural": 70.0,
}

DOMAIN_DISPLAY_NAMES = {
    "statistical": "Statistical Competency",
    "technical": "Technical Competency",
    "digital_governance": "Digital Governance",
    "behavioural": "Behavioural & Managerial Competency",
}


def evaluate_officer_gaps(role: str, domain_scores: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Deterministic rule-based Gap Engine comparing officer domain scores against role benchmark levels.
    Fulfills PRD NFR: 100% rule-based comparison (NOT an LLM call).
    Fulfills PRD Explainability mandate: Every gap includes a plain-language reason string.
    """
    required = ROLE_REQUIRED_LEVELS.get(role, DEFAULT_REQUIRED_LEVELS)
    detected_gaps: List[Dict[str, Any]] = []

    for domain_key, req_score in required.items():
        curr_score = domain_scores.get(domain_key, 0.0)
        gap_delta = round(req_score - curr_score, 1)

        if gap_delta > 0:
            if gap_delta >= 20.0:
                severity = "HIGH"
            elif gap_delta >= 10.0:
                severity = "MEDIUM"
            else:
                severity = "LOW"

            domain_label = DOMAIN_DISPLAY_NAMES.get(domain_key, domain_key.title())

            reason_text = (
                f"Current {domain_label} score is {curr_score}%, which is {gap_delta}% below "
                f"the required level of {req_score}% for the {role} benchmark."
            )

            description = f"Competency gap detected in {domain_label} for target role '{role}'."

            detected_gaps.append({
                "domain": domain_key,
                "description": description,
                "severity": severity,
                "reason_text": reason_text,
                "status": "OPEN",
                "gap_delta": gap_delta,
            })

    severity_rank = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}
    detected_gaps.sort(key=lambda g: (severity_rank.get(g["severity"], 0), g["gap_delta"]), reverse=True)

    return detected_gaps
