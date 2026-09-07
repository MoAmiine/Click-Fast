let btngoconfig = document.getElementById('btn-go-config')
btngoconfig.addEventListener('click' , () => {
    document.getElementById('view-home').style.display = 'none';
    document.getElementById('view-config').style.display = 'block';
})

let btnstartgame = document.getElementById('btn-start-game')
btnstartgame.addEventListener('click' ,() => {
    document.getElementById('view-config').style.display = 'none'
    document.getElementById('view-game').style.display = 'block'
})


