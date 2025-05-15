import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
  
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
