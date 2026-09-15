---
title: Gli slider odiano il tuo punteggio CLS
description: "Genera automaticamente CSS responsive con height e media query per ridurre il CLS e stabilizzare il layout."
date: 2025-07-20 18:40:10 +0300
image: '/images/gli-slider-odiano-il-tuo-punteggio-cls/copertina.webp'
tags: [cls, free-script, code]
---

# **Gli slider odiano il tuo punteggio CLS**

## Introduzione

Slider e sezioni "hero" above the fold sono visivamente potenti, ma spesso causano **problemi di performance**: uno dei più comuni è il **CLS (Cumulative Layout Shift)**.

Il motivo? Non hanno un’altezza iniziale definita. L’immagine o lo script che li compone si carica in ritardo, causando uno **spostamento improvviso** del layout.

Questo influisce negativamente su:

* Core Web Vitals (in particolare CLS e LCP)
* Esperienza utente mobile
* Ranking SEO su Google

---

## Obiettivo

In queste settimane ho "combattuto" spesso con siti web che proponevano slider all'interno della sezione Abode the Fold. Purtroppo quasi mai qualcuno si interessa ad ottimizzare questi elementi, causando un impatto tanto negativo sia sull'UX del sito che sul CLS della pagina, per questo ho realizzato **uno script da usare direttamente in console** per misurare l’altezza reale dello slider in questione su diversi viewport (mobile, tablet, desktop) e generare un **CSS responsive predittivo** con `height` e `media queries` corrette.

---

## Come funziona

![esempio-di-ottimizzazione-cls.gif](/images/gli-slider-odiano-il-tuo-punteggio-cls/esempio-di-ottimizzazione-cls.gif)

1. Apri la console (`F12`) sulla pagina da analizzare.
2. Incolla lo script seguente.
3. Esegui:

```js
start("tuo-selettore", true);
```

4. Al termine della scansione, lo script genererà:

  * il CSS `height` con media query responsive,
  * una versione minificata (copiata negli appunti),
  * una versione leggibile (commentata per viewport).

---

