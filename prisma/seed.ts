import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCTS = [
  // ── Electronics ──
  {
    name: "Aura Pro Noise Cancelling Headphones",
    description: "Studio-grade 40mm drivers deliver breathtaking soundstage while adaptive ANC silences the world around you. 38-hour battery, multipoint Bluetooth 5.3, and a feather-light titanium frame.",
    price: 349.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
    stock: 28,
  },
  {
    name: "Phantom X Mechanical Keyboard",
    description: "Full-aluminum CNC chassis with premium tactile switches, per-key RGB, and a gasket-mounted layout that absorbs every keystroke with satisfying precision. Wired and Bluetooth dual-mode.",
    price: 189.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"],
    stock: 35,
  },
  {
    name: "Lumina 4K Streaming Webcam",
    description: "Ultra-sharp 4K 60fps sensor with dual studio-quality microphones and AI-powered auto-framing that keeps you perfectly centered. Plug-and-play on Mac and Windows — no drivers needed.",
    price: 199.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80"],
    stock: 42,
  },
  {
    name: "NovaPad Ultra 12.9\"",
    description: "Powered by the latest octa-core chip with a liquid-smooth 120Hz OLED display. The thinnest tablet in its class, purpose-built for creators, students, and professionals on the move.",
    price: 899.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"],
    stock: 18,
  },
  {
    name: "Vortex True Wireless Earbuds",
    description: "Hybrid active noise cancellation, 32 hours of total playtime, and a custom-tuned 10mm graphene driver for rich, detailed audio. IPX5 sweat resistance and wireless charging case included.",
    price: 179.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"],
    stock: 50,
  },
  {
    name: "Apex Ultra-Slim Laptop 14\"",
    description: "A magnesium-alloy chassis weighing just 1.1 kg houses a blazing-fast processor, 16GB RAM, and an all-day 22-hour battery. The 2.8K OLED display is calibrated for 100% DCI-P3 color accuracy.",
    price: 1299.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"],
    stock: 14,
  },

  // ── Fashion ──
  {
    name: "Urban Nomad Oversized Hoodie",
    description: "Crafted from 400gsm heavyweight French terry cotton for a premium drop-shoulder silhouette. Garment-washed for instant softness and a lived-in feel that only gets better over time.",
    price: 129.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80"],
    stock: 45,
  },
  {
    name: "Onyx Slim-Fit Chinos",
    description: "Tailored from a stretch-cotton twill blend for a clean, modern fit that moves with you. Wrinkle-resistant and versatile enough to take you from boardroom to weekend brunch.",
    price: 95.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"],
    stock: 38,
  },
  {
    name: "Luxe Merino Turtleneck",
    description: "Spun from 100% fine-gauge merino wool, this turtleneck regulates body temperature naturally and resists odors. A refined, minimalist staple that pairs effortlessly with everything.",
    price: 175.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80"],
    stock: 22,
  },
  {
    name: "Midnight Double-Breasted Trench",
    description: "A modern interpretation of the classic trench coat, cut from a water-repellent cotton-blend gabardine. Structured shoulders, horn buttons, and a belted waist for a sharp, commanding presence.",
    price: 389.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
    stock: 12,
  },
  {
    name: "The Essential Premium White Tee",
    description: "A luxury take on the everyday tee — 220gsm Supima cotton with a precise seam structure that drapes perfectly and holds its shape wash after wash. The last white t-shirt you'll ever need.",
    price: 59.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80"],
    stock: 75,
  },

  // ── Accessories ──
  {
    name: "Meridian Moonphase Automatic Watch",
    description: "Swiss-assembled 42mm automatic movement with a moonphase complication and sapphire crystal glass. A hand-finished brushed stainless case and genuine alligator strap make this an heirloom timepiece.",
    price: 449.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"],
    stock: 15,
  },
  {
    name: "Noir Structured Leather Tote",
    description: "Architectural silhouette sculpted from full-grain vegetable-tanned Italian leather. A wide interior with suede lining, a magnetic closure, and an interior zip pocket keep your essentials organized and secure.",
    price: 299.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"],
    stock: 20,
  },
  {
    name: "Cobalt Waxed Canvas Weekender",
    description: "Built for the modern traveler — 40L of organized space in a rugged waxed canvas shell that's naturally water-resistant. Padded laptop sleeve, YKK zippers, and carry-on compliant dimensions.",
    price: 179.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"],
    stock: 30,
  },
  {
    name: "Glacier Polarized Aviator Sunglasses",
    description: "Hand-polished gold titanium frames with category 3 polarized lenses that eliminate glare in 99% of light conditions. Spring-loaded temples and adjustable nose pads for a custom, all-day fit.",
    price: 225.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"],
    stock: 40,
  },
  {
    name: "Apex Slim Leather Cardholder",
    description: "Six precisely stitched card slots and RFID-blocking technology, all in just 6mm of handcrafted vegetable-tanned leather. Slips invisibly into any pocket and improves with every day of use.",
    price: 65.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"],
    stock: 60,
  },

  // ── Aesthetic Decor ──
  {
    name: "Sunset Projection Night Lamp",
    description: "Projects a dreamy warm-orange sunset gradient across your walls and ceiling via a 10W LED with 360° rotation. Three lighting modes, USB-powered, and compact enough to place on any shelf or desk.",
    price: 49.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1578899374926-6cb0da2fb38a?auto=format&fit=crop&w=800&q=80"],
    stock: 55,
  },
  {
    name: "Ceramic Donut Bud Vase",
    description: "Hand-formed stoneware in a soft donut silhouette with a matte pastel glaze — the perfect stem holder for a single dried flower or pampas sprig. Each piece is unique due to the hand-finishing process.",
    price: 35.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1616627547584-bf3caa26c1eb?auto=format&fit=crop&w=800&q=80"],
    stock: 40,
  },
  {
    name: "Amber Soy Wax Scented Candle",
    description: "Poured in small batches from 100% natural soy wax with a crackling wooden wick. The signature blend of sandalwood, vanilla, and amber fills a room for up to 55 hours of clean, non-toxic burn time.",
    price: 28.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1542601906897-07cbfe838671?auto=format&fit=crop&w=800&q=80"],
    stock: 75,
  },
  {
    name: "Warm White Fairy Lights 3m",
    description: "300 micro-LEDs on ultra-fine copper wire with a USB controller offering eight flash modes. Flexible enough to drape over a headboard, weave through shelves, or fill a glass jar for instant ambiance.",
    price: 22.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80"],
    stock: 90,
  },
  {
    name: "Minimalist Botanical Line Art Print",
    description: "A series of three A4 fine-line botanical illustrations printed on 200gsm acid-free cotton rag paper. Frameable in any standard A4 frame — sold as a matched set for a curated gallery-wall look.",
    price: 45.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80"],
    stock: 60,
  },

  // ── Female Fashion & Accessories ──
  {
    name: "Aesthetic Canvas Tote Bag",
    description: "Heavyweight 12oz natural canvas with a minimalist typographic print and a 10-inch drop handle. Fits a 13\" laptop, a water bottle, and all your everyday essentials with an interior zip pocket for keys.",
    price: 29.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b772c?auto=format&fit=crop&w=800&q=80"],
    stock: 80,
  },
  {
    name: "Gold Plated Hoop Earrings Set",
    description: "A set of four graduated hoops — 10mm, 16mm, 22mm, and 30mm — crafted from surgical-grade steel with 18K gold plating. Hypoallergenic, tarnish-resistant, and a must-have for every jewelry wardrobe.",
    price: 35.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"],
    stock: 65,
  },
  {
    name: "Mulberry Silk Scrunchies Set",
    description: "Six oversized scrunchies in 100% 22-momme mulberry silk — gentle on hair, prevents breakage, and holds its shape without creasing. Packed in a gift-ready organza pouch across six complementary shades.",
    price: 24.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"],
    stock: 70,
  },
  {
    name: "Oversized Pastel Lavender Hoodie",
    description: "Boxy drop-shoulder fit in a 380gsm brushed fleece, garment-dyed in a soft lavender that fades beautifully over time. Ribbed cuffs, a kangaroo pocket, and a relaxed hem that hits just below the hip.",
    price: 89.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80"],
    stock: 48,
  },
  {
    name: "Butterfly Hair Claw Clips Set",
    description: "A set of eight resin claw clips in assorted sizes and pastel shades — perfect for half-up styles, messy buns, or sectioning hair. Lightweight yet strong-grip; compatible with all hair types and thicknesses.",
    price: 18.00,
    category: "Accessories",
    images: ["https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&q=80"],
    stock: 95,
  },

  // ── Skincare & Beauty ──
  {
    name: "Jade Roller & Gua Sha Set",
    description: "Dual-ended jade roller paired with a sculpted gua sha board. Cold-rolling reduces puffiness, boosts circulation, and helps serums absorb deeper into skin. Comes in a velvet-lined gift box.",
    price: 38.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80"],
    stock: 50,
  },
  {
    name: "Hydrating Hyaluronic Face Serum",
    description: "Multi-weight hyaluronic acid complex delivers 72-hour hydration at three skin depths. Fragrance-free, dermatologist-tested formula visibly plumps fine lines in 14 days. Suitable for all skin types.",
    price: 55.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"],
    stock: 42,
  },
  {
    name: "Tinted Vanilla Lip Balm Set",
    description: "A set of six sheer tinted balms — from barely-there nude to berry rose — formulated with shea butter, vitamin E, and natural beeswax. SPF 15 protection, moisturizes for six hours per application.",
    price: 19.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1598452963314-b09f397a5c48?auto=format&fit=crop&w=800&q=80"],
    stock: 88,
  },
  {
    name: "LED Portable Makeup Mirror",
    description: "10× magnification on one side and 1× on the reverse, surrounded by 24 daylight-matched LEDs with stepless dimming. Folds flat to 12mm for travel, runs on USB-C, and auto-shuts off after 10 minutes.",
    price: 45.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1588776814546-ec7e9b6ab5f9?auto=format&fit=crop&w=800&q=80"],
    stock: 38,
  },

  // ── Gen-Z Tech ──
  {
    name: "Pastel Matte Phone Case",
    description: "Slim 1.2mm hard-shell case with a soft-touch matte finish in six pastel colorways. Raised bezels protect the camera and screen, while military-grade drop-tested corners absorb impact without adding bulk.",
    price: 22.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80"],
    stock: 100,
  },
  {
    name: "Macaron Color Bluetooth Earbuds",
    description: "Six candy pastel colorways on a matching case and earbuds with 8mm dynamic drivers and 28 hours total playtime. Touch controls, one-step pairing, and IPX4 splash resistance for everyday carry.",
    price: 45.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80"],
    stock: 55,
  },
  {
    name: "Aesthetic Vinyl Laptop Skin",
    description: "Ultra-thin 0.2mm vinyl precision-cut for your specific laptop model with a repositionable, residue-free adhesive. Full-coverage design with a satin laminate finish that protects against scuffs and scratches.",
    price: 19.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"],
    stock: 75,
  },
  {
    name: "USB Desktop Cup Warmer",
    description: "Smart coaster keeps your coffee, tea, or cocoa at an ideal 55°C. Plug-and-play USB-A with an LED power ring, non-slip silicone mat, and an auto-off safety sensor after 4 hours of inactivity.",
    price: 29.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"],
    stock: 60,
  },

  // ── Lifestyle ──
  {
    name: "Motivational Gradient Water Bottle 1L",
    description: "BPA-free Tritan copolyester with time markers and motivational quotes printed on a frosted gradient finish. Leak-proof flip lid, wide mouth for ice, and fits all standard cup holders. Dishwasher safe.",
    price: 38.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80"],
    stock: 68,
  },
  {
    name: "Borosilicate Glass Coffee Mug",
    description: "Double-walled 350ml glass mug that keeps drinks hot for 2 hours and looks stunning doing it. Heat-resistant borosilicate construction, ergonomic handle, and a clear silhouette that shows off your latte art.",
    price: 32.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?auto=format&fit=crop&w=800&q=80"],
    stock: 50,
  },

  // ── Grooming & Personal Care ──
  {
    name: "ProGlide Elite Electric Trimmer",
    description: "Zero-blade gap precision trimmer with a powerful 6,500 RPM motor, self-sharpening blades, and a 4-hour battery. Fully washable head and a cordless runtime of 90 minutes.",
    price: 89.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=800&q=80"],
    stock: 45,
  },
  {
    name: "Lumière Daily Skincare Ritual Set",
    description: "A curated 5-piece routine — gentle foaming cleanser, hyaluronic toner, Vitamin C serum, SPF 50 moisturizer, and a retinol night cream — all formulated for sensitive and combination skin.",
    price: 145.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"],
    stock: 32,
  },
  {
    name: "AirSilk Pro Ionic Hair Dryer",
    description: "1800W motor with ionic and ceramic far-infrared technology reduces frizz and drying time by 40%. Three heat settings, two speed modes, and a cool-shot button for a salon-quality finish at home.",
    price: 119.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80"],
    stock: 28,
  },

  // ── Office & Work From Home ──
  {
    name: "CloudRest XL Ergonomic Mouse Pad",
    description: "900×400mm extended mat with a micro-woven surface for pixel-precise tracking and a memory-foam wrist rest filled with cooling gel. Anti-slip rubber base stays locked to any desk surface.",
    price: 45.00,
    category: "Office",
    images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80"],
    stock: 70,
  },
  {
    name: "Adjustable Aluminum Laptop Stand",
    description: "Aircraft-grade aluminum with six height and angle settings, ventilation channels that drop laptop temps by up to 8°C, and silicone padding that protects your device from every scratch.",
    price: 79.00,
    category: "Office",
    images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=800&q=80"],
    stock: 55,
  },
  {
    name: "Halo Minimalist LED Desk Lamp",
    description: "Stepless dimming from 1% to 100%, five color temperatures (2700K–6500K), and a USB-C fast-charge port built into the base. Touch controls and a memory function that recalls your last setting.",
    price: 69.00,
    category: "Office",
    images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"],
    stock: 40,
  },
  {
    name: "Linen Hardcover Journal Set",
    description: "A matched pair of A5 dot-grid and ruled journals bound in linen with a lay-flat spine and 160gsm cream paper that handles fountain pens without bleed. Includes a bookmark ribbon and elastic closure.",
    price: 38.00,
    category: "Office",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"],
    stock: 65,
  },
  {
    name: "Bamboo Fiber Desk Organizer",
    description: "Seven-compartment modular organizer crafted from sustainable moso bamboo. Holds pens, cables, sticky notes, and small tech accessories in a compact 28×18cm footprint that elevates any desk setup.",
    price: 49.00,
    category: "Office",
    images: ["https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80"],
    stock: 50,
  },

  // ── Kitchen & Home Essentials ──
  {
    name: "BlendGo Portable Mini Blender",
    description: "600W USB-C rechargeable blender that makes a full smoothie in 45 seconds. Six stainless blades, BPA-free 380ml Tritan cup doubles as a sip-lid travel bottle. Dishwasher safe.",
    price: 55.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80"],
    stock: 60,
  },
  {
    name: "Steel Insulated Coffee Tumbler 20oz",
    description: "Double-wall 18/8 stainless steel with vacuum insulation keeps drinks hot for 12 hours or iced for 24. Sweat-free exterior, leak-proof lid, and a powder-coat finish in five matte colors.",
    price: 42.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80"],
    stock: 80,
  },
  {
    name: "PureAir 360 Room Air Purifier",
    description: "True HEPA H13 filter captures 99.97% of particles down to 0.1 microns — pollen, smoke, pet dander, and VOCs. Covers 40m² in one pass, with a real-time AQI display and whisper-quiet sleep mode.",
    price: 169.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80"],
    stock: 24,
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    description: "Handcrafted stoneware dripper and matching 600ml carafe with a heat-resistant silicone sleeve. The wide flat-bottom basket promotes even extraction for a consistently clean, balanced cup.",
    price: 75.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"],
    stock: 35,
  },
  {
    name: "Aroma Bloom Essential Oil Diffuser",
    description: "400ml ultrasonic diffuser with whisper-quiet operation, seven ambient LED color modes, and a four-timer setting. Covers up to 30m² and auto-shuts off when the tank runs dry.",
    price: 55.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80"],
    stock: 38,
  },

  // ── Fitness ──
  {
    name: "FlowForm Non-Slip Yoga Mat",
    description: "6mm natural tree rubber mat with a microfiber top layer that grips harder the more you sweat. Alignment markers printed with non-toxic ink, and carries easily with the included carry strap.",
    price: 55.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"],
    stock: 48,
  },
  {
    name: "CoreForce Resistance Bands Set",
    description: "Five latex-free bands from 5 to 50 lbs of resistance, color-coded for quick selection. Handles, ankle straps, door anchor, and a carrying case are all included for a full-gym workout anywhere.",
    price: 35.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80"],
    stock: 70,
  },
  {
    name: "FuelPro Stainless Shaker Bottle",
    description: "700ml wide-mouth bottle with a rounded 316-grade stainless mixer ball that blends protein powder to a silky-smooth consistency with zero clumps. Odor-resistant, leak-proof, and dishwasher safe.",
    price: 28.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80"],
    stock: 90,
  },
  {
    name: "AeroGlide Speed Jump Rope",
    description: "4mm PVC cable on dual ball-bearing handles with a tangle-free swivel that spins at up to 6 revolutions per second. Adjustable cable fits heights 5'–6'5\". Includes a travel pouch.",
    price: 29.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?auto=format&fit=crop&w=800&q=80"],
    stock: 85,
  },
  {
    name: "RecoverEdge Foam Roller Pro",
    description: "High-density EVA foam with a three-zone surface pattern — firm ridges, soft channels, and flat panels — that targets deep tissue, trigger points, and surface muscles in one tool.",
    price: 45.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"],
    stock: 52,
  },

  // ── Home Decor ──
  {
    name: "Arc Minimal Brass Floor Lamp",
    description: "A sweeping arc of hand-polished brass terminates in a drum linen shade, casting a warm diffused glow. Weighted marble base ensures complete stability. Compatible with smart dimmers.",
    price: 349.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"],
    stock: 18,
  },
  {
    name: "Organic Ceramic Bud Vase Trio",
    description: "Three hand-thrown stoneware vessels in graduating heights with a reactive ash glaze that gives each piece a one-of-a-kind finish. Style them together or scatter them for a curated, editorial look.",
    price: 89.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=800&q=80"],
    stock: 25,
  },
  {
    name: "Stonewashed Linen Cushion Set",
    description: "A set of four 50×50cm cushions in a tonal palette, made from pre-washed French linen that feels soft and lived-in from day one. Removable covers with invisible zippers and hypoallergenic inserts included.",
    price: 135.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"],
    stock: 30,
  },
  {
    name: "Nordic Concrete Desk Clock",
    description: "Cast from lightweight architectural concrete with an ultra-thin Swiss quartz movement. The unmarked dial and clean indices strip timekeeping back to its purest, most beautiful form.",
    price: 115.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1530695440407-21fef47230b1?auto=format&fit=crop&w=800&q=80"],
    stock: 22,
  },
  {
    name: "Fractured Geo Brass Wall Mirror",
    description: "A statement piece composed of six geometric mirror panels set in an antique brass frame, creating an endlessly shifting reflection of light and space. Arrives fully assembled with wall fixings.",
    price: 319.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"],
    stock: 10,
  },

  // ── Electronics: Trackers, Power & Connectivity ──
  {
    name: "TrackMate Pro Bluetooth Item Tracker",
    description: "Ultra-thin CR2032-powered tracker attaches to keys, bags, or luggage and rings at 90dB when misplaced. Crowd GPS network with 300m Bluetooth range and a replaceable battery rated for 12 months.",
    price: 35.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1569534403786-a9e1a40e34dd?auto=format&fit=crop&w=800&q=80"],
    stock: 85,
  },
  {
    name: "NomadPower 20000mAh Wireless Power Bank",
    description: "15W Qi wireless pad on top, 65W USB-C PD port, and two USB-A outputs — charge a laptop, phone, and earbuds simultaneously. Compact enough to fit a jacket pocket with an LED charge indicator.",
    price: 65.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?auto=format&fit=crop&w=800&q=80"],
    stock: 60,
  },
  {
    name: "CineBeam Pico Pocket Projector",
    description: "720p DLP projection up to 120 inches, built-in Android 9, Wi-Fi, and a 2-hour battery. Auto keystone correction means setup takes ten seconds. Weighs just 280g — fits in a coat pocket.",
    price: 179.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1626379961798-54f819ee896a?auto=format&fit=crop&w=800&q=80"],
    stock: 22,
  },
  {
    name: "ProHub 7-in-1 USB-C Docking Station",
    description: "Single cable turns one USB-C port into 4K HDMI, 100W pass-through charging, SD card slot, two USB-A 3.0 ports, and Gigabit Ethernet. Aluminium shell with passive cooling — runs silent, runs cool.",
    price: 79.00,
    category: "Electronics",
    images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80"],
    stock: 40,
  },

  // ── Fashion: Everyday Staples ──
  {
    name: "Stonewashed Linen Summer Shirt",
    description: "100% French linen stonewashed for maximum softness from the first wear. A relaxed, slightly oversized cut with a spread collar and single chest pocket — the shirt summer demands you own.",
    price: 85.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"],
    stock: 42,
  },
  {
    name: "Vintage Oversized Graphic Tee",
    description: "280gsm 100% ring-spun cotton with a washed-down vintage graphic and a boxy fit that works tucked or untucked. Pre-shrunk, bound neck seam, and double-stitched hem for long-term durability.",
    price: 45.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"],
    stock: 65,
  },
  {
    name: "Pebbled Leather Crossbody Bag",
    description: "Compact 22×16cm pebbled leather body with a detachable and adjustable 120cm strap. Interior organizer sleeve, back zip pocket, and a secure turn-lock closure in brushed gold hardware.",
    price: 149.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1591348278563-aa6140c8af18?auto=format&fit=crop&w=800&q=80"],
    stock: 28,
  },
  {
    name: "Relaxed Linen Bucket Hat",
    description: "Unstructured 100% linen bucket hat with a 6cm brim and a breathable open-weave crown. Folds flat into a bag without losing its shape. UPF 40+ rated and available in four washed-out tones.",
    price: 39.00,
    category: "Fashion",
    images: ["https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80"],
    stock: 55,
  },

  // ── Kitchen & Home ──
  {
    name: "Electric Milk Frother Wand",
    description: "Handheld battery-powered frother whips hot or cold milk into a thick, barista-quality foam in 15 seconds. Stainless whisk, ergonomic grip, and compact enough to keep next to the coffee machine.",
    price: 25.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80"],
    stock: 90,
  },
  {
    name: "Smart RGB LED Strip 5m",
    description: "16 million color WiFi LED strip compatible with Alexa, Google Home, and a dedicated app. Music-sync mode pulses to the beat and a self-adhesive backing installs in under two minutes.",
    price: 49.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&w=800&q=80"],
    stock: 70,
  },
  {
    name: "Self-Watering Terracotta Planter",
    description: "Double-walled terracotta planter with a hidden water reservoir that feeds roots through a cotton wick for up to two weeks. A drainage overflow hole prevents waterlogging for happier, healthier plants.",
    price: 42.00,
    category: "Home Decor",
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80"],
    stock: 35,
  },
  {
    name: "Precision Digital Kitchen Scale",
    description: "1g–5kg capacity with a 0.1g precision sensor, tare function, and five unit modes. Ultra-thin stainless platform, auto-off, and a bright backlit LCD that reads clearly even in direct sunlight.",
    price: 35.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1588515724527-074a7a56616c?auto=format&fit=crop&w=800&q=80"],
    stock: 55,
  },
  {
    name: "3-Piece Bamboo Cutting Board Set",
    description: "End-grain bamboo boards in small, medium, and large with juice grooves, non-slip rubber feet, and a loop handle. Naturally antimicrobial — harder than most hardwoods and kinder on knife edges.",
    price: 55.00,
    category: "Kitchen",
    images: ["https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80"],
    stock: 40,
  },

  // ── Grooming & Personal Care ──
  {
    name: "Sonic Facial Cleansing Brush",
    description: "8000 micro-vibrations per minute remove 99.5% more makeup and impurities than manual cleansing. Waterproof, USB-rechargeable, with three speed modes and two interchangeable silicone brush heads.",
    price: 65.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?auto=format&fit=crop&w=800&q=80"],
    stock: 38,
  },
  {
    name: "Compact Travel Grooming Kit",
    description: "Leather-zipped dopp kit containing a precision trimmer, nose trimmer, nail kit, stainless comb, and mini scissors — all TSA-compliant. Everything a man needs for a week away in under 600g.",
    price: 55.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683702?auto=format&fit=crop&w=800&q=80"],
    stock: 32,
  },
  {
    name: "Aromatherapy Shower Steamer Set",
    description: "Six 80g effervescent tablets — eucalyptus, lavender, peppermint, citrus, rose, and chamomile — that dissolve on the shower floor and release a 10-minute cloud of therapeutic essential-oil steam.",
    price: 32.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1570016106647-5bb6b79fadef?auto=format&fit=crop&w=800&q=80"],
    stock: 60,
  },
  {
    name: "Scalp Care Massage Shampoo Brush",
    description: "Soft medical-grade silicone bristles exfoliate the scalp, stimulate blood flow, and work shampoo into a rich lather 10× faster than fingers. Comfortable palm grip, suitable for wet and dry use.",
    price: 22.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1542393545-10f5b85e14fc?auto=format&fit=crop&w=800&q=80"],
    stock: 75,
  },
  {
    name: "Portable Rechargeable Neck Massager",
    description: "Six massage nodes with bi-directional rotation, three heat levels, and four intensity modes. Wraps around the neck and shoulders with flexible arms that apply even pressure. USB-C charged, 150-minute runtime.",
    price: 59.00,
    category: "Grooming",
    images: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"],
    stock: 30,
  },

  // ── Fitness ──
  {
    name: "Adjustable Dumbbell Set 2×10kg",
    description: "Dial-selector system adjusts from 2kg to 10kg in 2kg increments in under two seconds — replacing fifteen pairs of traditional dumbbells. Compact storage tray included. Cast iron plates, ABS shell.",
    price: 129.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"],
    stock: 18,
  },
  {
    name: "Ab Wheel Roller with Knee Mat",
    description: "Wide 18cm dual-wheel design for lateral stability as you roll out. Ergonomic foam-wrapped handles reduce wrist strain. Comes with a thick EVA knee pad — the only ab tool serious trainers need.",
    price: 29.00,
    category: "Fitness",
    images: ["https://images.unsplash.com/photo-1600881333168-2ef49b341f30?auto=format&fit=crop&w=800&q=80"],
    stock: 62,
  },
];

