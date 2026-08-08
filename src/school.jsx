import React, { useState, useEffect } from 'react';

// Language Toggle Content
const languageData = {
  hi: {
    btnText: "English",
    title: "नेहरू पब्लिक स्कूल",
    subtitle: "उत्कृष्टता और परंपरा का प्रतीक • Estd. NSP",
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

export default function App() {
  const [showGate, setShowGate] = useState(true);
  const [lang, setLang] = useState('hi');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [currentDayStr, setCurrentDayStr] = useState('');

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

  // State to hold individual notes/complaints for each student
  const [studentNotes, setStudentNotes] = useState({});

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

  const handleNoteChange = (roll, note) => {
    setStudentNotes({ ...studentNotes, [roll]: note });
  };

  const totalProjected = students.reduce((acc, s) => acc + (classFees[s.class] || 0), 0);
  const totalCollected = students.reduce((acc, s) => acc + (s.feeStatus === 'Paid' ? (classFees[s.class] || 0) : 0), 0);
  const pendingFees = totalProjected - totalCollected;
  const totalSalaries = teachers.reduce((acc, t) => acc + t.salary, 0);
  const netPL = totalCollected - totalSalaries;

  const currentLangText = languageData[lang];

  return (
    <div style={{ display: 'flex', backgroundColor: '#0f172a', height: '100vh', color: '#f8fafc', overflow: 'hidden', fontFamily: "'Cinzel', 'Playfair Display', 'Georgia', serif" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif; }
        h1, h2, h3, .serif-font { font-family: 'Cinzel', serif; }

        /* Overlay Entrance */
        .info-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: radial-gradient(circle at center, rgba(15, 23, 42, 0.95), rgba(2, 6, 23, 0.98));
          display: flex; justify-content: center; align-items: center;
          z-index: 9999; backdrop-filter: blur(12px);
        }
        .info-circular-box {
          background: linear-gradient(145deg, #1e293b, #0f172a);
          width: 90%; max-width: 680px; padding: 45px;
          border: 1px solid rgba(217, 119, 6, 0.4);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(217, 119, 6, 0.1);
          border-radius: 12px; text-align: center; position: relative;
        }
        .lang-toggle-btn {
          position: absolute; top: 20px; right: 20px;
          background: linear-gradient(135deg, #d97706, #b45309);
          color: #fff; border: none; padding: 8px 18px; font-size: 11px;
          font-weight: 700; cursor: pointer; border-radius: 20px; letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3); transition: all 0.3s ease;
        }
        .lang-toggle-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(217, 119, 6, 0.5); }

        /* Classic Crest Logo */
        .classic-crest {
          width: 80px; height: 85px;
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 2px solid #d97706; border-radius: 0 0 40px 40px;
          position: relative; display: flex; justify-content: center; align-items: center;
          box-shadow: 0 0 20px rgba(217, 119, 6, 0.25); margin: 0 auto 15px;
        }
        .classic-crest::before {
          content: "NPS"; color: #fbbf24; font-size: 12px; font-weight: 800;
          letter-spacing: 2px; font-family: 'Cinzel', serif;
        }

        /* Sidebar Styling */
        .sidebar {
          width: 310px; background: linear-gradient(180deg, #0b1329 0%, #030712 100%);
          border-right: 1px solid rgba(217, 119, 6, 0.2); padding: 35px 20px;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .sidebar-brand h2 { color: #f8fafc; font-size: 20px; text-align: center; letter-spacing: 1.5px; }
        .sidebar-brand .est-tag { text-align: center; font-size: 10px; color: #fbbf24; letter-spacing: 3px; font-weight: 700; margin-top: 4px; }
        .nav-menu { margin-top: 35px; }
        .nav-item {
          display: flex; align-items: center; color: #94a3b8; text-decoration: none;
          padding: 13px 18px; margin-bottom: 8px; border-radius: 8px; font-size: 13px;
          font-weight: 500; transition: all 0.25s ease; cursor: pointer; border: 1px solid transparent;
        }
        .nav-item:hover, .nav-item.active {
          background: linear-gradient(90deg, rgba(217, 119, 6, 0.15), transparent);
          color: #fbbf24; border-color: rgba(217, 119, 6, 0.3); font-weight: 600;
        }

        /* Main Container */
        .main-content { flex: 1; padding: 40px 45px; overflow-y: auto; background: #090d16; }
        .header-bar {
          display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px; margin-bottom: 35px;
        }
        .header-bar h1 { font-size: 28px; color: #f8fafc; letter-spacing: 1px; }

        .live-clock-badge {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8));
          border: 1px solid rgba(217, 119, 6, 0.4); padding: 10px 22px; border-radius: 30px;
          text-align: right; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .live-clock-badge .date { font-size: 14px; font-weight: 700; color: #fbbf24; }
        .live-clock-badge .day { font-size: 10px; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; }

        /* Premium Cards */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 20px; margin-bottom: 35px; }
        .stat-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(255, 255, 255, 0.08); padding: 22px; border-radius: 10px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); transition: transform 0.3s;
        }
        .stat-card:hover { transform: translateY(-3px); border-color: rgba(217, 119, 6, 0.4); }
        .stat-card h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 12px; }
        .stat-card .val { font-size: 28px; font-weight: 700; color: #f8fafc; }

        /* Section Layouts */
        .grid-2col { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; }
        @media (max-width: 1100px) { .grid-2col { grid-template-columns: 1fr; } }

        .glass-box {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.7));
          border: 1px solid rgba(255, 255, 255, 0.08); padding: 30px; border-radius: 12px;
          backdrop-filter: blur(10px); margin-bottom: 30px;
        }
        .glass-box h3 { color: #fbbf24; font-size: 18px; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 10px; }

        /* Form Controls */
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #cbd5e1; margin-bottom: 6px; }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 12px 15px; border-radius: 6px; color: #fff; font-size: 14px; outline: none; transition: border 0.3s;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #d97706; }

        .btn-gold {
          background: linear-gradient(135deg, #d97706, #b45309); color: #fff; border: none;
          padding: 12px 24px; border-radius: 6px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; font-size: 11px; cursor: pointer; transition: all 0.3s; width: 100%;
        }
        .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Tables */
        table { width: 100%; border-collapse: collapse; }
        th { background: rgba(15, 23, 42, 0.9); color: #fbbf24; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; padding: 14px; border-bottom: 2px solid rgba(217, 119, 6, 0.3); text-align: left; }
        td { padding: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; color: #e2e8f0; vertical-align: middle; }
        tr:hover { background: rgba(255, 255, 255, 0.02); }

        .badge { padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; }
        .badge-success { background: rgba(22, 101, 52, 0.4); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
        .badge-danger { background: rgba(153, 27, 27, 0.4); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
        .badge-cbse { background: rgba(180, 83, 9, 0.3); color: #fcd34d; border: 1px solid rgba(252, 211, 77, 0.3); }
        .badge-mpbse { background: rgba(3, 105, 161, 0.3); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }

        .btn-action { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .btn-action:hover { background: rgba(239, 68, 68, 0.4); }

        .btn-wa { background: rgba(13, 148, 136, 0.3); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3); padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; display: inline-flex; align-items: center; gap: 5px; }
        .btn-wa:hover { background: rgba(13, 148, 136, 0.5); }

        .preset-chip {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #94a3b8; font-size: 10px; padding: 3px 8px; border-radius: 12px;
          cursor: pointer; transition: all 0.2s; margin-right: 4px; margin-top: 4px; display: inline-block;
        }
        .preset-chip:hover { background: rgba(217, 119, 6, 0.2); color: #fbbf24; border-color: #d97706; }

        .editable-cell { cursor: pointer; transition: background 0.2s; }
        .editable-cell:hover { background: rgba(251, 191, 36, 0.1); }
      `}</style>

      {/* OVERLAY ENTRANCE */}
      {showGate && (
        <div className="info-overlay">
          <div className="info-circular-box">
            <button className="lang-toggle-btn" onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}>
              {currentLangText.btnText}
            </button>
            <div className="classic-crest"></div>
            <h2 className="serif-font" style={{ fontSize: '28px', color: '#f8fafc', marginBottom: '6px' }}>{currentLangText.title}</h2>
            <p style={{ color: '#fbbf24', fontSize: '12px', letterSpacing: '2px', uppercase: 'true', marginBottom: '20px' }}>{currentLangText.subtitle}</p>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.5), transparent)', margin: '20px 0' }} />
            <ul style={{ textAlign: 'left', margin: '20px 0', padding: '0 10px', listStyle: 'none' }}>
              {currentLangText.list.map((item, idx) => (
                <li key={idx} style={{ marginBottom: '12px', fontSize: '13.5px', color: '#cbd5e1', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: `✦ ${item}` }} />
              ))}
            </ul>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.5), transparent)', margin: '20px 0' }} />
            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '25px', letterSpacing: '1px' }}>{currentLangText.footer}</p>
            <button className="btn-gold" onClick={() => setShowGate(false)}>
              {currentLangText.proceed}
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div className="sidebar">
        <div>
          <div className="classic-crest"></div>
          <div className="sidebar-brand">
            <h2 className="serif-font">NEHRU PUBLIC SCHOOL</h2>
            <div className="est-tag">ESTABLISHED 2015</div>
          </div>

          <div className="nav-menu">
            <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</div>
            <div className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>Students Register</div>
            <div className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>Faculty Roster</div>
            <div className={`nav-item ${activeTab === 'dispatch-center' ? 'active' : ''}`} onClick={() => setActiveTab('dispatch-center')}>📩 Dispatch & Remarks</div>
            <div className={`nav-item ${activeTab === 'finance' ? 'active' : ''}`} onClick={() => setActiveTab('finance')}>💰 Accounts & Fund</div>
            <div className={`nav-item ${activeTab === 'routines' ? 'active' : ''}`} onClick={() => setActiveTab('routines')}>School Timings</div>
            <div className={`nav-item ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}>Fees Structure</div>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: '#475569', textAlign: 'center', letterSpacing: '1px' }}>
          ENTERPRISE SYSTEM V4.0
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header-bar">
          <h1 className="serif-font">
            {activeTab === 'dashboard' && 'Administrative Overview'}
            {activeTab === 'students' && 'Student Directory & Admissions'}
            {activeTab === 'teachers' && 'Faculty Management'}
            {activeTab === 'dispatch-center' && 'WhatsApp Dispatch & Faculty Remarks'}
            {activeTab === 'finance' && 'Financial Ledger'}
            {activeTab === 'routines' && 'Schedules & Operations'}
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
                <h4>Total Fund (Expected)</h4>
                <div className="val">₹{totalProjected.toLocaleString('en-IN')}</div>
              </div>
              <div className="stat-card" style={{ borderTop: '3px solid #22c55e' }}>
                <h4>Fund Collected</h4>
                <div className="val" style={{ color: '#4ade80' }}>₹{totalCollected.toLocaleString('en-IN')}</div>
              </div>
              <div className="stat-card" style={{ borderTop: '3px solid #ef4444' }}>
                <h4>Pending Receivables</h4>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 className="serif-font" style={{ margin: 0, border: 'none' }}>⭐ Honor Roll Toppers (Click Row to Edit)</h3>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>💡 Real-time editable ledger</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student Name</th>
                    <th>Board</th>
                    <th>Class</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {toppers.map((t, idx) => (
                    <tr key={idx}>
                      <td className="editable-cell" onClick={() => editTopper(idx, 'rank')}><strong>{t.rank}</strong></td>
                      <td className="editable-cell" onClick={() => editTopper(idx, 'name')}>{t.name}</td>
                      <td className="editable-cell" onClick={() => editTopper(idx, 'board')}>
                        <span className={`badge ${t.board === 'CBSE' ? 'badge-cbse' : 'badge-mpbse'}`}>{t.board}</span>
                      </td>
                      <td className="editable-cell" onClick={() => editTopper(idx, 'class')}>{t.class}</td>
                      <td className="editable-cell" onClick={() => editTopper(idx, 'percentage')}><strong style={{ color: '#4ade80' }}>{t.percentage}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h4>Enrolled Students</h4>
                <div className="val">{students.length}</div>
              </div>
              <div className="stat-card">
                <h4>Total Teachers</h4>
                <div className="val">{teachers.length}</div>
              </div>
              <div className="stat-card">
                <h4>Teachers Present</h4>
                <div className="val" style={{ color: '#4ade80' }}>{teachers.filter(t => t.present).length}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS REGISTER */}
        {activeTab === 'students' && (
          <div className="grid-2col">
            <div className="glass-box">
              <h3 className="serif-font">Student Enrollment</h3>
              <form onSubmit={handleAddStudent}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required placeholder="e.g. Rahul Sharma" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Father's Name</label>
                  <input type="text" required placeholder="e.g. Suresh Sharma" value={studentForm.father} onChange={(e) => setStudentForm({ ...studentForm, father: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input type="number" required placeholder="9876543210" value={studentForm.mobile} onChange={(e) => setStudentForm({ ...studentForm, mobile: e.target.value })} />
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
                  <input type="number" required placeholder="101" value={studentForm.roll} onChange={(e) => setStudentForm({ ...studentForm, roll: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Percentage / Grade</label>
                  <input type="text" placeholder="e.g. 94.2%" value={studentForm.percentage} onChange={(e) => setStudentForm({ ...studentForm, percentage: e.target.value })} />
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
              <h3 className="serif-font">Student Roster</h3>
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
                      <td><strong>{s.name}</strong><br/><span style={{ fontSize: '11px', color: '#94a3b8' }}>Ph: {s.mobile}</span></td>
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
        )}

        {/* TAB 3: TEACHERS */}
        {activeTab === 'teachers' && (
          <div className="grid-2col">
            <div className="glass-box">
              <h3 className="serif-font">Appoint Faculty</h3>
              <form onSubmit={handleAddTeacher}>
                <div className="form-group">
                  <label>Teacher Name</label>
                  <input type="text" required placeholder="Dr. Ramesh Sharma" value={teacherForm.name} onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" required placeholder="Mathematics" value={teacherForm.dept} onChange={(e) => setTeacherForm({ ...teacherForm, dept: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Monthly Salary (₹)</label>
                  <input type="number" required placeholder="40000" value={teacherForm.salary} onChange={(e) => setTeacherForm({ ...teacherForm, salary: e.target.value })} />
                </div>
                <button type="submit" className="btn-gold">Appoint Teacher</button>
              </form>
            </div>

            <div className="glass-box">
              <h3 className="serif-font">Faculty List</h3>
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
        )}

        {/* TAB 4: DISPATCH CENTER WITH FACULTY REMARKS & COMPLAINTS */}
        {activeTab === 'dispatch-center' && (
          <div className="glass-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 className="serif-font" style={{ margin: 0, border: 'none' }}>📩 WhatsApp Dispatch & Teacher Remarks Box</h3>
              <span style={{ fontSize: '11px', color: '#fbbf24', background: 'rgba(217, 119, 6, 0.15)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                ✍️ Type custom note or click presets before sending
              </span>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>Student Details</th>
                  <th style={{ width: '12%' }}>Performance</th>
                  <th style={{ width: '45%' }}>Faculty Note / Complaint Box</th>
                  <th style={{ width: '25%' }}>Dispatch Message</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, idx) => {
                  const customNote = studentNotes[s.roll] || "";
                  const formattedNotePart = customNote.trim() ? `\n\n📌 *Faculty Note/Remarks:* ${customNote.trim()}` : '';
                  
                  const fullMsg = encodeURIComponent(
                    `*NEHRU PUBLIC SCHOOL (Estd. 2015)*\n` +
                    `----------------------------------\n` +
                    `Dear Parent (${s.father}),\n` +
                    `Official Update for *${s.name}* (${s.class}, Roll No: ${s.roll}):\n\n` +
                    `• Academic Score: *${s.percentage}*\n` +
                    `• Fee Status: *${s.feeStatus}*` +
                    `${formattedNotePart}\n\n` +
                    `Regards,\nSchool Administration`
                  );

                  return (
                    <tr key={idx}>
                      <td>
                        <strong style={{ fontSize: '14px', color: '#f8fafc' }}>{s.name}</strong>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Father: {s.father}</div>
                        <div style={{ fontSize: '11px', color: '#fbbf24' }}>{s.class} | Roll #{s.roll}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#4ade80', fontSize: '14px' }}>{s.percentage}</strong>
                        <br/>
                        <span className={`badge ${s.feeStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: '5px' }}>
                          {s.feeStatus}
                        </span>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Type student remark / complaint here..." 
                          value={customNote}
                          onChange={(e) => handleNoteChange(s.roll, e.target.value)}
                          style={{
                            width: '100%',
                            background: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(217, 119, 6, 0.3)',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '12px',
                            outline: 'none'
                          }}
                        />
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', marginRight: '4px' }}>Quick Complaints:</span>
                          <span className="preset-chip" onClick={() => handleNoteChange(s.roll, "Incomplete homework & copies.")}>📝 Homework Issue</span>
                          <span className="preset-chip" onClick={() => handleNoteChange(s.roll, "Irregular attendance in class.")}>🚫 Frequent Absent</span>
                          <span className="preset-chip" onClick={() => handleNoteChange(s.roll, "Needs improvement in discipline.")}>⚠️ Discipline Issue</span>
                          <span className="preset-chip" onClick={() => handleNoteChange(s.roll, "Excellent progress & conduct!")}>🌟 Praise Student</span>
                        </div>
                      </td>
                      <td>
                        <a href={`https://wa.me/91${s.mobile}?text=${fullMsg}`} target="_blank" rel="noopener noreferrer">
                          <button className="btn-wa">
                            💬 Dispatch WhatsApp
                          </button>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: FINANCE */}
        {activeTab === 'finance' && (
          <div className="glass-box">
            <h3 className="serif-font">💰 Financial Reserve Overview</h3>
            <div className="stats-grid" style={{ marginTop: '20px' }}>
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
              <div className="stat-card">
                <h4>Net Surplus</h4>
                <div className="val" style={{ color: netPL >= 0 ? '#4ade80' : '#f87171' }}>₹{netPL.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ROUTINES */}
        {activeTab === 'routines' && (
          <div className="glass-box">
            <h3 className="serif-font">Operational Hours & Timings</h3>
            <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid rgba(217, 119, 6, 0.3)', padding: '15px', borderRadius: '8px', color: '#fbbf24', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>
              Official Hours: 08:00 AM – 02:00 PM (Monday to Saturday)
            </div>
            <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
              ✦ Period 1: 08:00 AM – 08:45 AM<br/>
              ✦ Period 2: 08:45 AM – 09:30 AM<br/>
              ✦ Period 3: 09:30 AM – 10:15 AM<br/>
              ✦ Recess Break: 10:15 AM – 10:45 AM<br/>
              ✦ Period 4: 10:45 AM – 11:30 AM<br/>
              ✦ Period 5: 11:30 AM – 12:15 PM<br/>
              ✦ Period 6: 12:15 PM – 01:00 PM<br/>
              ✦ Period 7: 01:00 PM – 02:00 PM
            </p>
          </div>
        )}

        {/* TAB 7: FEES CONFIGURATION */}
        {activeTab === 'fees' && (
          <div className="glass-box" style={{ maxWidth: '600px' }}>
            <h3 className="serif-font">Class Fee Configuration</h3>
            {Object.keys(classFees).map(c => (
              <div key={c} className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ margin: 0 }}>{c}</label>
                <input type="number" style={{ width: '180px' }} value={classFees[c]} onChange={(e) => handleFeeChange(c, e.target.value)} />
              </div>
            ))}
            <button className="btn-gold" style={{ marginTop: '15px' }} onClick={() => alert("Fees updated successfully!")}>Save Fee Structure</button>
          </div>
        )}

      </div>
    </div>
  );
}