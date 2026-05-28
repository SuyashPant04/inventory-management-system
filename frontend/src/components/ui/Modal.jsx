import { useState } from "react";
import Button from "./Button";

function Modal({ isOpen, title, children, onClose, onConfirm, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {title}
        </h2>

        <div className="mb-6 text-gray-600">
          {children}
        </div>

        <div className="flex gap-3 justify-end">
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
