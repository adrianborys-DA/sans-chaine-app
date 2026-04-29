import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, ComposedChart
} from 'recharts';
import { 
  User, Activity, Zap, Brain, ChevronRight, FileText, CheckCircle2, Upload, Database, FileCheck, BarChart3, Target, Info, TrendingDown, TrendingUp, ShieldCheck, Clock, Calendar as CalendarIcon, MessageSquare, Heart, MessageCircle, X, Send, ChevronDown, ChevronUp, Sparkles, Users, BookOpen, Cpu, Plus, Trash2, UserCog, Award, Flag, MapPin, Save, FileArchive, ChevronDownSquare
} from 'lucide-react';

// Extended Athlete Roster Database
const ATHLETE_ROSTER = [
  {
    id: '1',
    name: 'Andrew Randell',
    weight: '62',
    startingCTL: '50',
    startingATL: '60',
    objective: 'Win Races',
    savedReports: [],
    zones: {
      pwr_rec_low: '50', pwr_rec_high: '155', pwr_end_high: '190', pwr_tem_Z2: '240', pwr_tem_high: '300', pwr_SS_high: '310', pwr_thr_high: '330', pwr_vo2_high: '350',
      hr_rec_low: '35', hr_rec_high: '80', hr_end_high: '100', hr_z2_high: '110', hr_tem_high: '130', hr_thr_high: '150', hr_vo2_high: '160', hr_vo2_anarc: '190'
    }
  },
  {
    id: '2',
    name: 'Adrian Borys',
    weight: '68',
    startingCTL: '65',
    startingATL: '70',
    objective: 'Durability - Gravel',
    savedReports: [],
    zones: {
      pwr_rec_low: '0', pwr_rec_high: '128', pwr_end_high: '165', pwr_tem_Z2: '175', pwr_tem_high: '190', pwr_SS_high: '210', pwr_thr_high: '250', pwr_vo2_high: '290',
      hr_rec_low: '52', hr_rec_high: '115', hr_end_high: '130', hr_z2_high: '145', hr_tem_high: '155', hr_thr_high: '160', hr_vo2_high: '165', hr_vo2_anarc: '177'
    }
  },
  {
    id: '3',
    name: 'Sarah Chaine',
    weight: '62',
    startingCTL: '45',
    startingATL: '40',
    objective: 'Ironman Prep - Big Base',
    savedReports: [],
    zones: {
      pwr_rec_low: '85', pwr_rec_high: '130', pwr_end_high: '175', pwr_tem_Z2: '195', pwr_tem_high: '205', pwr_SS_high: '220', pwr_thr_high: '240', pwr_vo2_high: '280',
      hr_rec_low: '85', hr_rec_high: '110', hr_end_high: '130', hr_z2_high: '140', hr_tem_high: '148', hr_thr_high: '158', hr_vo2_high: '168', hr_vo2_anarc: '178'
    }
  }
];

// Rider Personas Transcribed from Sans Chaine Architecture
const RIDER_PERSONAS = [
  {
    id: 'racer',
    title: 'Mark — The Racer',
    tags: '35-50 · HIGH-EARNER · ELITE DATA LITERACY',
    profile: '12–18 hrs / week | 10,000–15,000+ km / year | Trains all year; 3–5 "A" races',
    execution: 'Clinical. Follows the plan at 95%+. Obsessive about ±1% power targets. Wants technical WKO5 validation daily.',
    psychology: 'The Professional. Views the bike as a performance vehicle. High data literacy — will challenge the model if the numbers don\'t add up.',
    motivation: 'Achievement. Driven by the podium and absolute limits. Needs the coach to "hold the reins" to prevent self-inflicted burnout.'
  },
  {
    id: 'explorer',
    title: 'Carolyn — The Explorer',
    tags: '45-60 · ESTABLISHED CAREER · HEALTH & COMMUNITY FOCUS',
    profile: '6–9 hrs / week | 5,000–8,000 km / year | Seasonal peaks — 1–2 big trips',
    execution: 'Pragmatic. Life and partner come first. Follows plan at 75–80%. Values social rides and adventure over raw FTP gains.',
    psychology: 'The Enthusiast. Motivated by being "fit enough to enjoy the trip" without suffering. Values community and experience over metrics.',
    motivation: 'Longevity. Rides for mental clarity and adventure. Wants preparation, not perfection — and a coach who understands the difference.'
  },
  {
    id: 'executive',
    title: 'Krista — The Executive',
    tags: '45-55 · TIME-POOR · HIGH-EXPECTATION LEADER',
    profile: '6–8 hrs / week | 4,000–6,000 km / year | Highly consistent weekly habit; rigid schedule',
    execution: 'Prescriptive. High trust — "Just tell me what to do." Needs zero-friction UI and "Executive Summary" outputs. Schedule is non-negotiable.',
    psychology: 'The CEO. Uses cycling as a daily stress-relief and life foundation. Expects the same precision from coach as direct reports.',
    motivation: 'Utility. Driven by efficiency. Wants a binary "Go/No-Go" daily decision based on recovery data (Whoop/HRV). The answer must be definitive.'
  },
  {
    id: 'enthusiast',
    title: 'Bard — The Enthusiast',
    tags: '30-45 · NEWER TO STRUCTURE · HIGH INSTRUCTIONAL NEED',
    profile: '8–11 hrs / week | 7,000–9,500 km / year | Eager but erratic — local club segments & centuries',
    execution: 'Erratic. Prone to "ego-riding" on easy days. Sponge for information on gear and nutrition. Often rides too hard with group on recovery days.',
    psychology: 'The Apprentice. Wants to look and ride like a pro. High instructional need — responds exceptionally well to clear "Why" explanations.',
    motivation: 'Mastery. Driven by social status and discovery. Wants to be "one of the guys" in the fast local group — needs coach to build the bridge.'
  }
];

const INITIAL_KB = [
  {
    id: 1,
    title: "Core Philosophy: Durability & Foundation",
    content: "Training is not about breaking the body down; it's about precise stimulation and adequate recovery. We build the aerobic foundation through disciplined torque, ensuring that durability—the capacity remaining after work performed—is prioritized over acute, unsustainable intensity. Aerobic decoupling should remain under 5%. If HR drifts significantly while power is steady, the base is weak. Do not chase high file averages; respect the intention of the session (warmups and recoveries drag averages down, this is normal)."
  },
  {
    id: 2,
    title: "Mental Medicine & Compliance",
    content: "A major part of Sans Chaine is 'Mental Medicine'. If an athlete's WHOOP recovery is consistently in the red, mental burnout will follow physical fatigue. Rest days are not a sign of weakness. Adjustments must be made dynamically. Missing a workout due to true fatigue is better than executing a poor workout that digs a deeper hole."
  }
];

// Helper to reliably load JSZip from CDNs
const getJSZip = async () => {
    if (window.JSZipConstructor) return window.JSZipConstructor;
    const extract = (m) => m.default?.default || m.default || m;
    try {
        const mod = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm');
        window.JSZipConstructor = extract(mod);
    } catch(e) {
        const mod = await import('https://esm.sh/jszip@3.10.1');
        window.JSZipConstructor = extract(mod);
    }
    return window.JSZipConstructor;
};

// Helper to load PDF.js for bulk brain import
const getPdfJs = async () => {
    if (window.pdfjsLib) return window.pdfjsLib;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    document.head.appendChild(script);
    await new Promise(resolve => {
        script.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve();
        };
    });
    return window.pdfjsLib;
};

