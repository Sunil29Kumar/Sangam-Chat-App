import { toast } from 'sonner';

export const showToast = {
  loading : (msg)=>toast.loading(msg),
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast.info(msg),
  warning: (msg) => toast.warning(msg),
  // Khaas feature: Loading toasts ke liye promise handling
  promise: (promise, { loading, success, error ,style}) => 
    toast.promise(promise, { loading, success, error , style}),
};