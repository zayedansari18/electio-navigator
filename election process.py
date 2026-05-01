import streamlit as st
import time
import requests

# --- 1. DATA DEFINITIONS ---
TIMELINE = [
    {"phase": "Announcement", "icon": "📢", "dur": "90 Days Before", "resp": "Election Commission", "desc": "Formal declaration of dates and the Model Code of Conduct.", "tip": "Check your registration status now."},
    {"phase": "Registration", "icon": "📝", "dur": "Ongoing", "resp": "Citizens", "desc": "The period to add your name to the electoral roll.", "tip": "Deadlines usually close 30 days before voting."},
    {"phase": "Nominations", "icon": "⚖️", "dur": "45 Days Before", "resp": "Candidates", "desc": "Candidates file papers and disclose assets/background.", "tip": "Read candidate affidavits to make an informed choice."},
    {"phase": "Campaigning", "icon": "🗣️", "dur": "30-2 Days Before", "resp": "Parties", "desc": "Public rallies and manifestos are shared with voters.", "tip": "Focus on policy promises, not just slogans."},
    {"phase": "Election Day", "icon": "🗳️", "dur": "1 Day", "resp": "Voters", "desc": "Polling booths open. Citizens cast their secret ballots.", "tip": "Bring your valid government Photo ID."},
    {"phase": "Counting", "icon": "📊", "dur": "1-2 Days", "resp": "Election Commission", "desc": "EVMs/Ballots are counted under strict supervision.", "tip": "Only official results from the commission are final."},
    {"phase": "Results", "icon": "🏆", "dur": "Immediate", "resp": "Government", "desc": "Winners are certified and the new government is formed.", "tip": "Your role as a citizen continues—hold them accountable!"}
]

VOTER_STEPS = [
    {"step": "Check Eligibility", "desc": "Citizen, 18+ years old.", "more": "Verify you are not legally disqualified."},
    {"step": "Find Your Booth", "desc": "Locate your assigned station.", "more": "Use the online 'Voter Search' portal."},
    {"step": "Verification", "desc": "ID check by officers.", "more": "Show your Photo ID and sign the register."},
    {"step": "Cast Vote", "desc": "Secret ballot on EVM.", "more": "Press the blue button next to your choice."},
    {"step": "Verification Slip", "desc": "Check the VVPAT screen.", "more": "A slip shows for 7 seconds confirming your vote."},
    {"step": "Ink Mark", "desc": "Get your finger marked.", "more": "Indelible ink prevents double-voting."}
]

QUIZ = [
    {"q": "What is the standard minimum age to vote?", "a": ["16", "18", "21"], "c": 1},
    {"q": "What does EVM stand for?", "a": ["Electronic Voting Machine", "Every Voter Matters", "Electric Vote Method"], "c": 0},
    {"q": "How long does a VVPAT slip show?", "a": ["2 seconds", "7 seconds", "30 seconds"], "c": 1}
]

# --- 2. STYLING & CONFIG ---
st.set_page_config(page_title="ElectionGuide", page_icon="🗳️", layout="wide")

