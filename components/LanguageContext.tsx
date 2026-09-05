"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "hi";
export type FontSize = "small" | "normal" | "large";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Top Bar
    gov_india: "भारत सरकार | Government of India",
    gov_ministry: "Ministry of Personnel, Public Grievances & Pensions • MoSPI & NSSTA",
    screen_reader: "Screen Reader",
    screen_reader_alert: "Screen Reader mode active. All official sections have ARIA labels and high-contrast support.",
    helpline: "Helpline: 1800-11-0001",
    portal_title: "अधिकारी प्रशिक्षण एवं मूल्यांकन पोर्टल",
    portal_subtitle: "Officer Training & Assessment Portal (DoPT / MoSPI)",
    satyameva: "सत्यमेव जयते",
    search_placeholder: "Search training modules, assessments, cadre orders, or circulars (Ctrl+K)...",
    copilot_btn: "Setu AI Co-pilot",
    logout: "Logout",
    login: "Login",
    quick_search: "Quick Search",
    recent_searches: "Recent In-Service Queries",
    close: "Close",

    // Navigation
    nav_dashboard: "Dashboard",
    nav_my_training: "My Training",
    nav_assessments: "Assessments & Quizzes",
    nav_learning_progress: "Learning Progress",
    nav_trainer_desk: "Trainer Desk",
    nav_admin_desk: "Admin Desk",

    // Dashboard
    cadre_dossier: "Cadre Officer Dossier",
    officer_name: "Shri Rajesh Sharma, IAS",
    officer_role: "Joint Secy (Admin)",
    cadre_badge: "AGMUT: 2008",
    batch_status: "Batch 2008 • Active Service",
    statutory_notice_title: "Statutory Compliance Notice",
    statutory_notice_desc: "Cadre Training Mandate for FY 2024-25 is active. As per DoPT circular No. T-16017/23/2024, all officers are required to complete mandatory GFR 2017 assessment within the designated cycle.",
    download_dossier: "Download Dossier",
    view_radar: "View Competency Radar",
    active_modules: "Active Training Modules",
    completed_curricula: "Completed Curricula",
    pending_assessments: "Pending Assessments",
    compliance_index: "Compliance Index",
    due_this_month: "Due this month",
    target_attainment: "Target Attainment",
    statutory_deadline: "Next statutory deadline in 4 days",
    evaluation_status: "Evaluation Status",
    dopt_verified: "DoPT Verified",
    grade_a: "Grade A",
    continue_module: "Continue Module",
    prescribed_modules: "Prescribed Training Modules",
    search_modules: "Filter active curricula by keyword...",
    all_categories: "All Categories",
    upcoming_exams: "Upcoming Departmental Examinations",
    start_exam: "Start Examination",
    recent_activity: "Recent Official Activity Log",
    audit_trail: "Immutable Audit Trail (NIC Log No: 88219/2025)",
    nic_secure_notice: "National Informatics Centre (NIC) verified secure environment. Strict compliance with Government of India Web Guidelines (GIGW 3.0).",
    cert_in_approved: "Security Audit: CERT-In Approved",
    version_tag: "Version: 4.8.2-GoI",

    // My Training (Profile)
    training_registry: "Cadre Mandatory Training Registry",
    training_compliance: "Academic Year 2024-2025 Training Compliance",
    target_mandatory: "Target Mandatory Hours",
    accrued_hours: "Accrued Hours Logged",
    deficit_balance: "Deficit Balance",
    compliance_grade: "Compliance Grade",
    all_statuses: "All Statuses",
    in_progress: "In Progress",
    completed: "Completed",
    yet_to_start: "Yet to Start",
    export_registry: "Export",
    excel_export: "Excel (.xlsx)",
    csv_export: "CSV Datafile",
    print_dossier: "Print Dossier",

    // Assessment
    dept_exam_title: "General Financial Rules (GFR 2017) & Public Procurement",
    sub_title: "Mandatory In-Service Assessment • Ministry of Finance (Dept of Expenditure)",
    time_remaining: "Time Remaining",
    minutes_left: "Minutes Left",
    question: "Question",
    marks: "Marks",
    negative: "Negative",
    auto_saved: "Auto-saved to NIC Cloud",
    prev: "Previous",
    next: "Next",
    save_next: "Save & Next",
    mark_review: "Mark for Review",
    submit_exam: "Submit Examination",
    question_palette: "Question Palette",
    answered: "Answered",
    not_visited: "Not Visited",
    review: "Review",
    unanswered: "Unanswered",

    // AI Quiz Generator & Upload
    tab_statutory_exam: "Statutory Examination (GFR 2017)",
    tab_ai_generator: "AI Course Quiz Generator (Upload Media)",
    upload_media_title: "Upload Course Media (PDF / PPT / Notes)",
    upload_media_subtitle: "Setu AI extracts syllabus content and generates an adaptive psychometric quiz linked to your competency gaps.",
    drag_drop_title: "Drag & drop course PDF or presentation slides here",
    drag_drop_hint: "Supports PDF, PPTX, PPT, and TXT • Maximum 25MB",
    browse_files: "Browse Files",
    preloaded_title: "Or 1-Click Test with Preloaded Course Materials:",
    num_questions_title: "Number of Questions:",
    target_bloom_title: "Cognitive Depth (Bloom's Taxonomy):",
    bloom_understand: "Level 2: Understand & Recall",
    bloom_apply: "Level 3: Procedural Application",
    bloom_analyze: "Level 4: Critical Case Analysis",
    btn_generate_quiz: "Generate AI Adaptive Quiz",
    btn_generating: "AI Processing Document...",
    pipeline_step1: "1. Extracting text & slides from document...",
    pipeline_step2: "2. Analyzing syllabus concepts via Gemini Flash...",
    pipeline_step3: "3. Aligning questions to active Competency Gaps...",
    pipeline_step4: "4. Finalizing psychometric MCQs & rationales...",
    quiz_ready_heading: "AI Generated Course Practice Quiz",
    quiz_ready_sub: "Dynamic assessment generated from",
    reset_upload: "Upload Different Course Material",

    // Automated Course Quiz & Pre-fetched Datasets
    automated_prep_title: "Automated Exam Preparation & Course Question Datasets",
    select_course_prompt: "Select any syllabus course below to immediately load its pre-fetched verified question dataset:",
    prefetched_dataset_badge: "Verified Dataset Pre-fetched",
    start_course_quiz: "Start Course Practice Quiz",
    or_custom_upload: "Need to test from custom study slides, circular or dataset ID?",
    switch_to_custom: "Upload Custom Course Material",
    switch_to_prefetched: "Use Pre-fetched Course Datasets",

    // Login
    jan_parichay_title: "NIC Jan Parichay SSO Gateway",
    select_role: "Select Official Role for Instant Access",
    one_click_login: "1-Click Verified Login",
    enter_credentials: "Or Enter Official MoSPI Credentials",
    email_label: "Government Email ID (e.g., officer@gov.in)",
    password_label: "Password",
    sign_in_button: "Sign in with Jan Parichay SSO",
  },
  hi: {
    // Top Bar
    gov_india: "भारत सरकार | Government of India",
    gov_ministry: "कार्मिक, लोक शिकायत तथा पेंशन मंत्रालय • सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)",
    screen_reader: "स्क्रीन रीडर",
    screen_reader_alert: "स्क्रीन रीडर मोड सक्रिय है। सभी आधिकारिक अनुभागों में ARIA लेबल और उच्च-कंट्रास्ट समर्थन मौजूद है।",
    helpline: "हेल्पलाइन: 1800-11-0001",
    portal_title: "अधिकारी प्रशिक्षण एवं मूल्यांकन पोर्टल",
    portal_subtitle: "अधिकारी प्रशिक्षण एवं मूल्यांकन पोर्टल (DoPT / MoSPI)",
    satyameva: "सत्यमेव जयते",
    search_placeholder: "प्रशिक्षण मॉड्यूल, परीक्षा, संवर्ग आदेश या परिपत्र खोजें (Ctrl+K)...",
    copilot_btn: "सेतु एआई सह-पायलट",
    logout: "लॉग आउट",
    login: "लॉग इन",
    quick_search: "त्वरित खोज",
    recent_searches: "हालिया सेवा संबंधी प्रश्न",
    close: "बंद करें",

    // Navigation
    nav_dashboard: "डैशबोर्ड",
    nav_my_training: "मेरा प्रशिक्षण",
    nav_assessments: "मूल्यांकन एवं प्रश्नोत्तरी",
    nav_learning_progress: "अधिगम प्रगति",
    nav_trainer_desk: "प्रशिक्षक डेस्क",
    nav_admin_desk: "प्रशासन डेस्क",

    // Dashboard
    cadre_dossier: "संवर्ग अधिकारी डॉसियर",
    officer_name: "श्री राजेश शर्मा, आईएएस",
    officer_role: "संयुक्त सचिव (प्रशासन)",
    cadre_badge: "एजीएमयूटी: 2008",
    batch_status: "बैच 2008 • सक्रिय सेवा",
    statutory_notice_title: "वैधानिक अनुपालन सूचना",
    statutory_notice_desc: "वित्तीय वर्ष 2024-25 के लिए संवर्ग प्रशिक्षण अधिदेश सक्रिय है। डीओपीटी परिपत्र सं. T-16017/23/2024 के अनुसार, सभी अधिकारियों को अनिवार्य जीएफआर 2017 मूल्यांकन नियत समय सीमा में पूरा करना आवश्यक है।",
    download_dossier: "डॉसियर डाउनलोड करें",
    view_radar: "योग्यता रडार देखें",
    active_modules: "सक्रिय प्रशिक्षण मॉड्यूल",
    completed_curricula: "पूर्ण किए गए पाठ्यक्रम",
    pending_assessments: "लंबित मूल्यांकन",
    compliance_index: "अनुपालन सूचकांक",
    due_this_month: "इस माह देय",
    target_attainment: "लक्ष्य प्राप्ति",
    statutory_deadline: "अगली वैधानिक समय सीमा 4 दिनों में",
    evaluation_status: "मूल्यांकन स्थिति",
    dopt_verified: "डीओपीटी सत्यापित",
    grade_a: "ग्रेड 'ए'",
    continue_module: "मॉड्यूल जारी रखें",
    prescribed_modules: "निर्धारित प्रशिक्षण मॉड्यूल",
    search_modules: "कीवर्ड द्वारा सक्रिय पाठ्यक्रम खोजें...",
    all_categories: "सभी श्रेणियां",
    upcoming_exams: "आगामी विभागीय परीक्षाएं",
    start_exam: "परीक्षा प्रारंभ करें",
    recent_activity: "हालिया आधिकारिक गतिविधि लॉग",
    audit_trail: "अपरिवर्तनीय ऑडिट ट्रेल (एनआईसी लॉग संख्या: 88219/2025)",
    nic_secure_notice: "राष्ट्रीय सूचना विज्ञान केंद्र (NIC) द्वारा सत्यापित सुरक्षित वातावरण। भारत सरकार वेब दिशानिर्देशों (GIGW 3.0) का पूर्ण अनुपालन।",
    cert_in_approved: "सुरक्षा ऑडिट: सीईआरटी-इन (CERT-In) स्वीकृत",
    version_tag: "संस्करण: 4.8.2-GoI",

    // My Training (Profile)
    training_registry: "संवर्ग अनिवार्य प्रशिक्षण रजिस्ट्री",
    training_compliance: "शैक्षणिक वर्ष 2024-2025 प्रशिक्षण अनुपालन",
    target_mandatory: "अनिवार्य लक्ष्य घंटे",
    accrued_hours: "अर्जित घंटे",
    deficit_balance: "घाटा शेष",
    compliance_grade: "अनुपालन ग्रेड",
    all_statuses: "सभी स्थितियां",
    in_progress: "प्रगति पर",
    completed: "पूर्ण",
    yet_to_start: "प्रारंभ होना शेष",
    export_registry: "निर्यात",
    excel_export: "एक्सेल (.xlsx)",
    csv_export: "सीएसवी (.csv)",
    print_dossier: "डॉसियर प्रिंट करें",

    // Assessment
    dept_exam_title: "सामान्य वित्तीय नियम (GFR 2017) एवं सार्वजनिक खरीद",
    sub_title: "अनिवार्य सेवाकालीन मूल्यांकन • वित्त मंत्रालय (व्यय विभाग)",
    time_remaining: "शेष समय",
    minutes_left: "मिनट शेष",
    question: "प्रश्न",
    marks: "अंक",
    negative: "नकारात्मक",
    auto_saved: "एनआईसी क्लाउड पर स्वतः सहेजा गया",
    prev: "पिछला",
    next: "अगला",
    save_next: "सहेजें और अगला",
    mark_review: "समीक्षा हेतु चिह्नित करें",
    submit_exam: "परीक्षा जमा करें",
    question_palette: "प्रश्न पैलेट",
    answered: "उत्तर दिया गया",
    not_visited: "नहीं देखा गया",
    review: "समीक्षा हेतु",
    unanswered: "अनुत्तरित",

    // AI Quiz Generator & Upload
    tab_statutory_exam: "वैधानिक परीक्षा (GFR 2017)",
    tab_ai_generator: "एआई पाठ्यक्रम प्रश्नोत्तरी निर्माता (सामग्री अपलोड)",
    upload_media_title: "पाठ्यक्रम सामग्री अपलोड करें (PDF / PPT / नोट्स)",
    upload_media_subtitle: "सेतु एआई पाठ्यक्रम सामग्री से स्वचालित रूप से आपके योग्यता अंतरालों के अनुरूप अनुकूलित प्रश्नोत्तरी तैयार करता है।",
    drag_drop_title: "पाठ्यक्रम पीडीएफ या प्रेजेंटेशन स्लाइड्स यहां खींचें और छोड़ें",
    drag_drop_hint: "पीडीएफ, पीपीटीएक्स, पीपीटी और टीएक्सटी समर्थित • अधिकतम 25MB",
    browse_files: "फ़ाइलें चुनें",
    preloaded_title: "या पूर्व-लोड की गई पाठ्यक्रम सामग्री के साथ 1-क्लिक परीक्षण करें:",
    num_questions_title: "प्रश्नों की संख्या:",
    target_bloom_title: "संज्ञानात्मक गहराई (ब्लूम वर्गीकरण):",
    bloom_understand: "स्तर 2: समझना और स्मरण",
    bloom_apply: "स्तर 3: प्रक्रियात्मक अनुप्रयोग",
    bloom_analyze: "स्तर 4: महत्वपूर्ण केस विश्लेषण",
    btn_generate_quiz: "एआई अनुकूलित प्रश्नोत्तरी बनाएं",
    btn_generating: "एआई दस्तावेज़ संसाधित कर रहा है...",
    pipeline_step1: "1. दस्तावेज़ से पाठ और स्लाइड्स निकाली जा रही हैं...",
    pipeline_step2: "2. जेमिनी फ्लैश द्वारा पाठ्यक्रम अवधारणाओं का विश्लेषण...",
    pipeline_step3: "3. सक्रिय योग्यता अंतरालों के साथ प्रश्नों का संरेखण...",
    pipeline_step4: "4. बहुविकल्पीय प्रश्नों और व्याख्याओं को अंतिम रूप दिया जा रहा है...",
    quiz_ready_heading: "एआई निर्मित पाठ्यक्रम अभ्यास प्रश्नोत्तरी",
    quiz_ready_sub: "गतिशील मूल्यांकन स्रोत:",
    reset_upload: "अन्य पाठ्यक्रम सामग्री अपलोड करें",

    // Automated Course Quiz & Pre-fetched Datasets
    automated_prep_title: "स्वचालित परीक्षा तैयारी एवं पाठ्यक्रम प्रश्न डेटासेट",
    select_course_prompt: "तत्काल पूर्व-प्राप्त सत्यापित प्रश्न डेटासेट लोड करने के लिए नीचे किसी भी पाठ्यक्रम का चयन करें:",
    prefetched_dataset_badge: "सत्यापित डेटासेट पूर्व-प्राप्त",
    start_course_quiz: "पाठ्यक्रम अभ्यास प्रश्नोत्तरी प्रारंभ करें",
    or_custom_upload: "कस्टम अध्ययन स्लाइड, परिपत्र या डेटासेट आईडी से परीक्षण करना चाहते हैं?",
    switch_to_custom: "कस्टम पाठ्यक्रम सामग्री अपलोड करें",
    switch_to_prefetched: "पूर्व-प्राप्त पाठ्यक्रम डेटासेट का उपयोग करें",

    // Login
    jan_parichay_title: "एनआईसी जन परिचय एकल साइन-ऑन (SSO)",
    select_role: "त्वरित पहुंच के लिए आधिकारिक भूमिका चुनें",
    one_click_login: "1-क्लिक सत्यापित लॉगिन",
    enter_credentials: "या आधिकारिक सांख्यिकी मंत्रालय क्रेडेंशियल्स दर्ज करें",
    email_label: "सरकारी ईमेल आईडी (उदा. officer@gov.in)",
    password_label: "पासवर्ड",
    sign_in_button: "जन परिचय एसएसओ के साथ साइन इन करें",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [fontSize, setFontSizeState] = useState<FontSize>("normal");

  useEffect(() => {
    // Restore language preference
    const savedLang = localStorage.getItem("setu_language") as Language | null;
    if (savedLang === "en" || savedLang === "hi") {
      setLanguageState(savedLang);
      document.documentElement.lang = savedLang;
    }

    // Restore font size preference
    const savedFontSize = localStorage.getItem("setu_font_size") as FontSize | null;
    if (savedFontSize === "small" || savedFontSize === "normal" || savedFontSize === "large") {
      setFontSizeState(savedFontSize);
      applyFontSize(savedFontSize);
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    if (size === "small") {
      document.documentElement.style.fontSize = "87.5%"; // 14px base
    } else if (size === "large") {
      document.documentElement.style.fontSize = "112.5%"; // 18px base
    } else {
      document.documentElement.style.fontSize = "100%"; // 16px base
    }
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem("setu_language", newLang);
    document.documentElement.lang = newLang;
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    localStorage.setItem("setu_font_size", newSize);
    applyFontSize(newSize);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        fontSize,
        setFontSize,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
