import { ErrorResService } from '@/common/responses/error/error.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { readFileSync, writeFileSync } from 'fs';
import { PrismaService } from 'nestjs-prisma';
import { join } from 'path';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { DocumentCreateDto } from './document.dto';

@Injectable()
export class DocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly error: ErrorResService,
  ) {}

  // Get All Documents
  async getAllDocuments() {
    try {
      const documents = await this.prisma.document.findMany({
        orderBy: {
          updatedAt: 'desc',
        },
      });
      return documents;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  // Create Document
  async createDocument(data: DocumentCreateDto, userId: string) {
    try {
      const obj: Prisma.DocumentCreateInput = {
        createdBy: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        doc: data.doc,
        signature: data.signature,
        user: {
          connect: {
            uuid: userId,
          },
        },
      };

      const document = await this.prisma.document.create({
        data: obj,
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
  async createSignaturePDF(
    firstName: string,
    lastName: string,
    email: string,
    signatureBase64: string,
  ) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText(`First Name: ${firstName}`, {
      x: 50,
      y: page.getHeight() - 70,
      size: 20,
      font: helveticaFont,
    });
    page.drawText(`Last Name: ${lastName}`, {
      x: 50,
      y: page.getHeight() - 100,
      size: 20,
      font: helveticaFont,
    });
    page.drawText(`Email: ${email}`, {
      x: 50,
      y: page.getHeight() - 130,
      size: 20,
      font: helveticaFont,
    });

    const signatureImage = await pdfDoc.embedPng(signatureBase64);
    const signatureDims = signatureImage.scale(1);
    page.drawImage(signatureImage, {
      x: page.getWidth() / 2 - signatureDims.width / 2,
      y: page.getHeight() / 2 - signatureDims.height / 2,
      width: signatureDims.width,
      height: signatureDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    writeFileSync(
      join(
        'src/uploads/' +
          firstName +
          lastName +
          email.replace('@', '') +
          '-merged.pdf',
      ),
      pdfBytes,
    );

    return firstName + lastName + email.replace('@', '') + '-merged.pdf';
  }

  // Merge Signature
  async signDocument(uuid: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { uuid },
      });
      if (!document) {
        return this.error.ExcBadRequest('Document not found');
      }

      const mergedPdf = await PDFDocument.create();

      const signatureImg = await this.createSignaturePDF(
        document.firstName,
        document.lastName,
        document.email,
        document.signature,
      );
      console.log('signatureImg', signatureImg);

      const signaturePath = join(__dirname, '../../uploads/' + signatureImg);
      const dataPath = join(__dirname, '../../uploads/' + document.doc);

      let pdfSignature: PDFDocument, pdfFile: PDFDocument;
      try {
        pdfSignature = await PDFDocument.load(readFileSync(signaturePath));
        pdfFile = await PDFDocument.load(readFileSync(dataPath));
      } catch (fileReadError) {
        console.log(fileReadError);
        return this.error.ExcBadRequest('Failed to read PDF file');
      }

      const copiedPagesA = await mergedPdf.copyPages(
        pdfFile,
        pdfFile.getPageIndices(),
      );
      copiedPagesA.forEach((page) => mergedPdf.addPage(page));

      const copiedPagesB = await mergedPdf.copyPages(
        pdfSignature,
        pdfSignature.getPageIndices(),
      );
      copiedPagesB.forEach((page) => mergedPdf.addPage(page));

      await mergedPdf.save();

      const pdfBytes = await mergedPdf.save();
      writeFileSync(
        join('src/uploads/' + document.doc.replace('.pdf', '') + '-merged.pdf'),
        pdfBytes,
      );

      await this.prisma.document.update({
        where: { uuid },
        data: {
          signedDoc: document.doc.replace('.pdf', '') + '-merged.pdf',
        },
      });
      return 'Successfully signed the document';
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        return this.error.ExcBadRequest(error.response.msg);
      }
      return this.error.ExcBadRequest('Something bad happened, try again.');
    }
  }
}