st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro&display=swap');
    
    .stApp { background-color: #f8fafc; color: #1a2744; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; color: #1a2744; }
    p, span { font-family: 'Source Sans Pro', sans-serif; }
    
    /* Custom Card Style */
    .card {
        background-color: white; padding: 20px; border-radius: 15px;
        border-left: 5px solid #f5a623; box-shadow: 2px 2px 10px rgba(0,0,0,0.05);
        margin-bottom: 20px;
    }
    .amber-text { color: #f5a623; font-weight: bold; }
    .navy-bg { background-color: #1a2744; color: white; padding: 20px; border-radius: 15px; }
    </style>
""", unsafe_allow_html=True)

# --- 3. SESSION STATE ---
if 'visited' not in st.session_state: st.session_state.visited = set(['Timeline'])
if 'chat_history' not in st.session_state: st.session_state.chat_history = []
if 'score' not in st.session_state: st.session_state.score = 0
if 'quiz_idx' not in st.session_state: st.session_state.quiz_idx = 0

# --- 4. HEADER & NAVIGATION ---
col1, col2 = st.columns([0.8, 0.2])
with col1:
    st.title("🗳️ ElectionGuide")
    st.write("Your step-by-step guide to democracy.")

# Progress Bar
prog_val = len(st.session_state.visited) / 5
st.progress(prog_val)
st.caption(f"Guide Progress: {int(prog_val*100)}%")

tabs = st.tabs(["📅 Timeline", "📋 How to Vote", "👥 Key Players", "🤖 Ask AI", "🧠 Quiz"])

# --- TAB 1: TIMELINE ---
with tabs[0]:
    st.session_state.visited.add('Timeline')
    st.subheader("The Election Journey")
    selected_phase = st.select_slider("Slide to explore the election phases:", options=[p['phase'] for p in TIMELINE])
    
    p_data = next(item for item in TIMELINE if item["phase"] == selected_phase)
    
    c1, c2 = st.columns([0.6, 0.4])
    with c1:
        st.markdown(f"### {p_data['icon']} {p_data['phase']}")
        st.write(f"**Responsible:** {p_data['resp']}")
        st.write(p_data['desc'])
    with c2:
        st.markdown(f"""<div class='navy-bg'><strong>💡 Voter Tip:</strong><br>{p_data['tip']}</div>""", unsafe_allow_html=True)

# --- TAB 2: VOTER GUIDE ---
with tabs[1]:
    st.session_state.visited.add('Guide')
    st.subheader("Step-by-Step Voting Process")
    cols = st.columns(3)
    for i, s in enumerate(VOTER_STEPS):
        with cols[i % 3]:
            st.markdown(f"""<div class='card'><span class='amber-text'>Step 0{i+1}</span><br><strong>{s['step']}</strong><br>{s['desc']}</div>""", unsafe_allow_html=True)
            with st.expander("Learn More"):
                st.write(s['more'])

# --- TAB 3: KEY PLAYERS ---
with tabs[2]:
    st.session_state.visited.add('Players')
    st.subheader("Key Stakeholders")
    players = {
        "Election Commission": "Independent body ensuring free and fair polls.",
        "Candidates": "Individuals contesting for a seat to represent you.",
        "Voters": "The most powerful players—the decision makers.",
        "Poll Officers": "Government staff managing the booths on Election Day."
    }
    for role, task in players.items():
        st.write(f"**{role}**: {task}")

# --- TAB 4: AI CHAT ---
with tabs[3]:
    st.session_state.visited.add('AI')
    st.subheader("Election Assistant (Claude AI)")
    
    for msg in st.session_state.chat_history:
        with st.chat_message(msg["role"]):
            st.write(msg["content"])

    if prompt := st.chat_input("Ask a question about voting..."):
        st.session_state.chat_history.append({"role": "user", "content": prompt})
        with st.chat_message("user"): st.write(prompt)
        
        with st.chat_message("assistant"):
            # Placeholder for Anthropic API Call
            # In production: response = client.messages.create(...)
            response = "I am currently in 'Education Mode'. To vote, ensure you are 18+ and registered on the electoral roll. Check your local commission website for your specific booth."
            st.write(response)
            st.session_state.chat_history.append({"role": "assistant", "content": response})

# --- TAB 5: QUIZ ---
with tabs[4]:
    st.session_state.visited.add('Quiz')
    st.subheader("Knowledge Check")
    
    if st.session_state.quiz_idx < len(QUIZ):
        item = QUIZ[st.session_state.quiz_idx]
        st.write(f"**Question {st.session_state.quiz_idx + 1}:** {item['q']}")
        ans = st.radio("Choose one:", item['a'], key=f"q{st.session_state.quiz_idx}")
        
        if st.button("Submit Answer"):
            if item['a'].index(ans) == item['c']:
                st.success("Correct!")
                st.session_state.score += 1
            else:
                st.error("Wrong answer.")
            st.session_state.quiz_idx += 1
            st.rerun()
    else:
        st.balloons()
        st.markdown(f"### Quiz Over! Your Score: {st.session_state.score}/{len(QUIZ)}")
        if st.button("Restart Quiz"):
            st.session_state.score = 0
            st.session_state.quiz_idx = 0
            st.rerun()

st.markdown("---")
st.caption("© 2024 ElectionGuide | Developed for Civic Education")