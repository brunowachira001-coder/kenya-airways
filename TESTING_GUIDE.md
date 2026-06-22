# Complete Booking Flow Testing Guide

## Server Information

**Development Server:** Running on port 3000
**Local Access:** http://localhost:3000
**Mobile/Network Access:** http://192.168.100.8:3000

**Start Server:**
```bash
npm run dev -- -H 0.0.0.0 -p 3000
```

## Complete Booking Flow Test

### 1. Home Page → Search
**URL:** http://192.168.100.8:3000

**Test Actions:**
- [ ] Click any "Book Now" button in Hero Slider (4 slides)
- [ ] Click any "Book Now" button in Featured Destinations (3 cards)
- [ ] Click "Book Now" in Promo Banner (Asante Rewards)

**Expected:** All should navigate to `/search` page

### 2. Search/Flight Selection Page
**URL:** http://192.168.100.8:3000/search

**Desktop Layout:**
- [ ] Route header displays correctly (NBO → destination)
- [ ] Date carousel shows with horizontal scroll
- [ ] Flight cards show all details (times, duration, terminals)
- [ ] Economy and Business columns side-by-side
- [ ] Expandable fare tiers work

**Mobile Layout:**
- [ ] Route header is responsive
- [ ] Date carousel scrolls horizontally
- [ ] Price columns stay 50/50 split (not stacked)
- [ ] Fare tiers scroll horizontally when expanded
- [ ] All text sizes are readable

**Test Actions:**
- [ ] Select a fare tier from any flight
- [ ] Verify navigation to passengers page

### 3. Passengers Page
**URL:** http://192.168.100.8:3000/booking/passengers

**Desktop Layout:**
- [ ] Trip summary header shows route
- [ ] "Enter your information" title in italic serif
- [ ] 3-column grid for passenger fields
- [ ] 2-column grid for contact information
- [ ] Frequent flyer section displays
- [ ] Newsletter/privacy checkboxes work
- [ ] Promotional footer displays

**Mobile Layout:**
- [ ] Header is responsive and readable
- [ ] All grids stack to single column
- [ ] Form fields are full-width and touch-friendly
- [ ] Images scale properly
- [ ] No horizontal scrolling

**Test Actions:**
- [ ] Fill in all passenger details
- [ ] Fill in contact information
- [ ] Click "Continue" button
- [ ] Verify navigation to review page

### 4. Review/Summary Page ⭐ (NEW CAROUSEL FEATURE)
**URL:** http://192.168.100.8:3000/booking/review

**Top Section:**
- [ ] Price bar shows total at top
- [ ] Currency selector works
- [ ] Warning message displays (if any)

**Flights Section:**
- [ ] Outbound flight details correct
- [ ] Return flight details correct
- [ ] Times, dates, terminals display properly

**Passenger Details:**
- [ ] All passengers listed with checkmarks
- [ ] Contact information displays
- [ ] Expandable sections work

**Extra Services Section (Desktop):**
- [ ] 2-column grid layout
- [ ] All 4 services visible:
  1. Seats (KES 2,000 - checkbox)
  2. Baggage (KES 16,965 - checkbox)
  3. Special Meals (Included - no checkbox)
  4. Special Assistance (Included - no checkbox)
- [ ] Checkboxes only on paid services
- [ ] Click checkbox on "Seats"
  - [ ] Green indicator appears
  - [ ] "+KES 2,000" label shows (multiply by passenger count)
  - [ ] Top price updates
  - [ ] Bottom price updates
- [ ] Click checkbox on "Baggage"
  - [ ] "+KES 16,965" label shows
  - [ ] Total increases by baggage price × passengers
- [ ] Uncheck services
  - [ ] Prices decrease
  - [ ] Visual indicators removed

**Extra Services Section (Mobile):** ⭐
- [ ] Services display as horizontal carousel
- [ ] Swipe left/right to see all 4 services
- [ ] Cards snap to center smoothly
- [ ] Scrollbar is hidden
- [ ] Pagination dots visible below
- [ ] Active dot highlights current card
- [ ] Each card is 320px wide
- [ ] Images are full-width in cards
- [ ] Text is readable and properly sized
- [ ] Checkboxes work on paid services
- [ ] Selecting service updates price immediately
- [ ] Can select multiple services while swiping
- [ ] All selections persist when navigating

