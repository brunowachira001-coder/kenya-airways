# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: quick-e2e.spec.ts >> Quick E2E - Mobile >> Baggage page loads
- Location: e2e/quick-e2e.spec.ts:109:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=Baggage').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Baggage').first()
    13 × locator resolved to <a href="/plan/baggage-information" class="block px-4 py-3 hover:bg-[#f5f5f5] hover:text-[#ed1c24] text-sm">Baggage Information</a>
       - unexpected value "hidden"

```

```yaml
- paragraph:
  - text: "Important: Resumption of Daily Nairobi – Dubai Flights —"
  - link "Read More":
    - /url: "#"
- button "Close notification"
- banner:
  - link "Kenya Airways – The Pride of Africa":
    - /url: /
    - img
    - img "Kenya Airways – The Pride of Africa"
  - button "Search"
  - button "Toggle menu"
- main:
  - navigation:
    - link "Baggage Information":
      - /url: /plan/baggage-information
    - link "Travel Information":
      - /url: /plan/travel-information
    - link "Special Care & Assistance":
      - /url: /plan/special-care
    - link "Travel Services":
      - /url: /plan/travel-services
  - heading "Baggage Information" [level=1]
  - paragraph: Everything you need to know about what to pack and how to carry it.
  - navigation:
    - link "Home":
      - /url: /
    - link "Plan":
      - /url: /plan/travel-information
    - text: Baggage Information
  - heading "Cabin Baggage Allowance" [level=2]
  - paragraph: To ensure a safe and comfortable flight for everyone, please adhere to our cabin baggage rules. Your cabin baggage must fit securely in the overhead lockers or under the seat in front of you.
  - table:
    - rowgroup:
      - row "Travel Class Allowance Max Dimensions":
        - columnheader "Travel Class"
        - columnheader "Allowance"
        - columnheader "Max Dimensions"
    - rowgroup:
      - row "Economy Class 1 piece up to 12kg + 1 small accessory 55 x 35 x 25 cm":
        - cell "Economy Class"
        - cell "1 piece up to 12kg + 1 small accessory"
        - cell "55 x 35 x 25 cm"
      - row "Premium Economy 2 pieces up to 12kg total + 1 small accessory 55 x 35 x 25 cm":
        - cell "Premium Economy"
        - cell "2 pieces up to 12kg total + 1 small accessory"
        - cell "55 x 35 x 25 cm"
      - row "Business Class 2 pieces up to 18kg total + 1 small accessory 55 x 35 x 25 cm":
        - cell "Business Class"
        - cell "2 pieces up to 18kg total + 1 small accessory"
        - cell "55 x 35 x 25 cm"
  - heading "Checked Baggage" [level=2]
  - paragraph: Checked baggage allowances vary depending on your route and class of travel. For the exact allowance for your journey, please check your e-ticket or use our Manage Booking tool.
  - paragraph: "Important Dimension Rules: The total dimensions (length + width + height) of any single piece of checked baggage must not exceed 158cm (62 inches). Items exceeding these dimensions may incur oversize fees."
  - heading "Frequently Asked Questions" [level=2]
  - region:
    - heading "Can I pool my baggage allowance with a companion?" [level=3]:
      - button "Can I pool my baggage allowance with a companion?"
    - heading "What items are prohibited in checked baggage?" [level=3]:
      - button "What items are prohibited in checked baggage?"
    - heading "How do I purchase extra baggage?" [level=3]:
      - button "How do I purchase extra baggage?"
  - heading "Restricted Items" [level=3]
  - paragraph: For safety and security reasons, there are strict rules about what you can and cannot take on board an aircraft.
  - list:
    - listitem: • Lithium batteries
    - listitem: • Flammable liquids
    - listitem: • Corrosive substances
    - listitem: • E-cigarettes
  - link "View full restricted items list →":
    - /url: "#"
  - heading "Lost or Delayed Bags" [level=3]
  - paragraph: If your baggage is delayed or damaged, our dedicated team is here to help you resolve the issue as quickly as possible.
  - link "Report a baggage issue →":
    - /url: "#"
  - heading "You might also be interested in" [level=2]
  - link "Travel Information Passports, visas, and health requirements for your destination. Read More":
    - /url: /plan/travel-information
    - heading "Travel Information" [level=3]
    - paragraph: Passports, visas, and health requirements for your destination.
    - text: Read More
  - link "Special Care Information about traveling with pets, infants, or medical needs. Read More":
    - /url: /plan/special-care
    - heading "Special Care" [level=3]
    - paragraph: Information about traveling with pets, infants, or medical needs.
    - text: Read More
  - link "Travel Insurance Protect your journey with our comprehensive insurance plans. Read More":
    - /url: /plan/travel-services
    - heading "Travel Insurance" [level=3]
    - paragraph: Protect your journey with our comprehensive insurance plans.
    - text: Read More
