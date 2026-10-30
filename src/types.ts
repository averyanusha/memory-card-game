export type Card = {
  id: number,
  name: string,
  image: string
};

export type ErrorStatus = 'THEME_REJECTED' | 'RATE_LIMITED' | 'GENERATION_FAILED' | 'NETWORK' | 'JOB_NOT_FOUND';
