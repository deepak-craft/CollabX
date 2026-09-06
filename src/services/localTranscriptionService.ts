type TranscriptionResult = { text: string };
type LocalTranscriber = (audio: Float32Array, options?: { chunk_length_s?: number; stride_length_s?: number }) => Promise<TranscriptionResult>;

let transcriberPromise: Promise<LocalTranscriber> | null = null;

const getAudioContext = (): typeof AudioContext => {
  const audioContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!audioContext) {
    throw new Error('This browser does not support local audio transcription.');
  }
  return audioContext;
};

const resampleAudio = (audioBuffer: AudioBuffer, targetSampleRate = 16000): Float32Array => {
  const sourceLength = audioBuffer.length;
  const targetLength = Math.max(1, Math.floor(sourceLength * targetSampleRate / audioBuffer.sampleRate));
  const mono = new Float32Array(sourceLength);

  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
    const channelData = audioBuffer.getChannelData(channel);
    for (let index = 0; index < sourceLength; index += 1) {
      mono[index] += channelData[index] / audioBuffer.numberOfChannels;
    }
  }

  if (audioBuffer.sampleRate === targetSampleRate) {
    return mono;
  }

  const resampled = new Float32Array(targetLength);
  const ratio = (sourceLength - 1) / Math.max(1, targetLength - 1);
  for (let index = 0; index < targetLength; index += 1) {
    const sourceIndex = index * ratio;
    const lowerIndex = Math.floor(sourceIndex);
    const upperIndex = Math.min(sourceLength - 1, lowerIndex + 1);
    const weight = sourceIndex - lowerIndex;
    resampled[index] = mono[lowerIndex] * (1 - weight) + mono[upperIndex] * weight;
  }
  return resampled;
};

const loadTranscriber = async (): Promise<LocalTranscriber> => {
  if (!('WebAssembly' in window)) {
    throw new Error('This browser cannot run the local transcription model.');
  }

  const { pipeline } = await import('@huggingface/transformers');
  const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
    device: 'wasm',
    dtype: 'q8',
  });
  return transcriber as unknown as LocalTranscriber;
};

const getTranscriber = (): Promise<LocalTranscriber> => {
  if (!transcriberPromise) {
    transcriberPromise = loadTranscriber().catch(error => {
      transcriberPromise = null;
      throw error;
    });
  }
  return transcriberPromise;
};

export const localTranscriptionService = {
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'WebAssembly' in window && Boolean(window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  },

  async transcribe(blob: Blob): Promise<string> {
    const AudioContextClass = getAudioContext();
    const audioContext = new AudioContextClass();
    try {
      const audioBuffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
      const transcriber = await getTranscriber();
      const result = await transcriber(resampleAudio(audioBuffer), { chunk_length_s: 30, stride_length_s: 5 });
      return result.text.trim();
    } finally {
      await audioContext.close();
    }
  },
};