**Hold Booking Option:**
- [ ] Checkbox and description visible
- [ ] Check "Hold my booking"
- [ ] "+KES 2,610" adds to total
- [ ] Price updates at top and bottom
- [ ] Uncheck to remove fee

**Price Breakdown:**
- [ ] Shows when services/hold booking selected
- [ ] Flight total line
- [ ] Extra services line (green, shows sum)
- [ ] Hold booking line (green, if checked)
- [ ] Final total matches sum

**Example Price Breakdown (1 passenger):**
```
Flight total:        KES 170,000
Extra services:     +KES 18,965  ← (2,000 + 16,965)
Hold booking:       +KES 2,610
────────────────────────────────
Total price:         KES 191,575
```

**Example Price Breakdown (2 passengers):**
```
Flight total:        KES 340,000
Extra services:     +KES 37,930  ← (2,000 + 16,965) × 2
Hold booking:       +KES 2,610
────────────────────────────────
Total price:         KES 380,540
```

**Checkout Button:**
- [ ] Click "Checkout" with services selected
- [ ] Verify navigation to payment page
- [ ] Verify total price persists

### 5. Payment Page
**URL:** http://192.168.100.8:3000/booking/payment

**Price Verification:**
- [ ] Top cart icon shows correct total
- [ ] Total price card shows correct amount
- [ ] Total includes extra services from review page
- [ ] Bottom summary shows same total

**Payment Methods:**
- [ ] Credit Card section expands/collapses
- [ ] PayPal section expands/collapses
- [ ] Mobile Payments section expands/collapses

**Credit Card Form:**
- [ ] All fields visible and functional
- [ ] Card preview displays
- [ ] Billing address fields work
- [ ] Terms checkbox works
- [ ] "Pay KES X" button shows correct total

**PayPal:**
- [ ] Terms checkbox works
- [ ] "Pay KES X" button shows correct total

**Mobile Payments:**
- [ ] Notice displays
- [ ] Terms checkbox works
- [ ] "Pay KES X" button shows correct total
- [ ] Clicking navigates to mobile payment gateway

**Responsive (Mobile):**
- [ ] Trip summary header stacks properly
- [ ] Payment method cards stack
- [ ] Credit card form is single column
- [ ] All grids are responsive
- [ ] No horizontal scrolling

### 6. Mobile Payment Gateway
**URL:** http://192.168.100.8:3000/booking/payment/mobile

**Layout:**
- [ ] Warning banner at top
- [ ] Payment options sidebar (left)
- [ ] M-Pesa form (center)
- [ ] Transaction details (right) with countdown

**Mobile Layout:**
- [ ] Three columns stack vertically
- [ ] All sections are full-width
- [ ] Phone number field is touch-friendly
- [ ] Submit button is full-width and accessible

**Functionality:**
- [ ] Can select payment method
- [ ] Can enter phone number
- [ ] Countdown timer displays
- [ ] Total amount matches previous pages

## Price Calculation Verification

### Manual Calculation Test

**Given:**
- 2 Adult passengers
- Outbound flight: KES 45,000 (base)
- Return flight: KES 40,000 (base)
- Fare: Economy (×1.2 multiplier)
- Selected: Seats (KES 2,000) + Baggage (KES 16,965)
- Hold booking: Yes (KES 2,610)

**Expected Calculation:**
```
Outbound: 45,000 × 1.2 = 54,000
Return:   40,000 × 1.2 = 48,000
Flight total (2 pax): (54,000 + 48,000) × 2 = 204,000

Seats:    2,000 × 2 = 4,000
Baggage: 16,965 × 2 = 33,930
Services total: 37,930

Hold booking: 2,610 (flat fee)

TOTAL: 204,000 + 37,930 + 2,610 = 244,540
```

