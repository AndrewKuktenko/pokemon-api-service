import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ versionKey: false, timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ required: true, index: true })
  refreshToken: string;

  @Prop()
  createdAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
