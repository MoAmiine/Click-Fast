

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
let minuteur = document.getElementById('countdown')


function game() {
    let durationValue = timeSelect.value;

 const countdown = setInterval(() => {
  if (durationValue <= 0) {
    clearInterval(countdown);
    finishgame();
  } else {
    minuteur.innerHTML = `${durationValue} seconds remaining...`
    durationValue--;
  }
}, 1000);   
}

function finishgame(){
    document.getElementById('view-game').style.display = 'none';
    document.getElementById('view-results').style.display = 'block'
}

