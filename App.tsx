import React, { useState, useEffect, useMemo } from 'react';
import { Order, Supplier, Commercial } from './types';
import { Spreadsheet } from './components/Spreadsheet';
import { Modal } from './components/Modal';
import { OrderForm } from './components/OrderForm';
import { SupplierSettings } from './components/SupplierSettings';
import { Button } from './components/Button';
import { Plus, Settings, Search, AlertTriangle, Package } from 'lucide-react';
import { jsPDF } from "jspdf";

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Anjo & Carpinteiro' },
  { id: '2', name: 'Empaco' },
  { id: '3', name: 'Portuense' },
  { id: '4', name: 'Bofil' },
  { id: '5', name: 'Bofitel' },
  { id: '6', name: 'J. Costa Carvalho (Jaime)' },
  { id: '7', name: 'Socorte' }
];

const INITIAL_COMMERCIALS: Commercial[] = [
  { id: '1', name: 'Fátima' },
  { id: '2', name: 'Cristiana' },
  { id: '3', name: 'Isabel' },
  { id: '4', name: 'Luis' },
  { id: '5', name: 'Carlos' },
  { id: '6', name: 'Marisa' },
  { id: '7', name: 'João' },
  { id: '8', name: 'Jorge' },
  { id: '9', name: 'Ruben' },
  { id: '10', name: 'Antonio Couraceiro' }
];

