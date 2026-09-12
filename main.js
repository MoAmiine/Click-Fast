let btngoconfig = document.getElementById('btn-go-config');
let btnstartgame = document.getElementById('btn-start-game');
let btnReplay = document.getElementById('btn-replay');
const pseudoInput = document.getElementById('pseudo');
const timeSelect = document.getElementById('select-time');
let pseudoValue = "";
const modeSelect = document.getElementById('select-mode');
let currentMode = "classique";
const btnGoHistory = document.getElementById('btn-go-history');
const btnBackHome = document.getElementById('btn-back-home');
const btnPurgeHistory = document.getElementById('btn-purge-history');
const historyContainer = document.getElementById('history-container');
const btnMainMenu = document.getElementById('btn-main-menu');



btngoconfig.addEventListener('click', () => {
    document.getElementById('view-home').style.display = 'none';
    document.getElementById('view-config').style.display = 'block';
});


if (btnReplay) {
    btnReplay.addEventListener('click', () => {
        document.getElementById('view-results').style.display = 'none';
        document.getElementById('view-config').style.display = 'block';
    });
}

if (btnMainMenu) {
    btnMainMenu.addEventListener('click', () => {
        document.getElementById('view-results').style.display = 'none';
        document.getElementById('view-home').style.display = 'block';
    });
}

if (btnGoHistory) {
    btnGoHistory.addEventListener('click', () => {
        document.getElementById('view-home').style.display = 'none';
        document.getElementById('view-history').style.display = 'block';
        renderHistory();
    });
}

if (btnBackHome) {
    btnBackHome.addEventListener('click', () => {
        document.getElementById('view-history').style.display = 'none';
        document.getElementById('view-home').style.display = 'block';
    });
}

if (btnPurgeHistory) {
    btnPurgeHistory.addEventListener('click', () => {
        if (confirm("Voulez-vous vraiment supprimer tout l'historique ?")) {
            localStorage.removeItem('clickFast.history');
            renderHistory();
        }
    });
}

function renderHistory() {
    let history = [];

    try {
        const savedHistory = localStorage.getItem('clickFast.history');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
        }
    } catch (e) {
        history = [];
    }

    if (history.length === 0) {
        historyContainer.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">Aucune partie enregistrée pour le moment.</p>';
        return;
    }

    let html = '';
    history.forEach((session, index) => {
        let precisionText = "";
        if (session.mode === "precision") {
            precisionText = ` | Précision: <span style="color: #10b981;">${session.precision}%</span>`;
        }

        html += `
            <div style="background: rgba(255,255,255,0.05); padding: 12px; margin-bottom: 10px; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                <div style="display: flex; justify-content: space-between; color: #cbd5e1; margin-bottom: 5px;">
                    <strong>#${index + 1} - ${session.pseudo}</strong>
                    <span style="font-size: 0.85rem; color: #94a3b8;">${session.date}</span>
                </div>
                <div style="color: #94a3b8; font-size: 0.85rem; text-transform: uppercase;">
                    Mode: ${session.mode} | Diff: ${session.diff} | Temps: ${session.temps}s
                </div>
                <div style="color: #fff; margin-top: 8px; font-size: 1.1rem;">
                    Score : <span style="color: var(--primary-color); font-weight: bold;">${session.score}</span> 
                    ${precisionText}
                </div>
            </div>
        `;
    });

    historyContainer.innerHTML = html;
}


const difficultySelect = document.getElementById('select-difficulty');
let currentDifficulty = "moyenne";

btnstartgame.addEventListener('click', (event) => {
    event.preventDefault();

    pseudoValue = pseudoInput.value.trim();

    if (pseudoValue.length < 2 || pseudoValue.length > 20) {
        alert("Veuillez saisir un pseudo valide (entre 2 et 20 caractères).");
        return;
    }

    currentDifficulty = difficultySelect.value;
    currentMode = modeSelect.value;

    document.getElementById('view-config').style.display = 'none';
    document.getElementById('view-game').style.display = 'block';

    game();
});

let minuteur = document.getElementById('countdown');
const cible = document.getElementById('target');
const arena = document.getElementById('arena');

let count = 0;
let misses = 0;

function game() {
    let durationValue = timeSelect.value;

    count = 0;
    misses = 0;

    let tailleCible = 60;

    if (currentDifficulty === "facile") {
        tailleCible = 80;
    } else if (currentDifficulty === "difficile") {
        tailleCible = 40;
    }

    cible.style.width = `${tailleCible}px`;
    cible.style.height = `${tailleCible}px`;

    const countdown = setInterval(() => {
        if (durationValue <= 0) {
            clearInterval(countdown);
            finishgame();
        } else {
            minuteur.innerHTML = `${durationValue} seconds remaining...`;
            durationValue--;
        }
    }, 1000);

    cible.onclick = (event) => {
        event.stopPropagation();
        moveTarget();
        count++
    };

    arena.onclick = () => {
        if (currentMode === "precision") {
            misses++;
        }
    };
}

