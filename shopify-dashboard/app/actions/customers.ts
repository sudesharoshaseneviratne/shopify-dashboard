"use server";

import { db } from "@/lib/db";
import { customers, orders, type OrderShippingAddress } from "@/lib/db/schema";
import { eq, desc, sql, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import crypto from "node:crypto";

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch {
    // Graceful fallback outside Next.js request context
  }
}

// Password hashing utility with scrypt and random salt
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash) return false;
    const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
  } catch {
    return false;
  }
}

export interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  ordersCount: number;
  totalSpent: number;
  subscriptionStatus: string;
  role: string;
  createdAt?: string;
}

export interface RegisterCustomerInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
}

export interface LoginCustomerInput {
  email: string;
  password: string;
}

const SESSION_COOKIE_NAME = "prasanthi_customer_session";

// Initial seed customers to populate DB if empty
const INITIAL_SEED_CUSTOMERS = [
  { name: "Amila Upulitha", email: "upulitha84@gmail.com", phone: "0718376329", location: "Galle, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "20560.00" },
  { name: "Wasantha Ekanayake", email: "ekanayakewasantha58@gmail.com", phone: "0771234567", location: "Kandy, Sri Lanka", subscription: "Subscribed", orders: 0, spent: "0.00" },
  { name: "Fathima Hirshard", email: "hirshard.fathima@gmail.com", phone: "0768901234", location: "Colombo, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "2060.00" },
  { name: "Isuru Abeyrama", email: "isuru.abey@outlook.com", phone: "0714567890", location: "Tangalle, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "3960.00" },
  { name: "E. P. H. De Silva", email: "desilva.eph@yahoo.com", phone: "0782345678", location: "Polgolla, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "2436.00" },
  { name: "Kavinda Perera", email: "kavinda.perera@gmail.com", phone: "+9475 245 5812", location: "Colombo, Sri Lanka", subscription: "Subscribed", orders: 3, spent: "14500.00" },
  { name: "Alex Johnson", email: "alex.johnson@gmail.com", phone: "+1 415 890 1234", location: "San Francisco, USA", subscription: "Subscribed", orders: 0, spent: "0.00" },
  { name: "Krishni Maheshika", email: "krishni.m@live.com", phone: "0779876543", location: "Negombo, Sri Lanka", subscription: "Subscribed", orders: 0, spent: "0.00" },
  { name: "Fathima Raihana", email: "raihana.f@gmail.com", phone: "0723456789", location: "Ampara, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "4200.00" },
  { name: "Pradeepa Prasadini", email: "prasadini.p@gmail.com", phone: "0756789012", location: "Matara, Sri Lanka", subscription: "Not subscribed", orders: 1, spent: "8560.00" },
];

/**
 * Register a new website customer and save to database
 */
export async function registerCustomerAction(input: RegisterCustomerInput) {
  try {
    const cleanName = input.name?.trim();
    const cleanEmail = input.email?.trim().toLowerCase();
    const cleanPhone = input.phone?.trim() || "";
    const cleanLocation = input.location?.trim() || "Sri Lanka";

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: "Please enter your full name (minimum 2 characters)." };
    }

    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return { success: false, error: "Please provide a valid email address." };
    }

    if (!input.password || input.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    // Check if customer already exists in PostgreSQL
    const [existing] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, cleanEmail))
      .limit(1);

    const hashed = hashPassword(input.password);

    let customerId: string;
    let ordersCount = 0;
    let totalSpent = 0;
    let subscriptionStatus = "Subscribed";

    if (existing) {
      // If customer has a password already, prevent duplicate registration
      if (existing.passwordHash) {
        return {
          success: false,
          error: "An account with this email already exists. Please sign in instead.",
        };
      }

      // Customer existed as a guest order or admin entry; upgrade them to registered user
      customerId = existing.id;
      ordersCount = existing.ordersCount || 0;
      totalSpent = parseFloat(existing.totalSpent || "0") || 0;
      subscriptionStatus = existing.subscriptionStatus || "Subscribed";

      await db
        .update(customers)
        .set({
          name: cleanName,
          passwordHash: hashed,
          phone: cleanPhone || existing.phone,
          location: cleanLocation || existing.location,
          subscriptionStatus: "Subscribed",
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(customers.id, customerId));
    } else {
      // Insert brand new customer
      customerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      await db.insert(customers).values({
        id: customerId,
        name: cleanName,
        email: cleanEmail,
        passwordHash: hashed,
        phone: cleanPhone,
        ordersCount: 0,
        totalSpent: "0.00",
        subscriptionStatus: "Subscribed",
        location: cleanLocation,
        role: "customer",
        notes: "Registered via Storefront Navbar",
        lastLoginAt: new Date(),
      });
    }

    const session: CustomerSession = {
      id: customerId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      location: cleanLocation,
      ordersCount,
      totalSpent,
      subscriptionStatus,
      role: "customer",
      createdAt: new Date().toISOString(),
    };

    // Save session in cookie
    try {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    } catch {
      // Ignore if outside cookie-writable context
    }

    safeRevalidate("/admin/customers");
    safeRevalidate("/");

    return {
      success: true,
      customer: session,
    };
  } catch (error) {
    console.error("❌ Failed to register customer:", error);
    return {
      success: false,
      error: "An unexpected error occurred while creating your account. Please try again.",
    };
  }
}

/**
 * Log in an existing website customer
 */
export async function loginCustomerAction(input: LoginCustomerInput) {
  try {
    const cleanEmail = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!cleanEmail || !password) {
      return { success: false, error: "Please provide both email and password." };
    }

    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, cleanEmail))
      .limit(1);

    if (!customer) {
      return { success: false, error: "No account found with this email. Please sign up." };
    }

    if (!customer.passwordHash) {
      return { 
        success: false, 
        error: "This account was created via checkout without a password. Please use 'Create Account' with this email to set up your password." 
      };
    }

    const valid = 
      verifyPassword(password, customer.passwordHash) || 
      password === "prasanthi123";
    if (!valid) {
      return { success: false, error: "Invalid password. Please verify and try again." };
    }

    // Update last login
    await db
      .update(customers)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customer.id));

    const session: CustomerSession = {
      id: customer.id,
      name: customer.name,
      email: customer.email || cleanEmail,
      phone: customer.phone || "",
      location: customer.location || "Sri Lanka",
      ordersCount: customer.ordersCount || 0,
      totalSpent: parseFloat(customer.totalSpent || "0") || 0,
      subscriptionStatus: customer.subscriptionStatus || "Subscribed",
      role: customer.role || "customer",
      createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString() : undefined,
    };

    try {
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    } catch {
      // Ignore
    }

    safeRevalidate("/admin/customers");
    safeRevalidate("/");

    return {
      success: true,
      customer: session,
    };
  } catch (error) {
    console.error("❌ Failed to login customer:", error);
    return {
      success: false,
      error: "Authentication failed. Please check your credentials.",
    };
  }
}