const App: React.FC = () => {
  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [commercials, setCommercials] = useState<Commercial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Delete Confirmation State
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Load Data from LocalStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('app_orders');
    const storedSuppliers = localStorage.getItem('app_suppliers');
    const storedCommercials = localStorage.getItem('app_commercials');

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    if (storedSuppliers) {
      setSuppliers(JSON.parse(storedSuppliers));
    } else {
      setSuppliers(INITIAL_SUPPLIERS);
    }

    if (storedCommercials) {
      setCommercials(JSON.parse(storedCommercials));
    } else {
      setCommercials(INITIAL_COMMERCIALS);
    }
  }, []);

  // Save Data to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('app_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('app_commercials', JSON.stringify(commercials));
  }, [commercials]);

  // Handlers
  const handleAddOrder = (orderData: any) => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      ...orderData
    };
    setOrders([newOrder, ...orders]);
    setIsOrderModalOpen(false);
  };

  const handleDeleteOrder = (id: string) => {
    setOrderToDelete(id);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      // Filter out the deleted item
      const remaining = orders.filter(o => o.id !== orderToDelete);
      
      // Sort by orderNumber ascending to re-sequence correctly (preserve relative history)
      const sortedAsc = [...remaining].sort((a, b) => a.orderNumber - b.orderNumber);
      
      // Renumber 1 to N
      const renumbered = sortedAsc.map((item, index) => ({
        ...item,
        orderNumber: index + 1
      }));

      // Restore descending order (Newest first) to match handleAddOrder behavior
      setOrders(renumbered.reverse());
      setOrderToDelete(null);
    }
  };

  const handleExportOrder = (order: Order) => {
    const doc = new jsPDF();

    // --- Order Number Section ---
    // Y = 80
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Encomenda Nº", 20, 80);
    doc.text(`${order.orderNumber}`, 60, 80);

    // --- Material Header ---
    // Y = 120 (Moved down from 100)
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Material/Serviço Solicitado:", 20, 120);

    // --- Content Section (Dynamic Height) ---
    let cursorY = 130; // Start content at 130
    const maxWidth = 170;
    const lineHeight = 6;

    // 1. Print Material
    const splitMaterial = doc.splitTextToSize(order.material, maxWidth);
    doc.text(splitMaterial, 20, cursorY);
    cursorY += splitMaterial.length * lineHeight;

    // 2. Print Service Description (if exists)
    if (order.serviceDescription && order.serviceDescription.trim() !== "") {
      cursorY += 6; // Add a small gap before service description
      
      doc.setFont("helvetica", "bold");
      doc.text("Descrição do serviço a realizar:", 20, cursorY);
      
      cursorY += 6; // New line
      doc.setFont("helvetica", "normal");
      
      const splitService = doc.splitTextToSize(order.serviceDescription, maxWidth);
      doc.text(splitService, 20, cursorY);
      cursorY += splitService.length * lineHeight;
    }

    // --- Draw Box ---
    // Box starts above Material text content (130 - 5 = 125)
    // Box ends just below the content text
    const boxTop = 125; 
    const boxBottom = cursorY + 5; // Add padding below text
    const boxHeight = boxBottom - boxTop;

    if (boxHeight > 0) {
      doc.setDrawColor(0); 
      doc.rect(18, boxTop, 174, boxHeight);
    }

    // --- Date Section (Positioned relative to content) ---
    // Keep date at bottom (250) unless content pushes it further
    const minDateY = 250; 
    const dateY = Math.max(minDateY, cursorY + 20);

    // --- Date Output ---
    doc.setFont("helvetica", "normal");
    doc.text("Data:", 20, dateY);
    doc.text(new Date(order.date).toLocaleDateString('pt-PT'), 55, dateY);

    // --- Comercial Section ---
    const commercialY = dateY + 10;
    doc.text("Comercial:", 20, commercialY);
    doc.text(order.commercial, 55, commercialY);

    // --- OEKO-TEX Note ---
    if (commercialY + 20 < 285) {
        const noteY = commercialY + 20;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text('Todos os produtos devem ser certificados "OEKO-TEX"', 20, noteY);
    }

    // --- Footer ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Nastrotex - Nota de Encomenda - docint112026", 105, 285, { align: "center" });

    // Save
    doc.save(`${order.orderNumber}_${order.date}.pdf`);
  };

  const handleAddSupplier = (name: string) => {
    const newSupplier: Supplier = {
      id: crypto.randomUUID(),
      name
    };
    setSuppliers([...suppliers, newSupplier]);
  };

  const handleRemoveSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const handleAddCommercial = (name: string) => {
    const newCommercial: Commercial = {
      id: crypto.randomUUID(),
      name
    };
    setCommercials([...commercials, newCommercial]);
  };

  const handleRemoveCommercial = (id: string) => {
    setCommercials(commercials.filter(c => c.id !== id));
  };

  // Calculate next order number automatically
  const nextOrderNumber = useMemo(() => {
    if (orders.length === 0) return 1;
    const maxOrder = Math.max(...orders.map(o => o.orderNumber));
    return maxOrder + 1;
  }, [orders]);

  // Filter orders based on search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.serviceDescription && order.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber.toString().includes(searchQuery)
    );
  }, [orders, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header - Clean & Minimalist */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-sm">
              <Package size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Gestor de Encomendas
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 transition-all"
              />
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-1"></div>

            <Button 
              variant="outline" 
              onClick={() => setIsSettingsModalOpen(true)}
              title="Configurações"
              className="!p-2.5 border-gray-200 hover:bg-gray-50"
            >
              <Settings size={18} className="text-gray-600" />
            </Button>
            
            <Button 
              variant="primary" 
              onClick={() => setIsOrderModalOpen(true)} 
              icon={<Plus size={18} />}
              className="shadow-sm hover:shadow bg-blue-600 hover:bg-blue-700 border-transparent"
            >
              Nova Encomenda
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-0">
        
        {/* Stats / Info Bar */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <div>
            Total: <strong className="text-gray-900">{filteredOrders.length}</strong> encomendas
          </div>
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
            Próximo Nº: <span className="font-mono font-bold">#{nextOrderNumber}</span>
          </div>
        </div>

        {/* Spreadsheet Component */}
        <Spreadsheet 
          orders={filteredOrders} 
          onDelete={handleDeleteOrder}
          onExport={handleExportOrder}
        />
      </main>

      {/* Modals */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Nova Encomenda"
      >
        <OrderForm 
          nextOrderNumber={nextOrderNumber}
          suppliers={suppliers}
          commercials={commercials}
          onSave={handleAddOrder}
          onCancel={() => setIsOrderModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Configurações"
      >
        <SupplierSettings 
          suppliers={suppliers}
          onAddSupplier={handleAddSupplier}
          onRemoveSupplier={handleRemoveSupplier}
          commercials={commercials}
          onAddCommercial={handleAddCommercial}
          onRemoveCommercial={handleRemoveCommercial}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Apagar Encomenda?</h3>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              Tem a certeza que deseja apagar esta encomenda? Os números das encomendas seguintes serão reajustados.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setOrderToDelete(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Apagar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;