**Test Steps:**
1. Book flight with 2 adults
2. Select Economy fare
3. On review page, select Seats + Baggage + Hold booking
4. Verify total shows: **KES 244,540**
5. Navigate to payment page
6. Verify all "Pay" buttons show: **KES 244,540**

## Mobile-Specific Tests

### Test on Actual Mobile Device

**Connect to:** http://192.168.100.8:3000

1. **Touch Targets:**
   - [ ] All buttons are at least 44px tall
   - [ ] Checkboxes are easy to tap
   - [ ] Links are spaced apart

2. **Carousel Gestures:**
   - [ ] Swipe left/right feels natural
   - [ ] Snap-to-center is smooth
   - [ ] No accidental scrolling
   - [ ] Can tap buttons inside cards

3. **Form Inputs:**
   - [ ] Phone number field doesn't zoom (16px font minimum)
   - [ ] Text inputs are touch-friendly
   - [ ] Select dropdowns work on iOS/Android
   - [ ] Checkboxes are large enough

4. **Scrolling:**
   - [ ] Vertical scroll is smooth
   - [ ] No horizontal scroll on any page
   - [ ] Carousel scrolls independently
   - [ ] No stuck scroll positions

## Common Issues & Solutions

### Issue: Carousel doesn't scroll smoothly
**Solution:** Ensure `snap-x snap-mandatory` classes are applied and `hide-scrollbar` class is present

### Issue: Prices don't update
**Solution:** Check browser console for errors, verify state management in React DevTools

### Issue: Total price wrong on payment page
**Solution:** Verify extras are saved to store before navigation, check `setExtras()` call

### Issue: Mobile horizontal scrolling
**Solution:** Add `overflow-x-hidden` to parent container, check for elements wider than viewport

### Issue: Can't connect from mobile
**Solution:** 
1. Verify server running with `-H 0.0.0.0`
2. Verify firewall allows port 3000
3. Verify devices on same network
4. Use correct IP: 192.168.100.8 (not 192.168.100.23)

## Browser Developer Tools Testing

### Chrome DevTools Mobile Emulation

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device: iPhone 12 Pro, Pixel 5, etc.
4. Test all pages in mobile view
5. Test carousel with mouse drag
6. Test touch simulation

### Network Tab Testing

1. Go to review page
2. Select/unselect services
3. Verify no network requests (client-side only)
4. Click checkout
5. Verify navigation occurs
6. Check payment page loads with correct total

### React DevTools Testing

1. Install React DevTools extension
2. Navigate to review page
3. Find `ReviewPage` component
4. Inspect state:
   - `selectedServices` (Set)
   - `holdBooking` (boolean)
   - `totalPrice` (number)
5. Select services and watch state update
6. Verify calculations match displayed prices

## Accessibility Testing (Basic)

- [ ] Tab through all interactive elements
- [ ] Checkboxes are keyboard accessible
- [ ] Focus indicators visible
- [ ] Form labels are present
- [ ] Images have alt text
- [ ] Color contrast is sufficient

## Performance Testing

- [ ] Page loads under 3 seconds on mobile
- [ ] Carousel scrolling is smooth (60fps)
- [ ] No layout shifts when selecting services
- [ ] Images lazy load properly
- [ ] No console errors

## Sign-Off Checklist

- [ ] All "Book Now" buttons lead to search
- [ ] Complete booking flow works end-to-end
- [ ] Carousel works on mobile with swipe gestures
- [ ] Extra services add to total price correctly
- [ ] Price persists from review to payment page
- [ ] Responsive design works on all screen sizes
- [ ] No horizontal scrolling on any page
- [ ] All forms are functional
- [ ] Payment methods display correctly
- [ ] Mobile payment gateway loads
- [ ] Server accessible on network (192.168.100.8:3000)

## Screenshots Locations

Review page screenshots should show:
- Desktop extra services grid with selected services
- Mobile extra services carousel with pagination dots
- Price breakdown with services added
- Total at top and bottom matching

Payment page screenshots should show:
- Total price matching review page
- All payment method buttons with same total
