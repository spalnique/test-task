export type RealtimeAPIConfig = {
  headers: {
    Authorization: string;
    'OpenAI-Beta'?: string;
  };
};

export type AudioEvent = {
  event_id: string;
  type: 'input_audio_buffer.append';
  audio: string;
};

export type RealtimeAPIEvent = {
  event_id: string;
  type: string;
  session?: {
    modalities: ('text' | 'audio')[];
    instructions: string;
    voice: 'sage';
    input_audio_format: 'pcm16';
    output_audio_format: 'pcm16';
    input_audio_transcription: { model: 'whisper-1' };
    turn_detection: {
      type: 'server_vad';
      threshold: number;
      prefix_padding_ms: number;
      silence_duration_ms: number;
      create_response: true;
    } | null;
    tools: Record<string, unknown>[];
    tool_choice: 'auto';
    temperature: number;
    max_response_output_tokens: 'inf' | number;
  };
  response?: {
    status: 'completed' | 'cancelled' | 'failed' | 'incomplete';
    status_details: Record<string, unknown> | null;
    output: {
      id: string;
      object: string;
      type: string;
      status: string;
      role: string;
      content: {
        type: string;
        text: string;
      }[];
    }[];
    usage: {
      total_tokens: number;
      input_tokens: number;
      output_tokens: number;
      input_token_details: {
        cached_tokens: number;
        text_tokens: number;
        audio_tokens: number;
        cached_tokens_details: {
          text_tokens: number;
          audio_tokens: number;
        };
      };
      output_token_details: {
        text_tokens: number;
        audio_tokens: number;
      };
    };
  };
};
