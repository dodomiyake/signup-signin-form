document.addEventListener('DOMContentLoaded', function() {
    // Select all buttons with the attribute data-dismiss-target
    const dismissButtons = document.querySelectorAll('[data-dismiss-target]');
    
    dismissButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Get the target element to dismiss
        const target = document.querySelector(button.getAttribute('data-dismiss-target'));
        if (target) {
          target.remove(); // Remove the target element
        }
      });
    });
  });
  