import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

class DocumentDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  doc: string;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  signedDoc: string;
}

//  Document Dto for create
export class DocumentCreateDto extends PickType(DocumentDto, [
  'firstName',
  'lastName',
  'email',
  'doc',
  'signature',
  'signedDoc',
]) {}

// Document Dto for Update
export class DocumentUpdateDto extends PartialType(DocumentCreateDto) {}

// Document Dto for Upload
export class DocumentUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file: Express.Multer.File;
}
