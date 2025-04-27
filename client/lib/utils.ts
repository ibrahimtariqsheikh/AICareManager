import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import * as crypto from 'crypto';



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Any Min Price" : "Any Max Price";
  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `$${kValue}k+` : `<$${kValue}k`;
  }
  return isMin ? `$${value}+` : `<$${value}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value] // eslint-disable-line @typescript-eslint/no-unused-vars
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
};

export const createNewUserInDatabase = async (
  user: any,
  idToken: any,
  fetchWithBQ: any
) => {
 
  const createUserResponse = await fetchWithBQ({
    url: "/users",
    method: "POST",
    body: {
      cognitoId: user.userId,
      email: idToken?.payload?.email || "",
      fullName: idToken?.payload?.given_name || "",
      role: idToken?.payload?.role || "CLIENT",
    },
  });

  if (createUserResponse.error) {
    throw new Error("Failed to create user record");
  }

  return createUserResponse;
};

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'S7fDIbAS4BDuhreXPufDWPwJT8hsEaae';

export function decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = Buffer.from(textParts[1], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

   const placeholderImages = ["https://camo.githubusercontent.com/5a03084fafec21ac62b3746ddbc9f38c9a7ec1f8024be719178ce9a5cb3edebf/68747470733a2f2f6176617461722e6972616e2e6c696172612e72756e2f7075626c69632f626f793f757365726e616d653d53636f7474", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBzwZ-pkjd0Jmp-Z6iuxuueVArq8Sbz56pbEDDG3WdholeLBppYn-DgaEHt9sDxC1yqL0&usqp=CAU", "https://bundui-images.netlify.app/avatars/10.png", "https://avatar.iran.liara.run/public/61","https://avatar.iran.liara.run/public/68"]

export const getRandomPlaceholderImage = () => {
  return placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
}
