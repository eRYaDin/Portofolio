/* ========================================
   RESET & BASE STYLES
======================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: 'Permanent Marker', cursive;
    background: #FFE66D url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="10" cy="10" r="3" fill="%23FF6B6B" opacity="0.3"/><circle cx="90" cy="20" r="4" fill="%234ECDC4" opacity="0.3"/><circle cx="50" cy="80" r="3" fill="%2395E1D3" opacity="0.3"/></svg>');
    min-height: 100vh;
    color: #2D3436;
    overflow-x: hidden;
}

.hidden {
    display: none !important;
}

/* ========================================
   START MENU
======================================== */
#start-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    padding: 20px;
    animation: fadeIn 0.5s ease-in;
}

#start-menu h1 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 3.5em;
    color: #FF6B6B;
    margin-bottom: 20px;
    transform: rotate(-2deg);
    text-shadow: 
        4px 4px 0 #000,
        -2px -2px 0 #000,
        2px -2px 0 #000,
        -2px 2px 0 #000;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: rotate(-2deg) translateY(0); }
    50% { transform: rotate(-2deg) translateY(-10px); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.speech-bubble {
    position: relative;
    background: white;
    border: 4px solid #000;
    border-radius: 20px;
    padding: 20px 30px;
    margin: 20px;
    font-size: 1.1em;
    box-shadow: 5px 5px 0 #000;
    max-width: 600px;
}

.speech-bubble:before {
    content: "";
    position: absolute;
    bottom: -20px;
    left: 30px;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 20px solid #000;
}

.speech-bubble:after {
    content: "";
    position: absolute;
    bottom: -14px;
    left: 33px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 17px solid white;
}

.mode-buttons {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 20px;
}

/* ========================================
   BUTTONS
======================================== */
.btn-comic {
    font-family: 'Bangers', cursive;
    font-size: 1.5em;
    padding: 20px 40px;
    background: #4ECDC4;
    color: #000;
    border: 5px solid #000;
    border-radius: 15px;
    cursor: pointer;
    transform: rotate(-1deg);
    box-shadow: 6px 6px 0 #000;
    transition: all 0.1s;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.btn-comic:hover {
    transform: rotate(-1deg) translateY(-3px);
    box-shadow: 8px 8px 0 #000;
}

.btn-comic:active {
    transform: rotate(-1deg) translateY(2px);
    box-shadow: 3px 3px 0 #000;
}

.btn-red { background: #FF6B6B; }
.btn-yellow { background: #FFE66D; }
.btn-green { background: #95E1D3; }

.btn-small {
    font-family: 'Bangers', cursive;
    font-size: 1em;
    padding: 10px 20px;
    background: #4ECDC4;
    color: #000;
    border: 3px solid #000;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 3px 3px 0 #000;
    transition: all 0.1s;
    text-transform: uppercase;
}

.btn-small:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 0 #000;
}

.btn-small:active {
    transform: translateY(1px);
    box-shadow: 2px 2px 0 #000;
}

/* ========================================
   HEADER
======================================== */
header {
    background: white;
    border-bottom: 5px solid #000;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
}

header h1 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 2em;
    color: #FF6B6B;
    text-shadow: 2px 2px 0 #000;
}

.header-btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

/* ========================================
   MAIN CONTENT
======================================== */
.content-wrapper {
    padding: 30px 20px;
}

.page-title {
    font-family: 'Luckiest Guy', cursive;
    font-size: 2.5em;
    text-align: center;
    color: #FF6B6B;
    margin-bottom: 30px;
    text-shadow: 3px 3px 0 #000;
    transform: rotate(-1deg);
}

/* ========================================
   INFO PANEL
======================================== */
.info-panel {
    background: white;
    border: 5px solid #000;
    border-radius: 20px;
    padding: 25px;
    margin: 0 auto 30px;
    max-width: 1200px;
    box-shadow: 8px 8px 0 #000;
}

.info-panel h3 {
    font-family: 'Bangers', cursive;
    font-size: 2em;
    color: #4ECDC4;
    margin-bottom: 20px;
    text-shadow: 2px 2px 0 #000;
    text-align: center;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.info-card {
    background: #F8F9FA;
    border: 3px solid #000;
    border-radius: 15px;
    padding: 20px;
}

.info-card h4 {
    font-family: 'Bangers', cursive;
    font-size: 1.5em;
    margin-bottom: 15px;
    text-shadow: 1px 1px 0 rgba(0,0,0,0.3);
}

.info-card p {
    font-family: 'Permanent Marker', cursive;
    font-size: 0.9em;
    line-height: 1.6;
    margin-bottom: 10px;
}

.info-card strong {
    color: #FF6B6B;
}

/* ========================================
   JOYSTICK SECTIONS
======================================== */
.sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 30px;
    max-width: 1600px;
    margin: 0 auto;
}

.section {
    background: white;
    border: 6px solid #000;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 10px 10px 0 #000;
    transform: rotate(-0.5deg);
    transition: all 0.2s;
}

.section:nth-child(even) {
    transform: rotate(0.5deg);
}

.section:hover {
    transform: rotate(0) scale(1.02);
    box-shadow: 12px 12px 0 #000;
}

.section-badge {
    display: inline-block;
    background: #FFE66D;
    border: 3px solid #000;
    padding: 5px 15px;
    border-radius: 20px;
    font-family: 'Bangers', cursive;
    font-size: 0.9em;
    margin-bottom: 10px;
}

.section h3 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.8em;
    color: #FF6B6B;
    margin-bottom: 10px;
    text-align: center;
    text-shadow: 2px 2px 0 #000;
}

.sensor-desc {
    font-family: 'Permanent Marker', cursive;
    font-size: 0.85em;
    text-align: center;
    margin-bottom: 15px;
    color: #666;
}

/* ========================================
   JOYSTICK CANVAS
======================================== */
.joystick-canvas {
    border: 5px solid #000;
    background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
    margin: 0 auto 20px;
    display: block;
    border-radius: 15px;
    box-shadow: inset 0 4px 8px rgba(0,0,0,0.2);
    max-width: 100%;
    height: auto;
    cursor: grab;
}

.joystick-canvas:active {
    cursor: grabbing;
}

.labels {
    background: #FFE66D;
    border: 4px solid #000;
    border-radius: 15px;
    padding: 15px;
    margin: 15px 0;
    text-align: center;
}

.labels div {
    font-family: 'Bangers', cursive;
    font-size: 1.3em;
    margin: 5px 0;
    color: #000;
}

.stats {
    background: #95E1D3;
    border: 4px solid #000;
    border-radius: 15px;
    padding: 12px;
    text-align: center;
    font-family: 'Bangers', cursive;
    font-size: 1.1em;
    margin: 15px 0;
}

/* ========================================
   GRAPH CONTAINER
======================================== */
.graph-container {
    width: 100%;
    height: 200px;
    border: 4px solid #000;
    border-radius: 15px;
    background: white;
    padding: 10px;
    margin-top: 20px;
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
}

/* ========================================
   GAME SECTION
======================================== */
.game-container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    border: 6px solid #000;
    border-radius: 25px;
    padding: 25px;
    box-shadow: 12px 12px 0 #000;
}

#game-canvas {
    border: 5px solid #000;
    background: linear-gradient(135deg, #E0E7FF 0%, #F3F4F6 100%);
    border-radius: 15px;
    display: block;
    margin: 20px auto;
    max-width: 100%;
    height: auto;
    box-shadow: inset 0 4px 8px rgba(0,0,0,0.2);
}

#game-stats {
    font-family: 'Bangers', cursive;
    font-size: 2em;
    text-align: center;
    color: #FF6B6B;
    margin: 20px 0;
    padding: 15px;
    background: #FFE66D;
    border: 4px solid #000;
    border-radius: 15px;
    text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
}

