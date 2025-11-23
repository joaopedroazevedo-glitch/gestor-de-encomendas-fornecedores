import React, { useState, useEffect, useMemo } from 'react';
import { Supplier, Commercial } from '../types';
import { Button } from './Button';

interface OrderFormProps {
  nextOrderNumber: number;
  suppliers: Supplier[];
  commercials: Commercial[];
  onSave: (
    data: { date: string; orderNumber: number; supplier: string; customer: string; material: string; serviceDescription: string; commercial: string }
  ) => void;
  onCancel: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ nextOrderNumber, suppliers, commercials, onSave, onCancel }) => {
  const [date, setDate] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [material, setMaterial] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [customer, setCustomer] = useState<string>('');
  const [commercial, setCommercial] = useState<string>('');

  // Sort suppliers alphabetically
  const sortedSuppliers = useMemo(() => {
    return [...suppliers].sort((a, b) => a.name.localeCompare(b.name));
  }, [suppliers]);

  // Sort commercials alphabetically
  const sortedCommercials = useMemo(() => {
    return [...commercials].sort((a, b) => a.name.localeCompare(b.name));
  }, [commercials]);

  // Set default date to today on mount and default selections
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
    
    if (sortedSuppliers.length > 0) {
      setSupplier(sortedSuppliers[0].name);
    }

    if (sortedCommercials.length > 0) {
      setCommercial(sortedCommercials[0].name);
    }
  }, [sortedSuppliers, sortedCommercials]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !customer || !supplier || !material || !commercial) return;

    onSave({
      date,
      orderNumber: nextOrderNumber,
      supplier,
      material,
      serviceDescription,
      customer,
      commercial
    });
  };

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Data</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Nº Pedido (Auto)</label>
          <input
            type="number"
            disabled
            value={nextOrderNumber}
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 shadow-sm cursor-not-allowed sm:text-sm font-mono"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">Fornecedor</label>
        {sortedSuppliers.length > 0 ? (
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {sortedSuppliers.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        ) : (
          <div className="text-sm text-red-600 p-2 border border-red-100 bg-red-50 rounded">
            Adicione fornecedores nas configurações.
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">Material / Serviço solicitado</label>
        <input
          type="text"
          required
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          placeholder="Descrição do material..."
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-gray-700">Descrição do serviço a realizar</label>
        <textarea
          rows={4}
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          placeholder="Descreva o serviço detalhadamente..."
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Cliente</label>
          <input
            type="text"
            required
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-700">Comercial</label>
          {sortedCommercials.length > 0 ? (
            <select
              value={commercial}
              onChange={(e) => setCommercial(e.target.value)}
              className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {sortedCommercials.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          ) : (
             <div className="text-sm text-red-600 p-2 border border-red-100 bg-red-50 rounded">
                Adicione comerciais nas configurações.
             </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="button"
          disabled={sortedSuppliers.length === 0 || !customer || !material || sortedCommercials.length === 0}
          onClick={handleSubmit}
        >
          Gravar
        </Button>
      </div>
    </form>
  );
};