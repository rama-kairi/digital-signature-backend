import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

import { IsNotEmpty, IsUUID } from 'class-validator';

class DocumentDto {
  @IsUUID()
  @ApiProperty({ type: String, format: 'uuid' })
  userUuid: string;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  data: string;

  @ApiProperty({ type: Number, format: 'int32' })
  signedPdf: number;
}

//  Document Dto for create
export class DocumentCreateDto extends PickType(DocumentDto, [
  'userUuid',
  'name',
  'data',
]) {}

// Document Dto for Update
export class DocumentUpdateDto extends PartialType(DocumentCreateDto) {}

// Document Dto for Upload
export class DocumentUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}
