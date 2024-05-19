import { useEffect, useRef } from 'react';

/**
 * Custom hook that detects clicks outside a specified element and triggers a handler function.
 *
 * @param {Function} handler - The function to be executed when a click outside the specified element is detected.
 * @param {boolean} [listenCapturing=true] - Flag indicating whether to listen for capturing phase events.
 * @return {Object} A ref object that holds a reference to the specified element.
 */
export function useDetectOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) handler();
      }

      document.addEventListener('click', handleClick, listenCapturing);

      return () =>
        document.removeEventListener('click', handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
