import React, { useState, useMemo } from 'react';
import { 
  Vote, Users, MessageSquare, HelpCircle, Calendar, MapPin, 
  FileCheck, UserPlus, Megaphone, BarChart3, Award, ShieldCheck, 
  Moon, Sun, Send, Loader2, RefreshCcw, ChevronRight, Info, CheckCircle 
} from 'lucide-react';

/**
 * DATA CONSTANTS
 */
const TIMELINE_PHASES = [
  { id: 'announcement', title: 'Announcement', icon: <Megaphone />, duration: '90 Days Before', responsible: 'Election Commission', desc: 'Formal declaration of election dates and implementation of the Model Code of Conduct.', tip: 'Verify your name exists on the current electoral roll.' },
  { id: 'registration', title: 'Registration', icon: <UserPlus />, duration: 'Until 30 Days Before', responsible: 'Citizens', desc: 'The window for new voters to register or existing voters to update their address details.', tip: 'Use the official portal to submit registration forms early.' },
  { id: 'filing', title: 'Nominations', icon: <FileCheck />, duration: '45 Days Before', responsible: 'Candidates', desc: 'Candidates file papers, disclose assets, and criminal records for public scrutiny.', tip: 'Check the "Know Your Candidate" portals to see their background.' },
  { id: 'campaigning', title: 'Campaigning', icon: <Users />, duration: '30-2 Days Before', responsible: 'Parties', desc: 'Political parties release manifestos and hold rallies to share their vision.', tip: 'Read manifestos carefully to understand policy promises.' },
  { id: 'voting', title: 'Election Day', icon: <Vote />, duration: '1 Day', responsible: 'Voters', desc: 'Polling stations open for citizens to cast their secret ballots.', tip: 'Bring your Voter ID or an approved government photo ID.' },
  { id: 'counting', title: 'Counting', icon: <BarChart3 />, duration: '1-2 Days', responsible: 'Commission', desc: 'EVMs and postal ballots are counted under the supervision of observers.', tip: 'Follow official channels for real-time, verified data.' },
  { id: 'results', title: 'Declaration', icon: <Award />, duration: 'Immediate', responsible: 'Commission', desc: 'The official winner is certified and results are formally gazetted.', tip: 'Governance begins. Keep tracking your representative\'s performance.' }
];

const VOTER_STEPS = [
  { title: "Check Eligibility", desc: "Citizen, 18+ years old, and a resident.", details: "You must be 18 on the qualifying date of the election year to be eligible.", icon: <CheckCircle className="text-emerald-500" /> },
  { title: "Register to Vote", desc: "Submit your application to the roll.", details: "Fill out the required registration forms online or at your local booth.", icon: <UserPlus className="text-blue-500" /> },
  { title: "Find Your Booth", desc: "Locate your assigned polling station.", details: "Check your voter slip or use the online 'Booth Locator' tool.", icon: <MapPin className="text-red-500" /> },
  { title: "What to Bring", desc: "Valid Govt Photo ID or Voter Card.", details: "Many govt IDs are accepted if your name is on the list.", icon: <FileCheck className="text-amber-500" /> },
  { title: "Cast the Vote", desc: "Mark your choice in the private booth.", details: "Press the button next to your candidate. Wait for the beep and check the VVPAT slip.", icon: <Vote className="text-indigo-500" /> },
  { title: "After Voting", desc: "Verify the ink mark on your finger.", details: "The indelible ink is a sign of your participation and prevents double-voting.", icon: <Award className="text-purple-500" /> }
];

const KEY_PLAYERS = [
  { role: "Election Commission", icon: <ShieldCheck />, desc: "The neutral body managing the entire process.", tasks: ["Drafting rolls", "Setting schedules", "Conduct enforcement"] },
  { role: "Candidates", icon: <Users />, desc: "Individuals competing to represent your interests.", tasks: ["Policy proposals", "Public debates", "Disclosures"] },
  { role: "Voters", icon: <Vote />, desc: "The ultimate decision makers in a democracy.", tasks: ["Researching", "Participating", "Accountability"] },
  { role: "Poll Officers", icon: <BarChart3 />, desc: "Staff ensuring integrity at the polling station.", tasks: ["ID verification", "EVM management", "Crowd control"] }
];

const QUIZ_QUESTIONS = [
  { q: "What is the minimum age to vote in most democratic elections?", options: ["16", "18", "21", "25"], correct: 1 },
  { q: "What does EVM stand for?", options: ["Electronic Voting Machine", "Every Vote Matters", "Elective Voter Method", "Electronic Verified Mail"], correct: 0 },
  { q: "Who enforces the Model Code of Conduct?", options: ["Police", "Supreme Court", "Election Commission", "Prime Minister"], correct: 2 },
  { q: "When does campaigning usually have to stop?", options: ["On results day", "48 hours before voting ends", "1 week before", "Never"], correct: 1 },
  { q: "Which of these is required to vote?", options: ["A party membership", "Being on the Voter List", "A university degree", "Paying a fee"], correct: 1 }
];

