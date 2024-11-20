import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const notify = {
  success: (message: string, options = {}) =>
    toast.success(message, { toastId: uuidv4(), ...options }),
  error: (message: string, options = {}) =>
    toast.error(message, { toastId: uuidv4(), ...options }),
};

export default notify;