const App = () => {
  const [view, setView] = useState('onboarding'); // 'onboarding', 'report', 'admin', 'profile'
  
  // Importer UI States
  const [isImportingFit, setIsImportingFit] = useState(false);
  const [isImportingContext, setIsImportingContext] = useState(false);
  const [isImportingWhoop, setIsImportingWhoop] = useState(false);
  const [importStatus, setImportStatus] = useState('idle');
  const [contextStatus, setContextStatus] = useState('idle');
  const [whoopStatus, setWhoopStatus] = useState('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingContext, setIsDraggingContext] = useState(false);
  const [isDraggingWhoop, setIsDraggingWhoop] = useState(false);
  const [isDraggingPdf, setIsDraggingPdf] = useState(false);

  // Load persistent roster & rider drafts from localStorage
  const [athleteRoster, setAthleteRoster] = useState(() => {
    const saved = localStorage.getItem('sc_athleteRoster');
    return saved ? JSON.parse(saved) : ATHLETE_ROSTER;
  });
  
  const [selectedRosterId, setSelectedRosterId] = useState(() => localStorage.getItem('sc_selectedRosterId') || '');
  const [saveStatus, setSaveStatus] = useState('');
  const [expandedReportId, setExpandedReportId] = useState(null);
  
  const [riderData, setRiderData] = useState(() => {
    const saved = localStorage.getItem('sc_currentRiderDraft');
    if (saved) return JSON.parse(saved);
    return {
      id: '', name: '', weight: '70', ftp: '250', objective: '', context: '', subjectiveFeel: 'good',
      startingCTL: '50', startingATL: '50', startingDate: '2026-03-16', endDate: '',
      personaId: '', keyEvents: [], savedReports: [],
      zones: {
        pwr_rec_low: '0', pwr_rec_high: '135', pwr_end_high: '185', pwr_tem_Z2: '210', pwr_tem_high: '235', pwr_SS_high: '250', pwr_thr_high: '265', pwr_vo2_high: '315',
        hr_rec_low: '60', hr_rec_high: '115', hr_end_high: '135', hr_z2_high: '145', hr_tem_high: '155', hr_thr_high: '165', hr_vo2_high: '175', hr_vo2_anarc: '185'
      }
    };
  });

  const [rawRides, setRawRides] = useState([]);
  const [whoopData, setWhoopData] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [dayReasons, setDayReasons] = useState({});
  const [collapsedWeeks, setCollapsedWeeks] = useState({});
  
  // Load persistent Knowledge Base from localStorage
  const [knowledgeBase, setKnowledgeBase] = useState(() => {
    const saved = localStorage.getItem('sc_knowledgeBase');
    return saved ? JSON.parse(saved) : INITIAL_KB;
  });
  
  const [newArticle, setNewArticle] = useState({ title: '', content: '' });
  const [isSyncingBrain, setIsSyncingBrain] = useState(false);
  const [isImportingPdfs, setIsImportingPdfs] = useState(false);
  const [pdfImportStatus, setPdfImportStatus] = useState('');

  // AI & PDF Gen States
  const [closingStatement, setClosingStatement] = useState("");
  const [isGeneratingStatement, setIsGeneratingStatement] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Chat Bot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hey, Andrew here. I've got your latest block data loaded up alongside the Sans Chaine knowledge base. Let me know what you want to dig into." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [durabilityMetrics, setDurabilityMetrics] = useState({ wkg: 4.1, decay: -3.2, status: 'Resilient' });
  const reasonOptions = ["Rest Day", "Sick", "No time", "Not motivated", "Travel", "Other"];

  // --- Persistence Hooks ---
  useEffect(() => {
    localStorage.setItem('sc_athleteRoster', JSON.stringify(athleteRoster));
  }, [athleteRoster]);

  useEffect(() => {
    localStorage.setItem('sc_knowledgeBase', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  useEffect(() => {
    localStorage.setItem('sc_currentRiderDraft', JSON.stringify(riderData));
  }, [riderData]);

  useEffect(() => {
    localStorage.setItem('sc_selectedRosterId', selectedRosterId);
  }, [selectedRosterId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // --- Handlers for Data Reset & Rider Profile ---
  const resetSessionData = () => {
    setRawRides([]);
    setWhoopData({});
    setPerformanceData([]);
    setDayReasons({});
    setCollapsedWeeks({});
    setImportStatus('idle');
    setContextStatus('idle');
    setWhoopStatus('idle');
    setClosingStatement("");
    setChatMessages([
      { role: 'assistant', content: "Hey, Andrew here. I've got your latest block data loaded up alongside the Sans Chaine knowledge base. Let me know what you want to dig into." }
    ]);
    setIsImportingFit(false);
    setIsImportingContext(false);
    setIsImportingWhoop(false);
  };

  const handleZoneChange = (metric, key, value) => {
    setRiderData(prev => ({
      ...prev,
      zones: { ...prev.zones, [`${metric}_${key}`]: value }
    }));
  };

  const handleAddEvent = () => {
    setRiderData(prev => ({
      ...prev,
      keyEvents: [...prev.keyEvents, { id: Date.now(), name: '', date: '', type: 'A-Race', location: '' }]
    }));
  };

  const handleUpdateEvent = (id, field, value) => {
    setRiderData(prev => ({
      ...prev,
      keyEvents: prev.keyEvents.map(ev => ev.id === id ? { ...ev, [field]: value } : ev)
    }));
  };

  const handleRemoveEvent = (id) => {
    setRiderData(prev => ({
      ...prev,
      keyEvents: prev.keyEvents.filter(ev => ev.id !== id)
    }));
  };

  const handleRosterSelect = (e) => {
    const id = e.target.value;
    setSelectedRosterId(id);
    const athlete = athleteRoster.find(a => a.id === id);
    if (athlete) {
      setRiderData(prev => ({
        ...prev, ...athlete,
        ftp: athlete.zones?.pwr_thr_high || athlete.ftp || prev.ftp,
        savedReports: athlete.savedReports || []
      }));
    }
    resetSessionData(); 
  };

  const handleNewRider = () => {
    setRiderData({
      id: '', name: '', weight: '70', ftp: '250', objective: '', context: '', subjectiveFeel: 'good',
      startingCTL: '50', startingATL: '50', startingDate: '2026-03-16', endDate: '',
      personaId: '', keyEvents: [], savedReports: [],
      zones: {
        pwr_rec_low: '0', pwr_rec_high: '135', pwr_end_high: '185', pwr_tem_Z2: '210', pwr_tem_high: '235', pwr_SS_high: '250', pwr_thr_high: '265', pwr_vo2_high: '315',
        hr_rec_low: '60', hr_rec_high: '115', hr_end_high: '135', hr_z2_high: '145', hr_tem_high: '155', hr_thr_high: '165', hr_vo2_high: '175', hr_vo2_anarc: '185'
      }
    });
    setSelectedRosterId('');
    resetSessionData();
  };

  const handleSaveProfile = () => {
    setAthleteRoster(prev => {
      const existingIndex = prev.findIndex(r => r.id === riderData.id);
      if (existingIndex >= 0) {
         const newRoster = [...prev];
         newRoster[existingIndex] = { ...riderData };
         return newRoster;
      } else {
         const newId = Date.now().toString();
         const newRider = { ...riderData, id: newId };
         setRiderData(newRider);
         setSelectedRosterId(newId);
         return [...prev, newRider];
      }
    });
    setSaveStatus('Saved!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const saveReportToProfile = () => {
    if (!selectedRosterId) return;
    
    const newReport = {
      id: Date.now().toString(),
      dateSaved: new Date().toLocaleDateString(),
      blockStart: riderData.startingDate,
      blockEnd: riderData.endDate,
      objective: riderData.objective || "Standard Review",
      ctl: performanceData.length > 0 ? performanceData[performanceData.length - 1].ctl : 'N/A',
      statement: closingStatement || "No coach's eye statement generated."
    };

    setAthleteRoster(prev => prev.map(athlete => {
      if (athlete.id === selectedRosterId) {
        return { ...athlete, savedReports: [newReport, ...(athlete.savedReports || [])] };
      }
      return athlete;
    }));

    setRiderData(prev => ({
      ...prev,
      savedReports: [newReport, ...(prev.savedReports || [])]
    }));
  };

  const handleResetSession = () => {
      resetSessionData();
      setView('onboarding');
  };

  const handleReasonChange = (date, reason) => setDayReasons(prev => ({ ...prev, [date]: reason }));
  const toggleWeek = (weekStr) => setCollapsedWeeks(prev => ({ ...prev, [weekStr]: !prev[weekStr] }));

 // --- OpenAI API ---
  const fetchOpenAIResponse = async (prompt, systemInstruction) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY; 
    const url = `https://api.openai.com/v1/chat/completions`;
    const payload = {
      model: "gpt-4o-mini", // You can change this to "gpt-3.5-turbo" if you want it to be cheaper/faster
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    };

    const delays = [1000, 2000, 4000, 8000, 16000];
    for (let i = 0; i < 6; i++) {
      try {
        const response = await fetch(url, { 
          method: 'POST', 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` 
          }, 
          body: JSON.stringify(payload) 
        });
        if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`HTTP ${response.status}: ${errorText}`);
}
        const result = await response.json();
        return result.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
      } catch (err) {
  console.error("OpenAI request failed:", err);

  if (i === 5) {
    return `Error: Unable to connect to the analysis engine. Details: ${err.message}`;
  }

  await new Promise(resolve => setTimeout(resolve, delays[i]));
}
    }
  };


  // --- Agent & Telemetry Logic ---
  const getPowerZone = (val, z) => {
    if (val < parseFloat(z.pwr_rec_low)) return "Below Zone";
    if (val <= parseFloat(z.pwr_rec_high)) return "Recovery";
    if (val <= parseFloat(z.pwr_end_high)) return "Endurance";
    if (val <= parseFloat(z.pwr_tem_Z2)) return "Tempo Z2";
    if (val <= parseFloat(z.pwr_tem_high)) return "Tempo High";
    if (val <= parseFloat(z.pwr_SS_high)) return "Sweet Spot";
    if (val <= parseFloat(z.pwr_thr_high)) return "Threshold";
    if (val <= parseFloat(z.pwr_vo2_high)) return "VO2 Max";
    return "Anaerobic";
  };

  const getHRZone = (val, z) => {
    if (val < parseFloat(z.hr_rec_low)) return "Below Zone";
    if (val <= parseFloat(z.hr_rec_high)) return "Recovery";
    if (val <= parseFloat(z.hr_end_high)) return "Endurance";
    if (val <= parseFloat(z.hr_z2_high)) return "HR Z2";
    if (val <= parseFloat(z.hr_tem_high)) return "Tempo";
    if (val <= parseFloat(z.hr_thr_high)) return "Threshold";
    if (val <= parseFloat(z.hr_vo2_high)) return "VO2 Max";
    if (val <= parseFloat(z.hr_vo2_anarc)) return "VO2 Anaerobic";
    return "Max Effort";
  };

  const getTelemetryDistribution = () => {
    if (!rawRides || rawRides.length === 0) return { pwr: "No data", hr: "No data" };
    let pwrCounts = {}; let hrCounts = {}; let totalPoints = 0; const z = riderData.zones;

    rawRides.forEach(ride => {
        if (!ride.chartData) return;
        ride.chartData.forEach(pt => {
            if (pt.watts > 0 || pt.hr > 0) totalPoints++;
            if (pt.watts > 0) { const pZone = getPowerZone(pt.watts, z); pwrCounts[pZone] = (pwrCounts[pZone] || 0) + 1; }
            if (pt.hr > 0) { const hZone = getHRZone(pt.hr, z); hrCounts[hZone] = (hrCounts[hZone] || 0) + 1; }
        });
    });

    if (totalPoints === 0) return { pwr: "No data", hr: "No data" };
    const formatDist = (counts) => Object.entries(counts).map(([zone, count]) => `${zone}: ${((count / totalPoints) * 100).toFixed(1)}%`).join(' | ');
    return { pwr: formatDist(pwrCounts), hr: formatDist(hrCounts) };
  };

  const getWorkoutsContext = () => {
    let recentWorkoutsContext = "No workout data available.";
    if (performanceData.length > 0) {
      const logEntries = [];
      const blockEndTime = riderData.endDate ? new Date(riderData.endDate + 'T00:00:00').getTime() : Infinity;

      performanceData.forEach(week => {
        week.days.forEach(day => {
          const currentDayTime = new Date(day.date + 'T00:00:00').getTime();
          if (currentDayTime > blockEndTime) return; 
          const recoveryStr = day.whoop?.recovery ? ` | WHOOP Recovery: ${day.whoop.recovery}%` : '';
          
          if (day.rides.length > 0) {
            day.rides.forEach(r => {
              logEntries.push(`- Date: ${r.date} | Activity: ${r.name} | TSS: ${r.tss} | Decoupling: ${r.decoupling}% | Avg Pwr: ${r.watts}W | Avg HR: ${r.hr}${recoveryStr} | Prescribed: ${r.summary}`);
            });
          } else {
            const reason = dayReasons[day.date] || "No Data / Unspecified";
            logEntries.push(`- Date: ${day.date} | Activity: Off Day | Reason: ${reason}${recoveryStr}`);
          }
        });
      });
      recentWorkoutsContext = logEntries.join('\n');
    }
    return recentWorkoutsContext;
  };

  const getAgentZoneContext = () => {
    const z = riderData.zones;
    return `Power Zones (W) -> Rec: ${z.pwr_rec_low}-${z.pwr_rec_high}, End High: ${z.pwr_end_high}, Tem Z2: ${z.pwr_tem_Z2}, Tem High: ${z.pwr_tem_high}, SS High: ${z.pwr_SS_high}, Thr High: ${z.pwr_thr_high}, VO2 High: ${z.pwr_vo2_high} | HR Zones (bpm) -> Rec: ${z.hr_rec_low}-${z.hr_rec_high}, End High: ${z.hr_end_high}, Z2 High: ${z.hr_z2_high}, Tem High: ${z.hr_tem_high}, Thr High: ${z.hr_thr_high}, VO2 High: ${z.hr_vo2_high}, Anaerobic: ${z.hr_vo2_anarc}`;
  };

  const getPersonaContext = () => {
    if (!riderData.personaId) return "No specific psychological persona assigned.";
    const p = RIDER_PERSONAS.find(x => x.id === riderData.personaId);
    if (!p) return "";
    return `Athlete Persona: ${p.title}. Psychology: ${p.psychology}. Motivation: ${p.motivation}. Typical Execution: ${p.execution}`;
  };

  const getEventsContext = () => {
    if (riderData.keyEvents.length === 0) return "No upcoming events scheduled.";
    return "Upcoming Events:\n" + riderData.keyEvents.map(e => `- ${e.date}: ${e.name} (${e.type}) in ${e.location}`).join('\n');
  };

  const compileKnowledgeBase = () => knowledgeBase.map(kb => `[ARTICLE: ${kb.title}]\n${kb.content}`).join('\n\n');

  const handleBulkPdfImport = async (e) => {
      e.preventDefault();
      setIsDraggingPdf(false);
      const files = Array.from(e.dataTransfer?.files || e.target?.files || []).filter(f => f.name.toLowerCase().endsWith('.pdf'));
      if (files.length === 0) return;

      setIsImportingPdfs(true);
      const newArticles = [];

      try {
          const pdfjs = await getPdfJs();
          for (let i = 0; i < files.length; i++) {
              const file = files[i];
              setPdfImportStatus(`Processing ${file.name} (${i + 1}/${files.length})...`);
              const arrayBuffer = await file.arrayBuffer();
              const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
              let fullText = '';
              for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                  const page = await pdf.getPage(pageNum);
                  const textContent = await page.getTextContent();
                  fullText += textContent.items.map(item => item.str).join(' ') + '\n';
              }
              newArticles.push({ id: Date.now() + i, title: file.name.replace('.pdf', ''), content: fullText.trim() });
          }
          setKnowledgeBase(prev => [...prev, ...newArticles]);
          setPdfImportStatus(`Successfully imported ${files.length} articles!`);
          setTimeout(() => setPdfImportStatus(''), 3000);
      } catch (error) {
          console.error("Error parsing PDFs:", error);
          setPdfImportStatus("Error processing PDFs. Check console.");
          setTimeout(() => setPdfImportStatus(''), 3000);
      } finally { setIsImportingPdfs(false); }
  };

  const handleGenerateStatement = async () => {
    setIsGeneratingStatement(true);
    setClosingStatement("Retrieving knowledge base and reviewing telemetry logs...");
    
    const workoutsContext = getWorkoutsContext();
    const zoneContext = getAgentZoneContext();
    const distributions = getTelemetryDistribution();
    const kbString = compileKnowledgeBase();
    const personaContext = getPersonaContext();
    const eventsContext = getEventsContext();

    const prompt = `Write my monthly closing statement to my athlete, ${riderData.name}.
    
    Here is what I need you to do:
    1. Base your assessment ONLY on the principles found in the "Sans Chaine Knowledge Base".
    2. Look at the Workout Log and the Current Telemetry Distribution below.
    3. TAILOR THE TONE based on their Psychological Persona. Speak to their motivations.
    4. Mention upcoming events if relevant.
    
    Athlete Objective: ${riderData.objective}
    Athlete Zones: ${zoneContext}
    My Coach Context Note: ${riderData.context}
    
    ${personaContext}
    ${eventsContext}
    
    Current Telemetry Distribution (Time in Zone):
    Power Zones: ${distributions.pwr}
    HR Zones: ${distributions.hr}
    
    Workout Log:
    ${workoutsContext}
    `;

    const systemInstruction = `You are Andrew Randell, an expert cycling coach. Speak directly to your athlete in the first-person ("Hey", "I noticed", "you did"). 
    
    CRITICAL: You must align your feedback perfectly with the following Sans Chaine Knowledge Base:
    
    === SANS CHAINE KNOWLEDGE BASE ===
    ${kbString}
    ==================================
    
    Write a practical, data-driven retrospective. Break down specific workouts intelligently. Tell them what they did well, what needs fixing, and address missed days. DO NOT preach generic philosophy outside of the provided Knowledge Base. Match your communication style to the athlete's documented Persona.`;

    const responseText = await fetchOpenAIResponse(prompt, systemInstruction);
    setClosingStatement(responseText);
    setIsGeneratingStatement(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    const userText = chatInput.trim();
    const newMessages = [...chatMessages, { role: 'user', content: userText }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatLoading(true);

    const latestWeek = performanceData.length > 0 ? performanceData[performanceData.length - 1] : null;
    
    const systemInstruction = `You are Andrew Randell, an expert cycling coach. Speak directly to your athlete, ${riderData.name}.
    
    CRITICAL INSTRUCTIONS:
    1. Base all advice ONLY on the following coaching knowledge base:
    === SANS CHAINE KNOWLEDGE BASE ===
    ${compileKnowledgeBase()}
    ==================================
    
    2. Match communication style to their Persona: ${getPersonaContext()}
    3. Be direct and actionable.
    
    Current Athlete: ${riderData.name}. Objective: ${riderData.objective}.
    Latest CTL: ${latestWeek ? latestWeek.ctl : 'N/A'}. Durability: ${durabilityMetrics.wkg} W/kg (Decay: ${durabilityMetrics.decay}%).
    My general coaching note: "${riderData.context}".
    
    Telemetry Distribution: Power: ${getTelemetryDistribution().pwr} | HR: ${getTelemetryDistribution().hr}
    
    ${getEventsContext()}
    
    Workout Log:
    ${getWorkoutsContext()}
    `;

    const chatHistory = newMessages.map(m => `${m.role === 'user' ? 'Athlete' : 'Andrew'}: ${m.content}`).join('\n');
    const prompt = `Conversation history:\n${chatHistory}\n\nPlease respond to the latest message as Andrew the coach based on the Knowledge Base, Persona, and provided data.`;

    const responseText = await fetchOpenAIResponse(prompt, systemInstruction);
    setChatMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    setIsChatLoading(false);
  };

  const handleSavePdf = async () => {
    saveReportToProfile(); 
    
    setIsGeneratingPdf(true);
    const element = document.getElementById('report-content');
    if (!element) { setIsGeneratingPdf(false); return; }

    if (!window.html2pdf) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      document.head.appendChild(script);
      await new Promise(resolve => { script.onload = resolve; });
    }

    const noPrintElements = document.querySelectorAll('.no-print');
    const originalDisplays = [];
    noPrintElements.forEach((el, index) => { originalDisplays[index] = el.style.display; el.style.display = 'none'; });

    const textareas = element.querySelectorAll('textarea');
    const replacementDivs = [];
    textareas.forEach((ta) => {
      const div = document.createElement('div');
      div.className = ta.className;
      div.style.cssText = ta.style.cssText;
      div.style.height = 'auto'; div.style.minHeight = ta.style.height || ta.offsetHeight + 'px';
      div.style.whiteSpace = 'pre-wrap'; div.innerText = ta.value || ta.placeholder || '';
      ta.parentNode.insertBefore(div, ta); ta.style.display = 'none';
      replacementDivs.push({ ta, div });
    });

    const opt = {
      margin: [0.4, 0.4, 0.4, 0.4], filename: `${riderData.name ? riderData.name.replace(/\s+/g, '_') : 'Athlete'}_Retrospective.pdf`,
      image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true, windowWidth: 1200 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }, pagebreak: { mode: 'css', avoid: '.break-inside-avoid' }
    };

    try { await window.html2pdf().set(opt).from(element).save(); } 
    catch (err) { console.error("PDF generation failed", err); } 
    finally {
      noPrintElements.forEach((el, index) => { el.style.display = originalDisplays[index]; });
      replacementDivs.forEach(({ ta, div }) => { ta.style.display = ''; if (div.parentNode) div.parentNode.removeChild(div); });
      setIsGeneratingPdf(false);
    }
  };

  // ----- Data Parsing Core -----
  const parseCSVRow = (text) => {
    let result = []; let current = ''; let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
        else current += char;
    }
    result.push(current.trim()); return result;
  };

  const calculateTrueNP = (dataPoints) => {
      if (!dataPoints || dataPoints.length < 30) return 0;
      let pwr4thSum = 0; let validWindows = 0;
      for (let i = 0; i < dataPoints.length - 30; i++) {
          let windowSum = 0;
          for (let j = 0; j < 30; j++) windowSum += dataPoints[i + j].p;
          pwr4thSum += Math.pow(windowSum / 30, 4); validWindows++;
      }
      return validWindows > 0 ? Math.pow(pwr4thSum / validWindows, 0.25) : 0;
  };

  const generateWeeks = (rides, startDateString, endDateString, whoopStats = {}) => {
    if (!rides || rides.length === 0) return [];
    const [startYear, startMonth, startDay] = startDateString.split('-').map(Number);
    const rawStartDate = new Date(startYear, startMonth - 1, startDay);
    const startDate = new Date(rawStartDate);
    startDate.setDate(startDate.getDate() - ((rawStartDate.getDay() + 6) % 7));
    
    let maxDate = new Date(startDate);
    if (endDateString) {
        const [ey, em, ed] = endDateString.split('-').map(Number);
        maxDate = new Date(ey, em - 1, ed);
    } else {
        rides.forEach(r => {
            if (!r.date) return;
            const [y, m, d] = r.date.split('-').map(Number);
            const rDate = new Date(y, m - 1, d);
            if (rDate > maxDate) maxDate = rDate;
        });
    }
    
    const totalWeeks = Math.max(1, Math.ceil((Math.floor((Date.UTC(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()) - Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) / (1000 * 60 * 60 * 24)) + 1) / 7));
    
    const weeksMap = [];
    let currentCTL = parseFloat(riderData.startingCTL) || 50;
    let currentATL = parseFloat(riderData.startingATL) || 60;
    
    for (let w = 0; w < totalWeeks; w++) {
        const weekObj = { week: `Week ${w + 1}`, days: [], tss: 0, ctl: 0, atl: 0, decoupling: 0 };
        let weekDecouplingSum = 0; let weekDecouplingCount = 0;

        for (let d = 0; d < 7; d++) {
            const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            currentDate.setDate(currentDate.getDate() + (w * 7) + d);
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
            
            const dayRides = rides.filter(r => r.date === dateStr);
            const dayTss = dayRides.reduce((sum, r) => sum + r.tss, 0);
            weekObj.tss += dayTss;
            
            dayRides.forEach(r => { if (r.decoupling > 0) { weekDecouplingSum += r.decoupling; weekDecouplingCount++; } });
            currentCTL = currentCTL + (dayTss - currentCTL) / 42;
            currentATL = currentATL + (dayTss - currentATL) / 7;

            weekObj.days.push({
                date: dateStr, dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' }), rides: dayRides,
                whoop: whoopStats[dateStr] || null, tss: dayTss, ctl: Math.round(currentCTL), atl: Math.round(currentATL)
            });
        }
        weekObj.ctl = Math.round(currentCTL); weekObj.atl = Math.round(currentATL);
        weekObj.decoupling = weekDecouplingCount > 0 ? parseFloat((weekDecouplingSum / weekDecouplingCount).toFixed(1)) : 0;
        weeksMap.push(weekObj);
    }
    return weeksMap;
  };

  const processZipFile = async (file) => {
      if (typeof window !== 'undefined' && typeof window.Buffer === 'undefined') {
          try {
              const bufferMod = await import('https://cdn.jsdelivr.net/npm/buffer@6.0.3/+esm');
              window.Buffer = bufferMod.Buffer || bufferMod.default?.Buffer;
          } catch (e) { console.warn("Failed to polyfill Buffer:", e); }
      }

      const getConstructor = (mod) => {
          if (!mod) return null; if (typeof mod === 'function') return mod;
          if (mod.default && typeof mod.default === 'function') return mod.default;
          if (mod.default?.default && typeof mod.default.default === 'function') return mod.default.default;
          if (mod.FitParser && typeof mod.FitParser === 'function') return mod.FitParser;
          if (mod.default?.FitParser && typeof mod.default.FitParser === 'function') return mod.default.FitParser;
          for (const key in mod) { if (typeof mod[key] === 'function') return mod[key]; } return null;
      };

      const getPako = (mod) => {
          if (!mod) return null; if (typeof mod.ungzip === 'function') return mod;
          if (mod.default && typeof mod.default.ungzip === 'function') return mod.default; return mod;
      };
      
      let JSZipMod, pakoMod, FitParserMod;
      try {
          JSZipMod = await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm'); pakoMod = await import('https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm'); FitParserMod = await import('https://cdn.jsdelivr.net/npm/fit-file-parser@1.0.9/+esm');
      } catch (err1) {
          try { JSZipMod = await import('https://esm.sh/jszip@3.10.1'); pakoMod = await import('https://esm.sh/pako@2.1.0'); FitParserMod = await import('https://esm.sh/fit-file-parser@1.0.9'); } 
          catch (err2) { JSZipMod = await import('https://jspm.dev/jszip'); pakoMod = await import('https://jspm.dev/pako'); FitParserMod = await import('https://jspm.dev/fit-file-parser'); }
      }

      const JSZip = getConstructor(JSZipMod); const FitParser = getConstructor(FitParserMod); const pako = getPako(pakoMod);
      if (typeof FitParser !== 'function' || typeof JSZip !== 'function' || !pako) throw new Error("Parser modules failed to load.");

      const zip = new JSZip(); const loadedZip = await zip.loadAsync(file);
      const fitFiles = Object.keys(loadedZip.files).filter(name => (name.toLowerCase().endsWith('.fit') || name.toLowerCase().endsWith('.fit.gz')) && !name.includes('__MACOSX') && !loadedZip.files[name].dir);
      if (fitFiles.length === 0) throw new Error("No .fit or .fit.gz files found in the ZIP.");

      const allSessions = {}; let earliestDate = null; let latestDate = null;

      for (const fileName of fitFiles) {
          let fileBuffer = await loadedZip.files[fileName].async('arraybuffer');
          if (fileName.toLowerCase().endsWith('.gz')) fileBuffer = pako.ungzip(new Uint8Array(fileBuffer)).buffer;

          const parser = new FitParser({ forceSetMessageName: false, mode: 'list' });
          const parsedData = await new Promise((resolve, reject) => { parser.parse(fileBuffer, (error, data) => { if (error) reject(error); else resolve(data); }); });
          const records = parsedData.records || []; if (records.length === 0) continue;

          let startTime = null; const baseFileName = fileName.split('/').pop();
          if (!allSessions[baseFileName]) allSessions[baseFileName] = { id: baseFileName, dateFull: '', date: '', maxElapsed: 0, dataPoints: [] };

          for (const record of records) {
              const ts = record.timestamp; if (!ts) continue;
              let timestampDate = ts instanceof Date ? ts : new Date(ts); if (isNaN(timestampDate)) continue;

              if (!startTime) startTime = timestampDate;
              if (!earliestDate || timestampDate < earliestDate) earliestDate = timestampDate;
              if (!latestDate || timestampDate > latestDate) latestDate = timestampDate;

              const elapsed_sec = (timestampDate - startTime) / 1000;
              const pwr = record.power || 0; const hr = record.heart_rate || 0; const cad = record.cadence || 0;

              if (!allSessions[baseFileName].dateFull) {
                  allSessions[baseFileName].dateFull = `${timestampDate.getFullYear()}-${String(timestampDate.getMonth() + 1).padStart(2, '0')}-${String(timestampDate.getDate()).padStart(2, '0')} 00:00:00`;
                  allSessions[baseFileName].date = allSessions[baseFileName].dateFull.split(' ')[0];
              }

              if (elapsed_sec > allSessions[baseFileName].maxElapsed) allSessions[baseFileName].maxElapsed = elapsed_sec;
              if (pwr > 0 || hr > 0) allSessions[baseFileName].dataPoints.push({ p: pwr, hr: hr, cad: cad, t: elapsed_sec });
          }
      }

      const weightToUse = parseFloat(riderData.weight) || 70;

      const extractedRides = Object.values(allSessions).map(s => {
          s.dataPoints.sort((a, b) => a.t - b.t);
          let decouplingCalc = 0;
          if (s.dataPoints.length > 100) {
              const activeData = s.dataPoints.filter(d => d.t >= Math.min(900, s.maxElapsed * 0.2));
              if (activeData.length > 50) {
                  const midIndex = Math.floor(activeData.length / 2);
                  const firstHalf = activeData.slice(0, midIndex); const secondHalf = activeData.slice(midIndex);
                  const avgP1 = firstHalf.reduce((sum, d) => sum + d.p, 0) / firstHalf.length; const avgHR1 = firstHalf.reduce((sum, d) => sum + d.hr, 0) / firstHalf.length;
                  const avgP2 = secondHalf.reduce((sum, d) => sum + d.p, 0) / secondHalf.length; const avgHR2 = secondHalf.reduce((sum, d) => sum + d.hr, 0) / secondHalf.length;
                  const ef1 = avgHR1 > 0 ? avgP1 / avgHR1 : 0; const ef2 = avgHR2 > 0 ? avgP2 / avgHR2 : 0;
                  if (ef1 > 0) decouplingCalc = ((ef1 - ef2) / ef1) * 100;
              }
          }

          const durationHours = s.maxElapsed / 3600; const count = s.dataPoints.length;
          const avgWatts = count > 0 ? Math.round(s.dataPoints.reduce((acc, curr) => acc + curr.p, 0) / count) : 0;
          const avgHr = count > 0 ? Math.round(s.dataPoints.reduce((acc, curr) => acc + curr.hr, 0) / count) : 0;
          
          let np = calculateTrueNP(s.dataPoints) || (avgWatts * 1.05);
          const ftp = parseFloat(riderData.ftp) || parseFloat(riderData.zones?.pwr_thr_high) || 250;
          let calcTss = Math.round((durationHours * 3600 * Math.pow(ftp > 0 ? np / ftp : 0, 2)) / 36) || Math.round(durationHours * 60);

          const chartData = []; const step = Math.max(1, Math.floor(s.dataPoints.length / 100));
          for (let i = 0; i < s.dataPoints.length; i += step) chartData.push({ time: Math.floor(s.dataPoints[i].t / 60), watts: s.dataPoints[i].p, hr: s.dataPoints[i].hr, cadence: s.dataPoints[i].cad, target: avgWatts });
          
          return {
              id: s.id, dateFull: s.dateFull, date: s.date, duration: parseFloat(durationHours.toFixed(2)),
              watts: avgWatts, hr: avgHr, wkg: parseFloat((avgWatts / weightToUse).toFixed(2)), kj: Math.round(s.dataPoints.reduce((acc, curr) => acc + curr.p, 0) / 1000), 
              summary: "Technical data synced. Pending context matching...", syncMethod: "In-Browser ZIP Parse", name: `Ride on ${s.date}`, tss: calcTss, decoupling: parseFloat(decouplingCalc.toFixed(1)), chartData: chartData
          };
      });

      const blockStartStr = earliestDate ? earliestDate.toISOString().split('T')[0] : riderData.startingDate;
      const blockEndStr = latestDate ? latestDate.toISOString().split('T')[0] : blockStartStr;

      setRiderData(prev => ({ ...prev, startingDate: blockStartStr, endDate: blockEndStr }));
      setRawRides(extractedRides);
      setPerformanceData(generateWeeks(extractedRides, blockStartStr, blockEndStr, whoopData));
      setImportStatus('success'); setIsImportingFit(false);
  };

  const handleMasterDataImport = async (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]; if (!file) return;
    setIsImportingFit(true); setImportStatus('idle');
    try { if (file.name.toLowerCase().endsWith('.zip')) await processZipFile(file); else throw new Error("Unsupported file type. Please upload a .zip"); } 
    catch (error) { console.error("Import Error:", error); setImportStatus('error'); setIsImportingFit(false); }
  };

  const findValueIgnoreCase = (obj, keys) => {
      const lowerObj = Object.keys(obj).reduce((acc, k) => { acc[k.toLowerCase()] = obj[k]; return acc; }, {});
      for (let k of keys) { if (lowerObj[k.toLowerCase()] !== undefined && lowerObj[k.toLowerCase()] !== "") return lowerObj[k.toLowerCase()]; } return null;
  };

  const parseContextFileContent = (csvText) => {
        const lines = csvText.replace(/^\uFEFF/, '').split(/\r?\n/);
        const headers = parseCSVRow(lines[0]).map(h => h.replace(/["']/g, '').trim());
        const tpData = lines.slice(1).filter(l => l.trim()).map(line => {
          const row = parseCSVRow(line); const obj = {}; headers.forEach((h, idx) => { obj[h] = (row[idx] || '').replace(/["']/g, '').trim(); }); return obj;
        });

        const mergedRides = rawRides.map(ride => {
            const potentialMatches = tpData.filter(tp => {
                let tpDate = findValueIgnoreCase(tp, ['WorkoutDay', 'Date', 'Day']) || '';
                if (tpDate.includes('/')) { const d = new Date(tpDate); if (!isNaN(d)) tpDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
                return tpDate === ride.date;
            });
            let bestMatch = null; let minDiff = 0.5;
            potentialMatches.forEach(match => {
                const diff = Math.abs((parseFloat(findValueIgnoreCase(match, ['TimeTotalInHours', 'Duration'])) || 0) - ride.duration);
                if (diff < minDiff) { minDiff = diff; bestMatch = match; }
            });
            if (bestMatch) {
                const tpTSS = findValueIgnoreCase(bestMatch, ['TSS', 'Training Stress Score', 'Training Stress Score®']);
                return { ...ride, name: bestMatch.Title || ride.name, summary: bestMatch.WorkoutDescription || "", coachComments: bestMatch.CoachComments || "", feeling: bestMatch.Feeling || "", rpe: bestMatch.Rpe || "", tss: (tpTSS && tpTSS !== "") ? Math.round(parseFloat(tpTSS)) : ride.tss, syncMethod: 'Verified by Day & Duration' };
            }
            return { ...ride, syncMethod: 'No Context Match' };
        });

        setRawRides(mergedRides); setPerformanceData(generateWeeks(mergedRides, riderData.startingDate, riderData.endDate, whoopData)); setContextStatus('success');
  };

  const handleContextImport = async (e) => {
    e.preventDefault(); setIsDraggingContext(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]; if (!file) return;
    setIsImportingContext(true); setContextStatus('syncing');
    try {
        let csvText = "";
        if (file.name.toLowerCase().endsWith('.zip')) {
            const JSZip = await getJSZip(); const zip = new JSZip(); const loadedZip = await zip.loadAsync(file);
            const workoutFileKey = Object.keys(loadedZip.files).find(n => n.toLowerCase().includes('workouts.csv'));
            if (!workoutFileKey) throw new Error("Could not find 'workouts.csv' inside the uploaded ZIP.");
            csvText = await loadedZip.files[workoutFileKey].async('text');
        } else { csvText = await file.text(); }
        parseContextFileContent(csvText);
    } catch (error) { console.error("Error parsing TP Context data:", error); setContextStatus('error'); } finally { setIsImportingContext(false); }
  };

  const parseWhoopFileContent = (csvText) => {
      const lines = csvText.replace(/^\uFEFF/, '').split(/\r?\n/);
      const parsedWhoop = { ...whoopData };
      const headers = parseCSVRow(lines[0]).map(h => h.replace(/["']/g, '').trim().toLowerCase());
      const isTPMetricsFormat = headers.includes('hrv') || headers.includes('restinghr') || headers.includes('pulse');

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const parts = parseCSVRow(lines[i]);
        if (isTPMetricsFormat) {
            const obj = {}; headers.forEach((h, idx) => { obj[h] = parts[idx] ? parts[idx].replace(/["']/g, '').trim() : ''; });
            let tpDate = obj['date'] || obj['day'] || '';
            if (tpDate.includes('/')) { const d = new Date(tpDate); if (!isNaN(d)) tpDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
            if (!tpDate) continue;
            if (!parsedWhoop[tpDate]) parsedWhoop[tpDate] = { hrv: null, pulse: null, recovery: null };
            if (obj['hrv']) parsedWhoop[tpDate].hrv = Math.round(parseFloat(obj['hrv']));
            if (obj['restinghr'] || obj['pulse']) parsedWhoop[tpDate].pulse = Math.round(parseFloat(obj['restinghr'] || obj['pulse']));
            if (obj['recovery']) parsedWhoop[tpDate].recovery = parseInt(obj['recovery'], 10);
            if (obj['notes'] && obj['notes'].includes('WHOOP Recovery Score:')) { const match = obj['notes'].match(/WHOOP Recovery Score:\s*(\d+)/); if (match && match[1]) parsedWhoop[tpDate].recovery = parseInt(match[1], 10); }
        } else {
            if (parts.length < 3) continue;
            const date = parts[0].split(' ')[0]; const type = parts[1]; const value = parts[2];
            if (!date) continue;
            if (!parsedWhoop[date]) parsedWhoop[date] = { hrv: null, pulse: null, recovery: null };
            if (type === 'HRV') parsedWhoop[date].hrv = Math.round(parseFloat(value));
            else if (type === 'Pulse') parsedWhoop[date].pulse = Math.round(parseFloat(value));
            else if (type === 'Notes' && value.includes('WHOOP Recovery Score:')) { const match = value.match(/WHOOP Recovery Score:\s*(\d+)/); if (match && match[1]) parsedWhoop[date].recovery = parseInt(match[1], 10); }
        }
      }
      setWhoopData(parsedWhoop); setPerformanceData(generateWeeks(rawRides, riderData.startingDate, riderData.endDate, parsedWhoop)); setWhoopStatus('success');
  };

  const handleWhoopImport = async (e) => {
    e.preventDefault(); setIsDraggingWhoop(false);
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]; if (!file) return;
    setIsImportingWhoop(true); setWhoopStatus('syncing');
    try {
        let csvText = "";
        if (file.name.toLowerCase().endsWith('.zip')) {
            const JSZip = await getJSZip(); const zip = new JSZip(); const loadedZip = await zip.loadAsync(file);
            const metricsFileKey = Object.keys(loadedZip.files).find(n => n.toLowerCase().includes('metrics.csv'));
            if (!metricsFileKey) throw new Error("Could not find 'metrics.csv' inside the uploaded ZIP.");
            csvText = await loadedZip.files[metricsFileKey].async('text');
        } else { csvText = await file.text(); }
        parseWhoopFileContent(csvText);
    } catch (error) { console.error("Error parsing Metrics data:", error); setWhoopStatus('error'); } finally { setIsImportingWhoop(false); }
  };

  const blockPurpose = performanceData && performanceData.length > 0 ? (performanceData.reduce((acc, week) => acc + week.decoupling, 0) / performanceData.length) < 4.5 ? "Aerobic Endurance (Sans Chaine)" : "Foundation Phase" : "Awaiting Data";
  
  const aggregateStats = useMemo(() => {
    if (!performanceData.length) return null;
    let totalTSS = 0; let totalHours = 0; let validDecouplingSum = 0; let validDecouplingCount = 0; let validRecoverySum = 0; let validRecoveryCount = 0;
    performanceData.forEach(week => {
      week.days.forEach(day => {
        totalTSS += day.tss;
        day.rides.forEach(r => { totalHours += r.duration; if (r.decoupling > 0) { validDecouplingSum += r.decoupling; validDecouplingCount++; } });
        if (day.whoop?.recovery) { validRecoverySum += day.whoop.recovery; validRecoveryCount++; }
      });
    });
    const endCtl = performanceData[performanceData.length - 1].ctl; const startCtl = riderData.startingCTL;
    return {
      endingCTL: endCtl, ctlDelta: endCtl - startCtl, totalTSS, totalHours: totalHours.toFixed(1),
      avgDecoupling: validDecouplingCount > 0 ? (validDecouplingSum / validDecouplingCount).toFixed(1) : 0,
      avgRecovery: validRecoveryCount > 0 ? Math.round(validRecoverySum / validRecoveryCount) : 0,
    }
  }, [performanceData, riderData]);

  const dailyGraphData = performanceData.flatMap(week => week.days.map(day => ({
      ...day, displayDate: `${day.dayName} ${day.date.split('-').slice(1).join('/')}`,
      activityTypes: day.rides.length > 0 ? day.rides.map(r => r.name).join(', ') : (dayReasons[day.date] || 'Rest / No Data'),
      watts: day.rides.length > 0 ? Math.round(day.rides.reduce((s, r) => s + r.watts, 0) / day.rides.length) : null,
      hr: day.rides.length > 0 ? Math.round(day.rides.reduce((s, r) => s + r.hr, 0) / day.rides.length) : null,
  })));

  const CustomDailyTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null; const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-200 z-[100] min-w-[200px]">
        <p className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-2">{data.displayDate}</p>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center gap-4"><span className="font-bold text-slate-400 uppercase text-[9px]">Activity</span><span className="font-bold text-slate-800 text-right max-w-[140px] truncate" title={data.activityTypes}>{data.activityTypes}</span></div>
          <div className="flex justify-between"><span className="font-bold text-slate-400 uppercase text-[9px]">TSS</span><span className="font-black text-slate-800">{data.tss}</span></div>
          {data.watts > 0 && <div className="flex justify-between"><span className="font-bold text-slate-400 uppercase text-[9px]">Avg Power</span><span className="font-bold text-slate-800">{data.watts} W</span></div>}
          {data.hr > 0 && <div className="flex justify-between"><span className="font-bold text-slate-400 uppercase text-[9px]">Avg HR</span><span className="font-bold text-slate-800">{data.hr} bpm</span></div>}
          {data.whoop?.hrv && <div className="flex justify-between"><span className="font-bold text-slate-400 uppercase text-[9px]">WHOOP HRV</span><span className="font-bold text-slate-800">{data.whoop.hrv}</span></div>}
          {data.whoop?.recovery && <div className="flex justify-between"><span className="font-bold text-slate-400 uppercase text-[9px]">Recovery</span><span className={`font-bold ${data.whoop.recovery >= 67 ? 'text-green-500' : data.whoop.recovery >= 34 ? 'text-amber-500' : 'text-red-500'}`}>{data.whoop.recovery}%</span></div>}
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between gap-3 text-[10px] font-black uppercase"><span className="text-blue-600">CTL: {data.ctl}</span><span className="text-red-500">ATL: {data.atl}</span></div>
      </div>
    );
  };

  const Card = ({ children, title, icon: Icon, subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6 relative break-inside-avoid">
      <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-3">
        <div className="flex items-center gap-3">{Icon && <Icon className="w-5 h-5 text-blue-600" />}<h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">{title}</h3></div>
        {subtitle && <span className="text-xs font-bold text-slate-400 uppercase">{subtitle}</span>}
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 overflow-x-hidden">
      <style>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: white !important; }
          .no-print { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          textarea { height: auto !important; overflow: visible !important; border: none !important; background: transparent !important; resize: none !important; box-shadow: none !important; }
          footer { display: none !important; }
        }
      `}</style>
      
      <header className="bg-slate-900 text-white p-6 shadow-lg no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase tracking-tighter">SANS CHAINE</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Performance Engineering</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('admin')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 uppercase rounded-md transition ${view === 'admin' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-slate-800'}`}>
                <Cpu className="w-4 h-4" /> Brain Admin
            </button>
            <div className="w-px h-6 bg-slate-700 my-auto mx-2"></div>
            <button onClick={() => setView('profile')} className={`px-4 py-2 text-xs font-bold flex items-center gap-2 uppercase rounded-md transition ${view === 'profile' ? 'bg-amber-500 text-slate-900' : 'text-amber-300 hover:bg-slate-800'}`}>
                <UserCog className="w-4 h-4" /> Rider Profile
            </button>
            <button onClick={() => setView('onboarding')} className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition ${view === 'onboarding' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>Intake Sync</button>
            <button onClick={() => setView('report')} className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition ${view === 'report' ? 'bg-blue-600' : 'hover:bg-slate-800'}`} disabled={performanceData.length === 0}>Report</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 relative">
        
        {/* === RIDER PROFILE & CONFIGURATION VIEW === */}
        {view === 'profile' && (
            <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-6">
                <div className="mb-8 border-b border-slate-200 pb-4">
                    <h2 className="text-4xl font-black text-slate-900 mb-2 font-serif flex items-center gap-3"><UserCog className="w-8 h-8 text-amber-500"/> Master Rider Configuration</h2>
                    <p className="text-slate-500 text-sm">Define the physiology, psychology, and schedule of the athlete. This context heavily dictates the AI's coaching communication style and expectations.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex-1 w-full">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Select Rider to Edit</label>
                        <select
                            className="w-full mt-1 p-2 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 font-medium cursor-pointer"
                            value={riderData.id || ''}
                            onChange={handleRosterSelect}
                        >
                            <option value="" disabled>-- Select or Create New --</option>
                            {athleteRoster.map(athlete => <option key={athlete.id} value={athlete.id}>{athlete.name}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-4">
                        <button onClick={handleNewRider} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-slate-50 transition w-full md:w-auto">New Rider</button>
                        <button onClick={handleSaveProfile} className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-xs font-bold flex items-center justify-center gap-2 uppercase hover:bg-amber-600 transition shadow-md w-full md:w-auto min-w-[140px]">
                            {saveStatus ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />} 
                            {saveStatus || "Save Profile"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Info & Zones Config */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b border-slate-100 pb-2">Physiological Baseline</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Rider Name</label>
                                    <input type="text" className="w-full mt-1 p-2 border border-slate-200 rounded text-sm font-bold bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={riderData.name} onChange={e => setRiderData({...riderData, name: e.target.value})} placeholder="e.g. Jean-Luc" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Weight (kg)</label>
                                        <input type="number" className="w-full mt-1 p-2 border border-slate-200 rounded text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={riderData.weight} onChange={e => setRiderData({...riderData, weight: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase text-blue-600">FTP (Watts)</label>
                                        <input type="number" className="w-full mt-1 p-2 border border-blue-200 rounded text-sm font-black text-blue-700 bg-blue-50 outline-none focus:ring-2 focus:ring-blue-500" value={riderData.ftp} onChange={e => {
                                            setRiderData({...riderData, ftp: e.target.value, zones: { ...riderData.zones, pwr_thr_high: e.target.value }});
                                        }} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Season Objective</label>
                                    <input type="text" className="w-full mt-1 p-2 border border-slate-200 rounded text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500" value={riderData.objective} onChange={e => setRiderData({...riderData, objective: e.target.value})} placeholder="e.g. Aerobic Base Building" />
                                </div>
                            </div>
                        </div>

                        {/* Event Calendar Builder */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Flag className="w-5 h-5 text-red-500" /> Key Events</h3>
                                <button onClick={handleAddEvent} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition"><Plus className="w-4 h-4" /></button>
                            </div>
                            
                            {riderData.keyEvents.length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-4">No events scheduled. Add a target race.</p>
                            ) : (
                                <div className="space-y-4">
                                    {riderData.keyEvents.map((ev, index) => (
                                        <div key={ev.id} className="bg-slate-50 border border-slate-100 rounded-lg p-3 relative group">
                                            <button onClick={() => handleRemoveEvent(ev.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
                                            <input type="text" placeholder="Event Name (e.g. Unbound Gravel)" className="w-full text-sm font-bold bg-transparent outline-none mb-2 placeholder-slate-300" value={ev.name} onChange={e => handleUpdateEvent(ev.id, 'name', e.target.value)} />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="date" className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white outline-none" value={ev.date} onChange={e => handleUpdateEvent(ev.id, 'date', e.target.value)} />
                                                <select className="w-full p-1.5 text-xs border border-slate-200 rounded bg-white outline-none" value={ev.type} onChange={e => handleUpdateEvent(ev.id, 'type', e.target.value)}>
                                                    <option>A-Race</option><option>B-Race</option><option>C-Race / Training</option><option>Camp / Trip</option>
                                                </select>
                                            </div>
                                            <div className="mt-2 flex items-center gap-2 bg-white border border-slate-200 rounded px-2">
                                                <MapPin className="w-3 h-3 text-slate-400" />
                                                <input type="text" placeholder="Location" className="w-full p-1.5 text-xs bg-transparent outline-none" value={ev.location} onChange={e => handleUpdateEvent(ev.id, 'location', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Personas & Advanced Zones */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Psychological Persona Selection */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-800 mb-1 flex items-center gap-2"><Brain className="w-5 h-5 text-purple-600" /> Psychological Persona</h3>
                            <p className="text-xs text-slate-500 mb-4 border-b border-slate-100 pb-4">Select the archetype that best matches this rider. The AI Coach will adapt its communication style, metrics focus, and empathy levels accordingly.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {RIDER_PERSONAS.map(persona => (
                                    <div 
                                        key={persona.id} 
                                        onClick={() => setRiderData(prev => ({ ...prev, personaId: persona.id }))}
                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col h-full ${riderData.personaId === persona.id ? 'border-amber-500 bg-amber-50 shadow-md ring-4 ring-amber-500/10' : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-black text-slate-900">{persona.title}</h4>
                                            {riderData.personaId === persona.id && <CheckCircle2 className="w-5 h-5 text-amber-500" />}
                                        </div>
                                        <p className="text-[9px] font-black tracking-widest text-red-600 uppercase mb-3">{persona.tags}</p>
                                        <div className="space-y-3 flex-1 text-xs">
                                            <div><span className="font-bold text-slate-400 text-[10px] uppercase">Profile</span><p className="text-slate-700 leading-tight">{persona.profile}</p></div>
                                            <div><span className="font-bold text-slate-400 text-[10px] uppercase">Execution</span><p className="text-slate-700 leading-tight">{persona.execution}</p></div>
                                            <div><span className="font-bold text-slate-400 text-[10px] uppercase">Motivation</span><p className="text-slate-700 leading-tight italic">{persona.motivation}</p></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Zone Editor Matrix */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2"><Target className="w-5 h-5 text-blue-600"/> Granular Zone Editor</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                                            <th className="py-2 pr-2 font-bold text-[10px]">Zone Type</th>
                                            <th className="px-1 text-center font-bold text-[10px]" title="Recovery Low">Rec L</th>
                                            <th className="px-1 text-center font-bold text-[10px]" title="Recovery High">Rec H</th>
                                            <th className="px-1 text-center font-bold text-[10px]" title="Endurance High">End H</th>
                                            <th className="px-1 text-center font-bold text-[10px]" title="Tempo Z2">Tem Z2</th>
                                            <th className="px-1 text-center font-bold text-[10px]" title="Tempo High">Tem H</th>
                                            <th className="px-1 text-center font-bold text-[10px]" title="Sweet Spot High">SS H</th>
                                            <th className="px-1 text-center font-bold text-[10px] text-blue-600" title="Threshold High (FTP)">Thr H</th>
                                            <th className="px-1 text-center font-bold text-[10px] text-red-500" title="VO2 Max High">VO2 H</th>
                                            <th className="px-1 text-center font-bold text-[10px] text-red-500" title="Anaerobic Capacity">Anarc</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Power Row */}
                                        <tr className="border-b border-slate-50 hover:bg-slate-50">
                                            <td className="py-3 font-bold text-slate-700">Power (W)</td>
                                            {['rec_low', 'rec_high', 'end_high', 'tem_Z2', 'tem_high', 'SS_high', 'thr_high', 'vo2_high'].map(key => (
                                                <td key={`pwr_${key}`} className="px-1">
                                                    <input 
                                                        type="number" 
                                                        className={`w-14 p-1.5 text-center border rounded text-xs outline-none focus:ring-1 focus:ring-blue-500 ${key === 'thr_high' ? 'bg-blue-50 border-blue-200 font-bold text-blue-700' : 'bg-white border-slate-200'}`}
                                                        value={riderData.zones[`pwr_${key}`]} 
                                                        onChange={(e) => {
                                                            handleZoneChange('pwr', key, e.target.value);
                                                            if (key === 'thr_high') setRiderData(prev => ({...prev, ftp: e.target.value}));
                                                        }} 
                                                    />
                                                </td>
                                            ))}
                                            <td className="px-1 text-center text-slate-300 font-bold">-</td>
                                        </tr>
                                        {/* HR Row */}
                                        <tr className="hover:bg-slate-50">
                                            <td className="py-3 font-bold text-slate-700">HR (bpm)</td>
                                            {['rec_low', 'rec_high', 'end_high', 'z2_high', 'tem_high'].map(key => (
                                                <td key={`hr_${key}`} className="px-1">
                                                    <input type="number" className="w-14 p-1.5 text-center bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-red-500" value={riderData.zones[`hr_${key}`]} onChange={(e) => handleZoneChange('hr', key, e.target.value)} />
                                                </td>
                                            ))}
                                            <td className="px-1 text-center text-slate-300 font-bold">-</td>
                                            {['thr_high', 'vo2_high', 'vo2_anarc'].map(key => (
                                                <td key={`hr_${key}`} className="px-1">
                                                    <input type="number" className="w-14 p-1.5 text-center bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-red-500" value={riderData.zones[`hr_${key}`]} onChange={(e) => handleZoneChange('hr', key, e.target.value)} />
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Past Reports Archive */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <FileArchive className="w-5 h-5 text-blue-600"/> Archived Reports
                            </h3>
                            {(!riderData.savedReports || riderData.savedReports.length === 0) ? (
                                <p className="text-xs text-slate-400 italic py-4">No reports saved for this athlete yet. Generate a report in the Report tab to save it here.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {riderData.savedReports.map((report) => (
                                        <div key={report.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm">Block: {report.blockStart} to {report.blockEnd}</h4>
                                                    <p className="text-[10px] uppercase font-bold text-slate-500">{report.objective}</p>
                                                </div>
                                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded">CTL: {report.ctl}</span>
                                            </div>
                                            
                                            <div className={`mt-2 text-xs text-slate-600 italic border-t border-slate-200 pt-2 ${expandedReportId === report.id ? '' : 'line-clamp-3'}`}>
                                                "{report.statement}"
                                            </div>
                                            
                                            <div className="mt-auto pt-3">
                                                <button 
                                                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase flex items-center gap-1"
                                                    onClick={() => setExpandedReportId(expandedReportId === report.id ? null : report.id)}
                                                >
                                                    <ChevronDownSquare className={`w-3 h-3 transition-transform ${expandedReportId === report.id ? 'rotate-180' : ''}`} />
                                                    {expandedReportId === report.id ? 'Collapse Statement' : 'Read Full Statement'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* === ADMIN VIEW (KNOWLEDGE BASE) === */}
        {view === 'admin' && (
            <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-2 font-serif flex items-center justify-center gap-3"><Brain className="w-8 h-8 text-purple-600"/> Coaching Brain Engine</h2>
                    <p className="text-slate-500 text-sm">Manage the proprietary RAG (Retrieval-Augmented Generation) knowledge base that powers the AI coach. Changes here dictate how the AI analyzes files and interacts with athletes.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Embedded Coaching Articles</h3>
                            <button 
                                onClick={() => {
                                    setIsSyncingBrain(true);
                                    setTimeout(() => setIsSyncingBrain(false), 2000);
                                }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition ${isSyncingBrain ? 'bg-purple-200 text-purple-700' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'}`}
                            >
                                <Cpu className={`w-4 h-4 ${isSyncingBrain ? 'animate-spin' : ''}`} /> 
                                {isSyncingBrain ? "Indexing Vector DB..." : "Sync Knowledge Base"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {knowledgeBase.map(article => (
                                <div key={article.id} className="bg-slate-50 border border-slate-100 rounded-lg p-4 group relative">
                                    <button 
                                        onClick={() => setKnowledgeBase(knowledgeBase.filter(a => a.id !== article.id))}
                                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <h4 className="font-bold text-slate-800 mb-2 text-sm">{article.title}</h4>
                                    <p className="text-xs text-slate-600 leading-relaxed font-serif italic">{article.content}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 border-t border-slate-100 pt-6">
                            <h4 className="font-bold text-slate-800 text-sm mb-4">Add New Knowledge Article</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <input 
                                            type="text" placeholder="Article Title (e.g. Torque Mechanics)" 
                                            className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <textarea 
                                            rows="6" placeholder="Paste the content of your coaching article here. The AI will embed this into its memory for future analysis..." 
                                            className="w-full p-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                            value={newArticle.content} onChange={e => setNewArticle({...newArticle, content: e.target.value})}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (newArticle.title && newArticle.content) {
                                                setKnowledgeBase([...knowledgeBase, { id: Date.now(), title: newArticle.title, content: newArticle.content }]);
                                                setNewArticle({ title: '', content: '' });
                                            }
                                        }}
                                        disabled={!newArticle.title || !newArticle.content}
                                        className="bg-blue-600 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition"
                                    >
                                        <Plus className="w-4 h-4" /> Append to Database
                                    </button>
                                </div>

                                <div 
                                    className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center ${isDraggingPdf ? 'bg-purple-50 border-purple-400 border-dashed scale-[1.02]' : 'bg-white border-slate-200 border-dashed'}`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDraggingPdf(true); }}
                                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingPdf(false); }}
                                    onDrop={handleBulkPdfImport}
                                >
                                    <div className="bg-purple-100 p-4 rounded-full mb-4"><FileText className="w-8 h-8 text-purple-600" /></div>
                                    <h4 className="font-bold text-slate-800 text-sm">Bulk Import PDFs</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-2 mb-4">Drag & Drop multiple PDF files here</p>
                                    
                                    {isImportingPdfs ? (
                                        <p className="text-sm font-bold text-purple-600 animate-pulse">{pdfImportStatus}</p>
                                    ) : pdfImportStatus ? (
                                        <p className="text-sm font-bold text-green-600">{pdfImportStatus}</p>
                                    ) : (
                                        <>
                                            <input type="file" multiple accept=".pdf" className="hidden" id="pdf-upload" onChange={handleBulkPdfImport} />
                                            <label htmlFor="pdf-upload" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase cursor-pointer hover:bg-slate-800 transition shadow-md">Select PDF Files</label>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* === ONBOARDING (DATA SYNC) VIEW === */}
        {view === 'onboarding' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
             <section className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-[0.2em]">Athlete Quick Select</h4>
                  </div>
                  <button onClick={() => setView('profile')} className="text-[10px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 uppercase"><UserCog className="w-3 h-3"/> Edit Profile</button>
                </div>
                
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Select Athlete from Roster</label>
                  <select 
                    className="w-full mt-1 p-2 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50 font-medium cursor-pointer"
                    value={selectedRosterId} onChange={handleRosterSelect}
                  >
                    <option value="" disabled>-- Select Rider --</option>
                    {athleteRoster.map(athlete => <option key={athlete.id} value={athlete.id}>{athlete.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Starting CTL</label>
                    <input type="number" className="w-full mt-1 p-2 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50" value={riderData.startingCTL} onChange={(e) => setRiderData({...riderData, startingCTL: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Starting ATL</label>
                    <input type="number" className="w-full mt-1 p-2 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50" value={riderData.startingATL} onChange={(e) => setRiderData({...riderData, startingATL: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> Block Start Date</label>
                    <input type="date" className="w-full mt-1 p-2 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50" value={riderData.startingDate} onChange={(e) => {
                      setRiderData({...riderData, startingDate: e.target.value});
                      if (rawRides.length > 0) setPerformanceData(generateWeeks(rawRides, e.target.value, riderData.endDate, whoopData));
                    }} />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> Block End (Auto)</label>
                    <input type="date" className="w-full mt-1 p-2 border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50" value={riderData.endDate} onChange={(e) => {
                      setRiderData({...riderData, endDate: e.target.value});
                      if (rawRides.length > 0) setPerformanceData(generateWeeks(rawRides, riderData.startingDate, e.target.value, whoopData));
                    }} />
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mt-8 mb-2 font-serif italic">Sync Workflow</h2>
              
              <div 
                  className={`p-5 rounded-xl border-2 transition-all ${isDragging ? 'bg-blue-50 border-blue-400 border-dashed scale-[1.02]' : importStatus === 'success' ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 border-dashed'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={handleMasterDataImport}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${importStatus === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}><Database className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-slate-800 text-sm">Step 1: Raw FIT Archive (.zip)</h4><p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Drag & drop raw FIT zip here</p></div>
                </div>
                <label className="relative block">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleMasterDataImport} accept=".csv,.zip" />
                  <div className={`text-center py-3 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${isImportingFit ? 'bg-slate-200 text-slate-500' : importStatus === 'success' ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                    {isImportingFit ? "Extracting & Calculating..." : importStatus === 'success' ? `${rawRides.length} Sessions Loaded` : "Drop .ZIP or Select File"}
                  </div>
                </label>
              </div>

              <div 
                  className={`p-5 rounded-xl border-2 transition-all ${isDraggingContext ? 'bg-blue-50 border-blue-400 border-dashed scale-[1.02]' : contextStatus === 'success' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 border-dashed'} ${importStatus !== 'success' && 'opacity-50 pointer-events-none'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingContext(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingContext(false); }}
                  onDrop={handleContextImport}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${contextStatus === 'success' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}><MessageSquare className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-slate-800 text-sm">Step 2: TrainingPeaks Summary</h4><p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Drag TP Export ZIP or workouts.csv</p></div>
                </div>
                <label className="relative block">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleContextImport} accept=".csv,.zip" />
                  <div className={`text-center py-3 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${isImportingContext ? 'bg-slate-200 text-slate-500' : contextStatus === 'success' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {isImportingContext ? "Reconciling Days..." : contextStatus === 'success' ? "Context Merged Successfully" : "Drop ZIP or Select CSV"}
                  </div>
                </label>
              </div>

              <div 
                  className={`p-5 rounded-xl border-2 transition-all ${isDraggingWhoop ? 'bg-purple-50 border-purple-400 border-dashed scale-[1.02]' : whoopStatus === 'success' ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-200 border-dashed'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingWhoop(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingWhoop(false); }}
                  onDrop={handleWhoopImport}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${whoopStatus === 'success' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}><Heart className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-slate-800 text-sm">Step 3: Metrics (HRV & RHR)</h4><p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Drag TP Export ZIP or metrics.csv</p></div>
                </div>
                <label className="relative block">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleWhoopImport} accept=".csv,.zip" />
                  <div className={`text-center py-3 rounded-lg text-xs font-bold uppercase cursor-pointer transition ${isImportingWhoop ? 'bg-slate-200 text-slate-500' : whoopStatus === 'success' ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                    {isImportingWhoop ? "Extracting Metrics..." : whoopStatus === 'success' ? "Readiness Extracted" : "Drop ZIP or Select CSV"}
                  </div>
                </label>
                {whoopStatus === 'success' && <p className="text-[10px] text-purple-600 font-bold mt-2 uppercase flex items-center gap-1 italic"><CheckCircle2 className="w-3 h-3" /> Successfully populated physiological markers</p>}
              </div>
            </section>

            <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100 h-fit">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2 font-serif italic"><Brain className="w-5 h-5" /> Mental Medicine</h3>
              <textarea rows="8" className="w-full p-4 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm" placeholder="Reflect on the rider's mental durability, session adherence, and focus patterns throughout this block..." value={riderData.context} onChange={(e) => setRiderData({...riderData, context: e.target.value})} />
              
              <button 
                onClick={() => setView('report')} 
                disabled={performanceData.length === 0}
                className={`w-full text-white py-4 rounded-xl font-bold mt-6 shadow-xl transition transform uppercase tracking-widest text-xs ${performanceData.length > 0 ? 'bg-slate-900 hover:bg-slate-800 hover:-translate-y-1' : 'bg-slate-300 cursor-not-allowed'}`}>
                {performanceData.length > 0 ? 'View Performance Retrospective' : 'Awaiting Data Import'}
              </button>
            </section>
          </div>
        )}

        {/* === REPORT VIEW === */}
        {view === 'report' && performanceData.length > 0 && aggregateStats && (
          <div id="report-content" className="animate-in slide-in-from-bottom-4 duration-700 space-y-8">
            <div className="text-center pb-6 border-b border-slate-200 break-inside-avoid">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Target className="w-3 h-3" /> Block Classification: {blockPurpose}
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-2 font-serif">{riderData.name || 'Athlete Profile'}</h2>
              {riderData.personaId && (
                  <p className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-6">{RIDER_PERSONAS.find(p => p.id === riderData.personaId)?.title}</p>
              )}
              
              <div className="max-w-2xl mx-auto bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-4 text-left">
                <div className="flex items-center gap-2 mb-2 border-b border-slate-50 pb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Monthly Block Objective</p>
                </div>
                <p className="text-slate-800 font-medium leading-relaxed mb-4">{riderData.objective || "No specific objective provided for this block."}</p>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                   <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2">Sans Chaine Perspective</p>
                   <p className="text-sm text-slate-600 font-serif italic leading-relaxed">"Training is not about breaking the body down; it's about precise stimulation and adequate recovery. We build the aerobic foundation through disciplined torque, ensuring that durability—the capacity remaining after work performed—is prioritized over acute, unsustainable intensity."</p>
                </div>
              </div>
              <p className="text-slate-400 italic max-w-2xl mx-auto text-sm leading-relaxed font-serif">"Durability is capacity remaining after work performed."</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 break-inside-avoid">
                <div className="group relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors cursor-help">
                    <div className="flex justify-between items-start mb-2"><p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Fitness (CTL)</p>{aggregateStats.ctlDelta >= 0 ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}</div>
                    <div className="mb-4"><p className="text-3xl font-black text-slate-900">{aggregateStats.endingCTL}</p><p className={`text-xs font-bold mt-1 ${aggregateStats.ctlDelta >= 0 ? 'text-green-500' : 'text-red-500'}`}>{aggregateStats.ctlDelta >= 0 ? '+' : ''}{aggregateStats.ctlDelta} pts from start</p></div>
                    <div className="mt-auto pt-3 border-t border-slate-100"><p className="text-[10px] text-slate-500 italic font-serif leading-relaxed">"Consistency builds the engine. Don't chase the number; execute the daily work." - Andrew</p></div>
                </div>
                <div className="group relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors cursor-help">
                    <div className="flex justify-between items-start mb-2"><p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Volume</p><Activity className="w-4 h-4 text-blue-500" /></div>
                    <div className="mb-4"><p className="text-3xl font-black text-slate-900">{aggregateStats.totalHours}<span className="text-lg text-slate-400">h</span></p><p className="text-xs font-bold text-slate-500 mt-1">{aggregateStats.totalTSS} Total TSS</p></div>
                    <div className="mt-auto pt-3 border-t border-slate-100"><p className="text-[10px] text-slate-500 italic font-serif leading-relaxed">"Make the easy hours easy so the hard hours can actually be hard." - Andrew</p></div>
                </div>
                <div className="group relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors cursor-help">
                    <div className="flex justify-between items-start mb-2"><p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Efficiency</p><Target className="w-4 h-4 text-purple-500" /></div>
                    <div className="mb-4"><p className="text-3xl font-black text-slate-900">{aggregateStats.avgDecoupling}<span className="text-lg text-slate-400">%</span></p><p className="text-xs font-bold text-slate-500 mt-1">Avg Decoupling</p></div>
                    <div className="mt-auto pt-3 border-t border-slate-100"><p className="text-[10px] text-slate-500 italic font-serif leading-relaxed">"If HR drifts while power is steady, the base needs work. Target under 5%." - Andrew</p></div>
                </div>
                <div className="group relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors cursor-help">
                    <div className="flex justify-between items-start mb-2"><p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Durability</p><Zap className="w-4 h-4 text-amber-500" /></div>
                    <div className="mb-4"><p className="text-3xl font-black text-slate-900">{durabilityMetrics.wkg}</p><p className="text-xs font-bold text-slate-500 mt-1">W/kg @ 2000kJ</p></div>
                    <div className="mt-auto pt-3 border-t border-slate-100"><p className="text-[10px] text-slate-500 italic font-serif leading-relaxed">"Being strong fresh doesn't matter if you fade completely at hour three." - Andrew</p></div>
                </div>
                <div className="group relative bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors cursor-help">
                    <div className="flex justify-between items-start mb-2"><p className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Readiness</p><Heart className="w-4 h-4 text-rose-500" /></div>
                    <div className="mb-4"><p className={`text-3xl font-black ${aggregateStats.avgRecovery >= 67 ? 'text-green-500' : aggregateStats.avgRecovery >= 34 ? 'text-amber-500' : 'text-red-500'}`}>{aggregateStats.avgRecovery > 0 ? `${aggregateStats.avgRecovery}%` : 'N/A'}</p><p className="text-xs font-bold text-slate-500 mt-1">Avg WHOOP/HRV Recovery</p></div>
                    <div className="mt-auto pt-3 border-t border-slate-100"><p className="text-[10px] text-slate-500 italic font-serif leading-relaxed">"If you're in the red, mental medicine and recovery take priority over watts." - Andrew</p></div>
                </div>
            </div>

            <Card title="Integrated Load Profile" icon={BarChart3} subtitle="Daily Fitness vs Fatigue">
                <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dailyGraphData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="displayDate" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} minTickGap={30} />
                    <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<CustomDailyTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar isAnimationActive={false} yAxisId="right" dataKey="tss" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Daily TSS" />
                    <Area isAnimationActive={false} yAxisId="left" type="monotone" dataKey="atl" stroke="#ef4444" fill="transparent" strokeWidth={2} name="Fatigue" />
                    <Area isAnimationActive={false} yAxisId="left" type="monotone" dataKey="ctl" stroke="#2563eb" fill="#2563eb10" strokeWidth={4} name="Fitness" />
                    </ComposedChart>
                </ResponsiveContainer>
                </div>
            </Card>

            <Card title="Session Analytics & Graphing" icon={Database} subtitle="7-Day Calibration Grid">
                <div className="space-y-6">
                {performanceData.map((week, idx) => {
                    const isCollapsed = collapsedWeeks[week.week];
                    return (
                    <div key={idx} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex justify-between items-center mb-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors -mx-2" onClick={() => toggleWeek(week.week)}>
                            <div className="flex items-center gap-2"><h4 className="font-bold text-slate-800 text-lg">{week.week}</h4>{isCollapsed ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronUp className="w-5 h-5 text-slate-400" />}</div>
                            <span className="text-xs text-slate-500 font-bold uppercase">{week.tss} TSS | {week.decoupling}% Decoupling</span>
                        </div>
                        
                        {!isCollapsed && (
                            <div className="grid grid-cols-7 gap-2">
                            {week.days.map((day, dIdx) => (
                                <div key={dIdx} className="flex flex-col border border-slate-200 rounded-lg bg-slate-50 min-h-[140px] relative hover:z-50 transition-all duration-200">
                                    <div className="bg-slate-200 text-center py-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest rounded-t-lg">{day.dayName} <span className="opacity-60">{day.date.split('-').slice(1).join('/')}</span></div>
                                    {day.whoop && (
                                        <div className="flex justify-between px-1.5 py-1 text-[8px] border-b border-slate-200 bg-white">
                                            <span className="font-bold text-slate-500" title="Resting Heart Rate">RHR: {day.whoop.pulse || '-'}</span>
                                            <span className="font-bold text-slate-500" title="HRV">HRV: {day.whoop.hrv || '-'}</span>
                                            <span className={`font-black ${day.whoop.recovery >= 67 ? 'text-green-500' : day.whoop.recovery >= 34 ? 'text-amber-500' : 'text-red-500'}`} title="Recovery Score">{day.whoop.recovery ? `${day.whoop.recovery}%` : '-'}</span>
                                        </div>
                                    )}
                                    <div className="p-2 flex flex-col gap-2 flex-1 items-center justify-center relative">
                                        {day.rides.length > 0 ? (
                                            day.rides.map((ride, rIdx) => {
                                                const tooltipAnchor = dIdx > 3 ? "right-0 origin-top-right" : "left-0 origin-top-left";
                                                return (
                                                <div key={rIdx} className="group relative w-full hover:z-[100]">
                                                    <div className={`w-full p-2 rounded-lg flex flex-col items-start justify-center transition-all border shadow-sm cursor-help ${ride.syncMethod === 'No Context Match' ? 'bg-white border-slate-300 text-slate-600' : 'bg-blue-600 text-white border-blue-600'} hover:scale-105`}>
                                                        <div className="flex justify-between items-center w-full mb-1"><span className="text-[12px] font-black">{ride.tss} TSS</span><span className="text-[9px] font-bold opacity-80">{ride.duration}h</span></div>
                                                        <div className="flex justify-between items-center w-full"><span className="text-[9px] font-bold opacity-80">{ride.watts}W</span><span className="text-[9px] font-bold opacity-80">{ride.hr}bpm</span></div>
                                                    </div>
                                                    <div className={`absolute top-full ${tooltipAnchor} mt-2 w-[450px] bg-white rounded-xl shadow-2xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[100] p-4 transform scale-95 group-hover:scale-100`}>
                                                        <div className="flex justify-between items-start mb-2 border-b border-slate-100 pb-2">
                                                            <div><p className="text-sm font-black text-slate-900 leading-tight">{ride.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{ride.date} • {ride.duration}h</p></div>
                                                            <div className="text-right"><span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-black tracking-widest">{ride.syncMethod}</span></div>
                                                        </div>
                                                        {ride.chartData && ride.chartData.length > 0 && (
                                                        <div className="h-36 w-full mt-3 mb-3 bg-slate-50 rounded-lg p-2 border border-slate-100">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <ComposedChart data={ride.chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                                                                    <XAxis dataKey="time" hide />
                                                                    <YAxis yAxisId="power" tick={{fontSize: 8}} stroke="#cbd5e1" axisLine={false} tickLine={false} domain={[0, 'dataMax + 50']} />
                                                                    <YAxis yAxisId="hr" hide domain={[50, 200]} />
                                                                    <RechartsTooltip contentStyle={{ fontSize: '10px', padding: '4px', borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} labelStyle={{ display: 'none' }} itemStyle={{ padding: 0, margin: 0 }} />
                                                                    <Line isAnimationActive={false} yAxisId="power" type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="3 3" dot={false} strokeWidth={1.5} name="Target W" />
                                                                    <Area isAnimationActive={false} yAxisId="power" type="monotone" dataKey="watts" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} dot={false} name="Watts" />
                                                                    <Line isAnimationActive={false} yAxisId="hr" type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={1.5} dot={false} name="HR (bpm)" />
                                                                    <Line isAnimationActive={false} yAxisId="power" type="monotone" dataKey="cadence" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Cadence" />
                                                                </ComposedChart>
                                                            </ResponsiveContainer>
                                                        </div>
                                                        )}
                                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><p className="text-[8px] uppercase font-bold text-slate-400 mb-1">Feeling</p><div className="flex items-center gap-1"><Heart className="w-3 h-3 text-red-500" /><p className="text-[11px] font-bold text-slate-800">{ride.feeling || 'No Data'}</p></div></div>
                                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100"><p className="text-[8px] uppercase font-bold text-slate-400 mb-1">RPE / 10</p><p className="text-[11px] font-bold text-slate-800">{ride.rpe || 'N/A'}</p></div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {ride.summary && ride.summary !== "Technical data synced. Pending context matching..." && (
                                                                <div className="bg-blue-50 p-2 rounded border border-blue-100"><p className="text-[8px] uppercase font-black text-blue-600 mb-0.5">Ride Purpose</p><p className="text-[10px] text-blue-900 italic leading-relaxed">{ride.summary}</p></div>
                                                            )}
                                                        </div>
                                                        <div className="mt-3 pt-2 border-t border-slate-100 grid grid-cols-4 gap-2 text-center">
                                                            <div><p className="text-[7px] uppercase font-bold text-slate-400">Pwr</p><p className="text-[11px] font-black text-slate-700">{ride.watts}W</p></div>
                                                            <div><p className="text-[7px] uppercase font-bold text-slate-400">W/kg</p><p className="text-[11px] font-black text-slate-700">{ride.wkg}</p></div>
                                                            <div><p className="text-[7px] uppercase font-bold text-slate-400">HR</p><p className="text-[11px] font-black text-slate-700">{ride.hr}</p></div>
                                                            <div><p className="text-[7px] uppercase font-bold text-slate-400">P:HR</p><p className={`text-[11px] font-black ${ride.decoupling > 5 ? 'text-red-500' : 'text-green-600'}`}>{ride.decoupling}%</p></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                );
                                            })
                                        ) : (
                                            <div className="w-full flex flex-col gap-1 items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                                                <span className="text-[8px] uppercase font-bold text-slate-400 text-center">No Ride</span>
                                                <select 
                                                    className={`w-full text-[9px] p-1.5 border rounded outline-none font-bold cursor-pointer transition-colors ${dayReasons[day.date] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                                    value={dayReasons[day.date] || ''} onChange={(e) => handleReasonChange(day.date, e.target.value)}
                                                >
                                                    <option value="" disabled>Select Reason...</option>
                                                    {reasonOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            </div>
                        )}
                    </div>
                    );
                })}
                </div>
            </Card>

            <Card title="Monthly Closing Statement & Coach's Eye" icon={CheckCircle2}>
                {riderData.context && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 break-inside-avoid">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Mental Medicine Context</p>
                        <p className="text-sm text-blue-900 leading-relaxed italic font-serif">"{riderData.context}"</p>
                    </div>
                )}
                
                <div className="flex justify-end mb-2 no-print">
                    <button 
                      onClick={handleGenerateStatement}
                      disabled={isGeneratingStatement || performanceData.length === 0}
                      className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-lg text-[10px] font-black transition flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isGeneratingStatement ? "Generating Synopsis..." : "Auto-Generate AI Synopsis"}
                    </button>
                </div>
                
                <textarea 
                    className="w-full min-h-[280px] p-6 text-slate-800 leading-relaxed border border-slate-200 outline-none text-sm font-serif bg-slate-50 rounded-2xl focus:border-blue-300 transition-colors"
                    value={closingStatement} onChange={(e) => setClosingStatement(e.target.value)}
                    placeholder="Click 'Auto-Generate AI Synopsis' above to have the agent write a workout-by-workout breakdown evaluating execution against their zones, or type your own notes here..."
                />
                <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100 no-print">
                    <button onClick={handleResetSession} className="text-xs font-black text-slate-400 uppercase hover:text-slate-600 transition tracking-widest">Reset & Start New</button>
                    <button 
                      onClick={handleSavePdf} 
                      disabled={isGeneratingPdf}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition shadow-xl text-xs uppercase tracking-[0.2em] flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                      {isGeneratingPdf && <Cpu className="w-4 h-4 animate-spin" />}
                      {isGeneratingPdf ? "Generating PDF..." : "Finalize Retrospective (Save PDF)"}
                    </button>
                </div>
            </Card>
          </div>
        )}
      </main>

      {/* Floating Chat Bot */}
      <div className="fixed bottom-6 right-6 z-[2000] no-print">
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-[340px] md:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <div><h4 className="font-bold text-sm tracking-tight">Performance Assistant</h4><p className="text-[9px] text-slate-400 uppercase tracking-widest">Sans Chaine AI</p></div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 rounded-2xl rounded-tl-sm p-3 shadow-sm flex gap-1 items-center h-10 px-4">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span><span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" className="flex-1 p-2 bg-slate-100 border border-transparent rounded-lg text-sm outline-none focus:bg-white focus:border-blue-300 transition"
                  placeholder="Ask about decoupling, durability..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isChatLoading}
                />
                <button type="submit" disabled={!chatInput.trim() || isChatLoading} className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"><Send className="w-4 h-4" /></button>
              </form>
            </div>
          </div>
        )}

        <button onClick={() => setIsChatOpen(!isChatOpen)} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition transform hover:-translate-y-1">
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 text-center z-[1000] no-print">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.25em]">Sans Chaine Coaching | Mentorship Platform</p>
      </footer>
    </div>
  );
};

export default App;