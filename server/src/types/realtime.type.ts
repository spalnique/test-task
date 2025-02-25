export type RealtimeAPIConfig = {
  headers: {
    Authorization: string;
    'OpenAI-Beta'?: string;
  };
};

export type ClientRealtimeEvent = {
  event_id?: string;
  type:
    | 'session.update'
    | 'input_audio_buffer.append'
    | 'input_audio_buffer.commit'
    | 'input_audio_buffer.clear'
    | 'response.create'
    | 'response.cancel';
  session?: {
    modalities?: Array<'text' | 'audio'>;
    instructions?: string;
    voice?:
      | 'alloy'
      | 'ash'
      | 'ballad'
      | 'coral'
      | 'echo'
      | 'sage'
      | 'shimmer'
      | 'and'
      | 'verse';
    input_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
    output_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
    input_audio_transcription?: {
      model: 'whisper-1';
    } | null;
    turn_detection?: {
      threshold: number;
      prefix_padding_ms: number;
      silence_duration_ms: number;
      create_response?: boolean;
    } | null;
    temperature?: number;
    max_response_output_tokens?: 'inf' | number;
  };
  response?: {
    modalities?: Array<'text' | 'audio'>;
    instructions?: 'Please assist the user.';
    voice?:
      | 'alloy'
      | 'ash'
      | 'ballad'
      | 'coral'
      | 'echo'
      | 'sage'
      | 'shimmer'
      | 'and'
      | 'verse';
    output_audio_format: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
    temperature: number;
    max_output_tokens: 'inf' | number;
  };
  audio?: string;
};

export type ServerRealtimeEvent = {
  event_id: string;
  type:
    | 'error'
    | 'session.created'
    | 'session.updated'
    | 'input_audio_buffer.commited'
    | 'input_audio_buffer.cleared'
    | 'response.created'
    | 'response.done'
    | 'response.text.delta'
    | 'response.text.done';
  error?: {
    type: string;
    code: string;
    message: string;
    param: null;
    event_id: string;
  };
  session?: {
    id: string;

    model: string;
    modalities: Array<'text' | 'audio'>;
    instructions: string;

    turn_detection: {
      type: 'server_vad';
      threshold: number;
      prefix_padding_ms: number;
      silence_duration_ms: number;
    };
    temperature: number;
    max_response_output_tokens: 'inf' | number;
  };
  response?: {
    id: string;
    object: 'realtime.response';
    status: 'completed';
    status_details: null;
    output: {
      id: string;
      object: 'realtime.item';
      type: 'message';
      status: 'completed';
      role: string;
      content: {
        type: 'text';
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
  response_id?: string;
  item_id?: string;
  delta?: string;
};