/* ─────────────────────────────────────────
   Upsert helper — name isn't @unique in
   the schema, so we do findFirst + update/create
───────────────────────────────────────── */
async function upsertProduct(product: typeof PRODUCTS[0]) {
  const existing = await prisma.product.findFirst({ where: { name: product.name } });
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data: product });
    return "updated";
  }
  await prisma.product.create({ data: product });
  return "created";
}

async function main() {
  console.log("🌱 Seeding NexMart database…\n");

  /* ── Admin user ── */
  const email = "test@nexmart.com";
  const password = "Test1234!";
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name: "NexMart Admin", password: hashedPassword, role: "ADMIN" },
    create: { name: "NexMart Admin", email, password: hashedPassword, role: "ADMIN" },
  });
  console.log(`✅ Admin user: ${user.email}`);
  console.log(`   Password:   ${password}\n`);

  /* ── Products ── */
  const counts = { created: 0, updated: 0 };

  for (const product of PRODUCTS) {
    const result = await upsertProduct(product);
    counts[result]++;
    const tag = result === "created" ? "✅" : "♻️ ";
    console.log(`${tag} [${product.category.padEnd(11)}] ${product.name}`);
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ${counts.created} products created
  ${counts.updated} products updated
  ${PRODUCTS.length} total products in seed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