- contentinfo:
  - button "Kenya Airways"
  - button "KQ Group Brands"
  - button "Our Destinations"
  - button "Help"
  - button "Useful Links"
  - button "Asante Rewards"
  - button "Popular Destinations"
  - button "Manage"
  - heading "Follow us" [level=4]
  - link:
    - /url: https://www.facebook.com/officialkenyaairways/
    - img
  - link:
    - /url: https://twitter.com/KenyaAirways
  - link:
    - /url: https://www.instagram.com/officialkenyaairways/
    - img
  - link:
    - /url: https://www.linkedin.com/company/kenya-airways
    - img
  - link:
    - /url: https://youtube.com/@officialkenyaairways
    - img
  - link:
    - /url: https://open.spotify.com/show/3Pykcb3K4tJEaDeFxyDd07
  - img "Africa's Leading Airline - World Travel Awards 2025"
  - img "Africa's Leading Airline Brand - World Travel Awards 2025"
  - img "Africa's Leading Business Class - World Travel Awards 2025"
  - img "Africa's Leading Inflight Magazine - World Travel Awards 2025"
  - link "Privacy Statement":
    - /url: /privacy-statement
  - link "Conditions of Carriage":
    - /url: /conditions-of-carriage
  - link "Website Security":
    - /url: /website-security
  - link "Browser Compatibility":
    - /url: /browser-compatibility
  - link "Cookie Policy":
    - /url: /cookie-policy
  - link "Customer Service Plan":
    - /url: /customer-service-plan
  - link "Contingency Plan":
    - /url: /contingency-plan
  - link "Optional Fees":
    - /url: /optional-fees
  - link "24 Hours Refund Statement":
    - /url: /24-hours-refund-statement
  - link "EU Passenger Rights":
    - /url: /eu-passenger-rights
  - link "Thai Passenger Rights":
    - /url: /thai-passenger-rights
  - paragraph: © 2026 Kenya Airways PLC. All rights reserved.
