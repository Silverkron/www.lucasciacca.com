---
title: Come raffreddare un Raspberry Pi automaticamente
description: Scopri come raffreddare Raspberry Pi automaticamente con un piccolo circuito e uno script Python.
date: 2025-10-29 23:22:20 +0300
subtitle: RaspberryPi
image: '/images/come-raffreddare-un-raspberrypi/raspberrypi.webp'
---

## Perché è importante raffreddare Raspberry Pi

Quando il tuo **Raspberry Pi** lavora a lungo o sotto carico, la temperatura della CPU può superare facilmente i **70°C**, causando rallentamenti o throttling termico.  
Per evitare problemi di stabilità e allungare la vita del dispositivo, è fondamentale **raffreddare il Raspberry Pi** con un sistema automatico e silenzioso.

In questo progetto vedrai come realizzare un **sistema di raffreddamento intelligente** che accende e regola la ventola in base alla temperatura della CPU.  
Il tutto con un semplice **circuito elettronico** e uno **script Python** che sfrutta la libreria `gpiozero`.


## Come funziona il sistema per raffreddare Raspberry Pi

Il principio è semplice: il Raspberry Pi legge la temperatura della CPU e attiva una ventola a diverse velocità grazie a un **transistor TIP120** usato come interruttore.  
Il controllo è gestito via **PWM (Pulse Width Modulation)**, che consente di variare la velocità del motore in base al calore.

Lo script Python misura continuamente la temperatura e applica una logica di **isteresi** per evitare accensioni e spegnimenti frequenti:

- **Ventola spenta:** parte solo se la CPU supera i **60°C**
- **Ventola accesa:** si spegne quando la temperatura scende sotto i **50°C**
- Tra **50°C e 65°C** gira al 50%
- Tra **65°C e 70°C** sale al 75%
- Sopra i **70°C** lavora al 100%

Grazie a questa logica, il sistema di raffreddamento è **silenzioso, efficiente e automatico**, ideale per chi usa il Raspberry Pi come server, media center o nodo IoT.


## Componenti necessari per costruire il circuito

Per realizzare questo progetto e raffreddare efficacemente il Raspberry Pi, ti servono pochi componenti economici e facili da reperire:

- 🌀 **Ventola 5V** (modello 3010 o 4010)
- 🔌 **Raspberry Pi Model B** (qualsiasi versione, anche Pi 4 o 5)
- ⚙️ **Transistor TIP120** (NPN Darlington, per gestire la corrente della ventola)
- 🔩 **Resistenza da 1 kΩ** (limita la corrente sul pin di controllo GPIO)
- 🔗 **Cavi jumper** maschio-femmina

### Collegamenti elettrici

Segui lo schema mostrato nell’immagine (vedi figura allegata):

![circuito-tip120.webp](/images/come-raffreddare-un-raspberrypi/circuito-tip120.webp)

1. **Collega la ventola**:
    - il filo rosso al pin **5V** (pin 2 del Raspberry Pi)
    - il filo nero al **collettore** del TIP120

2. **Collega l’emettitore del TIP120** al **GND** del Raspberry Pi (pin 6 o 14).

3. **Collega una resistenza da 1kΩ** tra il **pin GPIO18** e la **base** del TIP120.

4. Assicurati che tutti i **GND** siano in comune.

In questo modo, il Raspberry Pi può controllare la ventola in modo proporzionale tramite il segnale PWM.

