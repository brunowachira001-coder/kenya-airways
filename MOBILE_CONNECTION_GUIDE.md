# Mobile Connection Guide - Kenya Airways Booking Site

## ✅ Server Status: RUNNING

The development server is now running and accessible!

## 📱 Mobile Access URLs

### Primary URL (Use This One):
```
http://192.168.100.8:3000
```

### Network Information:
- **IP Address**: 192.168.100.8
- **Port**: 3000
- **Interface**: wlan0 (WiFi)
- **Network**: 192.168.100.0/24

## 🔧 Connection Verified

✅ Server is running on port 3000
✅ Localhost connection working (http://localhost:3000)
✅ Network connection working (http://192.168.100.8:3000)
✅ No firewall blocking the connection

## 📲 How to Connect from Your Mobile Device

### Step 1: Check Your Network
Make sure your mobile device is connected to the **same WiFi network** as your computer.

Your computer is on network: **192.168.100.x**
Your mobile should also show an IP like: **192.168.100.xx**

### Step 2: Open Browser on Mobile
1. Open Chrome, Safari, or any browser on your mobile
2. Type in the address bar: `http://192.168.100.8:3000`
3. Press Go/Enter

### Step 3: Test the Site
1. You should see the Kenya Airways home page
2. Try clicking any "Book Now" button
3. Test the complete booking flow

## 🔍 Troubleshooting

### If you can't connect:

#### 1. Check Same Network
- On your mobile, go to WiFi settings
- Verify you're on the same network as your computer
- Look for network name that matches your computer's WiFi

#### 2. Check IP Address
The computer IP might change. To get the current IP, run:
```bash
hostname -I
```
Current IP: **192.168.100.8**

#### 3. Check Server Status
Run this to verify server is running:
```bash
curl http://localhost:3000
```

#### 4. Restart Server if Needed
Stop the server:
```bash
pkill -f "next dev"
```

Start it again:
```bash
npm run dev -- -H 0.0.0.0 -p 3000
```

#### 5. Try Port 3001 if 3000 Fails
```
http://192.168.100.8:3001
```

## 📋 Quick Test Checklist

Test these URLs in order:

1. ✅ Home page: `http://192.168.100.8:3000`
2. ✅ Search page: `http://192.168.100.8:3000/search`
3. ✅ Passengers page: `http://192.168.100.8:3000/booking/passengers`
4. ✅ Review page: `http://192.168.100.8:3000/booking/review`
5. ✅ Payment page: `http://192.168.100.8:3000/booking/payment`

## 🎯 Testing "Book Now" Buttons

All these buttons should work and lead to the booking flow:

### Hero Slider (Top of home page - 4 slides):
- "Explore the World for Less with Visa" → Book Now
- "Enjoy a Stopover in Nairobi" → Book Your Stopover
- "Dubai is Calling" → Book Now
- "From Africa to New York" → Book Now

### Featured Destinations (Scroll down - 3 cards):
- "Nairobi Stopover" → Book Now
- "Fly to Dubai" → Book Now
- "World Cup 2026" → Book Now

### Promo Banner (Further down):
- "Enjoy Up to 10% Off" → Book Now

## 📊 Expected Behavior

When you click any "Book Now" button:
1. **Navigate to Search Page** with flight options
2. **Select a flight** and fare tier
3. **Fill passenger details** (responsive form)
4. **Review booking** with trip summary
5. **Choose payment** method and complete

All pages should:
- ✅ Display without horizontal scrolling
- ✅ Be fully responsive on mobile (375px width)
- ✅ Match Kenya Airways design standards
- ✅ Show isolated booking experience (no main header/footer)

## 🌐 Network Details

```
Computer IP:     192.168.100.8
Network Range:   192.168.100.0 - 192.168.100.255
Subnet Mask:     255.255.255.0 (/24)
Interface:       wlan0 (WiFi)
Port:           3000
Binding:        0.0.0.0 (all interfaces)
```

## ✨ Server Commands

### Check if server is running:
```bash
curl -I http://localhost:3000
```

### Stop server:
```bash
pkill -f "next dev"
```

### Start server:
```bash
npm run dev -- -H 0.0.0.0 -p 3000
```

### Get current IP:
```bash
hostname -I
```

### Test network access:
```bash
curl -I http://192.168.100.8:3000
```

---

**Last Updated**: Now
**Status**: ✅ Server Running
**Primary URL**: http://192.168.100.8:3000
