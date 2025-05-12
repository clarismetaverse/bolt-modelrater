export interface RatingResponse {
  resp?: [{
    angelicness: number;
    'model agency rate': string;
    sexyness: number;
    'look unique features': string;
    comment?: string;
  }];
  success: boolean;
  error?: string;
}