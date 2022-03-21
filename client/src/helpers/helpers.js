import { v4 as uuidV4 } from 'uuid';

export const sessionId = () => {
  const sessionId = localStorage.getItem('session-id');
  if(sessionId) return sessionId;

  const newId = uuidV4();
  localStorage.setItem('session-id', newId);
  return newId;
}