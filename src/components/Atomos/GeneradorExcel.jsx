import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const ExcelGenerator = ({ empresas, fileName = "empresas_agenda" }) => {
  
  const generarExcel = async () => {
    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Sistema de Agenda Empresarial';
    workbook.created = new Date();
    
    // Añadir una hoja de cálculo
    const worksheet = workbook.addWorksheet('Empresas');
    
    // Definir estilos
    const headerStyle = {
      font: { bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F81BD' } },
      alignment: { vertical: 'middle', horizontal: 'center' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };
    
    const normalStyle = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };
    
    const dateStyle = {
      ...normalStyle,
      numFmt: 'dd/mm/yyyy hh:mm'
    };
    
    // Definir columnas
    worksheet.columns = [
      { header: 'Empresa', key: 'nombre', width: 25, style: normalStyle },
      { header: 'Dedicación', key: 'dedicacion', width: 20, style: normalStyle },
      { header: 'Contacto', key: 'contacto', width: 20, style: normalStyle },
      { header: 'Teléfono', key: 'telefono', width: 15, style: normalStyle },
      { header: 'Email', key: 'email', width: 25, style: normalStyle },
      { header: 'Tamaño', key: 'tamaño', width: 12, style: normalStyle },
      { header: 'Sistema Actual', key: 'sistema', width: 20, style: normalStyle },
      { header: 'Importancia', key: 'importancia', width: 12, style: normalStyle },
      { header: 'Última Visita', key: 'ultimaVisita', width: 20, style: dateStyle },
      { header: 'Próxima Visita', key: 'proximaVisita', width: 20, style: dateStyle },
      { header: 'Comportamiento de Compra', key: 'comportamiento', width: 25, style: normalStyle },
      { header: 'Desafíos', key: 'desafios', width: 25, style: normalStyle },
      { header: 'Puntos Críticos', key: 'puntosCriticos', width: 25, style: normalStyle },
      { header: 'Objetivos', key: 'objetivos', width: 25, style: normalStyle }
    ];
    
    // Aplicar estilo a los encabezados
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });
    
    // Añadir datos
    empresas.forEach(empresa => {
      worksheet.addRow({
        nombre: empresa.nombreEmpresa || '',
        dedicacion: empresa.dedicacionEmpresa || '',
        contacto: empresa.contactoEmpresa || '',
        telefono: empresa.telefonoEmpresa || '',
        email: empresa.correoEmpresa || '',
        tamaño: empresa.tamañoEmpresa || '',
        sistema: empresa.sistemaManjado || '',
        importancia: empresa.importanciaVisita || '',
        ultimaVisita: empresa.visita ? new Date(empresa.visita) : '',
        proximaVisita: empresa.proximaVisita ? new Date(empresa.proximaVisita) : '',
        comportamiento: empresa.comportamientoCompra || '',
        desafios: empresa.desafiosEmpresa || '',
        puntosCriticos: empresa.puntosCriticos || '',
        objetivos: empresa.objetivosEmpresa || ''
      });
    });
    
    // Ajustar altura de filas
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.height = 20;
    });
    
    // Añadir filtros
    worksheet.autoFilter = {
      from: 'A1',
      to: `${String.fromCharCode(65 + worksheet.columns.length - 1)}1`
    };
    
    // Añadir título
    worksheet.insertRow(1, ['Reporte de Empresas - Agenda']);
    worksheet.mergeCells('A1:N1');
    worksheet.getCell('A1').style = {
      font: { bold: true, size: 16, color: { argb: 'FF4F81BD' } },
      alignment: { vertical: 'middle', horizontal: 'center' }
    };
    worksheet.getRow(1).height = 25;
    
    // Añadir fecha de generación
    const lastRow = worksheet.rowCount + 2;
    worksheet.getCell(`A${lastRow}`).value = `Reporte generado el: ${new Date().toLocaleString('es-GT')}`;
    worksheet.mergeCells(`A${lastRow}:N${lastRow}`);
    worksheet.getCell(`A${lastRow}`).style = {
      font: { italic: true },
      alignment: { horizontal: 'right' }
    };
    
    // Generar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <button
      onClick={generarExcel}
      className="bg-gradient-to-r from-green-600 to-green-700 hover:scale-105 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition duration-200 flex items-center"
      title="Exportar a Excel"
    >
      <i className="fas fa-file-excel mr-2"></i>
      Exportar Excel
    </button>
  );
};