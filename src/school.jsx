import React, { useState, useEffect } from 'react';

// Language Toggle Content
const languageData = {
  hi: {
    btnText: "English",
    title: "नेहरू पब्लिक स्कूल",
    subtitle: "उत्कृष्टता और परंपरा का प्रतीक • Estd. MMXV",
    list: [
      "<strong>CBSE और MPBSE मान्यता प्राप्त:</strong> विश्वस्तरीय शिक्षण मानक एवं आधुनिक दृष्टिकोण।",
      "<strong>नवीनतम डिजिटल तकनीक:</strong> स्मार्ट क्लासरूम, रोबोटिक्स और मॉडर्न साइंस लैब।",
      "<strong>विशिष्ट संकाय (Faculty):</strong> देश के अनुभवी और उच्च शिक्षित अध्यापकों द्वारा मार्गदर्शन।",
      "<strong>100% बोर्ड परिणाम:</strong> सतत 100% प्रथम श्रेणी परिणाम का गौरवशाली इतिहास।"
    ],
    footer: "Nehru Public School Enterprise Management System • Established 2015",
    proceed: "प्रशासनिक पोर्टल में प्रवेश करें"
  },
  en: {
    btnText: "हिंदी",
    title: "Nehru Public School",
    subtitle: "A Tradition of Excellence & Innovation • Estd. MMXV",
    list: [
      "<strong>CBSE & MPBSE Affiliated:</strong> World-class curriculum with holistic development.",
      "<strong>Next-Gen Infrastructure:</strong> Smart interactive boards & advanced laboratories.",
      "<strong>Distinguished Faculty:</strong> Mentorship by veteran educators and experts.",
      "<strong>100% Board Success:</strong> Legacy of top positions & stellar board results."
    ],
    footer: "Nehru Public School Enterprise Management System • Established 2015",
    proceed: "Enter Administrative Portal"
  }
};

const defaultClassFees = {
  "Nursery": 12000, "KG-1": 14000, "KG-2": 14000,
  "Class 1st": 16000, "Class 2nd": 16000, "Class 3rd": 18000,
  "Class 4th": 18000, "Class 5th": 20000, "Class 6th": 22000,
  "Class 7th": 22000, "Class 8th": 24000, "Class 9th": 26000,
  "Class 10th": 28000, "Class 11th": 32000, "Class 12th": 35000
};

// ⚠️ YAHAN APNI GOOGLE APPS SCRIPT KI WEB APP URL PASTE KAREIN
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";

