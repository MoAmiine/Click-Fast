let btngoconfig = document.getElementById('btn-go-config');


btngoconfig.addEventListener('click', () => {
    document.getElementById('view-home').style.display = 'none';
    document.getElementById('view-config').style.display = 'block';
});

let btnstartgame = document.getElementById('btn-start-game');
const pseudoInput = document.getElementById('pseudo');
const timeSelect = document.getElementById('select-time');

btnstartgame.addEventListener('click', (event) => {
    event.preventDefault();

    const pseudoValue = pseudoInput.value.trim();

    if (pseudoValue.length < 2 || pseudoValue.length > 20) {
        alert("Veuillez saisir un pseudo valide (entre 2 et 20 caractères).");
        return;
    }
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
        misses++;
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

    document.getElementById('score').innerHTML = `
        <div style="color: #fff; font-size: 1.5rem; margin-bottom: 15px;">
            SCORE FINAL : <span style="color: var(--primary-color); font-size: 3rem; text-shadow: var(--primary-glow);">${count}</span> HITS
        </div>
        
        <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; display: inline-block; text-align: left; margin-bottom: 20px;">
            <div style="color: var(--danger-color); font-size: 1.2rem; margin-bottom: 5px;">
                ❌ Clics ratés : ${misses}
            </div>
            <div style="color: #10b981; font-size: 1.2rem;">
                🎯 Précision : ${precision}%
            </div>
        </div>

        <div style="font-size: 1.1rem; color: #94a3b8;">
            ⏱️ Durée : ${temps}s &nbsp;|&nbsp; ⚡ Vitesse : ${cps} hits/sec
        </div>
    `;
}