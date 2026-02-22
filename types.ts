export enum ParaphraseMode {
  Standard = 'Standard',
  Fluency = 'Fluency',
  Academic = 'Academic',
  Creative = 'Creative',
  Shorten = 'Shorten',
  Expand = 'Expand',
  Simple = 'Simple',
  Formal = 'Formal',
  Humanize = 'Humanize (Max)'
}

export interface ParaphraseRequest {
  text: string;
  mode: ParaphraseMode;
}

export interface ParaphraseResponse {
  rewrittenText: string;
}

export interface ModeConfig {
  id: ParaphraseMode;
  label: string;
  description: string;
  icon?: string;
  color: string;
}