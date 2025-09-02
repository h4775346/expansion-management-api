import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ResearchDocDocument = ResearchDoc & Document;

@Schema({ collection: 'research_docs', timestamps: true })
export class ResearchDoc {
  @Prop({ required: true, type: SchemaTypes.String })
  projectId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ResearchDocSchema = SchemaFactory.createForClass(ResearchDoc);

// Add text index on title and content
ResearchDocSchema.index({ title: 'text', content: 'text' });

// Add index on projectId and tags
ResearchDocSchema.index({ projectId: 1, tags: 1 });