- button "Back to top"
- alert
- heading "Your Privacy" [level=3]
- paragraph: We use cookies to improve your experience on our website, personalize content and ads, provide social media features and to analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
- button "Manage Settings"
- button "Accept All"
```

# Test source

```ts
  12  |   })
  13  | 
  14  |   test('Search page works', async ({ page }) => {
  15  |     await page.goto(`${BASE}/search?from=NBO&to=MBA&depart=2026-07-20&passengers=1&class=economy`)
  16  |     await page.waitForLoadState('networkidle')
  17  |     await page.waitForTimeout(2000)
  18  |     await expect(page.locator('text=Select your departure').first()).toBeVisible()
  19  |   })
  20  | 
  21  |   test('Payment page shows methods', async ({ page }) => {
  22  |     await page.goto(`${BASE}/booking/payment`)
  23  |     await page.waitForLoadState('networkidle')
  24  |     await expect(page.locator('text=Checkout').first()).toBeVisible()
  25  |     await expect(page.locator('text=Credit Card').first()).toBeVisible()
  26  |     await expect(page.locator('text=Mobile Payments').first()).toBeVisible()
  27  |   })
  28  | 
  29  |   test('Mobile payment - Bank Transfer Coming Soon', async ({ page }) => {
  30  |     await page.goto(`${BASE}/booking/payment/mobile`)
  31  |     await page.waitForLoadState('networkidle')
  32  |     await page.waitForTimeout(1000)
  33  |     await expect(page.locator('text=Coming Soon').first()).toBeVisible()
  34  |   })
  35  | 
  36  |   test('Mobile payment - Phone strips country code', async ({ page }) => {
  37  |     await page.goto(`${BASE}/booking/payment/mobile`)
  38  |     await page.waitForLoadState('networkidle')
  39  |     const phone = page.locator('input[type="tel"]').first()
  40  |     await phone.fill('254712345678')
  41  |     await expect(phone).toHaveValue('712345678')
  42  |   })
  43  | 
  44  |   test('Mobile payment - +254 prefix visible', async ({ page }) => {
  45  |     await page.goto(`${BASE}/booking/payment/mobile`)
  46  |     await page.waitForLoadState('networkidle')
  47  |     await expect(page.locator('span:text("+254")').first()).toBeVisible()
  48  |   })
  49  | 
  50  |   test('Confirmation - no spinner', async ({ page }) => {
  51  |     await page.goto(`${BASE}/booking/confirmation`)
  52  |     await page.waitForLoadState('networkidle')
  53  |     await page.waitForTimeout(1500)
  54  |     await expect(page.locator('text=Booking Pending Payment').first()).toBeVisible()
  55  |     await expect(page.locator('text=Verifying payment status')).not.toBeVisible()
  56  |   })
  57  | 
  58  |   test('Confirmation - action buttons', async ({ page }) => {
  59  |     await page.goto(`${BASE}/booking/confirmation`)
  60  |     await page.waitForLoadState('networkidle')
  61  |     await page.waitForTimeout(1500)
  62  |     await expect(page.locator('button:has-text("Print")').first()).toBeVisible()
  63  |     await expect(page.locator('button:has-text("Download")').first()).toBeVisible()
  64  |   })
  65  | 
  66  |   test('Confirmation - Go to Payment button', async ({ page }) => {
  67  |     await page.goto(`${BASE}/booking/confirmation`)
  68  |     await page.waitForLoadState('networkidle')
  69  |     await page.waitForTimeout(1500)
  70  |     const btn = page.locator('button:has-text("Go to Payment")').first()
  71  |     await expect(btn).toBeVisible()
  72  |     await btn.click()
  73  |     await page.waitForTimeout(2000)
  74  |     expect(page.url()).toContain('payment')
  75  |   })
  76  | 
  77  |   test('Admin dashboard loads', async ({ page }) => {
  78  |     await page.goto(`${BASE}/admin`)
  79  |     await page.waitForLoadState('networkidle')
  80  |     await page.waitForTimeout(3000)
  81  |     await expect(page.locator('text=Dashboard').first()).toBeVisible()
  82  |   })
  83  | 
  84  |   test('Admin - summary cards', async ({ page }) => {
  85  |     await page.goto(`${BASE}/admin`)
  86  |     await page.waitForLoadState('networkidle')
  87  |     await page.waitForTimeout(3000)
  88  |     await expect(page.locator('text=Visitors').first()).toBeVisible()
  89  |     await expect(page.locator('text=Bookings').first()).toBeVisible()
  90  |   })
  91  | 
  92  |   test('Admin - tabs work', async ({ page }) => {
  93  |     await page.goto(`${BASE}/admin`)
  94  |     await page.waitForLoadState('networkidle')
  95  |     await page.waitForTimeout(3000)
  96  |     const visitorsTab = page.locator('button:has-text("Visitors")').first()
  97  |     if (await visitorsTab.isVisible()) {
  98  |       await visitorsTab.click()
  99  |       await page.waitForTimeout(1000)
  100 |     }
  101 |   })
  102 | 
  103 |   test('Deals page loads', async ({ page }) => {
  104 |     await page.goto(`${BASE}/deals`)
  105 |     await page.waitForLoadState('networkidle')
  106 |     expect(page.url()).toContain('deals')
  107 |   })
  108 | 
  109 |   test('Baggage page loads', async ({ page }) => {
  110 |     await page.goto(`${BASE}/plan/baggage-information`)
  111 |     await page.waitForLoadState('networkidle')
> 112 |     await expect(page.locator('text=Baggage').first()).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  113 |   })
  114 | 
  115 |   test('Flight status page loads', async ({ page }) => {
  116 |     await page.goto(`${BASE}/book-manage/flight-status`)
  117 |     await page.waitForLoadState('networkidle')
  118 |     expect(page.url()).toContain('flight-status')
  119 |   })
  120 | 
  121 |   test('Check-in page loads', async ({ page }) => {
  122 |     await page.goto(`${BASE}/book-manage/check-in`)
  123 |     await page.waitForLoadState('networkidle')
  124 |     expect(page.url()).toContain('check-in')
  125 |   })
  126 | 
  127 |   test('Manage booking page loads', async ({ page }) => {
  128 |     await page.goto(`${BASE}/book-manage/manage-booking`)
  129 |     await page.waitForLoadState('networkidle')
  130 |     expect(page.url()).toContain('manage-booking')
  131 |   })
  132 | 
  133 |   test('No JS errors on homepage', async ({ page }) => {
  134 |     const errors: string[] = []
  135 |     page.on('pageerror', (err) => errors.push(err.message))
  136 |     await page.goto(BASE)
  137 |     await page.waitForLoadState('networkidle')
  138 |     await page.waitForTimeout(2000)
  139 |     const critical = errors.filter(e => !e.includes('418') && !e.includes('Hydration'))
  140 |     expect(critical).toHaveLength(0)
  141 |   })
  142 | })
  143 | 
```