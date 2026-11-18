import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export function FloatingWhatsApp({ whatsappNumber }: FloatingWhatsAppProps) {
  const cleanNumber = (whatsappNumber || '917879733808').replace(/\D/g, '');
  const href = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    'Hello META FLUX, I would like to discuss digital marketing services.'
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with META FLUX on WhatsApp"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 bg-[#7651D9] hover:bg-[#623EC4] text-white h-12 w-12 sm:w-auto sm:px-4 rounded-full shadow-lg border border-white/15 justify-center transition-transform duration-150 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7651D9] focus-visible:ring-offset-2"
    >
      <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline text-xs font-semibold whitespace-nowrap">
        WhatsApp Us
      </span>
    </a>
  );
}