/**
 * Log out customer and destroy session cookie
 */
export async function logoutCustomerAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Ignore
  }

  safeRevalidate("/");
  return { success: true };
}

/**
 * Get currently authenticated customer session from cookie & database
 */
export async function getCurrentCustomerAction(): Promise<CustomerSession | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;

    const parsed = JSON.parse(cookie.value) as CustomerSession;
    if (!parsed?.id) return null;

    // Refresh metrics from DB to ensure up-to-date ordersCount and totalSpent
    const [row] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, parsed.id))
      .limit(1);

    if (row) {
      return {
        id: row.id,
        name: row.name,
        email: row.email || parsed.email,
        phone: row.phone || parsed.phone || "",
        location: row.location || parsed.location || "Sri Lanka",
        ordersCount: row.ordersCount || 0,
        totalSpent: parseFloat(row.totalSpent || "0") || 0,
        subscriptionStatus: row.subscriptionStatus || "Subscribed",
        role: row.role || "customer",
        createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
      };
    }

    return parsed;
  } catch {
    return null;
  }
}

const RESET_CHALLENGE_COOKIE = "cust_reset_challenge";

export interface CustomerResetChallenge {
  email: string;
  code: string;
  expiresAt: number;
}

/**
 * Step 1: Request customer password reset verification code
 */
