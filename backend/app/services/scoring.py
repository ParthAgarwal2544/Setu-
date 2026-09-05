from typing import Dict, Any, List

def calculate_domain_scores(profile_data: Dict[str, Any]) -> Dict[str, float]:
    """
    Deterministic rule-based domain scoring engine for Setu Officer Profile.
    Evaluates profile input against the 4 PS-defined competency domains:
    1. Statistical Competency (statistical)
    2. Technical Competency (technical)
    3. Digital Governance Competency (digital_governance)
    4. Behavioural / Managerial Competency (behavioural)
    
    This function is 100% rule-based and explainable (non-LLM per PRD NFR).
    """
    role = str(profile_data.get("role", "") or profile_data.get("designation", "")).strip()
    department = str(profile_data.get("department", "") or profile_data.get("ministry", "")).strip()
    education = str(profile_data.get("education", "")).strip()
    
    try:
        experience = float(profile_data.get("experience", 0) or 0)
    except (ValueError, TypeError):
        experience = 0.0

    past_training = profile_data.get("past_training", {})
    tools: Dict[str, float] = {}
    specializations: List[str] = []
    surveys: List[str] = []

    if isinstance(past_training, dict):
        tools = past_training.get("tools", {}) or {}
        specializations = past_training.get("specializations", []) or []
        surveys = past_training.get("surveysConducted", []) or past_training.get("surveys", []) or []
    elif isinstance(past_training, list):
        for item in past_training:
            if isinstance(item, str):
                specializations.append(item)

    # Tool proficiency extraction (0-100 defaults if not provided)
    r_val = float(tools.get("r", 50))
    stata_val = float(tools.get("stata", 50))
    python_val = float(tools.get("python", 50))
    sql_val = float(tools.get("sql", 50))
    gis_val = float(tools.get("gis", 40))
    pyspark_val = float(tools.get("pyspark", 30))

    # --- 1. STATISTICAL DOMAIN SCORE ---
    edu_lower = education.lower()
    stat_base = 50.0 if any(kw in edu_lower for kw in ["m.sc", "ph.d", "master", "statistics", "stat"]) else 30.0
    
    stat_specs = {"Sampling Theory", "National Accounts", "Econometric Modeling", "Survey Calibration", "Time Series Forecasting"}
    spec_matches = sum(1 for s in specializations if any(kw.lower() in s.lower() for kw in stat_specs))
    stat_spec_bonus = min(30.0, spec_matches * 10.0)
    
    stat_tool_bonus = ((r_val + stata_val) / 2.0) * 0.25
    survey_bonus = min(20.0, len(surveys) * 5.0)
    
    statistical_score = round(min(100.0, max(10.0, stat_base + stat_spec_bonus + stat_tool_bonus + survey_bonus)), 1)

    # --- 2. TECHNICAL DOMAIN SCORE ---
    tech_base = 20.0
    tech_tool_bonus = ((python_val * 0.35) + (sql_val * 0.35) + (pyspark_val * 0.30)) * 0.6
    tech_spec_bonus = 15.0 if any("machine learning" in s.lower() or "econometric" in s.lower() or "gis" in s.lower() for s in specializations) else 0.0
    tech_exp_bonus = min(15.0, experience * 1.5)
    
    technical_score = round(min(100.0, max(10.0, tech_base + tech_tool_bonus + tech_spec_bonus + tech_exp_bonus)), 1)

    # --- 3. DIGITAL GOVERNANCE DOMAIN SCORE ---
    dig_base = 30.0
    gis_bonus = (gis_val * 0.35)
    dept_lower = department.lower()
    gov_dept_bonus = 15.0 if any(kw in dept_lower for kw in ["mospi", "nssta", "governance", "ministry", "statistical"]) else 5.0
    gov_tool_bonus = ((python_val + sql_val) / 2.0) * 0.20
    survey_gov_bonus = min(15.0, len(surveys) * 4.0)

    digital_governance_score = round(min(100.0, max(10.0, dig_base + gis_bonus + gov_dept_bonus + gov_tool_bonus + survey_gov_bonus)), 1)

    # --- 4. BEHAVIOURAL / MANAGERIAL DOMAIN SCORE ---
    beh_base = 35.0
    beh_exp_bonus = min(35.0, experience * 2.5)
    
    role_lower = role.lower()
    if "ddg" in role_lower or "deputy director general" in role_lower:
        role_bonus = 30.0
    elif "director" in role_lower and "joint" not in role_lower and "deputy" not in role_lower:
        role_bonus = 25.0
    elif "joint director" in role_lower:
        role_bonus = 20.0
    elif "deputy director" in role_lower:
        role_bonus = 15.0
    elif "senior statistical officer" in role_lower or "sso" in role_lower:
        role_bonus = 10.0
    else:
        role_bonus = 8.0

    behavioural_score = round(min(100.0, max(10.0, beh_base + beh_exp_bonus + role_bonus)), 1)

    return {
        "statistical": statistical_score,
        "technical": technical_score,
        "digital_governance": digital_governance_score,
        "behavioural": behavioural_score,
    }
