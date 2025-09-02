export interface User {
  id: string; 
  joined_at: string; 
  email: string;
  full_name: string;
  avatar_url: string;
  preferences: {
    fontStyle?: string;
    fontColor?: string;
    backgroundTheme?: string;
  };
  avg_wpm: number;
  max_wpm: number;
  min_wpm: number;
  total_time_typing: number;
  total_words_typed: number;
}