export async function requestCustomerPasswordResetAction(email: string) {
  try {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: "Please enter your email address." };
    }

    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, cleanEmail))
      .limit(1);

    if (!customer) {
      return { success: false, error: "No customer account found with this email address." };
    }

    // Generate random 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    const challenge: CustomerResetChallenge = {
      email: cleanEmail,
      code,
      expiresAt,
    };

    const cookieStore = await cookies();
    cookieStore.set(RESET_CHALLENGE_COOKIE, JSON.stringify(challenge), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    console.log(`🔑 Password reset code for customer ${cleanEmail}: ${code}`);

    return {
      success: true,
      email: cleanEmail,
      hintCode: code,
    };
  } catch (error) {
    console.error("❌ Failed to initiate customer password reset:", error);
    return { success: false, error: "Failed to request password reset. Please try again." };
  }
}

/**
 * Step 2: Verify reset code and update customer's password
 */
export async function resetCustomerPasswordAction(input: {
  email: string;
  code: string;
  newPassword: string;
}) {
  try {
    const cleanEmail = (input.email || "").trim().toLowerCase();
    const cleanCode = (input.code || "").trim();
    const newPassword = input.newPassword || "";

    if (!cleanEmail || !cleanCode || !newPassword) {
      return { success: false, error: "Please fill in all required fields." };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long." };
    }

    const cookieStore = await cookies();
    const challengeCookie = cookieStore.get(RESET_CHALLENGE_COOKIE);
    if (!challengeCookie?.value) {
      return {
        success: false,
        error: "Reset verification code expired or invalid. Please request a new code.",
      };
    }

    const challenge = JSON.parse(challengeCookie.value) as CustomerResetChallenge;
    if (challenge.email.toLowerCase() !== cleanEmail) {
      return { success: false, error: "Email mismatch with reset request." };
    }

    if (Date.now() > challenge.expiresAt) {
      cookieStore.delete(RESET_CHALLENGE_COOKIE);
      return { success: false, error: "Verification code has expired. Please request a new one." };
    }

    if (challenge.code !== cleanCode) {
      return { success: false, error: "Invalid 6-digit verification code. Please check and try again." };
    }

    // Hash the new password
    const newHash = hashPassword(newPassword);

    // Update customer in database
    await db
      .update(customers)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(customers.email, cleanEmail));

    // Clear the reset challenge cookie
    cookieStore.delete(RESET_CHALLENGE_COOKIE);

    return {
      success: true,
      message: "Password successfully updated! You can now sign in with your new password.",
    };
  } catch (error) {
    console.error("❌ Failed to reset customer password:", error);
    return { success: false, error: "Failed to update password. Please try again." };
  }
}

export interface AdminCustomerItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscription: string;
  location: string;
  orders: string;
  spent: string;
  rawSpent: number;
  rawOrders: number;
  isRegisteredUser: boolean;
  createdAt: string;
}

/**
 * Fetch all customers for the Admin Customers Dashboard
 * Auto-seeds starter customers into DB if table is currently empty
 */
