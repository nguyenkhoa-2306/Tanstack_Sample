export interface Question {
  id: number;
  text: string;
  options: [];
  correctAnswerIndex: number;
}

export type Questions = Pick<Question, 'id' | 'text' | 'options' | 'correctAnswerIndex'>[];
