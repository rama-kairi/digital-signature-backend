import { JwtAuthGuard } from '@/common/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentCreateDto } from './document.dto';
import { DocumentService } from './document.service';

@Controller('document')
@ApiTags('Document')
@ApiSecurity('JWT_auth')
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  // // Get All Documents
  @Get()
  @ApiResponse({ status: 200, description: 'Document' })
  @ApiOperation({ summary: 'Get Document List' })
  async getAllDocuments() {
    return await this.documentService.getAllDocuments();
  }

  @Post('/sign_document')
  @UseInterceptors(FileInterceptor('doc'))
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @UploadedFile() doc: Express.Multer.File,
    @Body() body: DocumentCreateDto,
    // @Res() res,
  ) {
    const data = await this.documentService.signDocument(body, doc);

    // res.setHeader('Content-Type', 'application/pdf');
    // res.sendFile(data.filename, { root: 'dist/uploads' });
    return data;
  }

  // Delete Document
  @Delete('/delete_document/:id')
  @ApiOperation({ summary: 'Delete Document' })
  async deleteDocument(@Param('id') id: string) {
    try {
      return await this.documentService.deleteDocument(id);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  @Get('/download_document/:id')
  @ApiOperation({ summary: 'Download Document' })
  async downloadDocument(@Param('id') id: string, @Res() res) {
    try {
      const data = await this.documentService.downloadDocument(id);
      console.log('data', data);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=signed_document.pdf`,
      );
      res.send(data);
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error, 400);
    }
  }
}
