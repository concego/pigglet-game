const sounds = {
    roll: new Audio('assets/sounds/roll.wav'),
    hold: new Audio('assets/sounds/hold.wav'),
    lose: new Audio('assets/sounds/lose.wav')
};
const i18n = {
    pt: { title: "Porquinho", p1: "Jogador 1", p2: "Jogador 2", current: "Rodada: ", btnRoll: "Rolar", btnHold: "Salvar", btnNew: "Novo", rolled: "Tirou ", lost: "Perdeu tudo!", win: " venceu!", turnOf: "Vez de: " },
    en: { title: "Pigglet", p1: "Player 1", p2: "CPU (PiggyBot)", current: "Round: ", btnRoll: "Roll", btnHold: "Hold", btnNew: "New", rolled: "Rolled ", lost: "You lost!", win: " won!", turnOf: "Turn of: " }
};
let lang = 'pt', scores = [0, 0], cur = 0, p = 0, active = true, isCPUTurn = false;
const d = {
    title: document.getElementById('title'), lang: document.getElementById('lang-toggle'),
    p1: document.getElementById('p1-score'), p2: document.getElementById('p2-score'),
    cur: document.getElementById('current-points'), name: document.getElementById('current-player-name'),
    st: document.getElementById('status-update'), pig: document.getElementById('pig-svg'),
    roll: document.getElementById('btn-roll'), hold: document.getElementById('btn-hold'), new: document.getElementById('btn-new')
};
function ui() {
    const t = i18n[lang]; d.title.textContent = t.title; d.lang.textContent = lang==='pt'?'EN':'PT';
    d.roll.textContent = t.btnRoll; d.hold.textContent = t.btnHold; d.new.textContent = t.btnNew;
    d.name.textContent = `${t.turnOf} ${t[p===0?'p1':'p2']}`;
}
function next() { 
    p = p===0?1:0; 
    cur = 0; 
    d.cur.textContent = '0'; 
    ui(); 
    setTimeout(clearStatus, 1500); // Limpa o status da jogada anterior após um breve intervalo
    if (p === 1 && active) {
        isCPUTurn = true;
        setTimeout(cpuPlay, 1000);
    } else {
        isCPUTurn = false;
    }
}

function cpuPlay() {
    if (!active || p !== 1) return;

    // Lógica da IA: Arriscar até ter 20 pontos na rodada, 
    // ou se o acumulado já for suficiente para ganhar o jogo.
    const threshold = 20;
    const willWin = (scores[1] + cur) >= 100;

    if (cur < threshold && !willWin) {
        rollDice();
        if (p === 1 && active) {
            setTimeout(cpuPlay, 1200); // Pequeno delay para parecer que está "pensando"
        }
    } else {
        holdPoints();
    }
}

function rollDice() {
    if (!active) return; 
    sounds.roll.play();
    const dice = Math.floor(Math.random()*6)+1;
    if (dice !== 1) { 
        cur += dice; 
        d.cur.textContent = cur; 
        d.st.textContent = i18n[lang].rolled + dice; 
    } else { 
        sounds.lose.play(); 
        d.st.textContent = i18n[lang].lost; 
        next(); 
    }
}

function holdPoints() {
    if (!active || cur === 0) return;
    sounds.hold.play(); 
    d.pig.classList.remove('jump'); 
    void d.pig.offsetWidth; 
    d.pig.classList.add('jump');
    scores[p] += cur; 
    d[p===0?'p1':'p2'].textContent = scores[p];
    if (scores[p] >= 100) { 
        d.st.textContent = (p===0?i18n[lang].p1:i18n[lang].p2) + i18n[lang].win; 
        active = false; 
    } else {
        next();
    }
}

d.lang.onclick = () => { lang = lang==='pt'?'en':'pt'; ui(); };
d.roll.onclick = () => { if (!isCPUTurn) rollDice(); };
d.hold.onclick = () => { if (!isCPUTurn) holdPoints(); };
d.new.onclick = () => { scores=[0,0]; cur=0; p=0; active=true; isCPUTurn=false; d.p1.textContent='0'; d.p2.textContent='0'; d.cur.textContent='0'; d.st.textContent=''; ui(); };
function clearStatus() { d.st.textContent = ''; }
ui();
