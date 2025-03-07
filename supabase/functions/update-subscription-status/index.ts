
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Valid plan types and statuses to match database constraints
type PlanType = 'free' | 'pro';
type SubscriptionStatus = 'active' | 'inactive' | 'canceled';

// Handle CORS preflight requests
serve(async (req) => {
  // Always respond to preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { plan_type, status, days } = body;
    
    // Validate inputs
    if (!plan_type || !['free', 'pro'].includes(plan_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid plan type. Must be either "free" or "pro"' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    if (!status || !['active', 'inactive', 'canceled'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status. Must be one of "active", "inactive", or "canceled"' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get authorization token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    console.log('Updating subscription status', { plan_type, status, days });
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Missing environment variables' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Create clients
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const supabaseClient = createClient(supabaseUrl, token);
    
    // Get user ID from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized or invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const userId = user.id;
    console.log('User ID:', userId);
    
    // Calculate expiry date if days provided
    let currentPeriodEnd = null;
    if (days) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      currentPeriodEnd = futureDate.toISOString();
      console.log('Setting expiry to:', currentPeriodEnd);
    }
    
    // Check if subscription record exists
    const { data: existingSubscription, error: fetchError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching subscription:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Error fetching subscription' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    let result;
    
    if (existingSubscription) {
      // Update existing subscription
      const updateData = {
        plan_type,
        status,
        updated_at: new Date().toISOString()
      };
      
      if (currentPeriodEnd) {
        updateData.current_period_end = currentPeriodEnd;
      }
      
      const { data, error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating subscription:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error updating subscription' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      result = data;
      console.log('Updated subscription:', result);
    } else {
      // Create new subscription
      const insertData = {
        user_id: userId,
        plan_type,
        status
      };
      
      if (currentPeriodEnd) {
        insertData.current_period_end = currentPeriodEnd;
      }
      
      const { data, error: insertError } = await supabaseAdmin
        .from('subscriptions')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating subscription:', insertError);
        return new Response(
          JSON.stringify({ error: 'Error creating subscription' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      result = data;
      console.log('Created subscription:', result);
    }
    
    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error updating subscription status:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
