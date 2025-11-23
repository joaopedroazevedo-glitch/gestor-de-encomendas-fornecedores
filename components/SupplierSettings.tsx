import React, { useState } from 'react';
import { Supplier, Commercial } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface SettingsProps {
  suppliers: Supplier[];
  onAddSupplier: (name: string) => void;
  onRemoveSupplier: (id: string) => void;
  commercials: Commercial[];
  onAddCommercial: (name: string) => void;
  onRemoveCommercial: (id: string) => void;
}

export const SupplierSettings: React.FC<SettingsProps> = ({ 
  suppliers, 
  onAddSupplier, 
  onRemoveSupplier,
  commercials,
  onAddCommercial,
  onRemoveCommercial,
}) => {
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newCommercialName, setNewCommercialName] = useState('');

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSupplierName.trim()) {
      onAddSupplier(newSupplierName.trim());
      setNewSupplierName('');
    }
  };

  const handleAddCommercial = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommercialName.trim()) {
      onAddCommercial(newCommercialName.trim());
      setNewCommercialName('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Section: Suppliers */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">Fornecedores</h4>
        <form onSubmit={handleAddSupplier} className="flex gap-2">
          <input
            type="text"
            value={newSupplierName}
            onChange={(e) => setNewSupplierName(e.target.value)}
            placeholder="Novo fornecedor..."
            className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
          />
          <Button type="submit" size="sm" icon={<Plus size={16} />}>
            Adicionar
          </Button>
        </form>

        <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
          <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 uppercase tracking-wider">
            Fornecedores Existentes ({suppliers.length})
          </div>
          <ul className="divide-y divide-gray-200 max-h-[150px] overflow-y-auto">
            {suppliers.length === 0 ? (
              <li className="p-4 text-center text-sm text-gray-500 italic">
                Nenhum fornecedor registado.
              </li>
            ) : (
              suppliers.map((supplier) => (
                <li key={supplier.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 group transition-colors">
                  <span className="text-sm text-gray-700 font-medium">{supplier.name}</span>
                  <button
                    onClick={() => onRemoveSupplier(supplier.id)}
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Section: Commercials */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
           Comerciais
        </h4>
        <form onSubmit={handleAddCommercial} className="flex gap-2">
          <input
            type="text"
            value={newCommercialName}
            onChange={(e) => setNewCommercialName(e.target.value)}
            placeholder="Novo comercial..."
            className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-shadow"
          />
          <Button type="submit" size="sm" icon={<Plus size={16} />}>
            Adicionar
          </Button>
        </form>

        <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
          <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 uppercase tracking-wider">
            Comerciais Existentes ({commercials.length})
          </div>
          <ul className="divide-y divide-gray-200 max-h-[150px] overflow-y-auto">
            {commercials.length === 0 ? (
              <li className="p-4 text-center text-sm text-gray-500 italic">
                Nenhum comercial registado.
              </li>
            ) : (
              commercials.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 group transition-colors">
                  <span className="text-sm text-gray-700 font-medium">{c.name}</span>
                  <button
                    onClick={() => onRemoveCommercial(c.id)}
                    className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                    title="Remover"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};