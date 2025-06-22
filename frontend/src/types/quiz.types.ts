import { Question } from './question.types';

export interface Quiz {
  id: string;
  title: string;
  description: string;
}

export type Quizzes = Pick<Quiz, 'id' | 'title' | 'description'>[];
