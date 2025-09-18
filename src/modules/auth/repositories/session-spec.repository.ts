import { ISessionRepository } from './session.repository';
import { Session } from '@/modules/auth/entities/session.entity';
import { v7 as uuidv7 } from 'uuid';

export class SessionRepositorySpec implements ISessionRepository {
  public sessions: Session[] = [];

  create(session: Session): Promise<void> {
    if (!session.id) {
      session.id = uuidv7();
    }
    this.sessions.push(session);

    return Promise.resolve();
  }

  update(session: Session): Promise<void> {
    const index = this.sessions.findIndex((s) => s.id === session.id);
    if (index !== -1) {
      this.sessions[index] = session;
    }

    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    const index = this.sessions.findIndex((session) => session.id === id);
    if (index !== -1) {
      this.sessions[index].revokedAt = new Date();
    }
    return Promise.resolve();
  }

  activate(id: string): Promise<void> {
    const index = this.sessions.findIndex((session) => session.id === id);
    if (index !== -1) {
      this.sessions[index].revokedAt = null;
    }

    return Promise.resolve();
  }

  find(): Promise<Session[]> {
    return Promise.resolve(
      this.sessions.sort((a, b) => a.id.localeCompare(b.id)),
    );
  }

  findWithDeleted(): Promise<Session[]> {
    return Promise.resolve(this.sessions);
  }

  findByUser(id: string): Promise<Session[]> {
    return Promise.resolve(
      this.sessions.filter((session) => session.userId === id),
    );
  }

  findByToken(token: string): Promise<Session> {
    return Promise.resolve(
      this.sessions.find((session) => session.token === token),
    );
  }

  findById(id: string): Promise<Session> {
    return Promise.resolve(this.sessions.find((session) => session.id === id));
  }

  findByIdWithDeleted(id: string): Promise<Session> {
    return Promise.resolve(this.sessions.find((session) => session.id === id));
  }
}
