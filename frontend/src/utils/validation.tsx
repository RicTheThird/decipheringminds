export const handleKeyDownOnlyNumeric = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, tab, enter, and escape
    if (
        event.key === 'Backspace' ||
        event.key === 'Enter' ||
        event.key === 'Escape'
    ) {
        return;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (
        event.ctrlKey &&
        (event.key === 'a' || event.key === 'c' || event.key === 'v' || event.key === 'x')
    ) {
        return;
    }

    // Ensure that it is a number and stop the key press
    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
    }
};

export const handleKeyDownNoNumeric = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, tab, enter, and escape
    if (
      event.key === 'Backspace' ||
      event.key === 'Tab' ||
      event.key === 'Enter' ||
      event.key === 'Escape'
    ) {
      return;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (
      event.ctrlKey &&
      (event.key === 'a' || event.key === 'c' || event.key === 'v' || event.key === 'x')
    ) {
      return;
    }

    // Prevent numeric input
    if (/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  };