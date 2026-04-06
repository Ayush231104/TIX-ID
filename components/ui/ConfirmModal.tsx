'use client';

import { IoClose } from 'react-icons/io5';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose} 
    >
      <div 
        className="bg-white rounded-lg p-8 max-w-md w-full mx-auto shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-shade-900">{title}</h2>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-shade-900 hover:text-royal-blue-hover active:text-royal-blue-while-pressed text-2xl cursor-pointer transition-colors disabled:opacity-50"
          >
            <IoClose />
          </button>
        </div>
        
        <p className="text-shade-600 text-sm mb-8 leading-relaxed">
          {description}
        </p>
        
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="px-6 py-2.5 border border-shade-300 rounded-lg text-shade-900 hover:bg-shade-100 transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            disabled={isLoading} 
            className="px-6 py-2.5 bg-royal-blue text-sunshine-yellow font-bold rounded-lg hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed transition-all cursor-pointer disabled:opacity-50 min-w-[100px] flex justify-center"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}