import { motion } from "framer-motion";

const paymentMethods = [
  {
    name: "Visa",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="white" />
        <path d="M19.5 21.5L21.5 10.5H24.5L22.5 21.5H19.5Z" fill="#1A1F71" />
        <path d="M32.5 10.7C31.9 10.5 30.9 10.2 29.7 10.2C26.7 10.2 24.6 11.7 24.6 13.9C24.6 15.5 26 16.4 27.1 16.9C28.2 17.5 28.6 17.8 28.6 18.3C28.6 19 27.8 19.4 27 19.4C25.9 19.4 25.3 19.2 24.4 18.8L24 18.6L23.6 21.2C24.3 21.5 25.5 21.8 26.8 21.8C30 21.8 32 20.3 32 18C32 16.7 31.2 15.7 29.5 14.9C28.5 14.4 27.9 14 27.9 13.5C27.9 13 28.5 12.5 29.6 12.5C30.5 12.5 31.2 12.7 31.7 12.9L32 13L32.5 10.7Z" fill="#1A1F71" />
        <path d="M37.5 10.5H35.2C34.5 10.5 33.9 10.7 33.6 11.4L29 21.5H32.2L32.8 19.7H36.7L37.1 21.5H40L37.5 10.5ZM33.7 17.3C34 16.5 35.2 13.4 35.2 13.4L35.9 17.3H33.7Z" fill="#1A1F71" />
        <path d="M17.5 10.5L14.5 18L14.2 16.7C13.5 14.5 11.5 12 9.3 10.8L12 21.5H15.3L20.8 10.5H17.5Z" fill="#1A1F71" />
        <path d="M11.5 10.5H6.5L6.4 10.8C10.3 11.7 12.8 14 13.8 16.7L12.7 11.5C12.5 10.7 11.9 10.5 11.5 10.5Z" fill="#F9A533" />
      </svg>
    ),
  },
  {
    name: "Mastercard",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="white" />
        <circle cx="18" cy="16" r="9" fill="#EB001B" />
        <circle cx="30" cy="16" r="9" fill="#F79E1B" />
        <path d="M24 8.5C26.2 10.3 27.5 13 27.5 16C27.5 19 26.2 21.7 24 23.5C21.8 21.7 20.5 19 20.5 16C20.5 13 21.8 10.3 24 8.5Z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: "American Express",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="#006FCF" />
        <path d="M10 16L12 11H14L16 16L18 11H20L17 19H15L13 14L11 19H9L10 16Z" fill="white" />
        <path d="M21 11H27V13H23V14H26.5V16H23V17H27V19H21V11Z" fill="white" />
        <path d="M28 11H32L33.5 14L35 11H39L35.5 16L39 21H35L33.5 18L32 21H28L31.5 16L28 11Z" fill="white" />
      </svg>
    ),
  },
  {
    name: "PayPal",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="white" />
        <path d="M19.5 8H25.5C28.5 8 30 9.5 29.5 12C29 15.5 26.5 17 23.5 17H21.5L20.5 22H17L19.5 8Z" fill="#003087" />
        <path d="M22 10.5H24.5C26 10.5 26.5 11 26.5 12C26.5 13.5 25.5 14.5 24 14.5H22.5L22 10.5Z" fill="white" />
        <path d="M25.5 11H31.5C34.5 11 36 12.5 35.5 15C35 18.5 32.5 20 29.5 20H27.5L26.5 25H23L25.5 11Z" fill="#0070E0" />
        <path d="M28 13.5H30.5C32 13.5 32.5 14 32.5 15C32.5 16.5 31.5 17.5 30 17.5H28.5L28 13.5Z" fill="white" />
      </svg>
    ),
  },
  {
    name: "Apple Pay",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="black" />
        <path d="M15.5 10C15.2 10.5 14.6 10.9 14 10.9C13.9 10.2 14.2 9.5 14.5 9.1C14.9 8.6 15.5 8.2 16 8.2C16.1 8.9 15.8 9.5 15.5 10ZM16 11.1C15.1 11 14.4 11.6 14 11.6C13.6 11.6 13 11.1 12.3 11.1C11.4 11.2 10.6 11.7 10.1 12.5C9.2 14 9.8 16.3 10.7 17.5C11.1 18.1 11.6 18.8 12.3 18.8C13 18.8 13.2 18.4 14 18.4C14.8 18.4 15 18.8 15.7 18.8C16.4 18.8 16.9 18.1 17.3 17.5C17.8 16.8 18 16.1 18 16.1C18 16.1 16.5 15.5 16.5 13.7C16.5 12.2 17.7 11.5 17.7 11.5C17.1 10.5 16.1 10.4 15.7 10.4L16 11.1Z" fill="white" />
        <path d="M22 11H24.5C26.5 11 28 12.5 28 14.5C28 16.5 26.5 18 24.5 18H23.5V21H22V11ZM23.5 16.5H24.3C25.5 16.5 26.4 15.7 26.4 14.5C26.4 13.3 25.5 12.5 24.3 12.5H23.5V16.5Z" fill="white" />
        <path d="M31 14C31 12.9 31.7 12 32.8 12C33.4 12 33.9 12.3 34.2 12.7V12.1H35.6V18H34.2V17.4C33.9 17.8 33.4 18.1 32.8 18.1C31.7 18.1 31 17.2 31 16.1V14ZM32.5 16C32.5 16.6 32.9 17 33.5 17C34.1 17 34.5 16.6 34.5 16V14.1C34.5 13.5 34.1 13.1 33.5 13.1C32.9 13.1 32.5 13.5 32.5 14.1V16Z" fill="white" />
        <path d="M37 21L38.5 17.5L36 12.1H37.6L39.2 15.8L40.7 12.1H42.3L38.5 21H37Z" fill="white" />
      </svg>
    ),
  },
  {
    name: "Google Pay",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="white" />
        <path d="M22 14.5C22 13.4 22.4 12.5 23.2 11.8C22.5 11.2 21.5 10.8 20.3 10.8C18.5 10.8 17 12 16.4 12C15.8 12 14.4 10.9 13 10.9C10.9 10.9 8.6 12.6 8.6 16.2C8.6 18.3 9.4 20.5 10.5 21.9C11.4 23 12.2 24 13.4 24C14.5 24 15 23.3 16.4 23.3C17.8 23.3 18.2 24 19.4 24C20.6 24 21.4 23 22.2 22C23.1 20.9 23.5 19.8 23.5 19.7C23.5 19.7 21.9 19 21.9 17.2C21.9 15.6 23.2 14.9 23.2 14.9C22.5 13.8 21.4 13.7 21 13.7L22 14.5Z" fill="#3C4043" />
        <path d="M18.5 9.4C19.2 8.6 19.6 7.5 19.5 6.4C18.5 6.5 17.4 7.1 16.7 7.9C16.1 8.6 15.6 9.7 15.7 10.8C16.8 10.9 17.8 10.2 18.5 9.4Z" fill="#3C4043" />
        <path d="M32.3 15.1C32.3 13.4 31.1 12.3 29.4 12.3H26V21H27.7V17.9H29.4C31.1 17.9 32.3 16.8 32.3 15.1ZM27.7 13.7H29C29.9 13.7 30.5 14.2 30.5 15.1C30.5 16 29.9 16.5 29 16.5H27.7V13.7Z" fill="#4285F4" />
        <path d="M35.2 12.3C33.5 12.3 32.3 13.5 32.3 15.2V18.1C32.3 19.8 33.5 21 35.2 21C36.9 21 38.1 19.8 38.1 18.1V15.2C38.1 13.5 36.9 12.3 35.2 12.3ZM36.4 18.1C36.4 18.8 35.9 19.4 35.2 19.4C34.5 19.4 34 18.8 34 18.1V15.2C34 14.5 34.5 13.9 35.2 13.9C35.9 13.9 36.4 14.5 36.4 15.2V18.1Z" fill="#34A853" />
        <path d="M42.5 15.5L40.5 12.3H38.5L41.5 17V21H43.2V17L46.2 12.3H44.2L42.5 15.5Z" fill="#EA4335" />
      </svg>
    ),
  },
  {
    name: "UPI",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="white" />
        <path d="M12 10L16 22H14L13 19H9L8 22H6L10 10H12ZM12.5 17L11 12.5L9.5 17H12.5Z" fill="#097939" />
        <path d="M17 10H19V20H23V22H17V10Z" fill="#097939" />
        <path d="M24 10H26V22H24V10Z" fill="#097939" />
        <path d="M31.5 10C34.5 10 36 12 36 14.5C36 17 34.5 19 31.5 19H29V22H27V10H31.5ZM31.5 17C33 17 34 16 34 14.5C34 13 33 12 31.5 12H29V17H31.5Z" fill="#097939" />
        <path d="M40 10L44 22H42L41 19H37L36 22H34L38 10H40ZM40.5 17L39 12.5L37.5 17H40.5Z" fill="#ED752E" />
      </svg>
    ),
  },
  {
    name: "Net Banking",
    svg: (
      <svg viewBox="0 0 48 32" className="h-6 w-auto" fill="none">
        <rect width="48" height="32" rx="4" fill="white" />
        <rect x="8" y="8" width="32" height="16" rx="2" stroke="#333" strokeWidth="1.5" fill="none" />
        <path d="M12 12H14V20H12V12Z" fill="#333" />
        <path d="M16 12H24V14H18V15H23V17H18V18H24V20H16V12Z" fill="#333" />
        <path d="M26 12H30L32 16L34 12H38L34 20H32L28 12H30L32 17L26 12Z" fill="#333" />
      </svg>
    ),
  },
];

interface PaymentIconsProps {
  dark?: boolean;
}

export const PaymentIcons = ({ dark = false }: PaymentIconsProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
      <span className={`text-xs font-sans mr-1 ${dark ? "text-neutral-300" : "text-neutral-500"}`}>We accept:</span>
      <div className="flex gap-2 flex-wrap">
        {paymentMethods.map((payment, index) => (
          <motion.div
            key={payment.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.1, y: -2 }}
            className="bg-white rounded-md px-2 py-1.5 shadow-sm cursor-default border border-neutral-200 flex items-center justify-center min-w-[50px]"
            title={payment.name}
          >
            {payment.svg}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
