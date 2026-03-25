import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Status } from '../types';

interface DropdownProps {
  options: Status[];
  selected: Status;
  onChange: (value: Status) => void;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selected,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    const findScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
      if (!element) return null;
      const style = getComputedStyle(element);
      if (style.overflow === 'auto' || style.overflow === 'scroll' || style.overflowY === 'auto' || style.overflowY === 'scroll') {
        return element;
      }
      return findScrollableParent(element.parentElement);
    };

    const scrollable = findScrollableParent(ref.current);
    const handleScroll = () => setIsOpen(false);
    if (scrollable) {
      scrollable.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (scrollable) {
        scrollable.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        className="relative w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-colors duration-200"
        onClick={handleButtonClick}
      >
        <span className="block truncate text-gray-900">{selected}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {isOpen && createPortal(
        <div
          className="fixed z-[9999] bg-white shadow-2xl max-h-60 rounded-lg py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto border border-gray-200"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            minWidth: '200px'
          }}
        >
          {options.map((option) => (
            <button
              key={option}
              className={`cursor-pointer select-none relative py-2.5 pl-4 pr-9 w-full text-left hover:bg-indigo-50 transition-colors duration-150 ${
                selected === option ? 'bg-indigo-100 text-indigo-900 font-medium' : 'text-gray-700'
              }`}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              <span className="block truncate">{option}</span>
              {selected === option && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};