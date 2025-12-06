const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log(`
    ███╗   ███╗ ██████╗ ██████╗ ██████╗ ███████╗
    ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██╔════╝
    ██╔████╔██║██║   ██║██████╔╝██║  ██║█████╗  
    ██║╚██╔╝██║██║   ██║██╔══██╗██║  ██║██╔══╝  
    ██║ ╚═╝ ██║╚██████╔╝██║  ██║██████╔╝███████╗
    ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝
          WEBHOOK TOOL v1 - MORDE EDITION
`);

function soru(soru) {
    return new Promise(resolve => rl.question(soru, resolve));
}

async function tekGonder() {
    const webhook = await soru('Webhook URL: ');
    const mesaj = await soru('Mesaj içeriği: ');
    const username = await soru('Username (enter boş bırak): ') || "MORDE";
    const avatar = await soru('Avatar URL (enter boş bırak): ') || "https://i.hizliresim.com/5q2r9v3.png";

    await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: mesaj, username, avatar_url: avatar })
    });
    console.log('Gönderildi!');
    menu();
}

async function spam() {
    const webhook = await soru('Webhook URL: ');
    const mesaj = await soru('Spam mesajı: ');
    const adet = parseInt(await soru('Kaç tane atsın (max 1000): ')) || 100;
    const gecikme = parseInt(await soru('Gecikme (ms) - 0 = full speed: ')) || 0;

    console.log(`Spam başlıyor... ${adet} mesaj`);
    for (let i = 1; i <= adet; i++) {
        try {
            await fetch(webhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: mesaj + (gecikme === 0 ? '' : ` (${i})`) })
            });
            process.stdout.write(`\rGönderilen: ${i}/${adet}`);
            if (gecikme > 0) await new Promise(r => setTimeout(r, gecikme));
        } catch { }
    }
    console.log('\nSpam bitti!');
    menu();
}

async function embedGonder() {
    const webhook = await soru('Webhook URL: ');
    const baslik = await soru('Embed Başlık: ');
    const aciklama = await soru('Embed Açıklama: ');
    const renk = await soru('Renk (hex, örnek: #8b5cf6): ') || "#8b5cf6";

    await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            embeds: [{
                title: baslik,
                description: aciklama,
                color: parseInt(renk.replace('#', ''), 16),
                timestamp: new Date(),
                footer: { text: "MORDE TOOL" }
            }]
        })
    });
    console.log('Embed gönderildi!');
    menu();
}

async function dosyaGonder() {
    const webhook = await soru('Webhook URL: ');
    const dosyaYolu = await soru('Dosya yolu (örnek: C:\\foto.png): ');

    if (!fs.existsSync(dosyaYolu)) {
        console.log('Dosya bulunamadı!');
        return menu();
    }

    const form = new fetch.FormData();
    form.append('file', fs.createReadStream(dosyaYolu));

    await fetch(webhook + '?wait=true', {
        method: 'POST',
        body: form
    });
    console.log('Dosya gönderildi!');
    menu();
}

function menu() {
    console.log(`
    ╔══════════════════════════════════╗
    ║ 1) Tek Mesaj Gönder              ║
    ║ 2) Spam At (max 1000)            ║
    ║ 3) Embed Gönder                  ║
    ║ 4) Dosya Gönder                  ║
    ║ 5) Çıkış                         ║
    ╚══════════════════════════════════╝
    `);
    rl.question('Seçimin: ', secim => {
        if (secim === '1') tekGonder();
        else if (secim === '2') spam();
        else if (secim === '3') embedGonder();
        else if (secim === '4') dosyaGonder();
        else if (secim === '5') process.exit();
        else { console.log('Geçersiz seçim!'); menu(); }
    });
}

menu();
