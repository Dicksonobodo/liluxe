// WhatsApp service integration
/**
 * Send order details via WhatsApp
 * Opens WhatsApp with pre-filled message to store owner
 */
export const sendWhatsAppOrder = (orderDetails) => {
  const { orderId, customerName, customerPhone, items, totalPrice } = orderDetails;

  // Format items list
  const itemsList = items
    .map((item, index) => 
      `${index + 1}. ${item.name}\n   Size: ${item.size}\n   Quantity: ${item.quantity}\n   Price: ₦${(item.price * item.quantity).toLocaleString('en-NG')}`
    )
    .join('\n\n');

  // Build message
  const message = `*NEW ORDER - LILUXE STORE*

*Order ID:* ${orderId}

*Customer Details:*
Name: ${customerName}
Phone: ${customerPhone}

*Items Ordered:*
${itemsList}

*Total Amount:* ₦${totalPrice.toLocaleString('en-NG')}

---
Order placed on ${new Date().toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}`;

  // Store owner's WhatsApp number (from your requirements)
  const storeWhatsApp = '2348052465801';

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp URL
  const whatsappURL = `https://wa.me/${storeWhatsApp}?text=${encodedMessage}`;

  // Open WhatsApp
  window.open(whatsappURL, '_blank');
};

/**
 * Format phone number to Nigerian format
 * Auto-prepends +234 and removes leading zero
 */
export const formatNigerianPhone = (phone) => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // Remove leading 234 if present
  if (cleaned.startsWith('234')) {
    cleaned = cleaned.substring(3);
  }

  // Remove leading 0 if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Add +234 prefix
  return `+234${cleaned}`;
};

/**
 * Validate Nigerian phone number
 */
export const isValidNigerianPhone = (phone) => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Should be 10 or 11 digits (with or without leading 0)
  // Or 13 digits with 234 prefix
  if (cleaned.length === 10 || cleaned.length === 11) {
    return true;
  }

  if (cleaned.length === 13 && cleaned.startsWith('234')) {
    return true;
  }

  return false;
};
