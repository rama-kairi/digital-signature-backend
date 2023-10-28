import { ErrorResService } from '@/common/responses/error/error.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { DocumentCreateDto } from './document.dto';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import {
  writeFileSync,
  readFileSync,
  unlinkSync,
  existsSync,
  mkdirSync,
} from 'fs';
import { join } from 'path';
import { Prisma } from '@prisma/client';

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

  // Delete Document
  async deleteDocument(uuid: string) {
    try {
      const deleteDocument = await this.prisma.document.delete({
        where: {
          uuid,
        },
      });
      return deleteDocument;
    } catch (error) {
      console.log(error.message);

      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  async signDocument(data: DocumentCreateDto, file: Express.Multer.File) {
    // create upload folder if not exist
    const dir = join('./src/uploads');
    if (!existsSync(dir)) mkdirSync(dir);

    // Create Signature PDF with FirstName, LastName, Email, Signature
    const signaturePDF = await PDFDocument.create();
    const page = signaturePDF.addPage();
    const helveticaFont = await signaturePDF.embedFont(StandardFonts.Helvetica);

    page.drawText(`First Name: ${data.firstName}`, {
      x: 50,
      y: page.getHeight() - 70,
      size: 20,
      font: helveticaFont,
    });
    page.drawText(`Last Name: ${data.lastName}`, {
      x: 50,
      y: page.getHeight() - 100,
      size: 20,
      font: helveticaFont,
    });
    page.drawText(`Email: ${data.email}`, {
      x: 50,
      y: page.getHeight() - 130,
      size: 20,
      font: helveticaFont,
    });

    const signatureImage = await signaturePDF.embedPng(data.signature);
    const signatureDims = signatureImage.scale(1);
    page.drawImage(signatureImage, {
      x: page.getWidth() / 2 - signatureDims.width / 2,
      y: page.getHeight() / 2 - signatureDims.height / 2,
      width: signatureDims.width,
      height: signatureDims.height,
    });

    const signaturePdfBytes = await signaturePDF.save();

    // Assuming you want to temporarily save the signaturePDF
    const tempSignaturePath = join(
      __dirname,
      '../../uploads/temp-signature.pdf',
    );
    writeFileSync(tempSignaturePath, signaturePdfBytes);

    // Merge Signature PDF with Document PDF
    const mergedPdf = await PDFDocument.create();

    const pdfSignature = await PDFDocument.load(
      readFileSync(tempSignaturePath),
    );
    const pdfFile = await PDFDocument.load(file.buffer);

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

    const pdfBytes = await mergedPdf.save();
    const mergedFilename =
      new Date().toISOString().substring(10) + '-signed.pdf';
    const outputPath = join('src/uploads/', mergedFilename);
    writeFileSync(outputPath, pdfBytes);

    // store the file in the database as base64
    const base64Pdf = readFileSync(outputPath, { encoding: 'base64' });

    // Clean up the temporary signature file
    unlinkSync(tempSignaturePath);

    // Create the Document in the database
    const obj: Prisma.DocumentCreateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      doc: file.originalname,
      signature: data.signature,
      signedDoc: base64Pdf,
    };

    try {
      await this.prisma.document.create({
        data: obj,
      });
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }

    return { success: true, message: 'Document Signed Successfully' };
  }

  // Download pdf file from database
  async downloadDocument(uuid: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: {
          uuid,
        },
      });

      if (!document) {
        return this.error.ExcBadRequest('Document not found.');
      }

      const pdfBase64 = document.signedDoc;

      const pdfBuffer = Buffer.from(pdfBase64, 'base64');

      return pdfBuffer;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }
}
