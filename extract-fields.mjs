import { PDFDocument } from 'pdf-lib';
import { readFileSync, readdirSync } from 'fs';

const pdfFiles = readdirSync('.').filter(f => f.endsWith('.pdf'));

for (const file of pdfFiles) {
  try {
    const bytes = readFileSync(file);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();
    const fields = form.getFields();

    console.log('\n=== ' + file + ' (' + fields.length + ' fields) ===');
    fields.slice(0, 20).forEach(f => {
      const type = f.constructor.name.replace('PDF','').replace('Field','');
      console.log('  ' + type + ': "' + f.getName() + '"');
    });
    if (fields.length > 20) console.log('  ... and ' + (fields.length - 20) + ' more');
  } catch (e) {
    console.log('\n=== ' + file + ': Error - ' + e.message + ' ===');
  }
}
