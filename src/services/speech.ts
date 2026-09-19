export interface TTSState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  rate: number;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  public isSupported(): boolean {
    return Boolean(this.synth && typeof SpeechSynthesisUtterance !== 'undefined');
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getKoreanVoices(): SpeechSynthesisVoice[] {
    if (!this.voices.length) this.loadVoices();
    return this.voices.filter((v) => v.lang.startsWith('ko') || v.lang.includes('KR'));
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      onPause?: () => void;
      onResume?: () => void;
    } = {}
  ): void {
    if (!this.isSupported() || !this.synth) {
      options.onError?.(new Error('Web Speech API is not supported in this browser.'));
      return;
    }

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text for clearer speech
    const cleanText = text.replace(/[*#`_]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Prefer high quality Korean voice
    const koreanVoices = this.getKoreanVoices();
    if (koreanVoices.length > 0) {
      // Prefer Google or natural Korean voice if present
      const preferred = koreanVoices.find((v) => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Yuna') || v.name.includes('Heami'));
      utterance.voice = preferred || koreanVoices[0];
      utterance.lang = utterance.voice.lang;
    } else {
      utterance.lang = 'ko-KR';
    }

    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.0;

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      // 'canceled' or 'interrupted' is normal when stop() is called
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
        options.onError?.(e);
      } else {
        options.onEnd?.();
      }
    };

    utterance.onpause = () => {
      options.onPause?.();
    };

    utterance.onresume = () => {
      options.onResume?.();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause(): void {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking && !this.synth.paused);
  }

  public isPaused(): boolean {
    return Boolean(this.synth && this.synth.paused);
  }
}

export const speechService = new SpeechService();
