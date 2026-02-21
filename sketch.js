// CONFIGURAÇÕES DO SCROLL
const config = {
    resMin: 40,       // Começa bem abstrato (blocões)
    resMax: 180,      // Termina em alta definição
    charsImagem: ' .:-=+*#%@',
    inverter: false
};

const asciiOutput = document.getElementById('ascii-output');
const scrollTrack = document.getElementById('scroll-track');
const introTexto = document.getElementById('intro-texto');

const img = new Image();
img.src = 'vermeer.jpg';

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d', { willReadFrequently: true });

function renderizarAscii(resolucao) {
    if (img.width === 0) return;

    const w = Math.floor(resolucao);
    const h = Math.floor(w * (img.height / img.width) * 0.5);

    canvas.width = w;
    canvas.height = h;

    context.drawImage(img, 0, 0, w, h);
    const imageData = context.getImageData(0, 0, w, h);
    const data = imageData.data;

    let asciiStr = '';

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const lum = (data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114) / 255;
            let charIdx = Math.floor(lum * (config.charsImagem.length - 1));
            if (config.inverter) charIdx = (config.charsImagem.length - 1) - charIdx;
            
            asciiStr += config.charsImagem[charIdx];
        }
        asciiStr += '\n';
    }

    asciiOutput.textContent = asciiStr;

    // --- A MÁGICA DO TAMANHO FÍSICO CONSTANTE ---
    // 1. Queremos que a arte ocupe 90% da tela (até um limite de 800px)
    const larguraDesejada = Math.min(window.innerWidth * 0.9, 800);
    
    // 2. Calcula a largura de cada "letra" para preencher esse espaço
    const larguraCaractere = larguraDesejada / w;
    
    // 3. Numa fonte monospace, a altura da letra é aprox. 1.6 vezes a largura
    const tamanhoFonte = larguraCaractere * 1.6;

    // Aplica o tamanho exato na tela
    asciiOutput.style.fontSize = `${tamanhoFonte}px`;
    asciiOutput.style.lineHeight = `${tamanhoFonte}px`;
}

function onScroll() {
    const scrollTop = window.scrollY; 
    const scrollAltura = scrollTrack.scrollHeight - window.innerHeight; 
    let progresso = scrollTop / scrollAltura;

    if (progresso < 0) progresso = 0;
    if (progresso > 1) progresso = 1;

    const resolucaoAtual = config.resMin + (config.resMax - config.resMin) * progresso;
    
    renderizarAscii(resolucaoAtual);

    if (progresso > 0.9) {
        introTexto.classList.add('visivel');
    } else {
        introTexto.classList.remove('visivel');
    }
}

img.onload = () => {
    renderizarAscii(config.resMin);
    window.addEventListener('scroll', onScroll);
    onScroll(); 
};

// Recalcula se a pessoa redimensionar a janela
window.addEventListener('resize', onScroll);