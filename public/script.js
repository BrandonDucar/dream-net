document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('status-text');
    const spendUsd = document.getElementById('spend-usd');
    const capUsd = document.getElementById('cap-usd');
    const headline = document.getElementById('headline');

    const headlines = [
        "Building the Future, Autonomously.",
        "Intelligence that Creates.",
        "Beyond Automation. True Autonomy.",
        "The Last Platform You'll Ever Need."
    ];

    let headlineIndex = 0;
    if(headline){
        headline.textContent = headlines[headlineIndex];
        setInterval(() => {
            headlineIndex = (headlineIndex + 1) % headlines.length;
            headline.style.opacity = 0;
            setTimeout(() => {
                headline.textContent = headlines[headlineIndex];
                headline.style.opacity = 1;
            }, 1000);
        }, 5000);
    }

    const updateStatus = async () => {
        try {
            const response = await fetch('/api/usage/summary');
            const data = await response.json();

            if(spendUsd && capUsd){
                spendUsd.textContent = `$${data.spend_usd.toFixed(2)}`;
                capUsd.textContent = `$${data.cap_usd.toFixed(2)}`;
            }

            if (statusText) {
                if (data.spend_usd >= data.cap_usd) {
                    statusText.textContent = 'BUDGET EXCEEDED';
                    document.getElementById('status-light').className = 'blinking-red';
                } else if (data.spend_usd >= data.cap_usd * data.warn_pct) {
                    statusText.textContent = 'BUDGET WARNING';
                    document.getElementById('status-light').className = 'blinking-yellow';
                } else {
                    statusText.textContent = 'OPERATIONAL';
                    document.getElementById('status-light').className = 'blinking-green';
                }
            }

        } catch (error) {
            console.error('Error fetching status:', error);
            if(statusText) statusText.textContent = 'OFFLINE';
            document.getElementById('status-light').className = 'blinking-red';
        }
    };

    updateStatus();
    setInterval(updateStatus, 15000); // Update every 15 seconds

    // Matrix background
    const canvas = document.getElementById('matrix-canvas');
    if(canvas){
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = 1;
        }

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0f0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        setInterval(draw, 33);
    }
});
