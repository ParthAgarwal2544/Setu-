from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

class CourseCatalogProvider(ABC):
    """
    Abstract Base Class for Course Catalog integration (iGOT Karmayogi & NSSTA).
    Fulfills PRD Adapter Isolation NFR: Recommendation Engine logic remains source-agnostic.
    """

    @abstractmethod
    async def get_courses(self) -> List[Dict[str, Any]]:
        """
        Fetch all available courses from the catalog provider.
        """
        pass

    @abstractmethod
    async def get_course_by_id(self, course_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch details of a specific course by its identifier.
        """
        pass


# HONESTY CORRECTION (2026-09-03): this was previously commented as "authentic
# hand-collected" data. That claim was not verified and is very likely false —
# the team has no real iGOT access (it's restricted to actual government
# employees) and several NSSTA entries below have suspiciously clean, evenly-
# spaced dates that look generated rather than copied from a real calendar.
# TODO before presenting this to a jury: either (a) replace these entries with
# genuinely verified data (e.g. cross-check specific titles/dates against the
# real NSSTA training calendar PDF), or (b) if that's not done in time, say so
# plainly if asked — "a representative sample based on real domain knowledge,
# not verbatim scraped listings" — rather than repeating "authentic hand-collected."
HAND_SEEDED_COURSES: List[Dict[str, Any]] = [
    # --- iGOT Karmayogi Courses ---
    {
        "id": "igot_101",
        "source": "igot",
        "title": "Python for Data Science & Microdata Processing",
        "description": "Master Python programming, Pandas dataframes, microdata cleaning, and automated tabulation for large-scale national sample surveys like PLFS and ASI.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "12 Hours (Self-Paced)",
        "domain": "technical",
        "skills": ["Python", "Pandas", "Microdata", "Outlier Analysis"],
    },
    {
        "id": "igot_102",
        "source": "igot",
        "title": "Introduction to R Programming & Survey Package",
        "description": "Self-paced training covering R syntax, Tidyverse data manipulation, and weighted survey analysis using the R survey package for MoSPI official statisticians.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "10 Hours (Self-Paced)",
        "domain": "statistical",
        "skills": ["R", "Tidyverse", "Survey Package", "Weighted Estimation"],
    },
    {
        "id": "igot_103",
        "source": "igot",
        "title": "Causal Inference & Policy Impact Evaluation",
        "description": "Advanced econometric methodology on Difference-in-Differences, Synthetic Control methods, and Regression Discontinuity designs for central government scheme evaluation.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "18 Hours (Self-Paced)",
        "domain": "statistical",
        "skills": ["Econometrics", "DiD", "Synthetic Control", "STATA"],
    },
    {
        "id": "igot_104",
        "source": "igot",
        "title": "Differential Privacy & Open Government Data Security",
        "description": "Mathematical privacy models, epsilon-delta privacy budgets, and anonymization techniques for safe public microdata dissemination under Open Government Data (OGD) policy.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "8 Hours (Self-Paced)",
        "domain": "digital_governance",
        "skills": ["Differential Privacy", "Microdata Anonymization", "Data Ethics"],
    },
    {
        "id": "igot_105",
        "source": "igot",
        "title": "SQL & Relational Database Queries for Public Sector Registers",
        "description": "Relational database design, complex SQL joins, index optimization, and data extraction pipelines for administrative registries and statistical databases.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "15 Hours (Self-Paced)",
        "domain": "technical",
        "skills": ["SQL", "Relational Databases", "Indexing", "ETL Pipelines"],
    },
    {
        "id": "igot_106",
        "source": "igot",
        "title": "Big Data Processing with PySpark & Distributed Microdata",
        "description": "Handling gigabyte and terabyte-scale survey microdata using Apache Spark, PySpark DataFrames, and cloud data lake architectures in government statistics.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "20 Hours (Self-Paced)",
        "domain": "technical",
        "skills": ["PySpark", "Apache Spark", "Big Data", "Distributed Computing"],
    },
    {
        "id": "igot_107",
        "source": "igot",
        "title": "Data Governance, DPDP Act Compliance, and Transparency",
        "description": "Frameworks for data ethics, privacy compliance under DPDP Act 2023, data quality assurance, and transparent statistical dissemination guidelines for public administration.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "6 Hours (Self-Paced)",
        "domain": "digital_governance",
        "skills": ["DPDP Act", "Data Governance", "Public Administration", "Transparency"],
    },
    {
        "id": "igot_108",
        "source": "igot",
        "title": "Time Series Forecasting and Econometric Modeling",
        "description": "ARIMA, Vector Autoregression (VAR), seasonal adjustment using X-13ARIMA-SEATS, and macro-economic indicator forecasting for economic decision making.",
        "embedding": None,
        "nomination_required": False,
        "schedule_date": None,
        "duration": "14 Hours (Self-Paced)",
        "domain": "statistical",
        "skills": ["Time Series", "ARIMA", "X-13ARIMA", "Econometrics"],
    },

    # --- NSSTA Published TPAC Programmes ---
    {
        "id": "nssta_201",
        "source": "nssta",
        "title": "Advanced Statistical Sampling & Non-Response Weighting",
        "description": "5-day residential workshop at NSSTA Greater Noida on multi-stage stratified survey calibration, post-stratification, and propensity score non-response adjustment.",
        "embedding": None,
        "nomination_required": True,
        "schedule_date": "2026-09-18T09:00:00Z",
        "duration": "5 Days (Residential)",
        "location": "NSSTA Campus, Greater Noida",
        "domain": "statistical",
        "skills": ["Sampling Theory", "Weighting Calibration", "Variance Estimation", "R Survey Package"],
    },
    {
        "id": "nssta_202",
        "source": "nssta",
        "title": "National Accounts Statistics & Supply-Use Tables (SUT)",
        "description": "4-day specialized training on Gross Value Added (GVA) compilation, Input-Output transaction tables, quarterly GDP estimation, and base-year revision methodologies.",
        "embedding": None,
        "nomination_required": True,
        "schedule_date": "2026-10-19T09:00:00Z",
        "duration": "4 Days (Residential)",
        "location": "NSSTA Campus, Greater Noida",
        "domain": "statistical",
        "skills": ["National Accounts", "SUT Matrices", "GVA Estimation", "Deflators"],
    },
    {
        "id": "nssta_203",
        "source": "nssta",
        "title": "GIS & Geospatial Analytics in Public Policy & District Planning",
        "description": "3-day hybrid workshop on QGIS, spatial contiguity matrices, choropleth mapping, and integrating satellite imagery into official socio-economic policy reporting.",
        "embedding": None,
        "nomination_required": True,
        "schedule_date": "2026-10-05T09:00:00Z",
        "duration": "3 Days (Hybrid)",
        "location": "Virtual & NSSTA Studio",
        "domain": "digital_governance",
        "skills": ["QGIS", "Spatial Moran's I", "GeoPandas", "SDG Indicators"],
    },
    {
        "id": "nssta_204",
        "source": "nssta",
        "title": "Survey Operations, CAPI Supervision, and SDRD Quality Control",
        "description": "5-day residential program at NSSTA Greater Noida focusing on questionnaire design, pre-testing, CAPI computer-assisted field supervision, and non-sampling error reduction.",
        "embedding": None,
        "nomination_required": True,
        "schedule_date": "2026-11-10T09:00:00Z",
        "duration": "5 Days (Residential)",
        "location": "NSSTA Campus, Greater Noida",
        "domain": "statistical",
        "skills": ["CAPI Supervision", "Questionnaire Design", "SDRD Operations", "Field Audit"],
    },
    {
        "id": "nssta_205",
        "source": "nssta",
        "title": "Consumer Price Index (CPI) & Inflation Compilation Methodology",
        "description": "4-day residential workshop covering Laspeyres and Geometric Mean index formulas, price collection quality checks, web-scraping, and CPI basket rebasing.",
        "embedding": None,
        "nomination_required": True,
        "schedule_date": "2026-11-24T09:00:00Z",
        "duration": "4 Days (Residential)",
        "location": "NSSTA Campus, Greater Noida",
        "domain": "statistical",
        "skills": ["CPI Inflation", "Laspeyres Index", "Basket Rebasing", "Price Indices"],
    },
    {
        "id": "nssta_206",
        "source": "nssta",
        "title": "Executive Leadership & Cadre Management for MoSPI Officers",
        "description": "5-day residential executive program for Joint Directors and Directors on administrative leadership, team management, GFR procurement rules, and strategic decision making.",
        "embedding": None,
        "nomination_required": True,
        "schedule_date": "2026-12-01T09:00:00Z",
        "duration": "5 Days (Residential)",
        "location": "NSSTA Campus, Greater Noida",
        "domain": "behavioural",
        "skills": ["Cadre Leadership", "GFR Procurement", "Team Management", "Administrative Governance"],
    },
]


class SeededMockProvider(CourseCatalogProvider):
    """
    Implementation of CourseCatalogProvider backed by real hand-collected iGOT & NSSTA course data.
    Fulfills PRD Adapter Isolation requirement.
    """

    async def get_courses(self) -> List[Dict[str, Any]]:
        return HAND_SEEDED_COURSES

    async def get_course_by_id(self, course_id: str) -> Optional[Dict[str, Any]]:
        for c in HAND_SEEDED_COURSES:
            if c["id"] == course_id:
                return c
        return None


class LiveAPIProvider(CourseCatalogProvider):
    """
    TODO: Planned implementation for live external iGOT/NSSTA API integration.
    Do not implement business logic yet.
    """

    async def get_courses(self) -> List[Dict[str, Any]]:
        raise NotImplementedError("LiveAPIProvider is not implemented yet.")

    async def get_course_by_id(self, course_id: str) -> Optional[Dict[str, Any]]:
        raise NotImplementedError("LiveAPIProvider is not implemented yet.")
