import { ISessionRepository } from './session.repository';
import { Session } from '../entities/session.entity';

export class SessionRepositorySpec implements ISessionRepository {
  public sessions: Session[] = [];
  private currentId = 1;

  async create(session: Session): Promise<void> {
    session.id = this.currentId++;
    this.sessions.push(session);
  }

  async update(session: Session): Promise<void> {
    const index = this.sessions.findIndex((s) => s.id === session.id);
    if (index !== -1) {
      this.sessions[index] = session;
    }
  }

  async delete(id: number): Promise<void> {
    const index = this.sessions.findIndex((session) => session.id === id);
    if (index !== -1) {
      this.sessions[index].revokedAt = new Date();
    }
  }

  async activate(id: number): Promise<void> {
    const index = this.sessions.findIndex((session) => session.id === id);
    if (index !== -1) {
      this.sessions[index].revokedAt = null;
    }
  }

  async find(): Promise<Session[]> {
    return this.sessions.sort((a, b) => a.id - b.id);
  }

  async findWithDeleted(): Promise<Session[]> {
    return this.sessions;
  }

  async findByUser(id: number): Promise<Session[]> {
    return this.sessions.filter((session) => session.userId === id);
  }

  async findByToken(token: string): Promise<Session> {
    return this.sessions.find((session) => session.token === token);
  }

  async findById(id: number): Promise<Session> {
    return this.sessions.find((session) => session.id === id);
  }

  async findByIdWithDeleted(id: number): Promise<Session> {
    return this.sessions.find((session) => session.id === id);
  }
}