function moveTarget() {
    const arenaWidth = arena.clientWidth;
    const arenaHeight = arena.clientHeight;

    const targetWidth = cible.clientWidth;
    const targetHeight = cible.clientHeight;

    const maxX = arenaWidth - targetWidth;
    const maxY = arenaHeight - targetHeight;

    let randomX = Math.floor(Math.random() * maxX);
    let randomY = Math.floor(Math.random() * maxY);

    cible.style.left = `${randomX}px`;
    cible.style.top = `${randomY}px`;
}

function finishgame() {
    document.getElementById('view-game').style.display = 'none';
    document.getElementById('view-results').style.display = 'block';

    const temps = parseInt(timeSelect.value, 10);
    const cps = (count / temps).toFixed(2);

    let totalscore = count + misses;
    let precision = 0;

    if (totalscore > 0) {
        precision = ((count / totalscore) * 100).toFixed(1);
    }

    const recordKey = `${currentMode}_${currentDifficulty}_${temps}`;

    let records = {};
    try {
        const savedRecords = localStorage.getItem('clickFast.records');
        if (savedRecords) {
            records = JSON.parse(savedRecords);
        }
    } catch (e) {
        console.error("Erreur");
        records = {};
    }

    const ancienRecord = records[recordKey] || 0;
    let isNewRecord = false;

    if (count > ancienRecord) {
        isNewRecord = true;
        records[recordKey] = count;
        localStorage.setItem('clickFast.records', JSON.stringify(records));
    }

    let precisionStatsHTML = "";
    if (currentMode === "precision") {
        precisionStatsHTML = `
            <div style="display: flex; justify-content: space-between; text-align: left; font-size: 1.1rem;">
                <div style="color: #f43f5e;">❌ Ratés : <strong>${misses}</strong></div>
                <div style="color: #10b981;">🎯 Précision : <strong>${precision}%</strong></div>
            </div>
            <hr style="border: 0; height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;">
        `;
    }

    document.getElementById('score').innerHTML = `
        <div style="margin-bottom: 30px;">
            <div style="color: #fff; font-size: 1.5rem; font-family: 'Orbitron', sans-serif; text-transform: uppercase;">
                JOUEUR : <span style="color: var(--primary-color);">${pseudoValue}</span>
                <div style="font-size: 0.9rem; color: #94a3b8; margin-top: 5px;">MODE ${currentMode.toUpperCase()}</div>
            </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); padding: 25px; border-radius: 12px; display: inline-block; text-align: center; margin-bottom: 25px; width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <div style="color: #fff; font-size: 1.2rem; margin-bottom: 20px;">
                CIBLES DÉTRUITES <br>
                <span style="color: var(--primary-color); font-size: 4rem; font-weight: bold; line-height: 1;">${count}</span>
            </div>
            
            <div style="color: #fbbf24; font-size: 0.9rem; margin-bottom: 10px;">
                (Ancien record : ${ancienRecord})
            </div>
            
            <hr style="border: 0; height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;">
            
            ${precisionStatsHTML}

            <div style="display: flex; justify-content: space-between; text-align: left; font-size: 1.1rem; color: #cbd5e1;">
                <div>⏱️ Temps : <strong>${temps}s</strong></div>
                <div>⚡ Vitesse : <strong>${cps} h/s</strong></div>
            </div>
        </div>

        <div id="record-banner" style="color: #fbbf24; font-weight: bold; font-size: 1.2rem; margin-bottom: 20px; text-shadow: 0 0 10px rgba(251, 191, 36, 0.5); display: none;">
            NOUVEAU RECORD !
        </div>
    `;

    if (isNewRecord) {
        document.getElementById('record-banner').style.display = 'block';
    }

    let history = [];
    try {
        const savedHistory = localStorage.getItem('clickFast.history');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
        }
    } catch (e) {
        // En cas d'anomalie, le tableau est réinitialisé à vide[cite: 1]
        console.error("Erreur historique, réinitialisation.");
        history = [];
    }

    // Création de l'objet contenant les statistiques de la partie actuelle
    const sessionData = {
        date: new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        pseudo: pseudoValue,
        mode: currentMode,
        diff: currentDifficulty,
        temps: temps,
        score: count,
        precision: precision
    };

    // unshift() ajoute la nouvelle partie tout au début du tableau
    history.unshift(sessionData);

    // Si on dépasse 20 sessions, pop() supprime la plus ancienne (la 21e) à la fin du tableau[cite: 1]
    if (history.length > 20) {
        history.pop();
    }

    // Sauvegarde finale dans le navigateur
    localStorage.setItem('clickFast.history', JSON.stringify(history));
}



