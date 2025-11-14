
(function() {
    const projectId = document.currentScript.getAttribute('data-project-id');
    
    // Create the chat widget container
    const chatWidget = document.createElement('div');
    chatWidget.style.position = 'fixed';
    chatWidget.style.bottom = '20px';
    chatWidget.style.right = '20px';
    chatWidget.style.width = '300px';
    chatWidget.style.height = '400px';
    chatWidget.style.border = '1px solid #ccc';
    chatWidget.style.borderRadius = '10px';
    chatWidget.style.backgroundColor = '#fff';
    chatWidget.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    chatWidget.style.overflow = 'hidden';
    chatWidget.style.display = 'flex';
    chatWidget.style.flexDirection = 'column';

    // Create the header
    const header = document.createElement('div');
    header.style.padding = '10px';
    header.style.backgroundColor = '#f1f1f1';
    header.style.borderBottom = '1px solid #ccc';
    header.innerHTML = '<strong>Chat with us!</strong>';

    // Create the messages container
    const messages = document.createElement('div');
    messages.style.flex = '1';
    messages.style.padding = '10px';
    messages.style.overflowY = 'auto';

    // Create the input form
    const form = document.createElement('form');
    form.style.padding = '10px';
    form.style.borderTop = '1px solid #ccc';
    form.style.display = 'flex';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type a message...';
    input.style.flex = '1';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '5px';
    input.style.padding = '8px';

    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = 'Send';
    button.style.marginLeft = '10px';
    button.style.border = 'none';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.borderRadius = '5px';
    button.style.padding = '8px 12px';
    button.style.cursor = 'pointer';

    form.appendChild(input);
    form.appendChild(button);

    // Append all parts to the widget
    chatWidget.appendChild(header);
    chatWidget.appendChild(messages);
    chatWidget.appendChild(form);

    // Add the widget to the body
    document.body.appendChild(chatWidget);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const messageText = input.value.trim();
        if (messageText) {
            const messageEl = document.createElement('div');
            messageEl.textContent = messageText;
            messages.appendChild(messageEl);
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
        }
    });

})();