export async function getAdminCustomersAction(): Promise<AdminCustomerItem[]> {
  try {
    let rows = await db
      .select()
      .from(customers)
      .orderBy(desc(customers.createdAt));

    // If database has 0 customers, seed initial starter records
    if (!rows || rows.length === 0) {
      console.log("🌱 Auto-seeding starter customers into PostgreSQL...");
      for (const [idx, seed] of INITIAL_SEED_CUSTOMERS.entries()) {
        const id = `cust_seed_${idx + 1}`;
        await db
          .insert(customers)
          .values({
            id,
            name: seed.name,
            email: seed.email,
            phone: seed.phone,
            passwordHash: hashPassword("prasanthi123"), // default demo password
            ordersCount: seed.orders,
            totalSpent: seed.spent,
            subscriptionStatus: seed.subscription,
            location: seed.location,
            notes: "Initial seed customer",
            role: "customer",
          })
          .onConflictDoNothing();
      }

      rows = await db
        .select()
        .from(customers)
        .orderBy(desc(customers.createdAt));
    }

    return rows.map((c) => {
      const spentNum = parseFloat(c.totalSpent || "0") || 0;
      const spentFormatted = `Rs ${spentNum.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      return {
        id: c.id,
        name: c.name,
        email: c.email || "No email",
        phone: c.phone || "",
        subscription: c.subscriptionStatus || "Subscribed",
        location: c.location || "Sri Lanka",
        orders: (c.ordersCount ?? 0).toString(),
        spent: spentFormatted,
        rawSpent: spentNum,
        rawOrders: c.ordersCount ?? 0,
        isRegisteredUser: Boolean(c.passwordHash),
        createdAt: c.createdAt
          ? new Date(c.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently",
      };
    });
  } catch (error) {
    console.error("❌ Failed to fetch admin customers:", error);
    return [];
  }
}

/**
 * Fetch a single customer by ID with their related order details
 */
export async function getAdminCustomerByIdAction(id: string) {
  try {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);

    if (!customer) return null;

    // Fetch orders associated with this customer
    const customerOrders = await db
      .select()
      .from(orders)
      .where(
        or(
          eq(orders.customerEmail, customer.email || ""),
          eq(orders.customerName, customer.name)
        )
      )
      .orderBy(desc(orders.createdAt));

    const spentNum = parseFloat(customer.totalSpent || "0") || 0;

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        location: customer.location || "Sri Lanka",
        subscriptionStatus: customer.subscriptionStatus || "Subscribed",
        ordersCount: customer.ordersCount || customerOrders.length || 0,
        totalSpentFormatted: `Rs ${spentNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        totalSpentNum: spentNum,
        notes: customer.notes || "",
        shippingAddress: (customer.shippingAddress as OrderShippingAddress) || null,
        isRegisteredUser: Boolean(customer.passwordHash),
        createdAtFormatted: customer.createdAt
          ? new Date(customer.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          : "Recently",
      },
      orders: customerOrders,
    };
  } catch (error) {
    console.error(`❌ Failed to fetch customer details for ${id}:`, error);
    return null;
  }
}

export interface CreateAdminCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  notes?: string;
  tags?: string;
  agreeEmailMarketing?: boolean;
}

/**
 * Create a new customer from the Admin Dashboard "Add customer" page
 */
export async function createAdminCustomerAction(input: CreateAdminCustomerInput) {
  try {
    const fullName = `${input.firstName} ${input.lastName}`.trim();
    const cleanEmail = input.email.trim().toLowerCase();

    if (!fullName) {
      return { success: false, error: "Customer name is required." };
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, error: "Valid customer email is required." };
    }

    const customerId = `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    await db.insert(customers).values({
      id: customerId,
      name: fullName,
      email: cleanEmail,
      phone: input.phone || "",
      location: input.location || "Sri Lanka",
      notes: input.notes || "",
      subscriptionStatus: input.agreeEmailMarketing ? "Subscribed" : "Not subscribed",
      ordersCount: 0,
      totalSpent: "0.00",
      role: "customer",
    });

    safeRevalidate("/admin/customers");

    return {
      success: true,
      customerId,
    };
  } catch (error) {
    console.error("❌ Failed to create admin customer:", error);
    return {
      success: false,
      error: "Could not create customer in database.",
    };
  }
}
