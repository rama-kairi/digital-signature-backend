import { ApiProperty } from '@nestjs/swagger';

export class DocumentCreateDto {
  @ApiProperty({ required: false })
  firstName: string;

  @ApiProperty({ required: false })
  lastName: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  doc: string;

  @ApiProperty({ required: false })
  signature: string;
}

// Document Dto for Update
// export class DocumentUpdateDto extends PartialType(DocumentCreateDto) {}

// Document Dto for Upload
export class DocumentUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}
