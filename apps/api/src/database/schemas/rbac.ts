import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { User } from './user';
import { sql } from 'drizzle-orm';

export const Role = pgTable('role', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: text('role_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const Permission = pgTable('permission', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  permissionName: text('permission_name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const UserRole = pgTable(
  'user_role',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => User.id),
    roleId: uuid('role_id')
      .notNull()
      .references(() => Role.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  table => ({
    pk: primaryKey({
      columns: [table.userId, table.roleId],
    }),
  }),
);

export const RolePermission = pgTable(
  'role_permission',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => Role.id),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => Permission.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  table => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  }),
);
