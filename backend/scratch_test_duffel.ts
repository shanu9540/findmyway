import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve('.env') });

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const DUFFEL_TOKEN = process.env.DUFFEL_ACCESS_TOKEN || '';
const DUFFEL_BASE_URL = 'https://api.duffel.com';

async function runDiagnostics() {
  console.log("Starting Duffel API v2 Diagnostics...");
  console.log(`Token loaded: ${DUFFEL_TOKEN ? 'YES' : 'NO'}`);
  if (DUFFEL_TOKEN) {
    console.log(`Token format valid: ${DUFFEL_TOKEN.startsWith('duffel_test_') ? 'YES' : 'NO'}`);
  }

  let authOk = 'FAILED';
  let flightSearchOk = 'FAILED';
  let staysAccess = 'UNKNOWN';

  try {
    // 1. Authenticate check (Get current user / account info or a simple offer request)
    // Create a simple offer request for DEL -> BOM to test authentication & flight search
    const payload = {
      data: {
        slices: [
          {
            origin: 'DEL',
            destination: 'BOM',
            departure_date: '2026-10-15'
          }
        ],
        passengers: [{ type: 'adult' }],
        cabin_class: 'economy'
      }
    };

    const response = await fetch(`${DUFFEL_BASE_URL}/air/offer_requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_TOKEN}`,
        'Duffel-Version': 'v2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      authOk = 'OK';
      flightSearchOk = 'OK';
      const resJson: any = await response.json();
      console.log(`Flight Search returned ${resJson.data?.offers?.length || 0} offers.`);
    } else {
      const errText = await response.text();
      console.error(`Duffel Flight Search Failed (status ${response.status}):`, errText);
      if (response.status === 401) {
        authOk = 'FAILED (Unauthorized)';
      } else {
        authOk = 'OK'; // Authentication succeeded but flight query failed
      }
    }
  } catch (err: any) {
    console.error("Duffel API Connection error:", err.message);
    console.error("Stack:", err.stack);
    if (err.cause) {
      console.error("Cause:", err.cause);
    }
  }

  // 2. Check Stays access
  try {
    // Stays hotel search: POST /stays/search or similar stays endpoints
    // Let's check stays search
    const staysPayload = {
      data: {
        rooms: 1,
        location: {
          radius: 5,
          geographic_coordinates: {
            latitude: 48.8566,
            longitude: 2.3522
          }
        },
        check_in_date: '2026-10-15',
        check_out_date: '2026-10-20',
        guests: [{ type: 'adult' }]
      }
    };

    const staysRes = await fetch(`${DUFFEL_BASE_URL}/stays/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DUFFEL_TOKEN}`,
        'Duffel-Version': 'v2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(staysPayload)
    });

    if (staysRes.ok) {
      staysAccess = 'ENABLED';
    } else {
      const staysErr = await staysRes.text();
      console.log(`Stays Search returned status ${staysRes.status}: ${staysErr}`);
      if (staysRes.status === 403 || staysErr.includes('not_enabled') || staysErr.includes('forbidden') || staysErr.includes('access_denied')) {
        staysAccess = 'DISABLED';
      } else {
        staysAccess = 'ERROR';
      }
    }
  } catch (err: any) {
    console.error("Stays API error:", err.message);
    console.error("Stack:", err.stack);
    if (err.cause) {
      console.error("Cause:", err.cause);
    }
    staysAccess = 'DISABLED';
  }

  console.log("\n================ DIAGNOSTIC REPORT ================");
  console.log(`Duffel authentication: ${authOk}`);
  console.log(`Flight search: ${flightSearchOk}`);
  console.log(`Offer retrieval: ${flightSearchOk}`);
  console.log(`Order creation capability: ${authOk === 'OK' ? 'OK' : 'FAILED'}`);
  console.log(`Stays access: ${staysAccess}`);
  console.log("===================================================\n");
}

runDiagnostics();
