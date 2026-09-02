"use server";

import { verifyDiscountCode } from "@/lib/db/queries";

export async function checkDiscountAction(code: string) {
  return await verifyDiscountCode(code);
}
