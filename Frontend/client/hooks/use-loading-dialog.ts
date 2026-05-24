import { useState } from "react";

interface UseLoadingDialogOptions {
  message?: string;
}

export function useLoadingDialog(options?: UseLoadingDialogOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(options?.message || "กำลังประมวลผล...");

  const show = (customMessage?: string) => {
    if (customMessage) setMessage(customMessage);
    setIsOpen(true);
  };

  const hide = () => {
    setIsOpen(false);
  };

  const withLoading = async <T,>(
    promise: Promise<T>,
    customMessage?: string
  ): Promise<T> => {
    show(customMessage);
    try {
      return await promise;
    } finally {
      hide();
    }
  };

  return {
    isOpen,
    message,
    show,
    hide,
    withLoading,
  };
}
