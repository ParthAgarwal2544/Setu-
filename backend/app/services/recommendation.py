import os
import math
from typing import List, Dict, Any
import numpy as np

try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

KEYWORD_VOCABULARY = [
    "python", "pandas", "pyspark", "spark", "r", "stata", "sql", "database",
    "sampling", "survey", "microdata", "national accounts", "gdp", "gva",
    "gis", "qgis", "spatial", "geospatial", "privacy", "governance", "dpdp",
    "econometrics", "causal", "time series", "arima", "cpi", "inflation",
    "leadership", "management", "administration", "procurement", "gfr",
    "plfs", "asi", "hces", "sut", "calibration", "variance", "outlier"
]


def generate_fallback_embedding(text: str) -> List[float]:
    """
    Deterministic TF-IDF style term frequency vector embedding over domain vocabulary keywords.
    Ensures vector search works reliably in all test & offline environments.
    """
    text_lower = text.lower()
    vec = []
    for kw in KEYWORD_VOCABULARY:
        count = text_lower.count(kw)
        vec.append(float(count))

    norm = math.sqrt(sum(v * v for v in vec))
    if norm > 0:
        vec = [v / norm for v in vec]
    else:
        vec = [1.0 / len(KEYWORD_VOCABULARY)] * len(KEYWORD_VOCABULARY)
    return vec


def generate_text_embedding(text: str) -> List[float]:
    """
    Generates text embedding using Gemini's text-embedding-004 model if API key is configured,
    otherwise falls back to deterministic term frequency vector embedding.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if HAS_GENAI and api_key:
        try:
            genai.configure(api_key=api_key)
            res = genai.embed_content(
                model="models/text-embedding-004",
                content=text,
            )
            if "embedding" in res:
                return res["embedding"]
        except Exception as e:
            print(f"Gemini embedding API call fallback: {e}")

    return generate_fallback_embedding(text)


def compute_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    a = np.array(vec_a, dtype=float)
    b = np.array(vec_b, dtype=float)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return float(np.dot(a, b) / (norm_a * norm_b))


def rank_courses_for_officer_gaps(
    open_gaps: List[Dict[str, Any]],
    courses: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    FR5 Recommendation Engine: Semantic vector match between officer open gaps and course catalog,
    ranked by relevance score (combining cosine similarity & domain alignment).
    """
    if not open_gaps:
        # No open gaps -> return courses with default scores
        ranked = []
        for c in courses:
            item = dict(c)
            item["relevance_score"] = 0.5
            item["is_gap_match"] = False
            item["matched_gap_domain"] = None
            item["relevance_reason"] = "General recommended course for continuous cadre professional development."
            ranked.append(item)
        return ranked

    # Construct query string from officer open gaps
    gap_domains = [g.get("domain", "") for g in open_gaps]
    gap_texts = [f"{g.get('domain', '')}: {g.get('description', '')} {g.get('reason_text', '')}" for g in open_gaps]
    query_text = " ".join(gap_texts)

    query_vec = generate_text_embedding(query_text)

    ranked_courses = []
    for c in courses:
        item = dict(c)
        course_text = f"{c.get('title', '')} {c.get('description', '')} {' '.join(c.get('skills', []))}"
        
        # Use existing course embedding if precomputed, else generate
        course_vec = c.get("embedding")
        if not course_vec:
            course_vec = generate_text_embedding(course_text)
            item["embedding"] = course_vec

        sim = compute_cosine_similarity(query_vec, course_vec)

        # Domain alignment bonus
        c_domain = c.get("domain", "")
        domain_matched = c_domain in gap_domains

        final_relevance = round(sim * 0.7 + (0.3 if domain_matched else 0.0), 3)
        item["relevance_score"] = final_relevance
        item["is_gap_match"] = domain_matched or final_relevance > 0.35
        matched_dom = c_domain if domain_matched else (gap_domains[0] if gap_domains else "Statistical Methodology")
        item["matched_gap_domain"] = matched_dom

        if domain_matched:
            item["relevance_reason"] = f"AI Vector Matched (Score: {final_relevance}): Directly addresses your open competency gap in {matched_dom.replace('_', ' ').title()} identified in evaluation."
        else:
            item["relevance_reason"] = f"Curriculum Alignment (Score: {final_relevance}): Complements your ISS cadre profile requirements."

        ranked_courses.append(item)

    # Sort courses by relevance score descending
    ranked_courses.sort(key=lambda x: x["relevance_score"], reverse=True)
    return ranked_courses
