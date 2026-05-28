import { useState } from "react";
import Button from "./Button";

function Modal({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Close",
  isDangerous = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg flex flex-col max-h-[90vh] max-w-3xl w-full">
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {title}
          </h2>
        </div>

        <div className="overflow-y-auto flex-1 px-6 text-gray-600">
          {children}
        </div>

        <div className="flex gap-3 justify-end p-6 border-t mt-auto">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            {cancelText}
          </Button>

          {onConfirm && (
            <Button
              variant={isDangerous ? "danger" : "primary"}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}

export default Modal;