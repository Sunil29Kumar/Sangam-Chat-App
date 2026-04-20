import { toast } from 'sonner';
import React from 'react';

export const showToast = {
  loading: (msg: string) => toast.loading(msg),
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  info: (msg: string) => toast.info(msg),
  warning: (msg: string) => toast.warning(msg),
  
  // Promise handling fix
  promise: (
    promise: Promise<any>, 
    { loading, success, error, style }: { 
      loading: string; 
      success: string; 
      error: string; 
      style?: React.CSSProperties 
    }
  ) => toast.promise(promise, { loading, success, error, style }),
};