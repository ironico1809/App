import React, { useState } from 'react';
import Button from './Button';
import './ExportButtons.css';

/**
 * Componente para exportar reportes en PDF y Excel - CU-26
 * @param {Object} props
 * @param {Object} props.data - Datos a exportar
 * @param {string} props.fileName - Nombre del archivo (sin extensión)
 * @param {string} props.reportTitle - Título del reporte
 * @param {boolean} props.disabled - Si los botones están deshabilitados
 * @param {Function} props.onExportStart - Callback cuando inicia la exportación
 * @param {Function} props.onExportComplete - Callback cuando termina la exportación
 * @param {Function} props.onExportError - Callback cuando hay error
 */
const ExportButtons = ({
  data = [],
  fileName = 'reporte',
  reportTitle = 'Reporte',
  disabled = false,
  onExportStart = () => {},
  onExportComplete = () => {},
  onExportError = () => {}
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState(null);

  // Función para exportar a PDF
  const exportToPDF = async () => {
    if (disabled || isExporting) return;

    try {
      setIsExporting(true);
      setExportingFormat('PDF');
      onExportStart('PDF');

      // Validar que hay datos para exportar
      if (!data || data.length === 0) {
        throw new Error('No hay datos disponibles para exportar');
      }

      // Simular generación de PDF (en implementación real usaría jsPDF o similar)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear contenido PDF simulado
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onExportComplete('PDF', `${fileName}.pdf`);
      
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      onExportError('PDF', error.message || 'Error al generar el archivo PDF');
      alert(`Error al exportar PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  // Función para exportar a Excel
  const exportToExcel = async () => {
    if (disabled || isExporting) return;

    try {
      setIsExporting(true);
      setExportingFormat('Excel');
      onExportStart('Excel');

      // Validar que hay datos para exportar
      if (!data || data.length === 0) {
        throw new Error('No hay datos disponibles para exportar');
      }

      // Simular generación de Excel (en implementación real usaría xlsx o similar)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Crear contenido Excel simulado
      const excelContent = generateExcelContent();
      const blob = new Blob([excelContent], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onExportComplete('Excel', `${fileName}.xlsx`);
      
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      onExportError('Excel', error.message || 'Error al generar el archivo Excel');
      alert(`Error al exportar Excel: ${error.message}`);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  // Generar contenido PDF simulado
  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString();
    const dataCount = Array.isArray(data) ? data.length : Object.keys(data).length;
    
    return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
72 720 Td
(${reportTitle}) Tj
0 -20 Td
(Fecha de generación: ${currentDate}) Tj
0 -20 Td
(Número de registros: ${dataCount}) Tj
0 -20 Td
(Exportado desde Smart Condominium) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000271 00000 n 
0000000524 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
593
%%EOF`;
  };

  // Generar contenido Excel simulado
  const generateExcelContent = () => {
    const currentDate = new Date().toLocaleDateString();
    const dataCount = Array.isArray(data) ? data.length : Object.keys(data).length;
    
    // Contenido CSV simulado (compatible con Excel)
    let csvContent = `${reportTitle}\n`;
    csvContent += `Fecha de generación,${currentDate}\n`;
    csvContent += `Número de registros,${dataCount}\n`;
    csvContent += `Exportado desde,Smart Condominium\n\n`;
    
    // Agregar headers y datos si es array
    if (Array.isArray(data) && data.length > 0) {
      const headers = Object.keys(data[0]);
      csvContent += headers.join(',') + '\n';
      
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header] || '';
          // Escapar comillas y comas
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        });
        csvContent += values.join(',') + '\n';
      });
    }
    
    return csvContent;
  };

  return (
    <div className="export-buttons">
      <Button
        onClick={exportToPDF}
        disabled={disabled || isExporting}
        className={`export-btn pdf-btn ${isExporting && exportingFormat === 'PDF' ? 'loading' : ''}`}
      >
        {isExporting && exportingFormat === 'PDF' ? (
          <>
            <span className="export-spinner">⟳</span>
            Generando PDF...
          </>
        ) : (
          <>
            📄 Exportar PDF
          </>
        )}
      </Button>

      <Button
        onClick={exportToExcel}
        disabled={disabled || isExporting}
        className={`export-btn excel-btn ${isExporting && exportingFormat === 'Excel' ? 'loading' : ''}`}
      >
        {isExporting && exportingFormat === 'Excel' ? (
          <>
            <span className="export-spinner">⟳</span>
            Generando Excel...
          </>
        ) : (
          <>
            📊 Exportar Excel
          </>
        )}
      </Button>
    </div>
  );
};

export default ExportButtons;