export default function App() {
  const [showGate, setShowGate] = useState(true);
  const [lang, setLang] = useState('hi');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [currentDayStr, setCurrentDayStr] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // LocalStorage Persistence
  const [toppers, setToppers] = useState(() => {
    const saved = localStorage.getItem('nps_toppers');
    return saved ? JSON.parse(saved) : [
      { rank: "1st", name: "Aarav Sharma", board: "CBSE", class: "Class 12th", percentage: "98.8%" },
      { rank: "2nd", name: "Priya Patel", board: "MPBSE", class: "Class 12th", percentage: "97.4%" },
      { rank: "3rd", name: "Rohan Verma", board: "CBSE", class: "Class 10th", percentage: "96.5%" }
    ];
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('nps_students');
    return saved ? JSON.parse(saved) : [
      { roll: 101, name: "Ananya Gupta", father: "Suresh Gupta", mobile: "9876543210", board: "CBSE", class: "Class 10th", percentage: "94.2%", feeStatus: "Paid" },
      { roll: 102, name: "Vikram Singh", father: "Rajesh Singh", mobile: "9812345678", board: "MPBSE", class: "Class 12th", percentage: "88.0%", feeStatus: "Unpaid" }
    ];
  });

  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('nps_teachers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Dr. Ramesh Sharma", dept: "Mathematics", salary: 42000, present: true },
      { id: 2, name: "Sunita Verma", dept: "Science", salary: 38000, present: true }
    ];
  });

  const [classFees, setClassFees] = useState(() => {
    const saved = localStorage.getItem('nps_class_fees');
    return saved ? JSON.parse(saved) : defaultClassFees;
  });

  const [studentForm, setStudentForm] = useState({
    name: '', father: '', mobile: '', board: 'CBSE', class: 'Nursery', roll: '', percentage: '', feeStatus: 'Unpaid'
  });

  const [teacherForm, setTeacherForm] = useState({ name: '', dept: '', salary: '' });

  useEffect(() => { localStorage.setItem('nps_toppers', JSON.stringify(toppers)); }, [toppers]);
  useEffect(() => { localStorage.setItem('nps_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('nps_teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('nps_class_fees', JSON.stringify(classFees)); }, [classFees]);

  useEffect(() => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setCurrentDateStr(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
    setCurrentDayStr(days[now.getDay()]);
  }, []);

  // Sync to Google Sheet
  const syncToGoogleSheet = async () => {
    if (GOOGLE_SHEET_URL.includes("YOUR_SCRIPT_ID_HERE")) {
      alert("Kripya pehle App.js me apni Web App URL paste karein!");
      return;
    }

    setIsSyncing(true);
    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SYNC_ALL_STUDENTS",
          students: students
        })
      });
      alert("✅ Data Google Sheet me successfully sync ho gaya!");
    } catch (err) {
      console.error(err);
      alert("❌ Sync karne me dikkat aayi.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    setStudents([...students, {
      roll: parseInt(studentForm.roll),
      name: studentForm.name,
      father: studentForm.father,
      mobile: studentForm.mobile,
      board: studentForm.board,
      class: studentForm.class,
      percentage: studentForm.percentage || 'N/A',
      feeStatus: studentForm.feeStatus
    }]);
    setStudentForm({ name: '', father: '', mobile: '', board: 'CBSE', class: 'Nursery', roll: '', percentage: '', feeStatus: 'Unpaid' });
  };

  const toggleFeeStatus = (idx) => {
    const updated = [...students];
    updated[idx].feeStatus = updated[idx].feeStatus === 'Paid' ? 'Unpaid' : 'Paid';
    setStudents(updated);
  };

  const deleteStudent = (idx) => {
    if (window.confirm("Remove student record?")) setStudents(students.filter((_, i) => i !== idx));
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    setTeachers([...teachers, { id: Date.now(), name: teacherForm.name, dept: teacherForm.dept, salary: parseFloat(teacherForm.salary), present: true }]);
    setTeacherForm({ name: '', dept: '', salary: '' });
  };

  const toggleTeacherAttendance = (idx) => {
    const updated = [...teachers];
    updated[idx].present = !updated[idx].present;
    setTeachers(updated);
  };

  const deleteTeacher = (idx) => {
    if (window.confirm("Remove faculty record?")) setTeachers(teachers.filter((_, i) => i !== idx));
  };

  const editTopper = (idx, field) => {
    const newVal = window.prompt(`Edit ${field.toUpperCase()}:`, toppers[idx][field]);
    if (newVal !== null && newVal.trim() !== "") {
      const updated = [...toppers];
      updated[idx][field] = newVal.trim();
      setToppers(updated);
    }
  };

  const handleFeeChange = (className, val) => {
    setClassFees({ ...classFees, [className]: parseFloat(val) || 0 });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting tab
  };

  const totalProjected = students.reduce((acc, s) => acc + (classFees[s.class] || 0), 0);
  const totalCollected = students.reduce((acc, s) => acc + (s.feeStatus === 'Paid' ? (classFees[s.class] || 0) : 0), 0);
  const pendingFees = totalProjected - totalCollected;
  const totalSalaries = teachers.reduce((acc, t) => acc + t.salary, 0);
  const netPL = totalCollected - totalSalaries;

  const currentLangText = languageData[lang];

  return (
    <div className="app-container">
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        h1, h2, h3, .serif-font { font-family: 'Cinzel', serif; }

        .app-container {
          display: flex;
          background-color: #0f172a;
          height: 100vh;
          color: #f8fafc;
          overflow: hidden;
          position: relative;
        }

        /* Overlay Entrance */
        .info-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98));
          display: flex; justify-content: center; align-items: center;
          z-index: 9999; backdrop-filter: blur(12px); padding: 15px;
        }
        .info-circular-box {
          background: linear-gradient(145deg, #1e293b, #0f172a);
          width: 100%; max-width: 680px; padding: 35px 25px;
          border: 1px solid rgba(217, 119, 6, 0.4);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
          border-radius: 12px; text-align: center; position: relative;
          max-height: 90vh; overflow-y: auto;
        }
        .lang-toggle-btn {
          position: absolute; top: 15px; right: 15px;
          background: linear-gradient(135deg, #d97706, #b45309);
          color: #fff; border: none; padding: 6px 14px; font-size: 11px;
          font-weight: 700; cursor: pointer; border-radius: 20px;
        }

        .classic-crest {
          width: 70px; height: 75px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 2px solid #d97706; border-radius: 0 0 35px 35px;
          position: relative; display: flex; justify-content: center; align-items: center;
          box-shadow: 0 0 20px rgba(217, 119, 6, 0.25); margin: 0 auto 15px;
        }
        .classic-crest::before {
          content: "MMXV"; color: #fbbf24; font-size: 11px; font-weight: 800;
          letter-spacing: 2px; font-family: 'Cinzel', serif;
        }

        /* Mobile Header */
        .mobile-header {
          display: none;
          background: #0b1329;
          padding: 15px 20px;
          border-bottom: 1px solid rgba(217, 119, 6, 0.2);
          align-items: center;
          justify-content: space-between;
          width: 100%;
          z-index: 100;
        }
        .hamburger-btn {
          background: transparent;
          border: none;
          color: #fbbf24;
          font-size: 24px;
          cursor: pointer;
        }

        /* Sidebar Styling */
        .sidebar {
          width: 280px; background: linear-gradient(180deg, #0b1329 0%, #030712 100%);
          border-right: 1px solid rgba(217, 119, 6, 0.2); padding: 30px 15px;
          display: flex; flex-direction: column; justify-content: space-between;
          transition: transform 0.3s ease;
          z-index: 500;
        }
        .sidebar-brand h2 { color: #f8fafc; font-size: 18px; text-align: center; letter-spacing: 1.5px; }
        .sidebar-brand .est-tag { text-align: center; font-size: 10px; color: #fbbf24; letter-spacing: 3px; font-weight: 700; margin-top: 4px; }
        .nav-menu { margin-top: 25px; }
        .nav-item {
          display: flex; align-items: center; color: #94a3b8; text-decoration: none;
          padding: 12px 15px; margin-bottom: 6px; border-radius: 8px; font-size: 13px;
          font-weight: 500; transition: all 0.25s ease; cursor: pointer; border: 1px solid transparent;
        }
        .nav-item:hover, .nav-item.active {
          background: linear-gradient(90deg, rgba(217, 119, 6, 0.15), transparent);
          color: #fbbf24; border-color: rgba(217, 119, 6, 0.3); font-weight: 600;
        }

        /* Main Container */
        .main-wrapper {
          flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden;
        }
        .main-content {
          flex: 1; padding: 30px; overflow-y: auto; background: #090d16;
        }
        .header-bar {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 15px; margin-bottom: 25px;
          flex-wrap: wrap; gap: 15px;
        }
        .header-bar h1 { font-size: 24px; color: #f8fafc; letter-spacing: 1px; }

        .live-clock-badge {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
          border: 1px solid rgba(217, 119, 6, 0.4); padding: 8px 18px; border-radius: 30px;
          text-align: right; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .live-clock-badge .date { font-size: 13px; font-weight: 700; color: #fbbf24; }
        .live-clock-badge .day { font-size: 9px; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; }

        /* Responsive Layout Grids */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 25px; }
        .stat-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.08); padding: 18px; border-radius: 10px;
        }
        .stat-card h4 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; }
        .stat-card .val { font-size: 22px; font-weight: 700; color: #f8fafc; }

        .grid-2col { display: grid; grid-template-columns: 1fr 1.5fr; gap: 20px; }

        .glass-box {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.7));
          border: 1px solid rgba(255, 255, 255, 0.08); padding: 20px; border-radius: 12px;
          margin-bottom: 20px;
        }
        .glass-box h3 { color: #fbbf24; font-size: 16px; margin-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; }

        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #cbd5e1; margin-bottom: 5px; }
        .form-group input, .form-group select {
          width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 10px 12px; border-radius: 6px; color: #fff; font-size: 13px; outline: none;
        }

        .btn-gold {
          background: linear-gradient(135deg, #d97706, #b45309); color: #fff; border: none;
          padding: 10px 18px; border-radius: 6px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; font-size: 11px; cursor: pointer; width: 100%;
        }
        .btn-sheet {
          background: linear-gradient(135deg, #059669, #047857); color: #fff; border: none;
          padding: 8px 14px; border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer;
        }

        /* Responsive Table Wrapper */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        table { width: 100%; border-collapse: collapse; white-space: nowrap; }
        th { background: rgba(15, 23, 42, 0.9); color: #fbbf24; font-size: 10px; text-transform: uppercase; padding: 10px; border-bottom: 2px solid rgba(217, 119, 6, 0.3); text-align: left; }
        td { padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 12px; color: #e2e8f0; }

        .badge { padding: 3px 8px; border-radius: 15px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
        .badge-success { background: rgba(22, 101, 52, 0.4); color: #4ade80; }
        .badge-danger { background: rgba(153, 27, 27, 0.4); color: #f87171; }
        .badge-cbse { background: rgba(180, 83, 9, 0.3); color: #fcd34d; }
        .badge-mpbse { background: rgba(3, 105, 161, 0.3); color: #38bdf8; }

        .btn-action { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; }
        .btn-wa { background: rgba(13, 148, 136, 0.3); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3); padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 10px; }

        .sidebar-backdrop {
          display: none;
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.6); z-index: 400; backdrop-filter: blur(3px);
        }

        /* MEDIA QUERIES FOR MOBILE & TABLET */
        @media (max-width: 900px) {
          .mobile-header { display: flex; }
          .sidebar {
            position: fixed; top: 0; left: 0; height: 100%;
            transform: translateX(-100%);
          }
          .sidebar.open { transform: translateX(0); }
          .sidebar-backdrop.open { display: block; }
          .grid-2col { grid-template-columns: 1fr; }
          .main-content { padding: 15px; }
          .header-bar h1 { font-size: 20px; }
        }
      `}</style>

      {/* OVERLAY ENTRANCE */}
      {showGate && (
        <div className="info-overlay">
          <div className="info-circular-box">
            <button className="lang-toggle-btn" onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}>
              {currentLangText.btnText}
            </button>
            <div className="classic-crest"></div>
            <h2 className="serif-font" style={{ fontSize: '22px', color: '#f8fafc', marginBottom: '4px' }}>{currentLangText.title}</h2>
            <p style={{ color: '#fbbf24', fontSize: '11px', letterSpacing: '1px', marginBottom: '15px' }}>{currentLangText.subtitle}</p>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.5), transparent)', margin: '15px 0' }} />
            <ul style={{ textAlign: 'left', margin: '15px 0', padding: '0 5px', listStyle: 'none' }}>
              {currentLangText.list.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: `✦ ${item}` }} />
              ))}
            </ul>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.5), transparent)', margin: '15px 0' }} />
            <p style={{ fontSize: '10px', color: '#64748b', marginBottom: '20px' }}>{currentLangText.footer}</p>
            <button className="btn-gold" onClick={() => setShowGate(false)}>
              {currentLangText.proceed}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE BACKDROP */}
      <div className={`sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      {/* SIDEBAR */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div>
          <div className="classic-crest"></div>
          <div className="sidebar-brand">
            <h2 className="serif-font">NEHRU PUBLIC</h2>
            <div className="est-tag">ESTABLISHED 2015</div>
          </div>

          <div className="nav-menu">
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}>Dashboard</div>
            <div className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => handleTabChange('students')}>Students Register</div>
            <div className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => handleTabChange('teachers')}>Faculty Roster</div>
            <div className={`nav-item ${activeTab === 'dispatch-center' ? 'active' : ''}`} onClick={() => handleTabChange('dispatch-center')}>📨 Send Results</div>
            <div className={`nav-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => handleTabChange('finance')}>💰 Accounts & Fund</div>
            <div className={`nav-item ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => handleTabChange('fees')}>Fees Structure</div>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#475569', textAlign: 'center', marginTop: '20px' }}>
          ENTERPRISE V4.0 (RESPONSIVE)
        </div>
      </div>

      {/* MAIN WRAPPER */}
      <div className="main-wrapper">
        {/* MOBILE HEADER */}
        <div className="mobile-header">
          <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <div className="serif-font" style={{ color: '#fbbf24', fontWeight: 'bold' }}>NEHRU PUBLIC SCHOOL</div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
          <div className="header-bar">
            <h1 className="serif-font">
              {activeTab === 'dashboard' && 'Administrative Overview'}
              {activeTab === 'students' && 'Student Directory'}
              {activeTab === 'teachers' && 'Faculty Management'}
              {activeTab === 'dispatch-center' && 'WhatsApp Dispatch'}
              {activeTab === 'finance' && 'Financial Ledger'}
              {activeTab === 'fees' && 'Fee Configuration'}
            </h1>
            <div className="live-clock-badge">
              <div className="date">{currentDateStr}</div>
              <div className="day">{currentDayStr}</div>
            </div>
          </div>

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card" style={{ borderTop: '3px solid #d97706' }}>
                  <h4>Total Fund</h4>
                  <div className="val">₹{totalProjected.toLocaleString('en-IN')}</div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid #22c55e' }}>
                  <h4>Collected</h4>
                  <div className="val" style={{ color: '#4ade80' }}>₹{totalCollected.toLocaleString('en-IN')}</div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid #ef4444' }}>
                  <h4>Pending</h4>
                  <div className="val" style={{ color: '#f87171' }}>₹{pendingFees.toLocaleString('en-IN')}</div>
                </div>
                <div className="stat-card" style={{ borderTop: '3px solid #3b82f6' }}>
                  <h4>{netPL >= 0 ? 'Net Profit' : 'Net Deficit'}</h4>
                  <div className="val" style={{ color: netPL >= 0 ? '#4ade80' : '#f87171' }}>
                    ₹{Math.abs(netPL).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="glass-box">
                <h3>⭐ Honor Roll Toppers</h3>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Board</th>
                        <th>Class</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toppers.map((t, idx) => (
                        <tr key={idx}>
                          <td style={{ cursor: 'pointer' }} onClick={() => editTopper(idx, 'rank')}><strong>{t.rank}</strong></td>
                          <td style={{ cursor: 'pointer' }} onClick={() => editTopper(idx, 'name')}>{t.name}</td>
                          <td style={{ cursor: 'pointer' }} onClick={() => editTopper(idx, 'board')}>
                            <span className={`badge ${t.board === 'CBSE' ? 'badge-cbse' : 'badge-mpbse'}`}>{t.board}</span>
                          </td>
                          <td style={{ cursor: 'pointer' }} onClick={() => editTopper(idx, 'class')}>{t.class}</td>
                          <td style={{ cursor: 'pointer' }} onClick={() => editTopper(idx, 'percentage')}><strong style={{ color: '#4ade80' }}>{t.percentage}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS REGISTER */}
          {activeTab === 'students' && (
            <div className="grid-2col">
              <div className="glass-box">
                <h3>Student Enrollment</h3>
                <form onSubmit={handleAddStudent}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" required value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Father's Name</label>
                    <input type="text" required value={studentForm.father} onChange={(e) => setStudentForm({ ...studentForm, father: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Mobile</label>
                    <input type="number" required value={studentForm.mobile} onChange={(e) => setStudentForm({ ...studentForm, mobile: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Board</label>
                    <select value={studentForm.board} onChange={(e) => setStudentForm({ ...studentForm, board: e.target.value })}>
                      <option value="CBSE">CBSE</option>
                      <option value="MPBSE">MPBSE</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Class</label>
                    <select value={studentForm.class} onChange={(e) => setStudentForm({ ...studentForm, class: e.target.value })}>
                      {Object.keys(classFees).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input type="number" required value={studentForm.roll} onChange={(e) => setStudentForm({ ...studentForm, roll: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Percentage</label>
                    <input type="text" value={studentForm.percentage} onChange={(e) => setStudentForm({ ...studentForm, percentage: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Fees Status</label>
                    <select value={studentForm.feeStatus} onChange={(e) => setStudentForm({ ...studentForm, feeStatus: e.target.value })}>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-gold">Register Student</button>
                </form>
              </div>

              <div className="glass-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ margin: 0, border: 'none' }}>Student Directory</h3>
                  <button className="btn-sheet" onClick={syncToGoogleSheet} disabled={isSyncing}>
                    {isSyncing ? "Syncing..." : "📊 Sync to Sheet"}
                  </button>
                </div>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Roll</th>
                        <th>Name</th>
                        <th>Class</th>
                        <th>Fees</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s, idx) => (
                        <tr key={idx}>
                          <td>#{s.roll}</td>
                          <td><strong>{s.name}</strong><br/><span style={{ fontSize: '10px', color: '#94a3b8' }}>{s.mobile}</span></td>
                          <td>{s.class}</td>
                          <td>
                            <span className={`badge ${s.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`} style={{ cursor: 'pointer' }} onClick={() => toggleFeeStatus(idx)}>
                              {s.feeStatus}
                            </span>
                          </td>
                          <td><button className="btn-action" onClick={() => deleteStudent(idx)}>Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TEACHERS */}
          {activeTab === 'teachers' && (
            <div className="grid-2col">
              <div className="glass-box">
                <h3>Appoint Faculty</h3>
                <form onSubmit={handleAddTeacher}>
                  <div className="form-group">
                    <label>Teacher Name</label>
                    <input type="text" required value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" required value={teacherForm.dept} onChange={(e) => setTeacherForm({ ...teacherForm, dept: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Salary (₹)</label>
                    <input type="number" required value={teacherForm.salary} onChange={(e) => setTeacherForm({ ...teacherForm, salary: e.target.value })} />
                  </div>
                  <button type="submit" className="btn-gold">Appoint Teacher</button>
                </form>
              </div>

              <div className="glass-box">
                <h3>Faculty List</h3>
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Dept</th>
                        <th>Attendance</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((t, idx) => (
                        <tr key={idx}>
                          <td><strong>{t.name}</strong></td>
                          <td>{t.dept}</td>
                          <td>
                            <span className={`badge ${t.present ? 'badge-success' : 'badge-danger'}`} style={{ cursor: 'pointer' }} onClick={() => toggleTeacherAttendance(idx)}>
                              {t.present ? 'Present' : 'Absent'}
                            </span>
                          </td>
                          <td><button className="btn-action" onClick={() => deleteTeacher(idx)}>Remove</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DISPATCH CENTER */}
          {activeTab === 'dispatch-center' && (
            <div className="glass-box">
              <h3>📨 WhatsApp Marksheet Dispatch</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class & Roll</th>
                      <th>Marks</th>
                      <th>Contact</th>
                      <th>Dispatch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, idx) => {
                      const msg = encodeURIComponent(`Dear Parent (${s.father}), Report Card for ${s.name} (${s.class}, Roll: ${s.roll}). Score: ${s.percentage}. Fees Status: ${s.feeStatus}. Nehru Public School.`);
                      return (
                        <tr key={idx}>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.class} (#{s.roll})</td>
                          <td><strong style={{ color: '#fbbf24' }}>{s.percentage}</strong></td>
                          <td>{s.mobile}</td>
                          <td>
                            <a href={`https://wa.me/91${s.mobile}?text=${msg}`} target="_blank" rel="noopener noreferrer">
                              <button className="btn-wa">💬 Send WA</button>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FINANCE */}
          {activeTab === 'finance' && (
            <div className="glass-box">
              <h3>💰 Financial Reserve Overview</h3>
              <div className="stats-grid" style={{ marginTop: '15px' }}>
                <div className="stat-card">
                  <h4>Projected Fees</h4>
                  <div className="val">₹{totalProjected.toLocaleString('en-IN')}</div>
                </div>
                <div className="stat-card">
                  <h4>Collected Fees</h4>
                  <div className="val" style={{ color: '#4ade80' }}>₹{totalCollected.toLocaleString('en-IN')}</div>
                </div>
                <div className="stat-card">
                  <h4>Faculty Payroll</h4>
                  <div className="val" style={{ color: '#f87171' }}>₹{totalSalaries.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FEES STRUCTURE */}
          {activeTab === 'fees' && (
            <div className="glass-box">
              <h3>Class-wise Annual Fee Configuration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginTop: '15px' }}>
                {Object.keys(classFees).map((c) => (
                  <div key={c} className="form-group" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <label style={{ color: '#fbbf24' }}>{c}</label>
                    <input
                      type="number"
                      value={classFees[c]}
                      onChange={(e) => handleFeeChange(c, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}