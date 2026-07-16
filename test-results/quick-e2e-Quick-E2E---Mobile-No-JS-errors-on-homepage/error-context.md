# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: quick-e2e.spec.ts >> Quick E2E - Mobile >> No JS errors on homepage
- Location: e2e/quick-e2e.spec.ts:133:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - img [ref=e4]
      - paragraph [ref=e6]:
        - text: "Important: Resumption of Daily Nairobi – Dubai Flights —"
        - link "Read More" [ref=e7] [cursor=pointer]:
          - /url: "#"
    - button "Close notification" [ref=e9] [cursor=pointer]:
      - img [ref=e10]
  - banner [ref=e13]:
    - generic [ref=e14]:
      - link "Kenya Airways – The Pride of Africa" [ref=e15] [cursor=pointer]:
        - /url: /
        - generic [ref=e16]:
          - img [ref=e18]
          - img "Kenya Airways – The Pride of Africa" [ref=e20]
      - generic [ref=e21]:
        - button "Search" [ref=e22] [cursor=pointer]:
          - img [ref=e23]
        - button "Toggle menu" [ref=e26] [cursor=pointer]:
          - img [ref=e27]
  - main [ref=e28]:
    - generic [ref=e29]:
      - generic [ref=e30]:
        - region [ref=e32]:
          - generic [ref=e33]:
            - tabpanel "1 of 4" [ref=e34]:
              - generic [ref=e39]:
                - heading "Explore the World for Less with Visa" [level=2] [ref=e40]
                - link "Book Now" [ref=e41] [cursor=pointer]:
                  - /url: /search?from=NBO&to=MBA&depart=2026-07-14&adults=1
            - tabpanel [ref=e42]:
              - generic [ref=e47]:
                - heading [level=2] [ref=e48]: Enjoy a Stopover in Nairobi
                - link [ref=e49] [cursor=pointer]:
                  - /url: /search?from=MBA&to=NBO&depart=2026-07-14&adults=1
                  - text: Book Your Stopover
            - tabpanel [ref=e50]:
              - generic [ref=e55]:
                - heading [level=2] [ref=e56]: Dubai is Calling. The Skies Are Open.
                - link [ref=e57] [cursor=pointer]:
                  - /url: /search?from=NBO&to=DXB&depart=2026-07-14&adults=1
                  - text: Book Now
            - tabpanel [ref=e58]:
              - generic [ref=e63]:
                - heading [level=2] [ref=e64]: From Africa to New York
                - link [ref=e65] [cursor=pointer]:
                  - /url: /search?from=NBO&to=JFK&depart=2026-08-01&adults=1
                  - text: Book Now
          - tablist "Select a slide to show":
            - tab "Go to slide 1" [selected] [ref=e66] [cursor=pointer]
            - tab "Go to slide 2" [ref=e67] [cursor=pointer]
            - tab "Go to slide 3" [ref=e68] [cursor=pointer]
            - tab "Go to slide 4" [ref=e69] [cursor=pointer]
        - generic [ref=e72]:
          - tablist [ref=e74]:
            - tab "Flights" [selected] [ref=e75] [cursor=pointer]:
              - img
              - text: Flights
            - tab "KQ Holidays" [ref=e76] [cursor=pointer]:
              - img
              - text: KQ Holidays
          - tabpanel "Flights" [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]:
                - generic [ref=e81]: Trip type
                - combobox [ref=e82] [cursor=pointer]:
                  - option "Return" [selected]
                  - option "One Way"
                  - option "Multi-City"
              - generic [ref=e83]:
                - generic [ref=e84]: Where from?
                - generic [ref=e85]:
                  - img [ref=e86]
                  - textbox "City or airport" [ref=e88]: Nairobi (NBO)
                  - generic [ref=e89]: NBO
              - button "Swap origin and destination" [ref=e91] [cursor=pointer]:
                - img [ref=e92]
              - generic [ref=e95]:
                - generic [ref=e96]: Where to?
                - generic [ref=e97]:
                  - img [ref=e98]
                  - textbox "City or airport" [ref=e100]: Mombasa (MBA)
                  - generic [ref=e101]: MBA
            - generic [ref=e102]:
              - generic [ref=e103]:
                - generic [ref=e104]: Passengers & Class
                - button "1 Adult · Economy" [ref=e105] [cursor=pointer]:
                  - img [ref=e106]
                  - generic [ref=e111]: 1 Adult · Economy
              - generic [ref=e112]:
                - generic [ref=e113]:
                  - generic [ref=e114]: Depart
                  - button "Thu, 16 Jul 2026" [ref=e115] [cursor=pointer]:
                    - img [ref=e116]
                    - generic [ref=e118]: Thu, 16 Jul 2026
                - generic [ref=e119]:
                  - generic [ref=e120]: Return
                  - button "Fri, 24 Jul 2026" [ref=e121] [cursor=pointer]:
                    - img [ref=e122]
                    - generic [ref=e124]: Fri, 24 Jul 2026
              - button "Search Flights" [ref=e126] [cursor=pointer]:
                - img
                - text: Search Flights
      - generic [ref=e129]:
        - button "Check in" [ref=e130] [cursor=pointer]:
          - img [ref=e132]
          - generic [ref=e134]: Check in
        - button "Manage Booking" [ref=e135] [cursor=pointer]:
          - img [ref=e137]
          - generic [ref=e140]: Manage Booking
        - link "Flight schedule" [ref=e141] [cursor=pointer]:
          - /url: /book-manage/flight-schedule
          - img [ref=e143]
          - generic [ref=e145]: Flight schedule
        - link "Flight status" [ref=e146] [cursor=pointer]:
          - /url: /book-manage/flight-status
          - img [ref=e148]
          - generic [ref=e151]: Flight status
      - generic [ref=e155]:
        - generic [ref=e157]:
          - heading "Deals from" [level=2] [ref=e160]
          - generic [ref=e162]:
            - button "Nairobi" [ref=e163] [cursor=pointer]
            - button "Mombasa" [ref=e164] [cursor=pointer]
            - button "Kisumu" [ref=e165] [cursor=pointer]
        - generic [ref=e166]:
          - generic [ref=e171] [cursor=pointer]:
            - heading "Mombasa" [level=3] [ref=e172]
            - paragraph [ref=e173]: 19 Jul 26 to 20 Jul 26
            - generic [ref=e174]: KES 2,500
          - generic [ref=e179] [cursor=pointer]:
            - heading "Zanzibar" [level=3] [ref=e180]
            - paragraph [ref=e181]: 21 Jul 26 to 25 Jul 26
            - generic [ref=e182]: KES 8,500
          - generic [ref=e187] [cursor=pointer]:
            - heading "Dar es Salaam" [level=3] [ref=e188]
            - paragraph [ref=e189]: 18 Jul 26 to 19 Jul 26
            - generic [ref=e190]: KES 7,800
          - generic [ref=e195] [cursor=pointer]:
            - heading "Johannesburg" [level=3] [ref=e196]
            - paragraph [ref=e197]: 23 Jul 26 to 30 Jul 26
            - generic [ref=e198]: KES 35,000
        - button "View all deals" [ref=e200] [cursor=pointer]
      - generic [ref=e203]:
        - heading "Plan Your Trip" [level=2] [ref=e207]
        - region [ref=e209]:
          - generic [ref=e210]:
            - tabpanel [ref=e211]:
              - link [ref=e212] [cursor=pointer]:
                - /url: /explore
                - heading [level=3] [ref=e216]:
                  - text: Discover Where We Fly
                  - img [ref=e217]
            - tabpanel [ref=e219]:
              - link [ref=e220] [cursor=pointer]:
                - /url: /plan/special-care
                - heading [level=3] [ref=e224]:
                  - text: Special Care
                  - img [ref=e225]
            - tabpanel [ref=e227]:
              - link [ref=e228] [cursor=pointer]:
                - /url: /plan/baggage-information
                - heading [level=3] [ref=e232]:
                  - text: Baggage Information
                  - img [ref=e233]
            - tabpanel "2 of 4" [ref=e235]:
              - link "Travel Requirements" [ref=e236] [cursor=pointer]:
                - /url: /plan/travel-information
                - heading "Travel Requirements" [level=3] [ref=e240]:
                  - text: Travel Requirements
                  - img [ref=e241]
            - tabpanel [ref=e243]:
              - link [ref=e244] [cursor=pointer]:
                - /url: /explore
                - heading [level=3] [ref=e248]:
                  - text: Discover Where We Fly
                  - img [ref=e249]
            - tabpanel [ref=e251]:
              - link [ref=e252] [cursor=pointer]:
                - /url: /plan/special-care
                - heading [level=3] [ref=e256]:
                  - text: Special Care
                  - img [ref=e257]
            - tabpanel [ref=e259]:
              - link [ref=e260] [cursor=pointer]:
                - /url: /plan/baggage-information
                - heading [level=3] [ref=e264]:
                  - text: Baggage Information
                  - img [ref=e265]
            - tabpanel [ref=e267]:
              - link [ref=e268] [cursor=pointer]:
                - /url: /plan/travel-information
                - heading [level=3] [ref=e272]:
                  - text: Travel Requirements
                  - img [ref=e273]
          - tablist "Select a slide to show":
            - tab "Go to slide 1" [ref=e275] [cursor=pointer]
            - tab "Go to slide 2" [selected] [ref=e276] [cursor=pointer]
            - tab "Go to slide 3" [ref=e277] [cursor=pointer]
            - tab "Go to slide 4" [ref=e278] [cursor=pointer]
      - generic [ref=e281]:
        - heading "Where Will You Go?" [level=2] [ref=e284]
        - region [ref=e286]:
          - generic [ref=e287]:
            - tabpanel [ref=e288]:
              - generic [ref=e293]:
                - heading [level=3] [ref=e294]: Fly to Dubai
                - paragraph [ref=e295]: Direct flights from Nairobi resumed. Non-stop travel with the Pride of Africa.
                - link [ref=e296] [cursor=pointer]:
                  - /url: /search?from=NBO&to=DXB&depart=2026-07-30&adults=1
                  - text: Book Now
                  - img [ref=e297]
            - tabpanel [ref=e299]:
              - generic [ref=e304]:
                - heading [level=3] [ref=e305]: World Cup 2026
                - paragraph [ref=e306]: From Africa to New York. Your gateway to the world's biggest game.
                - link [ref=e307] [cursor=pointer]:
                  - /url: /search?from=NBO&to=JFK&depart=2026-08-15&adults=1
                  - text: Book Now
                  - img [ref=e308]
            - tabpanel [ref=e310]:
              - generic [ref=e315]:
                - heading [level=3] [ref=e316]: Nairobi Stopover
                - paragraph [ref=e317]: Turn your layover into an adventure. 24–96 hours in Nairobi at no extra cost.
                - link [ref=e318] [cursor=pointer]:
                  - /url: /search?from=MBA&to=NBO&depart=2026-07-23&adults=1
                  - text: Book Now
                  - img [ref=e319]
            - tabpanel [ref=e321]:
              - generic [ref=e326]:
                - heading [level=3] [ref=e327]: Fly to Dubai
                - paragraph [ref=e328]: Direct flights from Nairobi resumed. Non-stop travel with the Pride of Africa.
                - link [ref=e329] [cursor=pointer]:
                  - /url: /search?from=NBO&to=DXB&depart=2026-07-30&adults=1
                  - text: Book Now
                  - img [ref=e330]
            - tabpanel "3 of 3" [ref=e332]:
              - generic [ref=e337]:
                - heading "World Cup 2026" [level=3] [ref=e338]
                - paragraph [ref=e339]: From Africa to New York. Your gateway to the world's biggest game.
                - link "Book Now" [ref=e340] [cursor=pointer]:
                  - /url: /search?from=NBO&to=JFK&depart=2026-08-15&adults=1
                  - text: Book Now
                  - img [ref=e341]
            - tabpanel [ref=e343]:
              - generic [ref=e348]:
                - heading [level=3] [ref=e349]: Nairobi Stopover
                - paragraph [ref=e350]: Turn your layover into an adventure. 24–96 hours in Nairobi at no extra cost.
                - link [ref=e351] [cursor=pointer]:
                  - /url: /search?from=MBA&to=NBO&depart=2026-07-23&adults=1
                  - text: Book Now
                  - img [ref=e352]
            - tabpanel [ref=e354]:
              - generic [ref=e359]:
                - heading [level=3] [ref=e360]: Fly to Dubai
                - paragraph [ref=e361]: Direct flights from Nairobi resumed. Non-stop travel with the Pride of Africa.
                - link [ref=e362] [cursor=pointer]:
                  - /url: /search?from=NBO&to=DXB&depart=2026-07-30&adults=1
                  - text: Book Now
                  - img [ref=e363]
          - tablist "Select a slide to show":
            - tab "Go to slide 1" [ref=e365] [cursor=pointer]
            - tab "Go to slide 2" [ref=e366] [cursor=pointer]
            - tab "Go to slide 3" [selected] [ref=e367] [cursor=pointer]
      - generic [ref=e370]:
        - heading "Additional Services" [level=2] [ref=e373]
        - generic [ref=e374]:
          - link "Duty Free Shopping" [ref=e375] [cursor=pointer]:
            - /url: /duty-free
            - generic [ref=e379]:
              - heading "Duty Free Shopping" [level=3] [ref=e381]
              - img [ref=e383]
          - link "Group Travel Travelling as a group, family or associates? It's fun travelling together but not always as fun to organize. Let us help you!" [ref=e385] [cursor=pointer]:
            - /url: /book-manage/manage-booking
            - generic [ref=e389]:
              - heading "Group Travel" [level=3] [ref=e390]
              - paragraph [ref=e391]: Travelling as a group, family or associates? It's fun travelling together but not always as fun to organize. Let us help you!
          - link "Kool Flyer's Club Discover a world of great Student Offers with exclusive unlimited access when you sign up." [ref=e392] [cursor=pointer]:
            - /url: /plan/travel-services
            - generic [ref=e396]:
              - heading "Kool Flyer's Club" [level=3] [ref=e397]
              - paragraph [ref=e398]: Discover a world of great Student Offers with exclusive unlimited access when you sign up.
          - link "Exquisite Charter Flights Fly beyond luxury in our Private Jets by booking from any of our tiers; Classy, Executive or Royal." [ref=e399] [cursor=pointer]:
            - /url: /plan/travel-services
            - generic [ref=e403]:
              - heading "Exquisite Charter Flights" [level=3] [ref=e404]
              - paragraph [ref=e405]: Fly beyond luxury in our Private Jets by booking from any of our tiers; Classy, Executive or Royal.
      - generic [ref=e409]:
        - img "Newsletter" [ref=e410]
        - generic [ref=e412]:
          - heading "Get the Latest Offers" [level=2] [ref=e413]
          - paragraph [ref=e414]: Subscribe for news and exclusive offers.
          - generic [ref=e415]:
            - textbox "Email address" [ref=e416]
            - generic [ref=e417] [cursor=pointer]:
              - generic [ref=e418]:
                - checkbox "I would like to receive news and offers from Kenya Airways" [ref=e419]
                - img [ref=e421]
              - generic [ref=e423]: I would like to receive news and offers from Kenya Airways
            - button "Subscribe" [ref=e424] [cursor=pointer]
  - contentinfo [ref=e425]:
    - generic [ref=e426]:
      - generic [ref=e427]:
        - button "Kenya Airways" [ref=e429] [cursor=pointer]:
          - generic [ref=e430]: Kenya Airways
          - img [ref=e432]
        - button "KQ Group Brands" [ref=e435] [cursor=pointer]:
          - generic [ref=e436]: KQ Group Brands
          - img [ref=e438]
        - button "Our Destinations" [ref=e441] [cursor=pointer]:
          - generic [ref=e442]: Our Destinations
          - img [ref=e444]
        - button "Help" [ref=e447] [cursor=pointer]:
          - generic [ref=e448]: Help
          - img [ref=e450]
      - generic [ref=e452]:
        - button "Useful Links" [ref=e454] [cursor=pointer]:
          - generic [ref=e455]: Useful Links
          - img [ref=e457]
        - button "Asante Rewards" [ref=e460] [cursor=pointer]:
          - generic [ref=e461]: Asante Rewards
          - img [ref=e463]
        - button "Popular Destinations" [ref=e466] [cursor=pointer]:
          - generic [ref=e467]: Popular Destinations
          - img [ref=e469]
        - button "Manage" [ref=e472] [cursor=pointer]:
          - generic [ref=e473]: Manage
          - img [ref=e475]
      - generic [ref=e478]:
        - heading "Follow us" [level=4] [ref=e479]
        - generic [ref=e480]:
          - link [ref=e481] [cursor=pointer]:
            - /url: https://www.facebook.com/officialkenyaairways/
            - img [ref=e482]
          - link [ref=e484] [cursor=pointer]:
            - /url: https://twitter.com/KenyaAirways
            - img [ref=e485]
          - link [ref=e487] [cursor=pointer]:
            - /url: https://www.instagram.com/officialkenyaairways/
            - img [ref=e488]
          - link [ref=e490] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/kenya-airways
            - img [ref=e491]
          - link [ref=e493] [cursor=pointer]:
            - /url: https://youtube.com/@officialkenyaairways
            - img [ref=e494]
          - link [ref=e496] [cursor=pointer]:
            - /url: https://open.spotify.com/show/3Pykcb3K4tJEaDeFxyDd07
            - img [ref=e497]
      - generic [ref=e499]:
        - img "Africa's Leading Airline - World Travel Awards 2025" [ref=e500]
        - img "Africa's Leading Airline Brand - World Travel Awards 2025" [ref=e501]
        - img "Africa's Leading Business Class - World Travel Awards 2025" [ref=e502]
        - img "Africa's Leading Inflight Magazine - World Travel Awards 2025" [ref=e503]
      - generic [ref=e504]:
        - generic [ref=e505]:
          - link "Privacy Statement" [ref=e506] [cursor=pointer]:
            - /url: /privacy-statement
          - link "Conditions of Carriage" [ref=e507] [cursor=pointer]:
            - /url: /conditions-of-carriage
          - link "Website Security" [ref=e508] [cursor=pointer]:
            - /url: /website-security
          - link "Browser Compatibility" [ref=e509] [cursor=pointer]:
            - /url: /browser-compatibility
          - link "Cookie Policy" [ref=e510] [cursor=pointer]:
            - /url: /cookie-policy
          - link "Customer Service Plan" [ref=e511] [cursor=pointer]:
            - /url: /customer-service-plan
          - link "Contingency Plan" [ref=e512] [cursor=pointer]:
            - /url: /contingency-plan
          - link "Optional Fees" [ref=e513] [cursor=pointer]:
            - /url: /optional-fees
          - link "24 Hours Refund Statement" [ref=e514] [cursor=pointer]:
            - /url: /24-hours-refund-statement
          - link "EU Passenger Rights" [ref=e515] [cursor=pointer]:
            - /url: /eu-passenger-rights
          - link "Thai Passenger Rights" [ref=e516] [cursor=pointer]:
            - /url: /thai-passenger-rights
        - paragraph [ref=e518]: © 2026 Kenya Airways PLC. All rights reserved.
  - button "Back to top":
    - img
  - alert [ref=e519]
  - generic [ref=e521]:
    - generic [ref=e522]:
      - heading "Your Privacy" [level=3] [ref=e523]
      - paragraph [ref=e524]: We use cookies to improve your experience on our website, personalize content and ads, provide social media features and to analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
    - generic [ref=e525]:
      - button "Manage Settings" [ref=e526] [cursor=pointer]
      - button "Accept All" [ref=e527] [cursor=pointer]
```

# Test source

```ts
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
  112 |     await expect(page.locator('text=Baggage').first()).toBeVisible()
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
> 137 |     await page.waitForLoadState('networkidle')
      |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  138 |     await page.waitForTimeout(2000)
  139 |     const critical = errors.filter(e => !e.includes('418') && !e.includes('Hydration'))
  140 |     expect(critical).toHaveLength(0)
  141 |   })
  142 | })
  143 | 
```