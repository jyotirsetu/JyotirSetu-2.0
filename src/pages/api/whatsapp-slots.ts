import type { APIRoute } from 'astro';
import { getTursoClient } from '../../lib/turso';

/**
 * WhatsApp Bot Slots API
 * Returns available consultation slots
 * GET /api/whatsapp-slots?date=2026-04-20&service=astrology
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

// API Key validation
const VALID_API_KEY = process.env.WHATSAPP_BOT_API_KEY || 'your-secure-api-key-here';

export const GET: APIRoute = async ({ request }) => {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Validate API Key
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey || apiKey !== VALID_API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized - Invalid API Key' 
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const date = url.searchParams.get('date');
    const service = url.searchParams.get('service') || 'astrology';
    
    // Generate available slots for next 7 days
    const slots = generateSlots(date);
    
    // Check which slots are already booked
    const bookedSlots = await getBookedSlots(date);
    
    // Filter out booked slots
    const availableSlots = slots.map(slot => ({
      ...slot,
      available: !bookedSlots.includes(slot.id),
      status: bookedSlots.includes(slot.id) ? 'booked' : 'available',
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: availableSlots,
        meta: {
          date: date || 'all',
          service,
          total: availableSlots.length,
          available: availableSlots.filter(s => s.available).length,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error fetching slots:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to fetch slots',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// Handle OPTIONS for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
};

/**
 * Generate consultation slots
 */
function generateSlots(specificDate: string | null): Array<{
  id: string;
  date: string;
  day: string;
  time: string;
  available: boolean;
  status: string;
}> {
  const slots = [];
  const today = new Date();
  
  // Generate for next 7 days or specific date
  const daysToGenerate = specificDate ? 1 : 7;
  const startDay = specificDate ? 0 : 0;
  
  for (let i = startDay; i < daysToGenerate; i++) {
    const date = specificDate 
      ? new Date(specificDate)
      : new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Time slots (10 AM to 6 PM, 2-hour intervals)
    const timeSlots = ['10:00', '12:00', '14:00', '16:00', '18:00'];
    
    timeSlots.forEach(time => {
      slots.push({
        id: `${dateStr}_${time}`,
        date: dateStr,
        day: dayName,
        time: time,
        available: true,
        status: 'available',
      });
    });
  }
  
  return slots;
}

/**
 * Get already booked slots from Turso database
 */
async function getBookedSlots(date: string | null): Promise<string[]> {
  try {
    const client = await getTursoClient();
    if (!client) {
      console.warn('Turso client not available');
      return [];
    }
    
    let query = "SELECT id, date, time FROM appointments WHERE status IN ('scheduled', 'confirmed')";
    const args: string[] = [];
    
    if (date) {
      query += " AND date = ?";
      args.push(date);
    } else {
      // Get bookings for next 7 days
      const today = new Date().toISOString().split('T')[0];
      query += " AND date >= ?";
      args.push(today);
    }
    
    const result = await client.execute({
      sql: query,
      args,
    });
    
    // Format as slot IDs
    return result.rows.map((row: any) => `${row.date}_${row.time}`);
    
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    return [];
  }
}
