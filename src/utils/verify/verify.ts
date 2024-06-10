export async function verifyCode(): Promise<string> {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