> 💡Puoi verificare la piedinatura del tuo modello consultando la [documentazione ufficiale di Raspberry Pi](https://www.raspberrypi.com/documentation/).

## Lo script Python per controllare la ventola

Per automatizzare il sistema e **raffreddare Raspberry Pi** in base alla temperatura, puoi usare lo script seguente.

```python3
#!/usr/bin/env python3
from gpiozero import PWMOutputDevice
import time
FAN_PIN = 18
fan = PWMOutputDevice(FAN_PIN, frequency=100)
# Stato ventola (per gestire l'isteresi)
fan_active = False
def get_cpu_temp():
    """Legge la temperatura della CPU"""
    with open('/sys/class/thermal/thermal_zone0/temp', 'r') as f:
        return float(f.read()) / 1000.0
def calculate_fan_speed(temp, current_fan_active):
    """
    Calcola la velocità della ventola con isteresi:
    VENTOLA SPENTA:
    - Se temp >= 60°C → Ventola parte al 50% (minimo)
    VENTOLA ACCESA:
    - Se temp < 50°C → Ventola si spegne
    - 50-65°C: Resta al 50% (minimo)
    - 65-70°C: 75% (alta)
    - > 70°C: 100% (massima)
    """
    global fan_active
    # Se ventola spenta, parte solo se temp >= 60°C
    if not current_fan_active:
        if temp >= 60:
            fan_active = True
            return 0.50  # Parte al 50%
        else:
            return 0.0  # Resta spenta
    # Se ventola accesa, si spegne solo se temp < 50°C
    else:
        if temp < 50:
            fan_active = False
            return 0.0  # Si spegne
        elif temp < 65:
            return 0.50  # Minimo 50%
        elif temp < 70:
            return 0.75  # Alta 75%
        else:
            return 1.0   # Massima 100%
def main():
    global fan_active
    print("🌡️  Controllo Temperatura Ventola con Isteresi")
    print("=" * 60)
    print("📊 Logica controllo:")
    print("   Ventola SPENTA → Parte a 60°C (minimo 50%)")
    print("   Ventola ACCESA → Si spegne sotto 50°C")
    print()
    print("📊 Velocità quando accesa:")
    print("   50-65°C: 50% (minimo)")
    print("   65-70°C: 75% (alta)")
    print("   > 70°C: 100% (massima)")
    print("=" * 60)
    print()
    previous_speed = -1
    try:
        while True:
            temp = get_cpu_temp()
            speed = calculate_fan_speed(temp, fan_active)
            # Aggiorna ventola solo se la velocità cambia
            if speed != previous_speed:
                fan.value = speed
                previous_speed = speed
            # Barra visiva
            percentage = speed * 100
            bars = "█" * int(percentage / 10)
            # Emoji temperatura
            if temp < 50:
                emoji = "❄️ "
            elif temp < 60:
                emoji = "🌡️ "
            elif temp < 70:
                emoji = "🔥"
            else:
                emoji = "🚨"
            # Stato ventola
            if fan_active:
                status = "ON "
            else:
                status = "OFF"
            print(f"{emoji} Temp: {temp:5.1f}°C | Ventola: {status} {percentage:3.0f}% [{bars:<10}]", end='\r')
            time.sleep(5)
    except KeyboardInterrupt:
        print("\n")
        print("=" * 60)
        print("⛔ Arresto del controllo ventola")
        fan.off()
        fan.close()
        print("✅ Ventola spenta - Script terminato")
if __name__ == "__main__":
    main()
```


Salvalo in un file, ad esempio `fan_control.py`, e rendilo eseguibile con:

```bash
chmod +x fan_control.py
```

## Come installare e testare il progetto

Segui questi passaggi per completare e testare il sistema di **raffreddamento automatico del Raspberry Pi**:

1. **Installa le librerie necessarie:**
   ```bash
   sudo apt update
   sudo apt install python3-gpiozero
   ```

2. **Copia lo script** nella directory `/home/pi/` e rendilo eseguibile.
3. **Eseguilo manualmente** con:
   ```bash
   python3 fan_control.py
   ```
4. **Monitora il terminale:** vedrai la temperatura e la velocità della ventola in tempo reale.
5. Se funziona correttamente, passa alla configurazione automatica con **systemd** (vedi sezione seguente).


## Come mantenere lo script sempre attivo con systemd

Per assicurarti che lo script di controllo della ventola venga avviato automaticamente all’accensione e resti sempre attivo, puoi creare un servizio **systemd**.

### 1. Crea il file di servizio

Apri un nuovo file di configurazione:

```bash
sudo nano /etc/systemd/system/fan-control.service
```

### 2. Inserisci il contenuto seguente

```ini
[Unit]
Description=Controllo automatico ventola Raspberry Pi
After=multi-user.target

[Service]
ExecStart=/usr/bin/python3 /home/pi/fan_control.py
WorkingDirectory=/home/pi
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

### 3. Salva e abilita il servizio

```bash
sudo systemctl daemon-reload
sudo systemctl enable fan-control.service
sudo systemctl start fan-control.service
```

### 4. Verifica che sia in esecuzione

```bash
sudo systemctl status fan-control.service
```

Se tutto è configurato correttamente, lo script si avvierà automaticamente ad ogni riavvio del Raspberry Pi e manterrà la ventola sempre sotto controllo, garantendo un **raffreddamento automatico e continuo**.

## Domande frequenti

### 🔧 Come collegare una ventola al Raspberry Pi?
Collega la ventola ai pin **5V e GND** per l’alimentazione, e usa un **transistor TIP120** controllato da un pin GPIO (ad esempio GPIO18) per regolare la velocità.

### 🌡️ Qual è la temperatura ideale del Raspberry Pi?
Il Raspberry Pi lavora in sicurezza fino a **80°C**, ma è consigliabile mantenerlo **sotto i 70°C** per garantire stabilità e lunga durata.

### 💻 Posso modificare lo script per usare un sensore diverso?
Sì, puoi adattarlo facilmente per leggere la temperatura da un sensore esterno come il **DS18B20**, modificando la funzione \`get_cpu_temp()\`.

### ⚙️ Funziona anche con Raspberry Pi 5?
Sì, lo script e il circuito sono compatibili con **tutte le versioni del Raspberry Pi**, purché la ventola funzioni a **5V** e il pin PWM sia configurato correttamente.

**In sintesi**, questo progetto ti permette di **raffreddare il Raspberry Pi in modo automatico, efficiente e silenzioso**, migliorando la stabilità del sistema con pochi componenti e poche righe di codice Python.

Se ti dovesse piacere l'immagine iniziale ho utilizzato [questo case stampato in 3D](https://makerworld.com/it/models/99946-raspberry-pi-4-case) che utilizza una ventola 4010 (4cm di diametro per 1cm di altezza) per cui [ho realizzato una versione alternativa](https://makerworld.com/it/models/1954466-raspberry-pi-4-case-3010-fan-remix) che si adatta alle ventole 3010 (3cm di diametro per 1cm di altezza)
