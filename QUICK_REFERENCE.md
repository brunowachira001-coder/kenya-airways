# Quick Reference Card

## 🚀 Start Development Server

```bash
npm run dev -- -H 0.0.0.0 -p 3000
```

## 🔗 URLs

| Device | URL |
|--------|-----|
| **Desktop/Laptop** | http://localhost:3000 |
| **Mobile/Tablet** | http://192.168.100.8:3000 |

## 📱 Test Extra Services Carousel (NEW FEATURE)

### Quick Test Steps:
1. Open: http://192.168.100.8:3000
2. Click any "Book Now" button
3. Select a flight and fare
4. Fill passenger details
5. **On Review Page:**
   - **Desktop:** See grid layout with checkboxes
   - **Mobile:** Swipe carousel left/right
   - Check "Seats" (KES 2,000)
   - Check "Baggage" (KES 16,965)
   - Watch price update at top and bottom
6. Click "Checkout"
7. **On Payment Page:** Verify total matches

### Expected Behavior:
- ✅ Smooth horizontal scroll on mobile
- ✅ Hidden scrollbar
- ✅ Snap-to-center effect
- ✅ Price adds per passenger
- ✅ Visual feedback when selected
- ✅ Total persists to payment page

## 💰 Price Calculation Formula

```
Flight Total = (Outbound + Return) × Fare Multiplier × Passenger Count

Extra Services = (Selected Services) × Passenger Count

Hold Booking = KES 2,610 (flat fee)

TOTAL = Flight Total + Extra Services + Hold Booking
```

### Example (1 passenger, Economy):
```
Flight:      KES 102,000
Seats:       KES   2,000
Baggage:     KES  16,965
Hold:        KES   2,610
─────────────────────────
TOTAL:       KES 123,575
```

## 🎯 Key Features to Test

- [ ] Home → Book Now buttons (all lead to search)
- [ ] Search → Flight selection
- [ ] Passengers → Form submission
- [ ] Review → Extra services carousel (mobile)
- [ ] Review → Price calculation (with services)
- [ ] Payment → Total persists
- [ ] Mobile → Responsive layout
- [ ] Mobile → Touch gestures

## 📋 Complete Booking Flow

```
HOME
  ↓ (Book Now)
SEARCH
  ↓ (Select Fare)
PASSENGERS
  ↓ (Continue)
REVIEW ⭐ NEW
  ↓ (Checkout with services)
PAYMENT
  ↓ (Pay with Mobile)
MOBILE GATEWAY
  ↓
CONFIRMATION
```

## 🐛 Troubleshooting

### Can't access from mobile?
```bash
# Check server is running
ps aux | grep "npm run dev"

# Verify IP address
ip addr show | grep "inet 192"

# Should show: 192.168.100.8
```

### Price not updating?
- Check browser console (F12)
- Clear browser cache
- Verify state in React DevTools

### Carousel not working?
- Test on actual device (not just DevTools)
- Check for horizontal scroll issues
- Verify `hide-scrollbar` class present

## 📦 Build & Deploy

```bash
# Development
npm run dev -- -H 0.0.0.0 -p 3000

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Services & Prices

| Service | Price | Type |
|---------|-------|------|
| Seats | KES 2,000 | Per passenger |
| Baggage | KES 16,965 | Per passenger |
| Special Meals | Included | Free |
| Special Assistance | Included | Free |
| Hold Booking | KES 2,610 | Flat fee |

## 🎨 Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `xs` | < 640px | Mobile phones |
| `sm:` | ≥ 640px | Large phones, tablets |
| `md:` | ≥ 768px | Tablets |
| `lg:` | ≥ 1024px | Laptops |
| `xl:` | ≥ 1280px | Desktops |

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/app/booking/review/page.tsx` | Extra services carousel ⭐ |
| `src/app/booking/payment/page.tsx` | Payment with total |
| `src/store/booking-store.ts` | State management |
| `src/app/globals.css` | Utility classes |

## 🔍 Debug Commands

```bash
# Check build errors
npm run build

# Check TypeScript
npm run type-check

# Check for linting issues
npm run lint

# View dev server logs
# (Check terminal where server is running)
```

## 📖 Documentation Files

- `PROJECT_STATUS.md` - Complete project overview
- `TESTING_GUIDE.md` - Detailed testing instructions
- `EXTRA_SERVICES_CAROUSEL_IMPLEMENTATION.md` - Feature details
- `QUICK_REFERENCE.md` - This file

## ⚡ Pro Tips

1. **Use React DevTools** to inspect state
2. **Use Chrome DevTools mobile emulation** for quick mobile testing
3. **Test on real devices** for touch gestures
4. **Check Network tab** to verify no unnecessary requests
5. **Watch console** for warnings/errors

## 🎉 Success Checklist

- [x] Server running on port 3000
- [x] Accessible on network (192.168.100.8)
- [x] Build passes without errors
- [x] All booking flow steps work
- [x] Extra services carousel implemented
- [x] Prices calculate correctly
- [x] State persists across pages
- [x] Responsive on all screens
- [x] No horizontal scrolling

---

**Status:** ✅ READY TO TEST
**Last Updated:** June 17, 2026
