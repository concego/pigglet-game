const sounds = {
    roll: new Audio('assets/sounds/roll.wav'),
    hold: new Audio('assets/sounds/hold.wav'),
    lose: new Audio('assets/sounds/lose.wav')
};
const i18n = {
    pt: { title: "Porquinho", p1: "Jogador 1", p2: "Jogador 2", current: "Rodada: ", btnRoll: "Rolar", btnHold: "Salvar", btnNew: "Novo", rolled: "Tirou ", lost: "Perdeu tudo!", win: " venceu!", turnOf: "Vez de: " },
    en: { title: "Pigglet", p1: "Player 1", p2: "Player 2", current: "Round: ", btnRoll: "Roll", btnHold: "Hold", btnNew: "New", rolled: "Rolled ", lost: "You lost!", win: " won!", turnOf: "Turn of: " }
};
let lang = 'pt', scores = [0, 0], cur = 0, p = 0, active = true;
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
function next() { p = p===0?1:0; cur = 0; d.cur.textContent = '0'; ui(); }
d.lang.onclick = () => { lang = lang==='pt'?'en':'pt'; ui(); };
d.roll.onclick = () => {
    if (!active) return; sounds.roll.play();
    const dice = Math.floor(Math.random()*6)+1;
    if (dice !== 1) { cur += dice; d.cur.textContent = cur; d.st.textContent = i18n[lang].rolled + dice; }
    else { sounds.lose.play(); d.st.textContent = i18n[lang].lost; next(); }
};
d.hold.onclick = () => {
    if (!active || cur === 0) return;
    sounds.hold.play(); d.pig.classList.remove('jump'); void d.pig.offsetWidth; d.pig.classList.add('jump');
    scores[p] += cur; d[p===0?'p1':'p2'].textContent = scores[p];
    if (scores[p] >= 100) { d.st.textContent = (p===0?i18n[lang].p1:i18n[lang].p2) + i18n[lang].win; active = false; }
    else next();
};
d.new.onclick = () => { scores=[0,0]; cur=0; p=0; active=true; d.p1.textContent='0'; d.p2.textContent='0'; d.cur.textContent='0'; d.st.textContent=''; ui(); };
ui();
