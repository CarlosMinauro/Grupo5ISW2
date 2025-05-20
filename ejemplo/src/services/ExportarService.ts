import { GastoTipo } from '../types/GastoTipo';
import { PDFDocument, rgb } from 'pdf-lib';

export function exportarCSV(data: GastoTipo[]) {
    const headers = "ID,Fecha,Monto,Descripción,Recurrente,Categoría\n";
    const csvContent = data.map(item => `${item.id},${item.date},${item.amount},${item.description},${item.recurring ? "Sí" : "No"},${item.category_id}`).join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'gastos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export async function exportarPDF(data: GastoTipo[]) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText('Reporte de Gastos', {
        x: 50,
        y: 350,
        size: 20,
        color: rgb(0, 0, 0),
    });

    const tableHeaders = ['ID', 'Fecha', 'Monto', 'Descripción', 'Recurrente', 'Categoría'];
    const tableData = data.map(item => [
        item.id.toString(),
        item.date,
        item.amount.toString(),
        item.description,
        item.recurring ? 'Sí' : 'No',
        item.category_id.toString()
    ]);

    let yPosition = 320;
    tableHeaders.forEach((header, index) => {
        page.drawText(header, {
            x: 50 + index * 80,
            y: yPosition,
            size: 10,
            color: rgb(0, 0, 0),
        });
    });

    yPosition -= 20;
    tableData.forEach(row => {
        row.forEach((cell, index) => {
            page.drawText(cell, {
                x: 50 + index * 80,
                y: yPosition,
                size: 10,
                color: rgb(0, 0, 0),
            });
        });
        yPosition -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'gastos.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
} 