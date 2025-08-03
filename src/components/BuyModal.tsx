import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface BuyModalProps {
  asset: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
  onClose: () => void;
}

const BuyModal: React.FC<BuyModalProps> = ({ asset, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    try {
      // Demo simulation
      toast.success('Simulating purchase...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Demo purchase completed! Quantity: ${quantity}`);
      onClose();
    } catch (error) {
      toast.error('Demo purchase failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = asset.price * quantity;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Purchase Asset (Demo)</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {asset.image && (
              <img
                src={asset.image}
                alt={asset.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{asset.title}</h3>
              <p className="text-sm text-gray-600">Asset ID: {asset.id}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Price per token:</span>
                  <span>${asset.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total:</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> This is a demonstration purchase. No real transaction will occur.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? 'Processing...' : 'Demo Purchase'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;
