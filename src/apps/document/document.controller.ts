import { JwtAuthGuard } from '@/common/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { DocumentCreateDto, DocumentUploadDto } from './document.dto';
import { DocumentService } from './document.service';

@Controller('document')
@ApiTags('Document')
@ApiSecurity('JWT_auth')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // Get All Documents
  @Get()
  @ApiResponse({ status: 200, description: 'Document' })
  @ApiOperation({ summary: 'Get Document List' })
  async getAllDocuments() {
    return await this.documentService.getAllDocuments();
  }

  // Create Document
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Document',
    type: DocumentCreateDto,
  })
  @ApiBody({ type: DocumentCreateDto })
  @ApiOperation({ summary: 'Create Document' })
  async createDocument(@Body() data: DocumentCreateDto) {
    return await this.documentService.createDocument(data);
  }

  // Get Document By uuid
  @Get('/:uuid')
  @ApiResponse({ status: 200, description: 'Document' })
  @ApiOperation({ summary: 'Get Document By uuid' })
  async getDocumentByUuid(@Param('uuid') uuid: string) {
    return await this.documentService.getDocumentByUuid(uuid);
  }

  // Update Document
  @Patch('/:uuid')
  @ApiResponse({ status: 200, description: 'Document' })
  @ApiOperation({ summary: 'Update Document' })
  async updateDocument(
    @Param('uuid') uuid: string,
    @Body() data: DocumentCreateDto,
  ) {
    return await this.documentService.updateDocument(uuid, data);
  }

  // Delete Document
  @Delete('/:uuid')
  @ApiResponse({ status: 200, description: 'Document' })
  @ApiOperation({ summary: 'Delete Document' })
  async deleteDocument(@Param('uuid') uuid: string) {
    return await this.documentService.deleteDocument(uuid);
  }

  // Upload Document
  @Patch('upload/file')
  @ApiResponse({
    status: 200,
    description: 'Document upload',
  })
  @ApiOperation({
    summary: 'Document upload',
    description: '## Upload Document',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  async uploadDocument(
    @Body() documentUploadDto: DocumentUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return { msg: 'file uploaded', file, fileName: file.filename };
  }

  // Add Signature
  @Patch(':uuid/sign')
  @UseInterceptors(FileInterceptor('signature'))
  @ApiConsumes('multipart/form-data')
  async signDocument(
    @Param('uuid') uuid: string,
    @Body() documentUploadDto: DocumentUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentService.signDocument(uuid, file.buffer);
  }
}