```js
// CSS Height Responsive Generator - Versione con iframe scalato
(function() {
    let measurements = [];
    let isRecording = false;
    let targetElement = null;
    let targetSelector = null; // Aggiungi il selettore
    let iframe = null;
    let overlay = null;
    let currentDeviceIndex = 0;
    
    // 11 larghezze standard basate sui dispositivi reali
    const standardDevices = [
        { width: 1920, device: 'Desktop Large' },
        { width: 1440, device: 'Desktop' },
        { width: 1366, device: 'Laptop' },
        { width: 1024, device: 'Tablet Landscape' },
        { width: 768, device: 'Tablet Portrait' },
        { width: 480, device: 'Mobile Large' },
        { width: 414, device: 'iPhone Pro Max' },
        { width: 412, device: 'Moto G (PageSpeed)' },
        { width: 375, device: 'iPhone Standard' },
        { width: 360, device: 'Android Standard' },
        { width: 320, device: 'Mobile Small' }
    ];
    
    // Funzione per iniziare la misurazione
    window.start = function(selector, auto = false) {
        if (!selector) {
            console.error('❌ Specifica un selettore CSS. Esempio: start(".mio-elemento")');
            return;
        }
        
        targetElement = document.querySelector(selector);
        if (!targetElement) {
            console.error(`❌ Elemento non trovato: ${selector}`);
            return;
        }
        
        targetSelector = selector; // Salva il selettore
        measurements = [];
        isRecording = true;
        currentDeviceIndex = 0;
        
        console.log(`🎯 Misurazione avviata per: ${selector}`);
        
        if (auto) {
            console.log('🤖 Modalità automatica con iframe scalato');
            console.log('📱 Creazione viewport simulata...');
            
            createScaledIframe();
            setTimeout(() => startAutoSequence(), 1000);
        } else {
            console.log('📏 Modalità manuale - riduci la finestra del browser');
            console.log('⏹️ Digita "stop()" quando hai finito');
            
            // Prima misurazione
            recordMeasurement();
            
            // Listener per il resize
            window.addEventListener('resize', handleResize);
        }
    };
    
    // Crea l'iframe scalato
    function createScaledIframe() {
        // Crea overlay di sfondo
        overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999998;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            color: white;
        `;
        
        // Crea iframe
        iframe = document.createElement('iframe');
        iframe.src = window.location.href;
        iframe.style.cssText = `
            border: 2px solid #00ff00;
            background: white;
            transform-origin: center center;
            transition: all 0.5s ease;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
        `;
        
        // Crea pannello di controllo
        const controlPanel = document.createElement('div');
        controlPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #000;
            color: #0f0;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #0f0;
            z-index: 999999;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.4;
            max-width: 250px;
        `;
        
        controlPanel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">🎯 CSS Height Generator</div>
            <div id="device-info">Preparazione...</div>
            <div id="progress-info" style="margin-top: 8px;"></div>
            <div style="margin-top: 10px; font-size: 10px;">
                <div>⏯️ SPAZIO: Avvia/Pausa</div>
                <div>⏭️ INVIO: Prossimo</div>
                <div>❌ ESC: Esci</div>
            </div>
        `;
        
        overlay.appendChild(iframe);
        overlay.appendChild(controlPanel);
        document.body.appendChild(overlay);
        
        // Gestione tasti
        document.addEventListener('keydown', handleKeyPress);
        
        // Nascondi scrollbar della pagina principale
        document.body.style.overflow = 'hidden';
    }
    
    // Avvia la sequenza automatica
    function startAutoSequence() {
        console.log('🚀 Iframe creato, attesa caricamento completo...');
        
        // Mostra indicatore di caricamento
        updateControlPanelLoading();
        
        // Attendi 5 secondi per il caricamento completo
        setTimeout(() => {
            console.log('✅ Caricamento completato, avvio misurazione...');
            
            // Ottieni la larghezza massima disponibile (finestra corrente)
            const maxAvailableWidth = window.innerWidth;
            
            // Trova il dispositivo standard più grande che sia <= alla larghezza massima
            // Se la finestra è più grande del dispositivo più grande, usa la finestra attuale
            const largestStandardDevice = standardDevices[0]; // Desktop Large 1920px
            
            let devicesForTest;
            if (maxAvailableWidth >= largestStandardDevice.width) {
                // Se la finestra è >= 1920px, inizia dalla finestra attuale
                devicesForTest = [
                    { width: maxAvailableWidth, device: `Current Window (${maxAvailableWidth}px)` },
                    ...standardDevices
                ];
            } else {
                // Altrimenti usa solo i dispositivi standard che entrano nella finestra
                devicesForTest = standardDevices.filter(d => d.width <= maxAvailableWidth);
            }
            
            if (devicesForTest.length === 0) {
                console.log('⚠️ Finestra troppo piccola');
                cleanup();
                return;
            }
            
            console.log(`📐 Test su ${devicesForTest.length} dispositivi (iniziando dal massimo):`);
            devicesForTest.forEach((d, i) => console.log(`   ${i + 1}. ${d.width}px - ${d.device}`));
            
            // Avvia la misurazione
            measureDevice(devicesForTest);
        }, 5000); // 5 secondi di attesa
    }
    
    // Aggiorna pannello durante il caricamento
    function updateControlPanelLoading() {
        const deviceInfo = document.getElementById('device-info');
        const progressInfo = document.getElementById('progress-info');
        
        if (deviceInfo) {
            deviceInfo.innerHTML = `
                <div style="color: #ffff00; font-weight: bold;">🔄 Caricamento...</div>
                <div style="color: #ffffff; font-size: 10px;">Attesa 5 secondi</div>
            `;
        }
        
        if (progressInfo) {
            let countdown = 5;
            const countdownInterval = setInterval(() => {
                if (progressInfo && countdown > 0) {
                    progressInfo.innerHTML = `
                        <div style="color: #ffff00;">
                            Caricamento in corso... ${countdown}s
                        </div>
                        <div style="width: 100%; height: 4px; background: #333; margin-top: 4px; border-radius: 2px;">
                            <div style="width: ${((5 - countdown) / 5) * 100}%; height: 100%; background: #ffff00; border-radius: 2px; transition: width 0.3s;"></div>
                        </div>
                    `;
                    countdown--;
                } else {
                    clearInterval(countdownInterval);
                }
            }, 1000);
        }
    }
    
    // Misura un dispositivo
    function measureDevice(devices) {
        if (currentDeviceIndex >= devices.length) {
            console.log('✅ Sequenza completata!');
            cleanup();
            generateCSS();
            return;
        }
        
        const device = devices[currentDeviceIndex];
        const maxWidth = Math.min(window.innerWidth * 0.9, 1200);
        const scale = Math.min(maxWidth / device.width, 0.8);
        
        // Aggiorna iframe
        iframe.style.width = device.width + 'px';
        iframe.style.height = '80vh';
        iframe.style.transform = `scale(${scale})`;
        
        // Aggiorna pannello di controllo
        updateControlPanel(device, devices);
        
        // Attendi che l'iframe si carichi e si adatti
        setTimeout(() => {
            measureIframeElement(device);
        }, 1200); // Aumentato da 800ms a 1200ms
    }
    
    // Aggiorna pannello di controllo
    function updateControlPanel(device, devices) {
        const deviceInfo = document.getElementById('device-info');
        const progressInfo = document.getElementById('progress-info');
        
        if (deviceInfo) {
            deviceInfo.innerHTML = `
                <div style="color: #00ff00; font-weight: bold;">${device.device}</div>
                <div style="color: #ffffff;">${device.width}px</div>
            `;
        }
        
        if (progressInfo) {
            progressInfo.innerHTML = `
                <div style="color: #ffff00;">
                    ${currentDeviceIndex + 1}/${devices.length} dispositivi
                </div>
                <div style="width: 100%; height: 4px; background: #333; margin-top: 4px; border-radius: 2px;">
                    <div style="width: ${((currentDeviceIndex + 1) / devices.length) * 100}%; height: 100%; background: #00ff00; border-radius: 2px;"></div>
                </div>
            `;
        }
    }
    
    // Misura l'elemento nell'iframe
    function measureIframeElement(device) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const iframeElement = iframeDoc.querySelector(targetElement.tagName + 
                (targetElement.id ? '#' + targetElement.id : '') + 
                (targetElement.className ? '.' + targetElement.className.split(' ').join('.') : ''));
            
            if (iframeElement) {
                const height = iframeElement.offsetHeight;
                
                // Evita duplicati
                const existing = measurements.find(m => Math.abs(m.width - device.width) <= 10);
                if (!existing) {
                    measurements.push({ width: device.width, height: height });
                    console.log(`📊 ${device.device}: ${device.width}px → ${height}px`);
                }
            } else {
                console.log(`⚠️ Elemento non trovato in iframe per ${device.device}`);
            }
        } catch (error) {
            console.log(`⚠️ Errore misurazione ${device.device}:`, error.message);
        }
        
        // Passa al prossimo automaticamente dopo 2 secondi
        setTimeout(() => {
            currentDeviceIndex++;
            const currentDevices = getCurrentDeviceList();
            measureDevice(currentDevices);
        }, 2000); // Aumentato da 1.5s a 2s
    }
    
    // Ottieni la lista corrente dei dispositivi da testare
    function getCurrentDeviceList() {
        const maxAvailableWidth = window.innerWidth;
        const largestStandardDevice = standardDevices[0];
        
        if (maxAvailableWidth >= largestStandardDevice.width) {
            return [
                { width: maxAvailableWidth, device: `Current Window (${maxAvailableWidth}px)` },
                ...standardDevices
            ];
        } else {
            return standardDevices.filter(d => d.width <= maxAvailableWidth);
        }
    }
    
    // Gestione tasti
    function handleKeyPress(e) {
        if (!isRecording) return;
        
        switch(e.key) {
            case ' ': // Spazio - pausa/riprendi
                e.preventDefault();
                console.log('⏸️ Pausa/Riprendi');
                break;
                
                            case 'Enter': // Invio - prossimo
                e.preventDefault();
                currentDeviceIndex++;
                const currentDevices = getCurrentDeviceList();
                measureDevice(currentDevices);
                break;
                
            case 'Escape': // ESC - esci
                e.preventDefault();
                console.log('❌ Misurazione interrotta');
                stop();
                break;
        }
    }
    
    // Pulizia
    function cleanup() {
        if (overlay) {
            document.body.removeChild(overlay);
            overlay = null;
        }
        
        iframe = null;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeyPress);
    }
    
    // Funzione per fermare la misurazione
    window.stop = function() {
        if (!isRecording) {
            console.log('⚠️ Nessuna misurazione attiva');
            return;
        }
        
        isRecording = false;
        window.removeEventListener('resize', handleResize);
        
        cleanup();
        generateCSS();
    };
    
    // Handler per resize manuale
    function handleResize() {
        if (!isRecording) return;
        
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            recordMeasurement();
        }, 100);
    }
    
    // Registra misurazione manuale
    function recordMeasurement() {
        if (!targetElement) return;
        
        const width = window.innerWidth;
        const height = targetElement.offsetHeight;
        
        const existing = measurements.find(m => Math.abs(m.width - width) <= 10);
        if (existing) {
            existing.height = height;
            return;
        }
        
        measurements.push({ width, height });
        console.log(`📊 Registrato: ${width}px → ${height}px`);
    }
    
    // Genera il CSS finale
    function generateCSS() {
        if (measurements.length === 0) {
            console.log('❌ Nessuna misurazione registrata');
            return;
        }
        
        // Ordina per larghezza decrescente
        measurements.sort((a, b) => b.width - a.width);
        
        // Filtra misurazioni simili
        const filtered = measurements.filter((current, index) => {
            if (index === 0) return true;
            const prev = measurements[index - 1];
            return Math.abs(prev.width - current.width) > 30;
        });
        
        console.log('\n🎨 CSS GENERATO:\n');
        
        // CSS minificato
        let css = '';
        
        // CSS base
        if (filtered.length > 0) {
            css += `${targetSelector}{height:${filtered[0].height}px}`;
        }
        
        // Media queries minificate
        for (let i = 1; i < filtered.length; i++) {
            const measurement = filtered[i];
            css += `@media(max-width:${measurement.width}px){${targetSelector}{height:${measurement.height}px}}`;
        }
        
        console.log('/* CSS Minificato */');
        console.log(css);
        
        // CSS formattato per leggibilità
        console.log('\n/* CSS Formattato */');
        let formattedCSS = '';
        
        if (filtered.length > 0) {
            const deviceName = getDeviceName(filtered[0].width);
            formattedCSS += `/* Base (${deviceName}) */\n`;
            formattedCSS += `${targetSelector} {\n`;
            formattedCSS += `    height: ${filtered[0].height}px;\n`;
            formattedCSS += `}\n\n`;
        }
        
        for (let i = 1; i < filtered.length; i++) {
            const measurement = filtered[i];
            const deviceName = getDeviceName(measurement.width);
            
            formattedCSS += `/* ${deviceName} */\n`;
            formattedCSS += `@media (max-width: ${measurement.width}px) {\n`;
            formattedCSS += `    ${targetSelector} {\n`;
            formattedCSS += `        height: ${measurement.height}px;\n`;
            formattedCSS += `    }\n`;
            formattedCSS += `}\n\n`;
        }
        
        console.log(formattedCSS);
        
        // Tabella riepilogativa
        console.log('📋 RIEPILOGO:');
        console.table(filtered);
        
        // Copia la versione minificata negli appunti
        if (navigator.clipboard) {
            navigator.clipboard.writeText(css).then(() => {
                console.log('✅ CSS minificato copiato negli appunti!');
            });
        }
    }
    
    // Ottieni nome dispositivo
    function getDeviceName(width) {
        // Controlla prima se è la finestra corrente
        if (Math.abs(width - window.innerWidth) <= 20) {
            return `Current Window (${width}px)`;
        }
        
        const device = standardDevices.find(d => Math.abs(d.width - width) <= 20);
        return device ? device.device : `Larghezza: ${width}px`;
    }
    
    // Funzione di aiuto
    window.help = function() {
        console.log('\n📖 GUIDA ALL\'USO:');
        console.log('1. start("selettore") - Misurazione manuale');
        console.log('2. start("selettore", true) - Misurazione automatica con iframe');
        console.log('3. stop() - Ferma e genera CSS');
        console.log('\n🎮 CONTROLLI (modalità automatica):');
        console.log('• SPAZIO: Pausa/Riprendi');
        console.log('• INVIO: Prossimo dispositivo');
        console.log('• ESC: Esci');
        console.log('\n💡 ESEMPIO:');
        console.log('start("#rev_slider_47_1_wrapper", true)');
    };
    
    console.log('🚀 CSS Height Generator v3.0 - Iframe Edition');
    console.log('📱 Supporto simulazione viewport con scale CSS');
    console.log('📝 Digita "help()" per iniziare');
})();
```

---

## Esempio di utilizzo

Supponiamo che lo slider principale abbia questo selettore:

```js
start("#hero-slider", true);
```

Lo script simulerà l'altezza effettiva del blocco su 11 larghezze standard (es. 1920px, 1440px, 768px, 375px, ecc.). Una volta terminato, genera il seguente output (esempio reale):

```css
/* Base (Desktop) */
#hero-slider {
  height: 720px;
}

/* Tablet */
@media (max-width: 1024px) {
  #hero-slider {
    height: 580px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  #hero-slider {
    height: 440px;
  }
}
```

---

## Quando usarlo

* Quando il tuo hero/slider causa **CLS elevato** in PageSpeed.
* Quando vuoi assegnare **un’altezza coerente** a un blocco dinamico sopra la piega.
* Quando lavori su un sito che **non consente modifiche al layout HTML** ma puoi aggiungere CSS.
* Quando hai bisogno di una soluzione **rapida e precisa** senza dover usare strumenti esterni.

---

## Conclusione

Molti problemi di CLS derivano da layout non prevedibili. Questo script ti permette di misurare in modo concreto **quanto spazio serve davvero** al tuo slider o blocco above the fold, su ogni tipo di viewport.

È uno strumento pensato per chi **lavora sul campo**, vuole risolvere rapidamente problemi reali, e cerca output direttamente utilizzabile nel CSS.