/* ========================================
   MINI JOYSTICKS
======================================== */
.mini-joysticks {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 20px;
    margin-top: 25px;
}

.mini-section {
    background: #F8F9FA;
    border: 4px solid #000;
    border-radius: 15px;
    padding: 15px;
    text-align: center;
    transition: all 0.2s;
    transform: rotate(-1deg);
}

.mini-section:nth-child(even) {
    transform: rotate(1deg);
}

.mini-section:hover {
    transform: rotate(0) scale(1.05);
    box-shadow: 5px 5px 0 #000;
}

.mini-section h4 {
    font-family: 'Bangers', cursive;
    font-size: 1.3em;
    color: #4ECDC4;
    margin-bottom: 10px;
    text-shadow: 1px 1px 0 #000;
}

.mini-joystick {
    border: 4px solid #000;
    background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
    border-radius: 10px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    max-width: 100%;
    height: auto;
    cursor: grab;
}

.mini-joystick:active {
    cursor: grabbing;
}

/* ========================================
   RESPONSIVE
======================================== */
@media (max-width: 768px) {
    #start-menu h1 {
        font-size: 2.5em;
    }

    .page-title {
        font-size: 2em;
    }

    .sections-grid {
        grid-template-columns: 1fr;
    }

    header h1 {
        font-size: 1.5em;
    }

    .btn-comic {
        font-size: 1.2em;
        padding: 15px 30px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .mini-joysticks {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    #start-menu h1 {
        font-size: 2em;
    }

    .speech-bubble {
        font-size: 0.95em;
        padding: 15px 20px;
    }

    .mode-buttons {
        flex-direction: column;
        width: 100%;
    }

    .btn-comic {
        width: 100%;
    }
}
