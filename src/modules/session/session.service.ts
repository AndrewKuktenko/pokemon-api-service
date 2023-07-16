import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionDocument, Session } from 'src/schemas/session.schema';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: Model<SessionDocument>,
  ) {}

  async addSession(user: string): Promise<SessionDocument> {
    const refreshToken = uuidv4();
    const session = new this.sessionModel({ user, refreshToken });
    await session.save();
    return session;
  }

  async findAndDelete(refreshToken: string): Promise<SessionDocument> {
    return await this.sessionModel.findOneAndDelete({ refreshToken });
  }
}
