# REVERT TODO — Restore Original Codebase

## Phase 1: Auth & OTP Revert
- [ ] `prisma/schema.prisma` — Remove OTP fields from User model
- [ ] `src/lib/email.ts` — Revert to minimal stub (no Resend, no templates)
- [ ] `src/lib/auth.ts` — Revert authorize to direct email+password (no OTP checks)
- [ ] `src/lib/actions/auth.actions.ts` — Revert to simple register + direct login

## Phase 2: Auth Pages Revert
- [ ] `src/app/(auth)/login/page.tsx` — Direct signIn, no OTP redirect
- [ ] `src/app/(auth)/register/page.tsx` — Simple register, no session token auto-login
- [ ] `src/app/(auth)/forgot-password/page.tsx` — Simple placeholder page
- [ ] `src/app/(auth)/verify-login/page.tsx` — DELETE (new OTP page)

## Phase 3: Checkout Revert
- [ ] `src/app/checkout/page.tsx` — Simple COD-only checkout
- [ ] `src/app/order-success/page.tsx` — DELETE (duplicate)
- [ ] `src/app/checkout/success/page.tsx` — Keep simple version

## Phase 4: Orders & Utils Revert
- [ ] `src/lib/actions/order.actions.ts` — Simplify createOrder
- [ ] `src/lib/utils/orderUtils.ts` — DELETE
- [ ] `src/app/profile/orders/page.tsx` — Simplify to basic list

## Phase 5: Cleanup
- [ ] Remove empty `public/payments/` dir if exists
- [ ] Run `npx prisma generate`

