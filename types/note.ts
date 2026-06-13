export type NoteCategory = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteCategory;
  createdAt: string;
  updatedAt: string;
}
export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
