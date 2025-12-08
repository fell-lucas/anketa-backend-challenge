import { QuestionType, AnswerType, LinkResponseType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Poll {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ enum: QuestionType, enumName: 'QuestionType' })
  questionType: QuestionType;

  @ApiProperty({ type: String })
  question: string;

  @ApiProperty({ enum: AnswerType, enumName: 'AnswerType' })
  answerType: AnswerType;

  @ApiProperty({ type: Boolean })
  hasMultipleAnswers: boolean;

  @ApiProperty({ type: Boolean })
  addOpenEndedOption: boolean;

  @ApiProperty({ type: Boolean })
  markAsOptionalQuestion: boolean;

  @ApiPropertyOptional({ type: Number })
  answerCharacterLimit?: number;

  @ApiPropertyOptional({ type: String })
  answerSuggestion?: string;

  @ApiPropertyOptional({ type: Number })
  answersCount?: number;

  @ApiPropertyOptional({ type: String })
  sectionId?: string;

  @ApiPropertyOptional({ enum: LinkResponseType, enumName: 'LinkResponseType' })
  linkResponseType?: LinkResponseType = LinkResponseType.NONE;

  @ApiPropertyOptional({ type: String })
  linkResponseSectionId?: string;

  @ApiPropertyOptional({ type: String })
  linkResponsePollId?: string;

  @ApiProperty({ type: String })
  postId: string;
}
