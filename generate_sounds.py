import wave
import struct
import math
import random

def save_wav(filename, samples):
    with wave.open(filename, 'w') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(44100)
        for s in samples:
            s = max(-1, min(1, s))
            f.writeframesraw(struct.pack('<h', int(s * 32767.0)))

def roll():
    # Dado rolando: ruído + impactos de madeira
    duration = 0.4
    num_samples = int(duration * 44100)
    samples = []
    for i in range(num_samples):
        noise = (random.random() * 2 - 1) * 0.1
        impact = 0.4 * math.sin(2.0 * math.pi * 100 * i / 44100) if i % 800 < 40 else 0
        env = math.sin(math.pi * i / num_samples)
        samples.append((noise + impact) * env)
    save_wav('assets/sounds/roll.wav', samples)

def hold():
    # Sucesso: Arpejo C Maior (Dó, Mi, Sol, Dó)
    duration = 0.6
    num_samples = int(duration * 44100)
    samples = []
    freqs = [261.63, 329.63, 392.00, 523.25]
    for i in range(num_samples):
        t = i / 44100
        f = freqs[min(int(t * 7), len(freqs)-1)]
        val = 0.3 * (math.sin(2*math.pi*f*t) + 0.5*math.sin(4*math.pi*f*t))
        env = 1.0 - (i / num_samples)
        samples.append(val * env)
    save_wav('assets/sounds/hold.wav', samples)

def lose():
    # Perda: Trompete triste com vibrato e queda de tom
    duration = 0.8
    num_samples = int(duration * 44100)
    samples = []
    for i in range(num_samples):
        t = i / 44100
        f_base = 330 - (t * 150)
        vibrato = 15 * math.sin(2 * math.pi * 6 * t)
        f = f_base + vibrato
        val = 0
        for h in range(1, 4):
            val += (0.5/h) * math.sin(2 * math.pi * f * h * t)
        env = math.sin(math.pi * i / num_samples) * (1.0 - t)
        samples.append(0.3 * val * env)
    save_wav('assets/sounds/lose.wav', samples)

roll()
hold()
lose()
print("Sons elaborados criados.")
