import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileInfoDto {
  @ApiPropertyOptional({ description: 'Marital status', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  maritalStatus?: string;

  @ApiPropertyOptional({ description: 'Sexual orientation', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  sexualOrientation?: string;

  @ApiPropertyOptional({ description: 'Race', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  race?: string;

  @ApiPropertyOptional({ description: 'Ethnicity', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ethnicity?: string;

  @ApiPropertyOptional({ description: 'Education level', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  education?: string;

  @ApiPropertyOptional({
    description: 'Industry (e.g., hospitality, entertainment)',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  industry?: string;

  @ApiPropertyOptional({
    description: 'Profession (e.g., engineer, doctor)',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  profession?: string;

  @ApiPropertyOptional({
    description: 'Average monthly income range',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  averageMonthlyIncome?: string;

  @ApiPropertyOptional({
    description: 'Household income in USD',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  householdIncomeInUSD?: string;

  @ApiPropertyOptional({ description: 'Housing situation', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  housing?: string;

  @ApiPropertyOptional({ description: 'Family size', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  familySize?: string;

  @ApiPropertyOptional({ description: 'Religious affiliation', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  religion?: string;

  @ApiPropertyOptional({ description: 'Political affiliation', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  politicalAffiliation?: string;

  @ApiPropertyOptional({
    description: 'Service in the military',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  serviceInTheMilitary?: string;

  @ApiPropertyOptional({
    description: "Partner's service in the military",
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  partnerServiceInTheMilitary?: string;

  @ApiPropertyOptional({
    description: 'Disability or impairment status',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  disabilityOrImpairment?: string;
}
