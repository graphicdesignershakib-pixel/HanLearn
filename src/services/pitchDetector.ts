/**
 * Autocorrelation-based fundamental frequency (F0) pitch detector.
 * Works natively via Web Audio API AudioContext & AnalyserNode.
 */
export class PitchDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private buffer: Float32Array<ArrayBuffer> | null = null;
  private isDetecting: boolean = false;
  private animationFrameId: number | null = null;

  public async start(onPitchSample: (freq: number | null, volume: number) => void): Promise<void> {
    if (this.isDetecting) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      throw new Error("Web Audio API not supported in this browser");
    }

    this.audioCtx = new AudioContextClass();
    if (this.audioCtx.state === "suspended") {
      await this.audioCtx.resume();
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.buffer = new Float32Array(this.analyser.fftSize);

    this.sourceNode = this.audioCtx.createMediaStreamSource(this.mediaStream);
    this.sourceNode.connect(this.analyser);

    this.isDetecting = true;

    const detectLoop = () => {
      if (!this.isDetecting || !this.analyser || !this.buffer || !this.audioCtx) return;

      this.analyser.getFloatTimeDomainData(this.buffer);

      // Calculate root-mean-square volume
      let sumSquares = 0;
      for (let i = 0; i < this.buffer.length; i++) {
        sumSquares += this.buffer[i] * this.buffer[i];
      }
      const rms = Math.sqrt(sumSquares / this.buffer.length);

      // If too quiet (background silence / noise), ignore pitch
      if (rms < 0.015) {
        onPitchSample(null, rms);
      } else {
        const pitch = this.autoCorrelate(this.buffer, this.audioCtx.sampleRate);
        onPitchSample(pitch, rms);
      }

      this.animationFrameId = requestAnimationFrame(detectLoop);
    };

    detectLoop();
  }

  public stop(): void {
    this.isDetecting = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }

  /**
   * Fast normalized autocorrelation algorithm to extract fundamental frequency
   */
  private autoCorrelate(buf: Float32Array, sampleRate: number): number | null {
    const SIZE = buf.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return null; // not enough signal

    let r1 = 0;
    let r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }
    }

    const subBuf = buf.subarray(r1, r2);
    const subSize = subBuf.length;

    const c = new Float32Array(subSize);
    for (let i = 0; i < subSize; i++) {
      for (let j = 0; j < subSize - i; j++) {
        c[i] += subBuf[j] * subBuf[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1;
    let maxpos = -1;
    for (let i = d; i < subSize; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;

    // Parabolic interpolation around peak
    const x1 = c[T0 - 1];
    const x2 = c[T0];
    const x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) {
      T0 = T0 - b / (2 * a);
    }

    const freq = sampleRate / T0;

    // Normal human speaking pitch range: 65 Hz (deep male) to 500 Hz (high female/child)
    if (freq >= 65 && freq <= 500) {
      return freq;
    }

    return null;
  }
}
