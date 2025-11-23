import React from 'react';
import { Order } from '../types';
import { Trash2, FileDown } from 'lucide-react';

interface SpreadsheetProps {
  orders: Order[];
  onDelete: (id: string) => void;
  onExport: (order: Order) => void;
}

export const Spreadsheet: React.FC<SpreadsheetProps> = ({ orders, onDelete, onExport }) => {
  // Simple helper to format date to PT format DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      {/* Scrollable Container */}
      <div className="flex-1 overflow-auto relative">
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 shadow-sm bg-gray-50">
            <tr>
              <th className="w-12 border-b border-gray-200 p-3 text-center font-medium text-gray-500 text-xs uppercase tracking-wider">#</th>
              <th className="border-b border-gray-200 p-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider w-24">
                Data
              </th>
              <th className="border-b border-gray-200 p-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider w-24">
                Nº Pedido
              </th>
              <th className="border-b border-gray-200 p-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider w-32 lg:w-40">
                Fornecedor
              </th>
              <th className="border-b border-gray-200 p-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider min-w-[160px]">
                Material
              </th>
              <th className="border-b border-gray-200 p-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider w-32 lg:w-40">
                Cliente
              </th>
              <th className="border-b border-gray-200 p-3 text-left font-medium text-gray-500 text-xs uppercase tracking-wider w-28 lg:w-32">
                Comercial
              </th>
              <th className="w-24 border-b border-gray-200 p-3 text-center font-medium text-gray-500 text-xs uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-16 text-center text-gray-400 bg-white">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl opacity-20">📦</span>
                    <p>A lista de encomendas está vazia.</p>
                    <p className="text-xs">Clique em "Nova Encomenda" para começar.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  <td className="p-3 text-center text-gray-400 text-xs font-mono select-none">
                    {index + 1}
                  </td>
                  <td className="p-3 text-gray-700 font-medium whitespace-nowrap">
                    {formatDate(order.date)}
                  </td>
                  <td className="p-3 font-semibold text-gray-900">
                    #{order.orderNumber.toString().padStart(4, '0')}
                  </td>
                  <td className="p-3 text-gray-700 truncate max-w-[160px]">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 truncate max-w-full">
                      {order.supplier}
                    </span>
                  </td>
                   <td className="p-3 text-gray-700 max-w-[200px] md:max-w-[280px] break-words whitespace-normal">
                    {order.material}
                  </td>
                  <td className="p-3 text-gray-700 truncate max-w-[160px]">
                    {order.customer}
                  </td>
                  <td className="p-3 text-gray-700 truncate max-w-[130px]">
                    {order.commercial}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExport(order);
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50 focus:outline-none"
                        title="Exportar para PDF"
                      >
                        <FileDown size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(order.id);
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50 focus:outline-none"
                        title="Apagar encomenda"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {/* Fill empty space visually without adding rows if we have data */}
            {orders.length > 0 && orders.length < 10 && (
              <tr className="h-full">
                <td colSpan={8} className="bg-transparent"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};