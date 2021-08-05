import { useState } from "react";

const useConfirm = () => {
  const [confirmState, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [callback, setCallback] = useState();
  const [param, setParam] = useState();
  const onCancel = () => {
    setConfirm(false);
  };
  const onConfirm = () => {
    if (callback) {
      callback(param);
    }
    setConfirm(false);
  };
  const showConfirm = (message) => ({callback,param}) => {
    setMessage(message);
    setParam(param);
    setCallback(()=>callback);
    setConfirm(true);
  };
  return { confirmState, message, onCancel, onConfirm, showConfirm };
};

export default useConfirm;
