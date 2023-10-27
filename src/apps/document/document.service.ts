import { ErrorResService } from '@/common/responses/error/error.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { DocumentCreateDto } from './document.dto';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly error: ErrorResService,
  ) {}

  // Get All Documents
  async getAllDocuments() {
    try {
      const documents = await this.prisma.document.findMany();
      return documents;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  // Create Document
  async createDocument(data: DocumentCreateDto) {
    try {
      const document = await this.prisma.document.create({
        data,
      });
      return document;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  // Get Document By uuid
  async getDocumentByUuid(uuid: string) {
    try {
      const document = await this.prisma.document.findFirst({
        where: { uuid },
      });
      return document;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  // Update Document
  async updateDocument(uuid: string, data: DocumentCreateDto) {
    try {
      const document = await this.prisma.document.update({
        where: { uuid },
        data,
      });
      return document;
    } catch (error) {
      console.log(error);
      return this.error.ExcBadRequest(
        'Something bad happen for update, try again.',
      );
    }
  }

  // Delete Document
  async deleteDocument(uuid: string) {
    try {
      const document = await this.prisma.document.delete({
        where: { uuid },
      });
      return document;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  // Add Signature
  async signDocument(uuid: string, signature: Buffer) {
    const document = await this.prisma.document.findUnique({
      where: { uuid },
    });
    if (!document) {
      return this.error.ExcBadRequest('Document not found');
    }

    const pdfDoc = await PDFDocument.load(document.data);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const pngImage = await pdfDoc.embedPng(signature);

    // Place the signature on the desired location on the first page
    firstPage.drawImage(pngImage, {
      x: firstPage.getWidth() / 2 - 100,
      y: firstPage.getHeight() / 2 - 100,
      width: 200,
      height: 100,
    });

    const signedPdfBytes = await pdfDoc.save();
    console.log(signedPdfBytes);

    // Update the stored PDF with the signed version
    // return await this.prisma.document.update({
    //   where: { uuid },
    //   data: { signedPdf: signedPdfBytes },
    // });
    // document.data = signedPdfBytes;
    // return await this.documentRepository.save(document);
  }
}
