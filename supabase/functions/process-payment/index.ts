
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { userId, planId, paymentMethod, amount, currency } = await req.json()
    
    // Validate the request
    if (!userId || !planId || !paymentMethod || !amount || !currency) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate a transaction ID
    const transactionId = crypto.randomUUID()
    
    // In a real application, you would integrate with a payment provider here
    // For now, we'll simulate a successful payment
    const paymentSuccessful = true
    
    if (paymentSuccessful) {
      // Create a transaction record
      const { error } = await supabase
        .from('transactions')
        .insert({
          id: transactionId,
          user_id: userId,
          plan_id: planId,
          payment_method: paymentMethod,
          amount,
          currency,
          status: 'success'
        })

      if (error) {
        console.error('Error creating transaction:', error)
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Error creating transaction: ${error.message}` 
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // If this is a subscription, update or create a subscription record
      if (planId !== 'one-time') {
        const { data: existingSubscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (existingSubscription) {
          // Update existing subscription
          await supabase
            .from('subscriptions')
            .update({
              plan_id: planId,
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSubscription.id)
        } else {
          // Create new subscription
          await supabase
            .from('subscriptions')
            .insert({
              user_id: userId,
              plan_id: planId,
              status: 'active'
            })
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          transactionId 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      // Payment failed
      await supabase
        .from('transactions')
        .insert({
          id: transactionId,
          user_id: userId,
          plan_id: planId,
          payment_method: paymentMethod,
          amount,
          currency,
          status: 'failed'
        })

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Payment processing failed' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Server error: ${error.message}` 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