/**
 * MAIN APP COMPONENT
 */
export default function ElectionGuide() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState(new Set(['timeline']));
  const [selectedPhase, setSelectedPhase] = useState(TIMELINE_PHASES[0]);
  const [quiz, setQuiz] = useState({ started: false, current: 0, score: 0, complete: false });
  const [chat, setChat] = useState({ 
    input: '', 
    history: [{ role: 'assistant', content: 'Welcome! I am your Election Guide AI. Ask me anything about the voting process.' }], 
    loading: false 
  });

  const progress = (visitedTabs.size / 5) * 100;

  const handleTabChange = (id) => {
    setActiveTab(id);
    setVisitedTabs(prev => new Set([...prev, id]));
  };

  const askAI = async (text) => {
    const query = text || chat.input;
    if (!query.trim()) return;
    setChat(p => ({ ...p, input: '', loading: true, history: [...p.history, { role: 'user', content: query }] }));

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'YOUR_KEY_HERE', 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 300,
          system: "You are an election education assistant. Answer clearly and concisely. Under 100 words. Neutral and factual.",
          messages: [{ role: 'user', content: query }]
        })
      });
      const data = await res.json();
      setChat(p => ({ ...p, loading: false, history: [...p.history, { role: 'assistant', content: data.content[0].text }] }));
    } catch {
      setChat(p => ({ ...p, loading: false, history: [...p.history, { role: 'assistant', content: "I am currently in educational mode. Please consult your local Election Commission website for specific legal data!" }] }));
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400;600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Source Sans Pro', sans-serif; }
      `}</style>

      {/* HEADER */}
      <header className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-[#1a2744] border-slate-700' : 'bg-[#1a2744] text-white'}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#f5a623] p-2 rounded-lg text-[#1a2744]"><Vote size={24} /></div>
            <h1 className="text-2xl font-serif font-bold">ElectionGuide</h1>
          </div>
          <nav className="flex flex-wrap justify-center gap-1">
            {[
              { id: 'timeline', label: 'Timeline', icon: <Calendar size={14}/> },
              { id: 'guide', label: 'How to Vote', icon: <Info size={14}/> },
              { id: 'players', label: 'Key Players', icon: <Users size={14}/> },
              { id: 'faq', label: 'Ask AI', icon: <MessageSquare size={14}/> },
              { id: 'quiz', label: 'Quiz', icon: <HelpCircle size={14}/> }
            ].map(t => (
              <button key={t.id} onClick={() => handleTabChange(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === t.id ? 'bg-[#f5a623] text-[#1a2744]' : 'hover:bg-white/10'}`}>
                {t.icon} <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </nav>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-white/10">{isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </div>
        <div className="w-full h-1 bg-black/20"><div className="h-full bg-[#f5a623] transition-all duration-700" style={{ width: `${progress}%` }} /></div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-3 text-[#1a2744] dark:text-[#f5a623]">The Election Lifecycle</h2>
              <p className="opacity-60 max-w-xl mx-auto">Follow the democratic journey from the first announcement to the swearing-in ceremony.</p>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 space-y-2">
                {TIMELINE_PHASES.map(p => (
                  <button key={p.id} onClick={() => setSelectedPhase(p)} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${selectedPhase.id === p.id ? 'border-[#f5a623] bg-[#f5a623]/10' : 'border-transparent hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                    <div className={`p-2 rounded-lg ${selectedPhase.id === p.id ? 'bg-[#f5a623] text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{p.icon}</div>
                    <div className="text-left">
                      <p className="font-bold leading-none mb-1">{p.title}</p>
                      <p className="text-xs opacity-50">{p.duration}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className={`lg:w-2/3 p-8 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-xl'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-[#1a2744] text-[#f5a623] rounded-2xl">{React.cloneElement(selectedPhase.icon, { size: 32 })}</div>
                  <div>
                    <span className="text-[#f5a623] text-xs font-bold uppercase tracking-widest">{selectedPhase.duration}</span>
                    <h3 className="text-3xl font-serif font-bold">{selectedPhase.title}</h3>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed">{selectedPhase.desc}</p>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold uppercase opacity-50">Responsible Authority</p>
                      <p className="font-semibold">{selectedPhase.responsible}</p>
                    </div>
                  </div>
                  <div className="bg-[#1a2744] text-white p-6 rounded-2xl flex flex-col justify-center">
                    <h5 className="font-bold mb-3 flex items-center gap-2 text-[#f5a623]"><CheckCircle size={18} /> Voter's Checklist</h5>
                    <p className="italic text-slate-300">"{selectedPhase.tip}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GUIDE */}
        {activeTab === 'guide' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold mb-3 text-[#1a2744] dark:text-[#f5a623]">How to Vote</h2>
              <p className="opacity-60">A simple, transparent guide for first-time and regular voters.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VOTER_STEPS.map((s, i) => (
                <div key={i} className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl font-black opacity-10">0{i+1}</div>
                    <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl">{s.icon}</div>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{s.title}</h4>
                  <p className="text-sm opacity-70 mb-4">{s.desc}</p>
                  <details className="text-xs group">
                    <summary className="cursor-pointer text-[#f5a623] font-bold flex items-center gap-1 list-none">
                      LEARN MORE <ChevronRight size={14} className="group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">{s.details}</p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLAYERS */}
        {activeTab === 'players' && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-12"><h2 className="text-4xl font-serif font-bold mb-3 text-[#1a2744] dark:text-[#f5a623]">Key Stakeholders</h2></div>
            <div className="grid md:grid-cols-2 gap-6">
              {KEY_PLAYERS.map((p, i) => (
                <div key={i} className={`p-8 rounded-3xl border flex flex-col sm:flex-row gap-6 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <div className="h-16 w-16 shrink-0 bg-[#1a2744] text-[#f5a623] rounded-2xl flex items-center justify-center">{React.cloneElement(p.icon, {size: 32})}</div>
                  <div>
                    <h4 className="text-2xl font-serif font-bold mb-1">{p.role}</h4>
                    <p className="opacity-60 mb-4 text-sm">{p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.tasks.map((t, idx) => <span key={idx} className="text-[10px] uppercase font-bold px-3 py-1 bg-[#f5a623]/10 text-[#f5a623] rounded-full border border-[#f5a623]/20">{t}</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHAT/FAQ */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto h-[600px] flex flex-col border rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-800 dark:border-slate-700 animate-in fade-in">
            <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 font-bold"><MessageSquare className="text-[#f5a623]" /> Election Assistant</div>
              <div className="text-[10px] px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded font-bold uppercase tracking-widest">Live Help</div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chat.history.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-[#1a2744] text-white rounded-tr-none' : 'bg-slate-100 dark:bg-slate-700 rounded-tl-none'}`}>
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  </div>
                </div>
              ))}
              {chat.loading && <div className="flex justify-start"><div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-2xl animate-pulse"><Loader2 className="animate-spin text-[#f5a623]" /></div></div>}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700 flex gap-2">
              <input value={chat.input} onChange={e => setChat({...chat, input: e.target.value})} onKeyPress={e => e.key === 'Enter' && askAI()} placeholder="Ask a question about voting..." className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#f5a623]" />
              <button onClick={() => askAI()} className="p-4 bg-[#f5a623] text-[#1a2744] rounded-xl hover:scale-105 active:scale-95 transition-all"><Send size={20} /></button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto">
            {!quiz.started ? (
              <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-xl animate-in zoom-in-95">
                <HelpCircle size={64} className="mx-auto text-[#f5a623] mb-6" />
                <h2 className="text-3xl font-serif font-bold mb-4 text-[#1a2744] dark:text-[#f5a623]">Are You Ready to Vote?</h2>
                <p className="mb-8 opacity-60">Test your knowledge of the election process before hitting the polls.</p>
                <button onClick={() => setQuiz({...quiz, started: true})} className="px-10 py-4 bg-[#1a2744] text-white rounded-2xl font-bold hover:shadow-lg transition-all">Start Quiz</button>
              </div>
            ) : quiz.complete ? (
              <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-xl">
                <div className="text-6xl mb-4">{quiz.score > 3 ? '🎉' : '📚'}</div>
                <h2 className="text-4xl font-serif font-bold mb-2">Quiz Complete!</h2>
                <p className="text-2xl font-bold text-[#f5a623] mb-6">Score: {quiz.score} / 5</p>
                <button onClick={() => setQuiz({started: true, current: 0, score: 0, complete: false})} className="flex items-center gap-2 mx-auto px-8 py-3 bg-[#1a2744] text-white rounded-xl font-bold"><RefreshCcw size={18}/> Retake Quiz</button>
              </div>
            ) : (
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border dark:border-slate-700 shadow-xl animate-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Question {quiz.current + 1} of 5</span>
                  <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#f5a623] transition-all" style={{ width: `${(quiz.current + 1) * 20}%` }} />
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-8">{QUIZ_QUESTIONS[quiz.current].q}</h3>
                <div className="space-y-3">
                  {QUIZ_QUESTIONS[quiz.current].options.map((opt, i) => (
                    <button key={i} onClick={() => {
                      const isCorrect = i === QUIZ_QUESTIONS[quiz.current].correct;
                      const isLast = quiz.current === 4;
                      setQuiz({
                        ...quiz,
                        score: isCorrect ? quiz.score + 1 : quiz.score,
                        current: isLast ? quiz.current : quiz.current + 1,
                        complete: isLast
                      });
                    }} className="w-full text-left p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-[#f5a623] hover:bg-[#f5a623]/5 font-semibold transition-all">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 border-t dark:border-slate-800 text-center">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-slate-400 text-sm mb-2">© 2024 ElectionGuide. Educating citizens for a stronger democracy.</p>
        </div>
      </footer>
    </div>
  );
}