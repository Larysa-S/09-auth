export type NoteCategory = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteCategory;
  createdAt: string;
  updatedAt: string;
}
