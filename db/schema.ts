import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at").notNull(),
  name: text("name").notNull(),
  company: text("company").notNull().default(""),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  city: text("city").notNull(),
  requestType: text("request_type").notNull(),
  product: text("product").notNull().default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  source: text("source").notNull().default("website"),
  ipHash: text("ip_hash").notNull(),
}, (table) => [
  index("idx_inquiries_created_at").on(table.createdAt),
  index("idx_inquiries_status_created_at").on(table.status, table.createdAt),
  index("idx_inquiries_ip_created_at").on(table.ipHash, table.createdAt),
]);
