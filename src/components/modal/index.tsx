"use client";

import { createContext, ReactNode, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";

type ModalContextType = {
  isOpen?: boolean;
  onClose: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error(
      "Modal compound components must be used within <Modal.Root>"
    );
  }
  return context;
};

type RootProps = {
  children: ReactNode;
  isOpen?: boolean;
  onClose: () => void;
};

const Root = ({ children, isOpen, onClose }: RootProps) => {
  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-40 outline-none focus:outline-none bg-neutral-800 bg-opacity-70">
        <div className="relative w-full lg:w-3/6 my-6 mx-auto lg:max-w-xl h-full lg:h-auto">
          <div className="h-full lg:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-black outline-none focus:outline-none">
            {children}
          </div>
        </div>
      </div>
    </ModalContext.Provider>
  );
};

type HeaderProps = {
  children: ReactNode;
};
const Header = ({ children }: HeaderProps) => {
  const { onClose } = useModalContext();

  return (
    <div className="flex items-center justify-between p-10 rounded-t">
      {children}
      <button
        onClick={onClose}
        className="p-1 ml-auto border-0 text-white hover:opacity-70 transition-all"
      >
        <AiOutlineClose size={20} />
      </button>
    </div>
  );
};

type BodyProps = {
  children: ReactNode;
};

const Body = ({ children }: BodyProps) => {
  return <div className="relative p-10">{children}</div>;
};

type FooterProps = {
  children: ReactNode;
};

const Footer = ({ children }: FooterProps) => {
  return <div className="flex flex-col gap-2 p-10">{children}</div>;
};

const Modal = { Root, Header, Body, Footer };
export default Modal;
