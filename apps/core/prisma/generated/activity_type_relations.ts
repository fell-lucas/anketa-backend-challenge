import { UserActivityLog } from './user_activity_log';
import { ApiProperty } from '@nestjs/swagger';

export class ActivityTypeRelations {
  @ApiProperty({ isArray: true, type: () => UserActivityLog })
  activityLogs: UserActivityLog[];
}
